import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes/MainRoute";

function App() {
  return (
    <Router>
      <Routes>
        {routes.map(({path, component: Component}) => (
          <Route key={path} path={path} element={<Component/>}/>
        ))}
      </Routes>
    </Router>
  );
}

export default App;
