import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken, setUser } from "../../../utils/auth";
import "../../../styles/admin/Login.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      await new Promise((r) => setTimeout(r, 600));
      setToken("demo-token");
      setUser({ email, roles: ["ADMIN"] });
      navigate("/admin");
    } catch (_) {
      setError("Đăng nhập thất bại, thử lại sau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-title">Admin Login</div>
      <div className="auth-subtitle">Đăng nhập để quản trị hệ thống</div>
      {error && <div className="auth-error">{error}</div>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span>Email</span>
          <input
            className="auth-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </label>
        <label className="auth-field">
          <span>Mật khẩu</span>
          <input
            className="auth-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
