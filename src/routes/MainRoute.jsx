import BookCarPage from "../pages/BookCarPage"; 
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/Auth/Register";

import HomePage from "../pages/HomePage"
import BusCompanyPage from "../pages/BusCompanyPage"
import BusStationPage from "../pages/BusStation"
import BusRoutePage from "../pages/BusRoute"
import StationDetail from "../pages/post/StationDetail"
import CompanyDetail from "../pages/post/CompanyDetail";
import RouteDetail from "../pages/post/RouteDetail";
import InfoPage from "../pages/InfoPage"
import TicketCheck from "../pages/TicketCheck";
import ProfilePage from "../pages/Profile/ProfilePage";

import ForgotPassword from "../pages/auth/ForgotPassword";
import NotFoundPage from "../pages/NotFoundPage";
import PaymentResultPage from "../pages/Payment/PaymentResult";

const routes = [
  { path: "/", component: HomePage},
  { path: "/bus-company", component: BusCompanyPage},
  { path: "/bus-station", component: BusStationPage},
  { path: "/bus-route", component: BusRoutePage},
  { path: "/station-detail/:title", component: StationDetail},
  { path: "/company-detail/:title", component: CompanyDetail},
  { path: "/route-detail/:title", component: RouteDetail},
  { path: "/info", component: InfoPage},
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage },
  { path: "/forgot-password", component: ForgotPassword},

  { path: "/book-car", component: BookCarPage, protected: true },
  { path: "/profile", component: ProfilePage, protected: true },
  { path: "/ticket-check", component: TicketCheck, protected: true },
  { path: "/payment-success", component: PaymentResultPage, protected: true},

  { path: "*", component: NotFoundPage }
]

export default routes;
