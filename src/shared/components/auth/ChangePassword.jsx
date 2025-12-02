import { useState } from "react";
import { UpdatePassword } from "../../../services/auth/forgotPassword";

export default function ChangePasswordModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        oldPass: "",
        newPass: "",
        confirmPass: ""
    });

    const [status, setStatus] = useState({ loading: false, error: "", success: "" });

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setStatus({ ...status, error: "", success: "" });
    };

    const handleClose = () => {
        setFormData({ oldPass: "", newPass: "", confirmPass: "" });
        setStatus({ loading: false, error: "", success: "" });
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.newPass !== formData.confirmPass) {
            setStatus({ ...status, error: "Mật khẩu mới không khớp!" });
            return;
        }
        if (formData.newPass.length < 6) {
             setStatus({ ...status, error: "Mật khẩu phải có ít nhất 6 ký tự." });
             return;
        }

        setStatus({ ...status, loading: true, error: "" });
        try {
            await UpdatePassword(formData.oldPass, formData.newPass);
            setStatus({ loading: false, error: "", success: "Đổi mật khẩu thành công!" });
            
            setTimeout(() => {
                onClose();
                setStatus({ loading: false, error: "", success: "" });
                setFormData({ oldPass: "", newPass: "", confirmPass: "" });
            }, 1500);
            
        } catch (err) {
            const msg = err?.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.";
            setStatus({ loading: false, error: msg, success: "" });
        }
    };

    return (
        <div className="pass-modal-overlay">
            <div className="modal-content">
                <h3>Đổi Mật Khẩu</h3>
                
                <form onSubmit={handleSubmit} className="password-form">
                    <div className="form-group">
                        <label>Mật khẩu cũ</label>
                        <input 
                            type="text" 
                            name="oldPass" 
                            value={formData.oldPass} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Mật khẩu mới</label>
                        <input 
                            type="text" 
                            name="newPass" 
                            value={formData.newPass} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Xác nhận mật khẩu mới</label>
                        <input 
                            type="text" 
                            name="confirmPass" 
                            value={formData.confirmPass} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    {status.error && <p className="error-text">{status.error}</p>}
                    {status.success && <p className="success-text">{status.success}</p>}

                    <div className="modal-actions">
                        <button type="button" onClick={handleClose} className="btn-cancel">Hủy</button>
                        <button type="submit" disabled={status.loading} className="btn-confirm">
                            {status.loading ? "Đang xử lý..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};