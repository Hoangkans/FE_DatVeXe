import { useEffect, useMemo, useRef, useState } from "react";
import TripCard from "./TripCard";
import "../../styles/TripList.css";
import SORTS from "../../constants/sortOptions";

import PaginationBar from "../Pagination"; 

export default function TripList(props) {
  const {
    trips = [],
    expandedId = null,
    activeTab = "images",
    onToggleTrip,
    onTabChange,
    onBookTicket,
    showHeader = true,
    showEmpty = true,
    onToggleFilters,
    isNarrow = false,
  } = props || {};

  const ITEMS_PER_PAGE = 5; 
  const [page, setPage] = useState(1);

  const [openMenu, setOpenMenu] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const lastSortRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpenMenu(null);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function timeToMinutes(hhmm = "") {
    const [h, m] = String(hhmm).split(":").map((v) => parseInt(v, 10));
    if (Number.isNaN(h) || Number.isNaN(m)) return 0;
    return h * 60 + m;
  }

  const displayedTrips = useMemo(() => {
    let data = Array.isArray(trips) ? [...trips] : [];

    if (selectedTime?.type === "filter") {
      const fromMin = timeToMinutes(selectedTime.from);
      const toMin = timeToMinutes(selectedTime.to);
      data = data.filter((t) => {
        const d = timeToMinutes(t?.depart);
        return d >= fromMin && d < toMin;
      });
    }

    if (selectedPrice?.type === "filter") {
      const min = selectedPrice.min ?? 0;
      const max = selectedPrice.max ?? Number.POSITIVE_INFINITY;
      data = data.filter((t) => Number(t?.price) >= min && Number(t?.price) <= max);
    }

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
      if (selectedTime?.type === "sort") applyTimeSort();
      else if (selectedPrice?.type === "sort") applyPriceSort();
    }

    return data;
  }, [trips, selectedTime, selectedPrice]);

  useEffect(() => {
    setPage(1);
  }, [displayedTrips]); 

  const paginatedTrips = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return displayedTrips.slice(startIndex, endIndex);
  }, [displayedTrips, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

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

      {paginatedTrips.map((t, idx) => (
        <TripCard
          key={t?.id ?? idx}
          t={t}
          expanded={expandedId === t.id}
          activeTab={activeTab}
          onToggle={() => onToggleTrip && onToggleTrip(t.id)}
          onTabChange={onTabChange || (() => void 0)}
          onBook={() => onBookTicket && onBookTicket(t.id)}
        />
      ))}

      {displayedTrips.length > 0 && (
        <PaginationBar 
            totalItems={displayedTrips.length} 
            itemsPerPage={ITEMS_PER_PAGE} 
            page={page} 
            onChange={handlePageChange} 
        />
      )}
    </>
  );
}