import HomePage from "../pages/HomePage"
import AdminLogin from "../pages/admin/Login";
import AdminRegister from "../pages/admin/Register";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminStations from "../pages/admin/Stations";
import AdminOperators from "../pages/admin/Operators";

const routes = [
    { path: "/", component: HomePage },
    { path: "/admin/login", component: AdminLogin },
    { path: "/admin/register", component: AdminRegister },
    { path: "/admin", component: AdminDashboard },
    { path: "/admin/stations", component: AdminStations },
    { path: "/admin/operators", component: AdminOperators },
]

export default routes;
