import { useNavigate, NavLink } from "react-router-dom";
import { logout } from "../../services/auth/auth.service";

import "../styles/AdminLayout.css";
import logo from "../../assets/logo.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PlaceIcon from "@mui/icons-material/Place";
import PeopleIcon from "@mui/icons-material/People";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import CollectionsIcon from "@mui/icons-material/Collections";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
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
            <NavLink to="/admin" className={({ isActive }) => `admin-nav-link ${isActive ? 'is-active' : ''}`}>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin/operators" className={({ isActive }) => `admin-nav-link ${isActive ? 'is-active' : ''}`}>
              <DirectionsBusIcon className="icon" />
              <span>Nhà xe</span>
            </NavLink>
            <NavLink to="/admin/stations" className={({ isActive }) => `admin-nav-link ${isActive ? 'is-active' : ''}`}>
              <PlaceIcon className="icon" />
              <span>Bến xe</span>
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-link ${isActive ? 'is-active' : ''}`}>
              <PeopleIcon className="icon" />
              <span>Người dùng</span>
            </NavLink>
            <NavLink to="/admin/tickets" className={({ isActive }) => `admin-nav-link ${isActive ? 'is-active' : ''}`}>
              <ConfirmationNumberIcon className="icon" />
              <span>Vé xe</span>
            </NavLink>
            <NavLink to="/admin/schedules" className={({ isActive }) => `admin-nav-link ${isActive ? 'is-active' : ''}`}>
              <CalendarMonthIcon className="icon" />
              <span>Lịch trình</span>
            </NavLink>
            <NavLink to="/admin/buses" className={({ isActive }) => `admin-nav-link ${isActive ? 'is-active' : ''}`}>
              <AirportShuttleIcon className="icon" />
              <span>Xe</span>
            </NavLink>
            <NavLink to="/admin/banners" className={({ isActive }) => `admin-nav-link ${isActive ? 'is-active' : ''}`}>
              <CollectionsIcon className="icon" />
              <span>Banner</span>
            </NavLink>
            <NavLink to="/admin/payment-providers" className={({ isActive }) => `admin-nav-link ${isActive ? 'is-active' : ''}`}>
              <AccountBalanceWalletIcon className="icon" />
              <span>Payment provider</span>
            </NavLink>
          </nav>
        </div>

        <div className="admin-footer">
          <div className="user-line"></div>
          <button
            className="logout-btn"
            onClick={() => {
              try {
                logout();
              } finally {
                navigate('/login');
              }
            }}
          >
            Đăng xuất
          </button>
        </div>
      </aside>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
