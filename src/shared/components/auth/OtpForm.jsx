import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import { otpVerify, resetPassword } from '../../../services/auth/forgotPassword';

export default function OtpForm({ email, onClose }) {
    const [step, setStep] = useState('OTP'); 
    
    const [otp, setOtp] = useState('');
    const [resetToken, setResetToken] = useState(null); 
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleVerifyOtp(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await otpVerify(email, otp);
            if (res && res.reset_token) {
                setResetToken(res.reset_token); 
                setStep('PASSWORD'); 
                toast.info("Xác thực OTP thành công! Nhập mật khẩu mới.");
            } else {
                throw new Error("Không nhận được token xác thực");
            }
        } catch (err) {
            const msg = err?.response?.data?.message || "Mã OTP không chính xác";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    async function handleResetPassword(e) {
        e.preventDefault();
        setError('');

        if (newPass !== confirmPass) {
            setError("Mật khẩu nhập lại không khớp");
            return;
        }
        
        setLoading(true);
        try {
            await resetPassword(resetToken, newPass);
            toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập.");
            onClose(); 
            navigate("/login")
        } catch (err) {
            const msg = err?.response?.data?.message || "Đổi mật khẩu thất bại";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="reset-modal-overlay">
            <div className="auth-card reset-modal-content">
                <button onClick={onClose} className="close-btn">&times;</button>

                {step === 'OTP' && (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="auth-brand">Nhập mã OTP</div>
                        <p style={{textAlign:'center', fontSize:'14px', color:'#666'}}>
                            Mã đã được gửi tới: <strong>{email}</strong>
                        </p>
                        
                        <label className="auth-field">
                            <input
                                className="auth-input"
                                type="text"
                                placeholder="Nhập mã 6 số"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </label>

                        {error && <div className="reset-error-text">{error}</div>}

                        <button className="auth-button" type="submit" disabled={loading}>
                            {loading ? "Đang xác thực..." : "Xác nhận OTP"}
                        </button>
                    </form>
                )}

                {step === 'PASSWORD' && (
                    <form onSubmit={handleResetPassword}>
                        <div className="auth-brand">Đặt lại mật khẩu</div>
                        
                        <label className="auth-field">
                            <span>Mật khẩu mới</span>
                            <input
                                className="auth-input"
                                type="text"
                                placeholder="Nhập mật khẩu mới"
                                value={newPass}
                                onChange={(e) => setNewPass(e.target.value)}
                            />
                        </label>

                        <label className="auth-field">
                            <span>Nhập lại mật khẩu</span>
                            <input
                                className="auth-input"
                                type="text"
                                placeholder="Xác nhận mật khẩu"
                                value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)}
                            />
                        </label>

                        {error && <div className="reset-error-text">{error}</div>}

                        <button className="auth-button" type="submit" disabled={loading}>
                            {loading ? "Đang cập nhật..." : "Đổi Mật Khẩu"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}