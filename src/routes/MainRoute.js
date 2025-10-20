import BookCarPage from "../pages/BookCarPage"; 
import AdminLogin from "../pages/admin/Login";
import AdminRegister from "../pages/admin/Register";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminStations from "../pages/admin/Stations";
import AdminOperators from "../pages/admin/Operators";

import HomePage from "../pages/HomePage"
import BusCompanyPage from "../pages/BusCompanyPage"
import BusStationPage from "../pages/BusStation"
import BusRoutePage from "../pages/BusRoute"
import StationDetail from "../pages/StationDetail"
import InfoPage from "../pages/InfoPage"

const routes = [
  { path: "/", component: HomePage},
  { path: "/bus-company", component: BusCompanyPage},
  { path: "/bus-station", component: BusStationPage},
  { path: "/bus-route", component: BusRoutePage},
  { path: "/station-detail/:title", component: StationDetail},
  { path: "/info", component: InfoPage},
  
  { path: "/admin/login", component: AdminLogin },
  { path: "/admin/register", component: AdminRegister },
  { path: "/admin", component: AdminDashboard },
  { path: "/admin/stations", component: AdminStations },
  { path: "/admin/operators", component: AdminOperators },
  { path: "/book-car", component: BookCarPage }
]

export default routes;
