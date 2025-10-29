import { useEffect, useMemo, useRef, useState } from "react";
import TripCard from "./TripCard";
import "../../styles/TripList.css";
import SORTS from "../../constants/sortOptions";

export default function TripList(props) {
  const {
    trips = [],
    expandedId = null,
    activeTab = "images",
    onToggleTrip,
    onTabChange,
    showHeader = true,
    showEmpty = true,
    onToggleFilters,
    isNarrow = false,
  } = props || {};

  // Local state for dropdowns and sorting/filtering
  const [openMenu, setOpenMenu] = useState(null); // 'time' | 'price' | null
  const [selectedTime, setSelectedTime] = useState(null); // option object
  const [selectedPrice, setSelectedPrice] = useState(null); // option object
  const lastSortRef = useRef(null); // 'time' | 'price'
  const menuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpenMenu(null);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Helpers
  function timeToMinutes(hhmm = "") {
    const [h, m] = String(hhmm).split(":").map((v) => parseInt(v, 10));
    if (Number.isNaN(h) || Number.isNaN(m)) return 0;
    return h * 60 + m;
  }

  const displayedTrips = useMemo(() => {
    let data = Array.isArray(trips) ? [...trips] : [];

    // Apply time filter
    if (selectedTime?.type === "filter") {
      const fromMin = timeToMinutes(selectedTime.from);
      const toMin = timeToMinutes(selectedTime.to);
      data = data.filter((t) => {
        const d = timeToMinutes(t?.depart);
        // Include boundary on start, exclude on end (half-open)
        return d >= fromMin && d < toMin;
      });
    }

    // Apply price filter
    if (selectedPrice?.type === "filter") {
      const min = selectedPrice.min ?? 0;
      const max = selectedPrice.max ?? Number.POSITIVE_INFINITY;
      data = data.filter((t) => Number(t?.price) >= min && Number(t?.price) <= max);
    }

    // Sorting precedence: whichever menu set a sort last
    const winner = lastSortRef.current;
    const applyTimeSort = () => {
      if (selectedTime?.id === "earliest") data.sort((a, b) => timeToMinutes(a.depart) - timeToMinutes(b.depart));
      else if (selectedTime?.id === "latest") data.sort((a, b) => timeToMinutes(b.depart) - timeToMinutes(a.depart));
    };
    const applyPriceSort = () => {
      if (selectedPrice?.id === "low-high") data.sort((a, b) => Number(a.price) - Number(b.price));
      else if (selectedPrice?.id === "high-low") data.sort((a, b) => Number(b.price) - Number(a.price));
    };

    if (winner === "time") applyTimeSort();
    else if (winner === "price") applyPriceSort();
    else {
      // If no explicit precedence yet, prefer time sort if set; else price
      if (selectedTime?.type === "sort") applyTimeSort();
      else if (selectedPrice?.type === "sort") applyPriceSort();
    }

    return data;
  }, [trips, selectedTime, selectedPrice]);

  // Reset dropdown selections whenever a new search result set arrives
  useEffect(() => {
    setSelectedTime(null);
    setSelectedPrice(null);
    lastSortRef.current = null;
    setOpenMenu(null);
  }, [trips]);
  function ResultsHeader() {
    const label = isNarrow ? "Bộ lọc" : "Sắp xếp theo tuyến đường";
    const clickable = Boolean(onToggleFilters);
    const commonProps = clickable
      ? {
          role: "button",
          tabIndex: 0,
          onClick: onToggleFilters,
          onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && onToggleFilters && onToggleFilters(),
        }
      : {};

    const timeLabel = selectedTime?.label || "Giờ đi";
    const priceLabel = selectedPrice?.label || "Mức giá";

    const onPick = (group, opt) => {
      if (group === "time") {
        // Toggle same option to clear
        setSelectedTime((cur) => (cur?.id === opt.id ? null : opt));
        if (opt.type === "sort") lastSortRef.current = "time";
      } else {
        setSelectedPrice((cur) => (cur?.id === opt.id ? null : opt));
        if (opt.type === "sort") lastSortRef.current = "price";
      }
      setOpenMenu(null);
    };

    return (
      <div className="results__header" ref={menuRef}>
        <div className={`sort ${isNarrow ? "link" : ""}`} {...commonProps}>{label}</div>
        <div className="toolbar">
          <div className="dropdown-wrap">
            <button className="dropdown" onClick={() => setOpenMenu((m) => (m === "time" ? null : "time"))}>
              <span>{timeLabel}</span>
              <span className="caret">▾</span>
            </button>
            {openMenu === "time" && (
              <div className="dropdown-menu">
                {SORTS.departureTime.map((opt) => (
                  <div
                    key={opt.id}
                    className={`menu-item ${selectedTime?.id === opt.id ? "is-active" : ""}`}
                    onClick={() => onPick("time", opt)}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dropdown-wrap">
            <button className="dropdown" onClick={() => setOpenMenu((m) => (m === "price" ? null : "price"))}>
              <span>{priceLabel}</span>
              <span className="caret">▾</span>
            </button>
            {openMenu === "price" && (
              <div className="dropdown-menu">
                {SORTS.price.map((opt) => (
                  <div
                    key={opt.id}
                    className={`menu-item ${selectedPrice?.id === opt.id ? "is-active" : ""}`}
                    onClick={() => onPick("price", opt)}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showHeader && <ResultsHeader />}
      {showEmpty && displayedTrips.length === 0 && (
        <div className="muted" style={{ padding: 16 }}>
          Không tìm thấy chuyến phù hợp. Vui lòng thử lại với tiêu chí khác.
        </div>
      )}
      {(displayedTrips || []).map((t, idx) => (
        <TripCard
          key={t?.id ?? idx}
          t={t}
          expanded={expandedId === t.id}
          activeTab={activeTab}
          onToggle={() => onToggleTrip && onToggleTrip(t.id)}
          onTabChange={onTabChange || (() => void 0)}
        />
      ))}
    </>
  );
}
