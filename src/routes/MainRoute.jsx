import BookCarPage from "../pages/BookCarPage"; 
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/Auth/Register";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminStations from "../pages/admin/Stations";
import AdminOperators from "../pages/admin/Operators";
import AdminUsers from "../pages/admin/Users";
import AdminTickets from "../pages/admin/Tickets";
import AdminSchedules from "../pages/admin/Schedules";
import AdminBuses from "../pages/admin/Buses";
import AdminSeats from "../pages/admin/Seats";
import AdminBanners from "../pages/admin/Banners";
import AdminPaymentProviders from "../pages/admin/PaymentProviders";
import AdminRoutes from "../pages/admin/Routes";

import HomePage from "../pages/HomePage"
import BusCompanyPage from "../pages/BusCompanyPage"
import BusStationPage from "../pages/BusStation"
import BusRoutePage from "../pages/BusRoute"
import StationDetail from "../pages/post/StationDetail"
import CompanyDetail from "../pages/post/CompanyDetail";
import RouteDetail from "../pages/post/RouteDetail";
import InfoPage from "../pages/InfoPage"
import TicketCheck from "../pages/TicketCheck";
import ArticlePage from "../pages/admin/ArticlePage";

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
  { path: "/article", component: ArticlePage},
  
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage },
  { path: "/admin", component: AdminDashboard },
  { path: "/admin/stations", component: AdminStations },
  { path: "/admin/operators", component: AdminOperators },
  { path: "/admin/users", component: AdminUsers },
  { path: "/admin/tickets", component:AdminTickets },
  { path: "/admin/schedules", component: AdminSchedules },
  { path: "/admin/routes", component: AdminRoutes },
  { path: "/admin/buses", component: AdminBuses },
  { path: "/admin/seats", component: AdminSeats },
  { path: "/admin/banners", component:AdminBanners },
  { path: "/admin/payment-providers", component: AdminPaymentProviders },
  { path: "/book-car", component: BookCarPage }
]

export default routes;
