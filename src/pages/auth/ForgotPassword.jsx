import { useState } from "react"
import { emailSubmit } from "../../services/auth/forgotPassword"

import OtpForm from "../../shared/components/auth/OtpForm";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        if (!email ) {
            setError("Vui lòng nhập email");
            return;
        }
        setLoading(true);
        try {
            const res = await emailSubmit(email);
            if (!res) {
                 throw new Error("Phản hồi không hợp lệ từ máy chủ");
            }
            toast.info(`Đã gửi xác nhận OTP đến: ${email}`);
            setShowModal(true);
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Xac nhan email thất bại, thử lại sau";
            toast.error("Khong gui duoc email");
            setError(msg);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="forgot-password">
            <div className="auth-card">
                <div className="auth-brand" style={{letterSpacing:1}}>
                    Nhập email để xác nhận thay đổi mật khẩu
                </div>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <label className="auth-field">
                        <span>Email</span>
                        <div className="auth-input-group">
                            <span className="auth-input-icon" aria-hidden>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z" fill="none"/><polyline points="22,6 12,13 2,6" /></svg>
                            </span>
                            <input
                                className="auth-input"
                                type="email"
                                placeholder="abc@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="username"
                            />
                        </div>
                    </label>
            
                    <button className="auth-button" type="submit" disabled={loading}>
                        {loading ? "Đang gui OTP..." : "Gui Xac Nhan"}
                    </button>
                </form>
            </div>

            {showModal&& (
                <OtpForm
                    email={email}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    )
}