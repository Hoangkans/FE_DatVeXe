import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes/MainRoute";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <Routes>
        {routes.map(({path, component: Component}) => (
          <Route key={path} path={path} element={<Component/>}/>
        ))}
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
