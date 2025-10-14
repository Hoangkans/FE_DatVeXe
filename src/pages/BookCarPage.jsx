import { useMemo, useState } from "react";
import "../shared/styles/BookCarPage.css";
import MainLayout from "../shared/layouts/MainLayout";
import hotlineImg from "../assets/hotline-bookcar.jpg";
import SidebarFilters from "../shared/components/BookCar/SidebarFilters";
import TripList from "../shared/components/BookCar/TripList";
import LocationPicker from "../shared/components/BookCar/LocationPicker";
import LOCATIONS from "../mock/data/locations.json";
import TRIPS from "../mock/data/trips.json";


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
  const [showFilters, setShowFilters] = useState(true);
  const [trips, setTrips] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [locations] = useState(LOCATIONS);
  const handlePickDate = () => {
    setDate(new Date().toISOString().slice(0, 10));
  };

  const handleSearch = async () => {
    // Filter local mock data instead of calling services
    const qFrom = from?.toLowerCase?.() || "";
    const qTo = to?.toLowerCase?.() || "";
    const results = TRIPS.filter((t) =>
      (!qFrom || String(t.from).toLowerCase().includes(qFrom)) &&
      (!qTo || String(t.to).toLowerCase().includes(qTo))
    );
    setTrips(results);
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
      {/* Route title */}
      <div className="route-title">
        <span>Hà Nội</span> Đến <span>Hải Phòng</span>
      </div>

      {/* Search box */}
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
          <div
            className="searchbox__item"
            role="button"
            tabIndex={0}
            onClick={handlePickDate}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handlePickDate()}
          >
            <div className="searchbox__label">Ngày Khởi Hành</div>
            <div className="searchbox__value">{date || "Chọn Ngày"}</div>
          </div>
          <button className="searchbox__button" onClick={handleSearch}>
            TÌM CHUYẾN XE
          </button>
        </div>
      </div>
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
