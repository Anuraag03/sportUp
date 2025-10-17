import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 px-6 py-4 flex items-center justify-between shadow-lg border-b-2 border-red-600">
      <Link to={user ? "/home" : "/"} className="text-red-500 font-bold text-2xl hover:text-red-400 transition-colors">
        SportUp
      </Link>
      <div className="flex items-center gap-6">
        {!user ? (
          <>
            <Link to="/login" className="text-white hover:text-red-500 transition-colors font-medium">Login</Link>
            <Link to="/signup" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors font-medium">Signup</Link>
            
          </>
        ) : (
          <>
            <Link to={`/profile/${user._id}`} className="text-white hover:text-red-500 transition-colors font-medium">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors font-medium cursor-pointer border-none"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;