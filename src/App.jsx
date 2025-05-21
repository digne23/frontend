import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Car from "./pages/Car";
import Package from "./pages/Package";
import ServicePackage from "./pages/ServicePackage";
import Payment from "./pages/Payment";
import Report from "./pages/Report";

function App() {
  // Simple auth state (extend this later with JWT storage)
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Router>
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/car"
          element={isLoggedIn ? <Car /> : <Navigate to="/login" />}
        />
        <Route
          path="/package"
          element={isLoggedIn ? <Package /> : <Navigate to="/login" />}
        />
        <Route
          path="/servicepackage"
          element={isLoggedIn ? <ServicePackage /> : <Navigate to="/login" />}
        />
        <Route
          path="/payment"
          element={isLoggedIn ? <Payment /> : <Navigate to="/login" />}
        />
        <Route
          path="/report"
          element={isLoggedIn ? <Report /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/car" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
