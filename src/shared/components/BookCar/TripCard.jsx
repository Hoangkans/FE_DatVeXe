import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../../styles/TripCard.css";
import formatMoney from "../../utils/ticket/money";
import Review from "./Review";

import { fetchUserReview, createReview } from "../../../services/bookcar/review";
import { getUser } from "../../../services/auth/auth.service"

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
    bus,
    id
  } = t || {};

  const [reviewList, setReviewList] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);

  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (expanded && activeTab === "review" && !reviewsLoaded) {
      const loadReviews = async () => {
        setLoadingReviews(true);
        try {
          const busId = bus?.id || t.id;
          const data = await fetchUserReview(busId);
          const sortedData = Array.isArray(data) ? data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : [];
          setReviewList(sortedData);
          setReviewsLoaded(true);
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingReviews(false);
        }
      };
      loadReviews();
    }
  }, [expanded, activeTab, reviewsLoaded, bus?.id, t.id]);

  const handleSubmitReview = async () => {
    const currentUser = getUser();
    
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để đánh giá!");
      return;
    }
    if (userRating === 0) {
      toast.warning("Vui lòng chọn số sao!");
      return;
    }
    if (!userComment.trim()) {
      toast.warning("Vui lòng nhập nội dung đánh giá!");
      return;
    }

    setIsSubmitting(true);
    try {
        const busId = bus?.id || t.id;
        
        const payload = {
            bus_id: busId,    
            rating: userRating,
            review: userComment
        };
        
        const newReview = await createReview(payload);

        setReviewList([newReview, ...reviewList]);
        
        setUserRating(0);
        setUserComment("");
        toast.success("Đánh giá của bạn đã được gửi!");

    } catch (error) {
        toast.error("Gửi đánh giá thất bại. Vui lòng thử lại.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const renderInteractiveStars = () => {
    return (
        <div className="star-input" style={{marginBottom: 10}}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span 
                    key={star}
                    onClick={() => setUserRating(star)}
                    style={{
                        cursor: "pointer",
                        fontSize: "1.5rem",
                        color: star <= userRating ? "#FFC107" : "#e4e5e9",
                        marginRight: 5
                    }}
                >
                    ★
                </span>
            ))}
            <span style={{fontSize: '0.9rem', color: '#666', marginLeft: 10}}>
                {userRating > 0 ? `${userRating} Sao` : "Chọn sao"}
            </span>
        </div>
    );
  };

  const renderTab = () => {
    if (activeTab === "images") {
      return (
        <div className="gallery-container" style={{ display: "flex", gap: 20 }}>
          <div className="gallery" style={{ flex: 1 }}>
            <img src={image} alt="Ảnh xe" style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }} />
          </div>
          <div className="booking-cta" style={{ width: "200px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "10px" }}>
            <div className="strong" style={{ fontSize: "1.1rem" }}>Chuyến {t.depart}</div>
            <div className="muted">Giường nằm cao cấp</div>
            <div className="price-tag" style={{ color: "#ff5e1f", fontSize: "1.2rem", fontWeight: "bold" }}>{formatMoney(t.price)}đ</div>
            <button className="btn btn--primary" style={{ width: "100%", padding: "12px" }} onClick={onBook}>ĐẶT VÉ NGAY</button>
          </div>
        </div>
      );
    }

    if (activeTab === "review") {
      return (
        <div className="reviews-wrapper" style={{display: 'flex', flexDirection: 'column', gap: 20}}>
            
            <div className="write-review-box" style={{ background: "#f9f9f9", padding: 15, borderRadius: 8, border: "1px solid #eee" }}>
                <div style={{fontWeight: 'bold', marginBottom: 10}}>Viết đánh giá của bạn</div>
                {renderInteractiveStars()}
                <textarea 
                    className="form-control"
                    rows="3"
                    placeholder="Chia sẻ trải nghiệm của bạn về chuyến đi..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    style={{
                        width: "100%", 
                        maxWidth: 700,
                        padding: 10, 
                        borderRadius: 4, 
                        border: "1px solid #ccc",
                        resize: "vertical",
                        marginBottom: 10,      
                    }}
                />
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <button 
                        className="btn btn--primary" 
                        onClick={handleSubmitReview}
                        disabled={isSubmitting}
                        style={{opacity: isSubmitting ? 0.7 : 1}}
                    >
                        {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                    </button>
                </div>
            </div>

            {/* --- REVIEW LIST --- */}
            <div className="reviews-list" style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
                {loadingReviews ? (
                    <div style={{ padding: 20, textAlign: "center", color: "#666" }}>Đang tải đánh giá...</div>
                ) : reviewList.length > 0 ? (
                    reviewList.map((item) => (
                        <Review key={item.id} data={item} />
                    ))
                ) : (
                    <div style={{ padding: 20, textAlign: "center", fontStyle: "italic", color: "#888" }}>
                        Chưa có đánh giá nào. Hãy là người đầu tiên!
                    </div>
                )}
            </div>
        </div>
      );
    }

    // Policy Tab
    return (
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
          <p>Phí huỷ sẽ được tính trên giá gốc, không giảm trừ khuyến mãi hoặc giảm giá; đồng thời không vượt quá số tiền quý khách đã thanh toán.</p>
        </div>
      </div>
    );
  };

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
        <button className="btn btn--primary" onClick={onToggle || (() => {})}>
          {expanded ? "Thu gọn" : "Chọn xe"}
        </button>
      </aside>

      {expanded && (
        <div className="trip__details">
          <div className="tabs">
            <button className={`tabs__btn ${activeTab === "images" ? "is-active" : ""}`} onClick={() => onTabChange("images")}>Hình ảnh</button>
            <button className={`tabs__btn ${activeTab === "cancel" ? "is-active" : ""}`} onClick={() => onTabChange("cancel")}>Phí hủy</button>
            <button className={`tabs__btn ${activeTab === "review" ? "is-active" : ""}`} onClick={() => onTabChange("review")}>Đánh giá ({reviewList.length || reviews})</button>
          </div>
          <div className="tab-panel">
            {renderTab()}
          </div>
        </div>
      )}
    </article>
  );
}