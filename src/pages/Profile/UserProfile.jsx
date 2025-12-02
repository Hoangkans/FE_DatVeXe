import formatDate from "../../shared/utils/date/date";
import { useState } from "react";
import ChangePasswordModal from "../../shared/components/auth/ChangePassword";

export default function UserProfile ({user}){
    const [openModal, setOpenMoal] = useState(false)

    return (
       <div className="profile-card">
            <div className="profile-info-header">
                <div>
                    <h2 style={{margin: 0}}>{user.fullName}</h2>
                    <span className="profile-role-badge">Khách hàng</span>
                </div>

                <div>
                    <button onClick={() => setOpenMoal(true)}>Thay đổi mật khẩu</button>
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

            <ChangePasswordModal
                isOpen={openModal}
                onClose={() => setOpenMoal(false)}
            />
        </div>
    )
}