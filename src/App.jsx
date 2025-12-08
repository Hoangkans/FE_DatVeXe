import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes/MainRoute";
import { ToastContainer } from "react-toastify";
import RequireAuth from "./routes/RequireAuth";
import ChatWidget from "./shared/components/ChatWidget/ChatWidget";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Routes>
        {routes.map((route) => {
          const { path, component: Component, protected: isProtected } = route;
          let renderElement = <Component />;

          if (isProtected) {
            renderElement = (
              <RequireAuth>
                <Component />
              </RequireAuth>
            );
          }
          
          return <Route key={path} path={path} element={renderElement} />;
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

      {/* Chat Widget - Floating button */}
      <ChatWidget />
    </Router>
  );
}

export default App;
