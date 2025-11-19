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
import ArticlePage from "../pages/admin/ArticlePage";
import ProfilePage from "../pages/ProfilePage";

import NotFoundPage from "../pages/NotFoundPage";

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
  { path: "/book-car", component: BookCarPage },
  { path: "/profile", component: ProfilePage },

  { path: "*", component: NotFoundPage }
]

export default routes;
