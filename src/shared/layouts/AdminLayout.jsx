import { useNavigate, NavLink } from "react-router-dom";

import "../styles/AdminLayout.css";
import logo from "../../assets/logo.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PlaceIcon from "@mui/icons-material/Place";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src={logo} alt="logo" />
          <div className="admin-env">
            <div className="env-name">vivutoday</div>
            <div className="env-sub">Production</div>
          </div>
        </div>

        <div className="admin-section">
          <div className="admin-section-title">Overview</div>
          <nav className="admin-nav">
            <NavLink to="/admin">
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin/operators" >
              <DirectionsBusIcon className="icon" />
              <span>Nhà xe</span>
            </NavLink>
            <NavLink to="/admin/stations">
              <PlaceIcon className="icon" />
              <span>Bến xe</span>
            </NavLink>
          </nav>
        </div>

        <div className="admin-footer">
          <div className="user-line"></div>
          <button className="logout-btn">Đăng xuất</button>
        </div>
      </aside>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
