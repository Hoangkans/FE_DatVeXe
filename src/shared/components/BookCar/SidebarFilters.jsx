export default function SidebarFilters(props) {
  const {
    showFilters = true,
    onToggleCollapse,
    
    popular = { discount: false, vip: false },
    onTogglePopular,
    search = "",
    onSearchChange,
    
    filteredOperators = [],
    selectedOps = {},
    onToggleOperator,
    departureStations = [],
    selectedDeparture = "",
    onSelectDeparture,
    arrivalStations = [],
    selectedArrival = "",
    onSelectArrival,
    busTypes = [],
    selectedBusType = "",
    onSelectBusType,

    minTime = 0,       
    onTimeChange,      
    maxPrice = 2000000, 
    onPriceChange, 

    onClear,
    anyChecked = false,
    selectedCount = 0,
  } = props || {};

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const busTypeLabels = {
    GIUONG_NAM: "Giường nằm",
    GHE_NGOI: "Ghế ngồi",
    LIMOUSINE: "Limousine"
  };

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
            <input 
              type="checkbox" 
              checked={!!popular?.discount} 
              onChange={onTogglePopular ? onTogglePopular("discount") : undefined} 
            /> 
            Chuyến giảm giá
          </label>
          <label className="checkbox">
            <input 
              type="checkbox" 
              checked={!!popular?.vip} 
              onChange={onTogglePopular ? onTogglePopular("vip") : undefined} 
            /> 
            Xe VIP Limousine
          </label>
        </div>

        <div className="filters__section">
          <div className="filters__label">Nơi đi</div>
          <select 
            className="filters__select"
            value={selectedDeparture}
            onChange={(e) => onSelectDeparture && onSelectDeparture(e.target.value)}
          >
            <option value="">Tất cả nơi đi</option>
            {departureStations.map((station) => (
              <option key={station} value={station}>{station}</option>
            ))}
          </select>
        </div>

        <div className="filters__section">
          <div className="filters__label">Nơi đến</div>
          <select 
            className="filters__select"
            value={selectedArrival}
            onChange={(e) => onSelectArrival && onSelectArrival(e.target.value)}
          >
            <option value="">Tất cả nơi đến</option>
            {arrivalStations.map((station) => (
              <option key={station} value={station}>{station}</option>
            ))}
          </select>
        </div>

         <div className="filters__section">
          <div className="filters__label">Loại xe</div>
          <select 
            className="filters__select"
            value={selectedBusType}
            onChange={(e) => onSelectBusType && onSelectBusType(e.target.value)}
          >
            <option value="">Tất cả loại xe</option>
              {busTypes.map(type => (
                <option key={type} value={type}>
                  {busTypeLabels[type] || type}
                </option>
              ))}
          </select>
        </div>

        <div className="filters__section">
          <div className="filters__label" style={{display: 'flex', justifyContent: 'space-between'}}>
            <span>Giờ đi</span>
            <span style={{fontWeight: 'normal', color: '#0060c4'}}>
               {minTime === 0 ? "Tất cả" : `Sau ${minTime}:00`}
            </span>
          </div>
          <input 
            className="range" 
            type="range" 
            min="0" 
            max="24" 
            value={minTime}
            onChange={(e) => onTimeChange && onTimeChange(Number(e.target.value))}
          />
          <div className="filters__range-meta">
            <span>00:00</span>
            <span>24:00</span>
          </div>
        </div>

        <div className="filters__section">
          <div className="filters__label" style={{display: 'flex', justifyContent: 'space-between'}}>
            <span>Giá vé tối đa</span>
            <span style={{fontWeight: 'normal', color: '#0060c4'}}>
               {formatCurrency(maxPrice)}
            </span>
          </div>
          <input 
            className="range" 
            type="range" 
            min="0" 
            max="2000000" 
            step="50000" 
            value={maxPrice}
            onChange={(e) => onPriceChange && onPriceChange(Number(e.target.value))}
          />
          <div className="filters__range-meta">
            <span>0đ</span>
            <span>2tr</span>
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
          <div className="filters__operator-list">
            {(filteredOperators || []).map((name) => (
              <label className="checkbox" key={name}>
                <input 
                  type="checkbox" 
                  checked={!!selectedOps[name]} 
                  onChange={onToggleOperator ? onToggleOperator(name) : undefined} 
                /> 
                {name}
              </label>
            ))}
          </div>
        </div>

        <button className="btn btn--ghost" onClick={onClear || (() => void 0)} disabled={!anyChecked}>
          Xoá đã chọn
        </button>
      </aside>
    </>
  );
}