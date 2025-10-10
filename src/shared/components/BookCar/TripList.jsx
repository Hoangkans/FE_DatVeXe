import TripCard from "./TripCard";
import "../../styles/TripList.css";

export default function TripList({ trips, expandedId, activeTab, onToggleTrip, onTabChange }) {
  function ResultsHeader() {
    return (
      <div className="results__header">
        <div className="sort link">Sắp xếp theo tuyến đường</div>
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
      <ResultsHeader />
      {trips.map((t) => (
        <TripCard
          key={t.id}
          t={t}
          expanded={expandedId === t.id}
          activeTab={activeTab}
          onToggle={() => onToggleTrip(t.id)}
          onTabChange={onTabChange}
        />
      ))}
    </>
  );
}
