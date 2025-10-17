import "../../styles/SidebarFilters.css";

export default function SidebarFilters(props) {
  const {
    showFilters = true,
    onToggleCollapse,
    popular = { discount: false, vip: false },
    onTogglePopular,
    selectedOps = {},
    onToggleOperator,
    search = "",
    onSearchChange,
    filteredOperators = [],
    onClear,
    anyChecked = false,
    selectedCount = 0,
  } = props || {};
  return (
    <>
      <div className="filters-toggle">
        <button className="btn btn--outline" onClick={onToggleCollapse || (() => void 0)}>
          Bộ lọc
          {anyChecked && <span className="pill">{selectedCount}</span>}
        </button>
      </div>
      <aside className={`filters ${!showFilters ? "is-collapsed" : ""}`}>
        <div className="filters__section">
          <h4 className="filters__title">Tiêu chí phổ biến</h4>
          <label className="checkbox">
            <input type="checkbox" checked={!!popular?.discount} onChange={onTogglePopular ? onTogglePopular("discount") : undefined} /> Chuyến giảm
            giá <span className="muted">(370)</span>
          </label>
          <label className="checkbox">
            <input type="checkbox" checked={!!popular?.vip} onChange={onTogglePopular ? onTogglePopular("vip") : undefined} /> Xe VIP Limousine
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
            onChange={(e) => (onSearchChange ? onSearchChange(e.target.value) : void 0)}
          />
          {(filteredOperators || []).map((name) => (
            <label className="checkbox" key={name}>
              <input type="checkbox" checked={!!selectedOps[name]} onChange={onToggleOperator ? onToggleOperator(name) : undefined} /> {name}
            </label>
          ))}
        </div>

        <button className="btn btn--ghost" onClick={onClear || (() => void 0)} disabled={!anyChecked}>
          Xoá đã chọn
        </button>
      </aside>
    </>
  );
}
