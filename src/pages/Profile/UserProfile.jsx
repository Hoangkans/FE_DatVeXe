import formatDate from "../../shared/utils/date/date";

export default function UserProfile ({user}){
    return (
       <div className="profile-card">
            <div className="profile-info-header">
                <div>
                    <h2 style={{margin: 0}}>{user.fullName}</h2>
                    <span className="profile-role-badge">Khách hàng</span>
                </div>
            </div>

            <hr style={{border: '0', borderTop: '1px solid #f3f4f6', margin: '20px 0'}} />

            <div className="profile-info-grid">
                
                <div className="profile-info-item">
                    <label>Họ và tên</label>
                    <p>{user.fullName}</p>
                </div>

                <div className="profile-info-item">
                    <label>Email</label>
                    <p>{user.email}</p>
                </div>
                    
                <div className="profile-info-item">
                    <label>Số điện thoại</label>
                    <p>{user.phoneNumber || "Chưa cập nhật"}</p>
                </div>

                <div className="profile-info-item">
                    <label>Ngày gia nhập</label>
                    <p>{formatDate(user.createdAt)}</p>
                </div>
            </div>
        </div>
    )
}