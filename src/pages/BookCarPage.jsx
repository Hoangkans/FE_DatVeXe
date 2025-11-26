import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import "../shared/styles/BookCarPage.css";
import MainLayout from "../shared/layouts/MainLayout";
import hotlineImg from "../assets/hotline-bookcar.jpg";
import SidebarFilters from "../shared/components/BookCar/SidebarFilters";
import TripList from "../shared/components/BookCar/TripList";
import LocationPicker from "../shared/components/BookCar/LocationPicker";
import locationsPick from "../services/bookcar/locations";
import BookingModal from "../shared/components/BookCar/BookingModal";
import formatDate from "../shared/utils/date/date";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getUser } from "../services/auth/auth.service";
import { fetchTripData } from "../services/bookcar/bookingInfo";
import { bookTicket } from "../services/Ticket/booking";
import createMoMoPayment from "../services/payment/createPayment";

const cleanString = (str) => {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9]/g, "") 
    .toLowerCase();
};

const LOCATION_ALIASES = {
  "tp.hcm": "ho chi minh", "sai gon": "ho chi minh", "hcm": "ho chi minh",
  "hn": "ha noi", "vung tau": "ba ria vung tau", "nha trang": "khanh hoa",
  "da lat": "lam dong", "buon ma thuot": "dak lak", "bmt": "dak lak",
  "pleiku": "gia lai", "quy nhon": "binh dinh", "phan thiet": "binh thuan",
  "hue": "thua thien hue", "vinh": "nghe an", "ha long": "quang ninh",
  "rach gia": "kien giang", "chau doc": "an giang"
};

const expandLocation = (text) => {
  if (!text) return "";
  const cleanText = cleanString(text);
  let expanded = text; 
  Object.keys(LOCATION_ALIASES).forEach((key) => {
    const cleanKey = cleanString(key);
    if (cleanText.includes(cleanKey)) {
      expanded += " " + LOCATION_ALIASES[key];
    }
  });
  return expanded;
};

const normalizeTripData = (apiItem) => {
  const departureDate = new Date(apiItem.time.departure);
  const arrivalDate = new Date(apiItem.time.arrival);
  const fromRaw = (apiItem.route?.start || "") + " " + (apiItem.route?.location?.departure?.address || "");
  const toRaw = (apiItem.route?.end || "") + " " + (apiItem.route?.location?.arrival?.address || "");

  return {
    id: apiItem.id,
    operator: apiItem.company?.name || "Unknown Bus",
    depart: departureDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    arrive: arrivalDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    departDate: formatDate(apiItem.time.departure) || "",
    duration: apiItem.route?.duration || "",
    fromStation: apiItem.route?.start || "",
    toStation: apiItem.route?.end || "",
    fromAddress: apiItem.route?.location?.departure?.address,
    toAddress: apiItem.route?.location?.arrival?.address,
    searchFrom: cleanString(expandLocation(fromRaw)),
    searchTo: cleanString(expandLocation(toRaw)),
    rawDate: apiItem.time.departure,
    price: apiItem.route?.price,
    seatsLeft: apiItem.seats?.available,
    rating: 4.5, 
    reviews: 10, 
    name: apiItem.bus?.name, 
    vip: apiItem.bus?.name?.toLowerCase().includes("vip") || apiItem.seats?.list?.some(s => s.seat_type === 'VIP'),
    discount: false, 
    image: apiItem.bus?.images?.[0]?.image_url || null,
    seatsList: apiItem.seats?.list || [],
  };
};

const performFilter = (sourceData, currentFilters, currentSidebar) => {
    let results = [...sourceData];

    if (currentFilters.from) {
      const keyword = cleanString(currentFilters.from);
      results = results.filter(t => t.searchFrom.includes(keyword));
    }

    if (currentFilters.to) {
      const keyword = cleanString(currentFilters.to);
      results = results.filter(t => t.searchTo.includes(keyword));
    }

    if (currentFilters.date) {
      results = results.filter(t => t.rawDate.startsWith(currentFilters.date));
    }

    const { popular, selectedOps } = currentSidebar;
    if (popular.discount) results = results.filter((t) => t.discount);
    if (popular.vip) results = results.filter((t) => t.vip);
    const selectedOperatorNames = Object.keys(selectedOps).filter((key) => selectedOps[key]);
    if (selectedOperatorNames.length) {
      const operatorSet = new Set(selectedOperatorNames);
      results = results.filter((t) => operatorSet.has(t.operator));
    }
    
    return results;
};

export default function BookCarPage() {
  const [locations, setLocations] = useState([]);
  const location = useLocation(); 
  const [allTrips, setAllTrips] = useState([]); 
  const [trips, setTrips] = useState([]); 
  const [bookingModal, setBookingModal] = useState({ isOpen: false, trip: null });
  const [isBooking, setIsBooking] = useState(false);
  
  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(location.search);
    return {
      from: decodeURIComponent(params.get("from") || ""),
      to: decodeURIComponent(params.get("to") || ""),
      date: params.get("date") || ""
    };
  });

  const [loading, setLoading] = useState(true);

  const [sidebarState, setSidebarState] = useState({
    popular: { discount: false, vip: false },
    selectedOps: {},
    search: "",
  });

  const [uiState, setUiState] = useState({
    expandedId: null,
    activeTab: "images",
    showFilters: true,
    isNarrow: false,
    hasSearched: false,
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await locationsPick;
        setLocations(data || []);
      } catch {
        setLocations([]);
      }
    };
    fetchLocations();
  }, []);

  const loadTrips = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchTripData();
      const rawList = Array.isArray(response) ? response : (response.data || []);
      const formattedList = rawList.map(normalizeTripData);
      
      setAllTrips(formattedList);
      setTrips(formattedList); 
    } catch (err) {
      console.log("Failed to load Trip.", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrips(); 
  }, [loadTrips]);

  useEffect(() => {
    if (allTrips.length > 0) {
      if (filters.from || filters.to || filters.date) {
          const results = performFilter(allTrips, filters, sidebarState);
          setTrips(results);
          setUiState(prev => ({ ...prev, hasSearched: true }));
      }
    }
  }, [allTrips]); 

  const handleSearch = useCallback(() => {
    const results = performFilter(allTrips, filters, sidebarState);
    setTrips(results);
    setUiState((prev) => ({ ...prev, hasSearched: true, expandedId: null, activeTab: "images" }));
  }, [filters, sidebarState, allTrips]);


  const handleConfirmBooking = async (bookingData) => {
    const { seat, passengerInfo, paymentMethod } = bookingData;
    const currentUser = getUser();
    
    if (!currentUser || !currentUser.id) {
        toast.error("Vui lòng đăng nhập để tiếp tục");
        return;
    }

    setIsBooking(true); 

    try {
      const userId = currentUser.id;
      const trip = bookingModal.trip;
      const ticketCode = "TCK" + Math.floor(100000 + Math.random() * 900000);

      await bookTicket(
          userId, trip.id, seat.id, seat.seat_type, trip.price, ticketCode,
          passengerInfo.phone, passengerInfo.email, paymentMethod
      );

      if (paymentMethod === 'momo') {
        toast.info("Đang kết nối đến MoMo...");

        const currentDomain = window.location.origin;
        const paymentPayload = {
            amount: trip.price,
            orderInfo: `Thanh toan ve xe ${ticketCode}`,
            redirectUrl: `${currentDomain}/payment-success`, 
            extraData: JSON.stringify({ ticketCode: ticketCode }),
            lang: "vi"
        };

        const momoResponse = await createMoMoPayment(paymentPayload, currentUser.accessToken);

        if (momoResponse && momoResponse.payUrl) {
            window.location.href = momoResponse.payUrl;
        } else {
            throw new Error("Không lấy được link thanh toán MoMo");
        }
      } else {
          toast.success(`Đặt vé thành công! Mã: ${ticketCode}`);
          setBookingModal({ isOpen: false, trip: null });
          await loadTrips();
          setIsBooking(false); 
      }
    } catch (err) {
        console.error(err);
        const msg = err.response?.data?.message || err.message || "Lỗi xử lý";
        toast.error(msg);
        setIsBooking(false); 
    }
  };

  const handleOpenBooking = (tripId) => {
    const selectedTrip = trips.find(t => t.id === tripId);
    if (selectedTrip) {
      setBookingModal({ isOpen: true, trip: selectedTrip });
    }
  };

    useEffect(() => {
      const mq = window.matchMedia("(max-width: 900px)");
      const updateNarrow = (e) => setUiState((prev) => ({ ...prev, isNarrow: e.matches }));
      mq.addEventListener("change", updateNarrow);
      updateNarrow(mq);
      return () => mq.removeEventListener("change", updateNarrow);
  }, []);

  const availableOperators = [...new Set(allTrips.map(t => t.operator))];

  return (
    <MainLayout>
      <div className="bookcar">
        <section className="search-hero">
          <div className="route-title">
            {filters.from || "—"} <span>Đến</span> {filters.to || "—"}
          </div>
          <div className="searchbox">
            <div className="searchbox__grid">
              <LocationPicker 
                label="Điểm Khởi Hành"
                placeholder="Chọn Điểm Khởi Hành"
                value={filters.from}
                options={locations}
                onSelect={(val) => {
                  const text = typeof val === 'string' ? val : (val?.destination || val?.name || "");
                  setFilters((prev) => ({ ...prev, from: text }));
                }}
              />
              <LocationPicker
                label="Điểm Đến"
                placeholder="Chọn Điểm Đến"
                value={filters.to}
                options={locations}
                onSelect={(val) => {
                  const text = typeof val === 'string' ? val : (val?.destination || val?.name || "");
                  setFilters((prev) => ({ ...prev, to: text }));
                }}
              />
              <div className="searchbox__item">
                <div className="searchbox__label">Ngày Khởi Hành</div>
                <input
                  type="date"
                  className="searchbox__date"
                  value={filters.date}
                  onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <button className="searchbox__button" onClick={handleSearch}>TÌM CHUYẾN XE</button>
            </div>
          </div>
        </section>

        <div className="bookcar__container">
          <SidebarFilters
            showFilters={uiState.showFilters}
            onToggleCollapse={() => setUiState((prev) => ({ ...prev, showFilters: !prev.showFilters }))}
            {...sidebarState}
            filteredOperators={availableOperators} 
            onTogglePopular={(key) => (e) =>
              setSidebarState((prev) => ({ 
                  ...prev, 
                  popular: { ...prev.popular, [key]: e.target.checked } 
              }))
            }
            onToggleOperator={(name) => (e) =>
              setSidebarState((prev) => ({
                ...prev,
                selectedOps: { ...prev.selectedOps, [name]: e.target.checked },
              }))
            }
            onSearchChange={(value) => setSidebarState((prev) => ({ ...prev, search: value }))}
            onClear={() =>
              setSidebarState({
                popular: { discount: false, vip: false },
                selectedOps: {},
                search: "",
              })
            }
            anyChecked={sidebarState.popular.discount || sidebarState.popular.vip || Object.values(sidebarState.selectedOps).some(Boolean)}
            selectedCount={
                (sidebarState.popular.discount ? 1 : 0) + 
                (sidebarState.popular.vip ? 1 : 0) + 
                Object.values(sidebarState.selectedOps).filter(Boolean).length
            }
          />

          <main className="results">
            {loading ? (
                <div style={{padding: 20, textAlign: 'center'}}>Đang tải dữ liệu...</div>
            ) : (
                <TripList
                  trips={trips}
                  expandedId={uiState.expandedId}
                  activeTab={uiState.activeTab}
                  showHeader={true}
                  showEmpty={uiState.hasSearched}
                  isNarrow={uiState.isNarrow}
                  onToggleFilters={uiState.isNarrow ? () => setUiState((prev) => ({ ...prev, showFilters: !prev.showFilters })) : undefined}
                  onToggleTrip={(id) =>
                    setUiState((prev) => ({
                      ...prev,
                      expandedId: prev.expandedId === id ? null : id,
                      activeTab: "images",
                    }))}
                  onBookTicket={handleOpenBooking}
                  onTabChange={(tab) => setUiState((prev) => ({ ...prev, activeTab: tab }))}
                />
                
            )}
            <BookingModal 
              isOpen={bookingModal.isOpen}
              trip={bookingModal.trip}
              onClose={() => setBookingModal({ isOpen: false, trip: null })}
              onConfirm={handleConfirmBooking}
              isLoading={isBooking}
            />

            <div className="banner">
              <img src={hotlineImg} alt="Đặt vé ngay hotline" />
            </div>
          </main>
        </div>
      </div>
    </MainLayout>
  );
}