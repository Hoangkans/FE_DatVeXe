import carImg from "../../../assets/anh-minh-hoa-xe.jpg";
import "../../styles/TripCard.css";
import formatMoney from "../../utils/ticket/money";

export default function TripCard(props) {
  const {
    t = {},
    expanded = false,
    activeTab = "images",
    onToggle,
    onTabChange,
  } = props || {};

  const {
    name = "",
    rating = 0,
    reviews = 0,
    depart = "",
    arrive = "",
    to = "",
    price = 0,
    seatsLeft = 0,
  } = t || {};
  return (
    <article className="trip">
      <img className="trip__thumb" src={carImg} alt="Hình minh họa xe" />

      <div className="trip__content">
        <div className="trip__title">
          <h4 className="trip__name">{name}</h4>
          <div className="trip__rating">
            <span className="badge">★ {Number(rating).toFixed(1)}</span>
            <span className="sep">•</span>
            <span className="muted">{reviews} Đánh giá</span>
          </div>
        </div>
        <div className="trip__subtitle muted">Limousine 9 chỗ</div>

        <div className="time time--row">
          <div className="time__col">
            <div className="time__value">{depart}</div>
            <div className="link small">Hà Nội Office - Cổ Linh</div>
          </div>
          <div className="time__center">
            <div className="time__duration muted small">1h30’</div>
            <div className="time__arrow" aria-hidden="true" />
            <div className="time__middle-label muted small">-</div>
          </div>
          <div className="time__col end">
            <div className="time__value">{arrive}</div>
            <div className="link small">{to}</div>
          </div>
        </div>

        <div className="note-row">
          <div className="note muted small">*Thuộc chuyến 21:00 31-12-2024 Hà Nội - Hải Phòng</div>
          <div className="link small">Thông tin chi tiết</div>
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
                    <div className="cell">Sau khi đặt</div>
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
