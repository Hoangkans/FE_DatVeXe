import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes/MainRoute";
import { ToastContainer } from "react-toastify";
import RequireAdmin from "./routes/RequireAdmin";

function App() {
  return (
    <Router>
      <Routes>
        {routes.map(({ path, component: Component }) => {
          const isAdminPath = path.startsWith("/admin");
          const element = isAdminPath ? (
            <RequireAdmin>
              <Component />
            </RequireAdmin>
          ) : (
            <Component />
          );
          return <Route key={path} path={path} element={element} />;
        })}
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </Router>
  );
}

export default App;
