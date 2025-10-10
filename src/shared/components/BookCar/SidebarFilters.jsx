import "../../styles/SidebarFilters.css";

export default function SidebarFilters({
  showFilters,
  onToggleCollapse,
  popular,
  onTogglePopular,
  selectedOps,
  onToggleOperator,
  search,
  onSearchChange,
  filteredOperators,
  onClear,
  anyChecked,
  selectedCount,
}) {
  return (
    <>
      <div className="filters-toggle">
        <button className="btn btn--outline" onClick={onToggleCollapse}>
          Bộ lọc
          {anyChecked && <span className="pill">{selectedCount}</span>}
        </button>
      </div>
      <aside className={`filters ${!showFilters ? "is-collapsed" : ""}`}>
        <div className="filters__section">
          <h4 className="filters__title">Tiêu chí phổ biến</h4>
          <label className="checkbox">
            <input type="checkbox" checked={popular.discount} onChange={onTogglePopular("discount")} /> Chuyến giảm
            giá <span className="muted">(370)</span>
          </label>
          <label className="checkbox">
            <input type="checkbox" checked={popular.vip} onChange={onTogglePopular("vip")} /> Xe VIP Limousine
            <span className="muted">(433)</span>
          </label>
        </div>

        <div className="filters__section">
          <div className="filters__label">Giờ đi</div>
          <input className="range" type="range" min="0" max="24" defaultValue="0" />
          <div className="filters__range-meta">
            <span>00:00</span>
            <span>23:59</span>
          </div>
        </div>

        <div className="filters__section">
          <div className="filters__label">Giá vé</div>
          <input className="range" type="range" min="0" max="2000000" step="50000" defaultValue="0" />
          <div className="filters__range-meta">
            <span>0</span>
            <span>2.000.000</span>
          </div>
        </div>

        <div className="filters__section">
          <div className="filters__label">Nhà xe</div>
          <input
            className="filters__search"
            placeholder="Tìm nhà xe"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {filteredOperators.map((name) => (
            <label className="checkbox" key={name}>
              <input type="checkbox" checked={!!selectedOps[name]} onChange={onToggleOperator(name)} /> {name}
            </label>
          ))}
        </div>

        <button className="btn btn--ghost" onClick={onClear} disabled={!anyChecked}>
          Xoá đã chọn
        </button>
      </aside>
    </>
  );
}
