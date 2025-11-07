import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginApi } from "../../../services/auth/auth.service";
import { changeName } from "../../../config/redux/reducers/user/userSlice";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "../../styles/admin/Login.css";
import { useDispatch } from "react-redux";

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu");
      return;
    }
    setLoading(true);
    try {
      // Call backend auth API; service will persist token/user
      const res = await loginApi(email, password);
      if (!res || !res.token) {
        throw new Error("Phản hồi không hợp lệ từ máy chủ");
      }

      const userData = res.user
      dispatch(changeName(userData))
      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Đăng nhập thất bại, thử lại sau";
      toast.error("Đăng nhập that bai!");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-brand">Ticket Booking</div>
      <div className="auth-subtitle">Chào bạn trở lại!</div>
      {error && <div className="auth-error">{error}</div>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span>Email</span>
          <div className="auth-input-group">
            <span className="auth-input-icon" aria-hidden>
              {/* Mail icon */}
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
        <label className="auth-field">
          <span>Password</span>
          <div className="auth-input-group">
            <span className="auth-input-icon" aria-hidden>
              {/* Lock icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <input
              className="auth-input"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="auth-input-action"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? (
                // Eye-off icon
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.73-1.62 1.8-3.06 3.11-4.24M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8-1.02 2.26-2.7 4.24-4.77 5.66"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                // Eye icon
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
        </label>

        <div className="auth-actions">
          <Link to="#" className="auth-link">Quên mật khẩu?</Link>
        </div>

        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <div className="auth-switch">
        <span>Bạn chưa có tài khoản?</span>
        <Link to="/register" className="auth-link">Tạo tài khoản</Link>
      </div>
    </div>
  );
}
