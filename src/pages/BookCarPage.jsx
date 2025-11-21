import { useState, useEffect, useMemo, useCallback } from "react";
import "../shared/styles/BookCarPage.css";
import MainLayout from "../shared/layouts/MainLayout";
import hotlineImg from "../assets/hotline-bookcar.jpg";
import SidebarFilters from "../shared/components/BookCar/SidebarFilters";
import TripList from "../shared/components/BookCar/TripList";
import LocationPicker from "../shared/components/BookCar/LocationPicker";
import locationsPick from "../services/bookcar/locations";

export default function BookCarPage() {
  const [locations, setLocations] = useState([]);
  const [trips, setTrips] = useState([]);
  const [filters, setFilters] = useState({ from: "", to: "", date: "" });

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

  const handleSearch = useCallback(async () => {
    try {
      const data = await searchTrips(filters);
      let results = data || [];
      const { popular, selectedOps } = sidebarState;
      if (popular.discount) results = results.filter((t) => t.discount);
      if (popular.vip) results = results.filter((t) => t.vip);
      const selectedOperatorNames = Object.keys(selectedOps).filter((key) => selectedOps[key]);
      if (selectedOperatorNames.length) {
        const operatorSet = new Set(selectedOperatorNames);
        results = results.filter((t) => operatorSet.has(t.operator));
      }

      setTrips(results);
      setUiState((prev) => ({ ...prev, hasSearched: true, expandedId: null, activeTab: "images" }));
    } catch {
      setTrips([]);
    }
  }, [filters, sidebarState]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const updateNarrow = (e) => setUiState((prev) => ({ ...prev, isNarrow: e.matches }));
    mq.addEventListener("change", updateNarrow);
    updateNarrow(mq);
    return () => mq.removeEventListener("change", updateNarrow);
  }, []);

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
                onSelect={(value) => setFilters((prev) => ({ ...prev, from: value }))}
              />
              <LocationPicker
                label="Điểm Đến"
                placeholder="Chọn Điểm Đến"
                value={filters.to}
                options={locations}
                onSelect={(value) => setFilters((prev) => ({ ...prev, to: value }))}
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
            onTogglePopular={(key) => (value) =>
              setSidebarState((prev) => ({ ...prev, popular: { ...prev.popular, [key]: value } }))}
            onToggleOperator={(name) => (value) =>
              setSidebarState((prev) => ({
                ...prev,
                selectedOps: { ...prev.selectedOps, [name]: value },
              }))}
            onSearchChange={(value) => setSidebarState((prev) => ({ ...prev, search: value }))}
            onClear={() =>
              setSidebarState({
                popular: { discount: false, vip: false },
                selectedOps: {},
                search: "",
              })}
          />

          <main className="results">
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
              onTabChange={(tab) => setUiState((prev) => ({ ...prev, activeTab: tab }))}
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