import { useMemo, useState, useEffect } from "react";
import "../shared/styles/BookCarPage.css";
import MainLayout from "../shared/layouts/MainLayout";
import hotlineImg from "../assets/hotline-bookcar.jpg";
import SidebarFilters from "../shared/components/BookCar/SidebarFilters";
import TripList from "../shared/components/BookCar/TripList";
import LocationPicker from "../shared/components/BookCar/LocationPicker";

export default function BookCarPage() {
  const operatorList = useMemo(
    () => [
      "Anh Huy (Hải Phòng)",
      "Anh Huy Đất Cảng",
      "Anh Huy Travel",
      "Bằng Phấn",
      "Cát Bà Express",
      "Cát Bà Go Easy Limousine",
    ],
    []
  );

  const [popular, setPopular] = useState({ discount: false, vip: false });
  const [selectedOps, setSelectedOps] = useState(() => Object.fromEntries(operatorList.map((n) => [n, false])));
  const [search, setSearch] = useState("");

  const anyChecked = Object.values(selectedOps).some(Boolean) || popular.discount || popular.vip;
  const selectedCount =
    (popular.discount ? 1 : 0) + (popular.vip ? 1 : 0) + Object.values(selectedOps).filter(Boolean).length;
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState("images");
  const [showFilters, setShowFilters] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !window.matchMedia('(max-width: 900px)').matches; // collapse on narrow by default
  });
  const [trips, setTrips] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [isNarrow, setIsNarrow] = useState(() => typeof window !== 'undefined' ? window.matchMedia('(max-width: 900px)').matches : false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 900px)');
    const handler = (e) => setIsNarrow(e.matches);
    mq.addEventListener ? mq.addEventListener('change', handler) : mq.addListener(handler);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', handler) : mq.removeListener(handler);
    };
  }, []);
  
  useEffect(() => {
    // Keep default behavior in sync with viewport
    setShowFilters(!isNarrow);
  }, [isNarrow]);
  const [locations, setLocations] = useState([]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getLocations();
        if (mounted) setLocations(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setLocations([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Load default trips on first render so the list isn't empty
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await searchTrips({});
        if (mounted) setTrips(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setTrips([]);
      }
    })();
    return () => { mounted = false };
  }, []);

  const handlePickDate = () => {
    setDate(new Date().toISOString().slice(0, 10));
  };

  const handleSearch = async () => {
    let results = [];
    try {
      const data = await searchTrips({ from, to, date });
      results = Array.isArray(data) ? data : [];
    } catch (e) {
      results = [];
    }

    // Apply sidebar filters (popular + operators)
    const selectedOperatorNames = Object.entries(selectedOps)
      .filter(([, v]) => Boolean(v))
      .map(([name]) => name);

    if (popular?.discount) results = results.filter((t) => t?.discount === true);
    if (popular?.vip) results = results.filter((t) => t?.vip === true);
    if (selectedOperatorNames.length > 0) {
      const set = new Set(selectedOperatorNames);
      results = results.filter((t) => set.has(String(t?.operator)));
    }
    setTrips(results);
    setHasSearched(true);
    setExpandedId(null);
    setActiveTab("images");
  };

  const handleTogglePopular = (key) => (e) => setPopular((s) => ({ ...s, [key]: e.target.checked }));
  const handleToggleOperator = (name) => (e) => setSelectedOps((s) => ({ ...s, [name]: e.target.checked }));
  const clearSelections = () => {
    setPopular({ discount: false, vip: false });
    setSelectedOps(Object.fromEntries(operatorList.map((n) => [n, false])));
  };

  const filteredOperators = operatorList.filter((n) => n.toLowerCase().includes(search.toLowerCase()));

  return (
    <MainLayout>
    <div className="bookcar">
      {/* Hero section: center title + form in the empty space */}
      <section className="search-hero">
        <div className="route-title">
          Hà Nội <span>Đến</span> Hải Phòng
        </div>

        <div className="searchbox">
          <div className="searchbox__grid">
          <LocationPicker
            label="Điểm Khởi Hành"
            placeholder="Chọn Điểm Khởi Hành"
            value={from}
            options={locations}
            onSelect={setFrom}
          />
          <LocationPicker
            label="Điểm Đến"
            placeholder="Chọn Điểm Đến"
            value={to}
            options={locations}
            onSelect={setTo}
          />
          <div className="searchbox__item" role="group" aria-label="Ngày khởi hành">
            <div className="searchbox__label">Ngày Khởi Hành</div>
            <input
              className="searchbox__date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onFocus={() => !date && handlePickDate()}
            />
          </div>
          <button className="searchbox__button" onClick={handleSearch}>
            TÌM CHUYẾN XE
          </button>
          </div>
        </div>
      </section>
      <div className="bookcar__container">
        <SidebarFilters
          showFilters={showFilters}
          onToggleCollapse={() => setShowFilters((s) => !s)}
          popular={popular}
          onTogglePopular={handleTogglePopular}
          selectedOps={selectedOps}
          onToggleOperator={handleToggleOperator}
          search={search}
          onSearchChange={(v) => setSearch(v)}
          filteredOperators={filteredOperators}
          onClear={clearSelections}
          anyChecked={anyChecked}
          selectedCount={selectedCount}
        />

        <main className="results">
          <TripList
            trips={trips}
            expandedId={expandedId}
            activeTab={activeTab}
            showHeader={true}
            showEmpty={hasSearched}
            isNarrow={isNarrow}
            onToggleFilters={isNarrow ? (() => setShowFilters((s) => !s)) : undefined}
            onToggleTrip={(id) => {
              if (expandedId === id) setExpandedId(null);
              else {
                setExpandedId(id);
                setActiveTab("images");
              }
            }}
            onTabChange={(tab) => setActiveTab(tab)}
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
