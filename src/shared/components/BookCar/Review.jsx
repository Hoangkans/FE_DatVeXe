import formatDate from "../../../shared/utils/date/date";

export default function Review({ data }) {
    const {
        user,
        rating = 0,
        created_at,
        review = "",
    } = data || {};


    const renderStars = (count) => {
        return [...Array(5)].map((_, i) => (
        <span key={i} style={{ color: i < count ? "#FFC107" : "#e4e5e9", fontSize: "1.2rem" }}>
            ★
        </span>
        ));
    };

    const fullName = user ? `${user.last_name} ${user.first_name}` : "Người dùng ẩn danh";

    return (
        <div className="review-item" style={{ padding: "15px 0", borderBottom: "1px solid #eee" }}>
            <div className="review-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <div style={{ fontWeight: "bold", fontSize: "0.95rem" }}>{fullName}</div>
                <div style={{ fontSize: "0.85rem", color: "#888" }}>{formatDate(created_at)}</div>
            </div>
            
            <div className="review-rating" style={{ marginBottom: "8px" }}>
                {renderStars(rating)}
            </div>
            
            <p className="review-content" style={{ fontSize: "0.9rem", color: "#333", margin: 0, lineHeight: "1.4" }}>
                {review}
            </p>
        </div>
    );
}