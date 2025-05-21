import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 p-4 flex space-x-4 text-white">
      <Link to="/car" className="hover:underline">
        Car
      </Link>
      <Link to="/package" className="hover:underline">
        Packages
      </Link>
      <Link to="/servicepackage" className="hover:underline">
        ServicePackage
      </Link>
      <Link to="/payment" className="hover:underline">
        Payment
      </Link>
      <Link to="/report" className="hover:underline">
        Reports
      </Link>
      <button
        onClick={logout}
        className="ml-auto bg-red-500 px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
}
