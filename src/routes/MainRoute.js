import HomePage from "../pages/HomePage"
import BusCompanyPage from "../pages/BusCompanyPage"
import BusStationPage from "../pages/BusStation"
import BusRoutePage from "../pages/BusRoute"
import StationDetail from "../pages/StationDetail"

const routes = [
    { path: "/", component: HomePage},
    { path: "/bus-company", component: BusCompanyPage},
    { path: "/bus-station", component: BusStationPage},
    { path: "/bus-route", component: BusRoutePage},
    { path: "/station-detail/:title", component: StationDetail},
]

export default routes;