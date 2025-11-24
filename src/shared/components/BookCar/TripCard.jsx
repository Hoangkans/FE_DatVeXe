import "../../styles/TripCard.css";
import formatMoney from "../../utils/ticket/money";

export default function TripCard(props) {
  const {
    t = {},
    expanded = false,
    activeTab = "images",
    onToggle,
    onTabChange,
    onBook
  } = props || {};

  const {
    name = "",
    operator = "",
    rating = 0,
    reviews = 0,
    depart = "",
    arrive = "",
    fromStation = "",
    toStation = "",
    price = 0,
    seatsLeft = 0,
    image = null,
    duration,
    departDate,
  } = t || {};
  return (
    <article className="trip">
      <img className="trip__thumb" src={image} alt="Hình minh họa xe" />

      <div className="trip__content">
        <div className="trip__title">
          <h4 className="trip__name">{operator}</h4>
          <div className="trip__rating">
            <span className="badge">★ {Number(rating).toFixed(1)}</span>
            <span className="sep">•</span>
            <span className="muted">{reviews} Đánh giá</span>
          </div>
        </div>
        <div className="trip__subtitle muted">{name}</div>

        <div className="time time--row">
          <div className="time__col">
            <div className="time__value">{depart}</div>
            <div className="link small">{fromStation}</div>
          </div>
          <div className="time__center">
            <div className="time__duration muted small">{duration}h</div>
            <div className="time__arrow" aria-hidden="true" />
            <div className="time__middle-label muted small">-</div>
          </div>
          <div className="time__col end">
            <div className="time__value">{arrive}</div>
            <div className="link small">{toStation}</div>
          </div>
        </div>

        <div className="note-row">
          <div className="note muted small">*Thuộc chuyến {depart} {fromStation} đến {toStation}</div>
        </div>
      </div>

      <aside className="trip__aside">
        <div className="aside__price">
          <span className="aside__from">Từ</span>
          <span className="aside__value">{formatMoney(price)} đ</span>
        </div>
        <div className="muted small">{seatsLeft} Còn trống</div>
        <button className="btn btn--primary" onClick={onToggle || (() => void 0)}>
          {expanded ? "Thu gọn" : "Chọn xe"}
        </button>
      </aside>

      {expanded && (
        <div className="trip__details">
          <div className="tabs">
            <button className={`tabs__btn ${activeTab === "images" ? "is-active" : ""}`} onClick={() => onTabChange("images")}>
              Hình ảnh
            </button>
            <button className={`tabs__btn ${activeTab === "cancel" ? "is-active" : ""}`} onClick={() => onTabChange("cancel")}>
              Phí hủy
            </button>
          </div>
          
          <div className="tab-panel">
            {activeTab === "images" ? (
              <div className="gallery-container" style={{display:'flex', gap: 20}}>
                <div className="gallery" style={{flex: 1}}>
                  <img src={image} alt="Ảnh xe" />
                </div>

                <div className="booking-cta" style={{width: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px'}}>
                   <div className="strong" style={{fontSize: '1.1rem'}}>Chuyến {t.depart}</div>
                   <div className="muted">Giường nằm cao cấp</div>
                   <div className="price-tag" style={{color: '#ff5e1f', fontSize: '1.2rem', fontWeight: 'bold'}}>
                     {formatMoney(t.price)}đ
                   </div>
                   
                   <button 
                     className="btn btn--primary" 
                     style={{width: '100%', padding: '12px'}}
                     onClick={onBook} 
                   >
                     ĐẶT VÉ NGAY
                   </button>
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
                    <div className="cell">Sau khi đặt</div>
                    <div className="cell">
                      <div>{depart}</div>
                      <div>{departDate}</div>
                    </div>

                    <div className="cell">
                      <div className="strong">0%</div>
                      <div className="muted small">giá trị đơn hàng</div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="cell">
                     <div>{depart}</div>
                     <div>{departDate}</div>
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
                    Phí huỷ sẽ được tính trên giá gốc, không giảm trừ khuyến mãi hoặc giảm giá; đồng thời không vượt quá số tiền quý khách đã thanh toán.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
