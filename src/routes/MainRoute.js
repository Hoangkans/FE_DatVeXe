import BookCarPage from "../pages/BookCarPage"; 
import AdminLogin from "../pages/admin/Login";
import AdminRegister from "../pages/admin/Register";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminStations from "../pages/admin/Stations";
import AdminOperators from "../pages/admin/Operators";
import AdminUsers from "../pages/admin/Users";
import AdminTickets from "../pages/admin/Tickets";
import AdminSchedules from "../pages/admin/Schedules";
import AdminBuses from "../pages/admin/Buses";
import AdminBanners from "../pages/admin/Banners";
import AdminPaymentProviders from "../pages/admin/PaymentProviders";

import HomePage from "../pages/HomePage"
import BusCompanyPage from "../pages/BusCompanyPage"
import BusStationPage from "../pages/BusStation"
import BusRoutePage from "../pages/BusRoute"
import StationDetail from "../pages/post/StationDetail"
import CompanyDetail from "../pages/post/CompanyDetail";
import RouteDetail from "../pages/post/RouteDetail";
import InfoPage from "../pages/InfoPage"
import TicketCheck from "../pages/TicketCheck";

const routes = [
  { path: "/", component: HomePage},
  { path: "/bus-company", component: BusCompanyPage},
  { path: "/bus-station", component: BusStationPage},
  { path: "/bus-route", component: BusRoutePage},
  { path: "/station-detail/:title", component: StationDetail},
  { path: "/company-detail/:title", component: CompanyDetail},
  { path: "/route-detail/:title", component: RouteDetail},
  { path: "/info", component: InfoPage},
  { path: "/ticket-check", component: TicketCheck},
  
  { path: "/login", component: AdminLogin },
  { path: "/register", component: AdminRegister },
  { path: "/admin", component: AdminDashboard },
  { path: "/admin/stations", component: AdminStations },
  { path: "/admin/operators", component: AdminOperators },
  { path: "/admin/users", component: AdminUsers },
  { path: "/admin/tickets", component: AdminTickets },
  { path: "/admin/schedules", component: AdminSchedules },
  { path: "/admin/buses", component: AdminBuses },
  { path: "/admin/banners", component: AdminBanners },
  { path: "/admin/payment-providers", component: AdminPaymentProviders },
  { path: "/book-car", component: BookCarPage }
]

export default routes;
