import { useMemo, useState } from "react";
import carImg from "../assets/anh-minh-hoa-xe.jpg";
import hotlineImg from "../assets/hotline-bookcar.jpg";

import "../shared/styles/BookCarPage.css"

function Price({ value }) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

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
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState("images");
  const [showFilters, setShowFilters] = useState(true);

  const handleTogglePopular = (key) => (e) => setPopular((s) => ({ ...s, [key]: e.target.checked }));
  const handleToggleOperator = (name) => (e) => setSelectedOps((s) => ({ ...s, [name]: e.target.checked }));
  const clearSelections = () => {
    setPopular({ discount: false, vip: false });
    setSelectedOps(Object.fromEntries(operatorList.map((n) => [n, false])));
  };

  const filteredOperators = operatorList.filter((n) => n.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bookcar">
      <div className="bookcar__container">
        <div className="filters-toggle">
          <button className="btn btn--outline" onClick={() => setShowFilters((s) => !s)}>
            Bộ lọc
            {anyChecked && (
              <span className="pill">{
                (popular.discount ? 1 : 0) +
                  (popular.vip ? 1 : 0) +
                  Object.values(selectedOps).filter(Boolean).length
              }</span>
            )}
          </button>
        </div>
        <aside className={`filters ${!showFilters ? "is-collapsed" : ""}`}>
          <div className="filters__section">
            <h4 className="filters__title">Tiêu chí phổ biến</h4>
            <label className="checkbox"><input type="checkbox" checked={popular.discount} onChange={handleTogglePopular("discount")} /> Chuyến giảm giá <span className="muted">(370)</span></label>
            <label className="checkbox"><input type="checkbox" checked={popular.vip} onChange={handleTogglePopular("vip")} /> Xe VIP Limousine <span className="muted">(433)</span></label>
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
            <input className="filters__search" placeholder="Tìm nhà xe" value={search} onChange={(e) => setSearch(e.target.value)} />
            {filteredOperators.map((name) => (
              <label className="checkbox" key={name}>
                <input type="checkbox" checked={!!selectedOps[name]} onChange={handleToggleOperator(name)} /> {name}
              </label>
            ))}
          </div>

          <button className="btn btn--ghost" onClick={clearSelections} disabled={!anyChecked}>Xoá đã chọn</button>
        </aside>

        <main className="results">
          

          <div className="results__header">
            <div className="sort link">Sắp xếp theo tuyến đường</div>
            <div className="toolbar">
              <button className="dropdown"><span>Giờ đi</span><span className="caret">▾</span></button>
              <button className="dropdown"><span>Mức giá</span><span className="caret">▾</span></button>
            </div>
          </div>

          {trips.map((t) => (
            <article className="trip" key={t.id}>
              <img className="trip__thumb" src={carImg} alt="Hình minh họa xe" />

              <div className="trip__content">
                <div className="trip__title">
                  <h4 className="trip__name">{t.name}</h4>
                  <div className="trip__rating">
                    <span className="badge">★ {t.rating.toFixed(1)}</span>
                    <span className="muted">{t.reviews} Đánh giá</span>
                  </div>
                </div>
                <div className="trip__subtitle muted">Limousine 9 chỗ</div>

                <div className="time time--row">
                  <div className="time__col">
                    <div className="time__value">{t.depart}</div>
                    <div className="muted small">Hà Nội Office - Cổ Linh</div>
                  </div>
                  <div className="time__center">
                    <div className="time__duration muted small">1h30’</div>
                    <div className="time__arrow" aria-hidden="true" />
                  </div>
                  <div className="time__col end">
                    <div className="time__value">{t.arrive}</div>
                    <div className="link">{t.to}</div>
                  </div>
                </div>

                <div className="note muted small">*Thuộc chuyến 21:00 31-12-2024 Hà Nội - Hải Phòng</div>
                <div className="link small">Thông tin chi tiết</div>
              </div>

              <aside className="trip__aside">
                <div className="aside__price"><Price value={t.price} /></div>
                <div className="muted small">Còn {t.seatsLeft} chỗ trống</div>
                <button
                  className="btn btn--primary"
                  onClick={() => {
                    if (expandedId === t.id) {
                      setExpandedId(null);
                    } else {
                      setExpandedId(t.id);
                      setActiveTab("images");
                    }
                  }}
                >
                  {expandedId === t.id ? "Thu gọn" : "Chọn xe"}
                </button>
              </aside>

              {expandedId === t.id && (
                <div className="trip__details">
                  <div className="tabs">
                    <button
                      className={`tabs__btn ${activeTab === "images" ? "is-active" : ""}`}
                      onClick={() => setActiveTab("images")}
                    >
                      Hình ảnh
                    </button>
                    <button
                      className={`tabs__btn ${activeTab === "cancel" ? "is-active" : ""}`}
                      onClick={() => setActiveTab("cancel")}
                    >
                      Phí hủy
                    </button>
                  </div>
                  <div className="tab-panel">
                    {activeTab === "images" ? (
                      <div className="gallery">
                        <img src={carImg} alt="Ảnh xe" />
                        <div className="dots">
                          <span className="dot is-active" />
                          <span className="dot" />
                          <span className="dot" />
                        </div>
                      </div>
                    ) : (
                      <div className="policy">
                        <div className="policy-table">
                          <div className="row head">
                            <div className="cell">Hủy từ</div>
                            <div className="cell">Đến trước</div>
                            <div className="cell">Phí hủy</div>
                          </div>

                          <div className="row">
                            <div className="cell">
                              Sau khi đặt
                            </div>
                            <div className="cell">
                              <div>06:45</div>
                              <div>25/11/2024</div>
                            </div>
                            <div className="cell">
                              <div className="strong">0%</div>
                              <div className="muted small">giá trị đơn hàng</div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="cell">
                              <div>06:45</div>
                              <div>25/11/2024</div>
                            </div>
                            <div className="cell">Giờ khởi hành</div>
                            <div className="cell">
                              <div className="strong">100%</div>
                              <div className="muted small">giá trị đơn hàng</div>
                            </div>
                          </div>
                        </div>

                        <div className="policy-note">
                          <div className="note-title">Ghi chú:</div>
                          <p>
                            Phí huỷ sẽ được tính trên giá gốc, không giảm trừ khuyến mãi hoặc giảm giá;
                            đồng thời không vượt quá số tiền quý khách đã thanh toán.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </article>
          ))}

          <div className="banner">
            <img src={hotlineImg} alt="Đặt vé ngay hotline" />
          </div>
        </main>
      </div>
    </div>
  );
}

const trips = [
  {
    id: 1,
    name: "Vip Phương Huy Luxury",
    rating: 4.8,
    reviews: 21,
    depart: "21:00",
    arrive: "22:30",
    price: 220000,
    seatsLeft: 10,
    from: "Hà Nội",
    to: "Hải Phòng",
  },
  {
    id: 2,
    name: "Hoàng Anh Limousine (Hải Phòng)",
    rating: 4.9,
    reviews: 310,
    depart: "21:15",
    arrive: "23:50",
    price: 450000,
    seatsLeft: 5,
    from: "Hà Nội",
    to: "Hải Phòng",
  },
  {
    id: 3,
    name: "Anh Huy Travel",
    rating: 4.3,
    reviews: 230,
    depart: "21:45",
    arrive: "00:25",
    price: 120000,
    seatsLeft: 12,
    from: "Hà Nội",
    to: "Hải Phòng",
  },
  {
    id: 4,
    name: "Vip Phương Huy Luxury",
    rating: 4.7,
    reviews: 18,
    depart: "20:30",
    arrive: "22:00",
    price: 220000,
    seatsLeft: 7,
    from: "Hà Nội",
    to: "Hải Phòng",
  },
  {
    id: 5,
    name: "Hoàng Anh Limousine (Hải Phòng)",
    rating: 4.9,
    reviews: 310,
    depart: "22:00",
    arrive: "00:30",
    price: 450000,
    seatsLeft: 3,
    from: "Hà Nội",
    to: "Hải Phòng",
  },
  {
    id: 6,
    name: "Anh Huy Travel",
    rating: 4.2,
    reviews: 200,
    depart: "19:45",
    arrive: "22:15",
    price: 120000,
    seatsLeft: 14,
    from: "Hà Nội",
    to: "Hải Phòng",
  },
];