import TripCard from "./TripCard";
import "../../styles/TripList.css";

export default function TripList(props) {
  const {
    trips = [],
    expandedId = null,
    activeTab = "images",
    onToggleTrip,
    onTabChange,
    showHeader = true,
    onToggleFilters,
    isNarrow = false,
  } = props || {};
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
    return (
      <div className="results__header">
        <div className={`sort ${isNarrow ? "link" : ""}`} {...commonProps}>{label}</div>
        <div className="toolbar">
          <button className="dropdown">
            <span>Giờ đi</span>
            <span className="caret">▾</span>
          </button>
          <button className="dropdown">
            <span>Mức giá</span>
            <span className="caret">▾</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {showHeader && <ResultsHeader />}
      {(trips || []).map((t, idx) => (
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
