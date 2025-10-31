import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerApi } from "../../../../services/auth/auth.service";
import "../../../styles/admin/Register.css";

export default function AdminRegister() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !email || !password || !confirm) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (password !== confirm) {
      setError("Mật khẩu không khớp");
      return;
    }

    setLoading(true);
    try {
      const res = await registerApi(firstName, lastName, email, password, confirm, phone);

      if (res?.token) {
        navigate("/admin");
      } else {
        navigate("/login");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Đăng ký thất bại, thử lại sau";
        console.log("❌ Error:", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-brand">Ticket Booking</div>
      <div className="auth-subtitle">Tạo tài khoản mới</div>
      {error && <div className="auth-error">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        {/* First name */}
        <label className="auth-field">
          <span>Họ</span>
          <div className="auth-input-group">
            <input
              className="auth-input"
              type="text"
              placeholder="Nguyễn"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
            />
          </div>
        </label>

        {/* Last name */}
        <label className="auth-field">
          <span>Tên</span>
          <div className="auth-input-group">
            <input
              className="auth-input"
              type="text"
              placeholder="Văn A"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
            />
          </div>
        </label>

        {/* Email */}
        <label className="auth-field">
          <span>Email</span>
          <div className="auth-input-group">
            <input
              className="auth-input"
              type="email"
              placeholder="abc@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
        </label>

        {/* Phone */}
        <label className="auth-field">
          <span>Số điện thoại</span>
          <div className="auth-input-group">
            <input
              className="auth-input"
              type="tel"
              placeholder="0987654321"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>
        </label>

        {/* Password */}
        <label className="auth-field">
          <span>Mật khẩu</span>
          <div className="auth-input-group">
            <input
              className="auth-input"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="auth-input-action"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>
        </label>

        {/* Confirm password */}
        <label className="auth-field">
          <span>Xác nhận mật khẩu</span>
          <div className="auth-input-group">
            <input
              className="auth-input"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="auth-input-action"
              onClick={() => setShowConfirm((s) => !s)}
            >
              {showConfirm ? "Ẩn" : "Hiện"}
            </button>
          </div>
        </label>

        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>

      <div className="auth-switch">
        <span>Đã có tài khoản?</span>
        <Link to="/login" className="auth-link">
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
}
