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
    <nav className="bg-blue-600 px-6 py-3 flex items-center justify-between">
      <Link to={user ? "/home" : "/"} className="text-white font-bold text-xl">
        SportUp
      </Link>
      <div className="flex items-center gap-6">
        {!user ? (
          <>
            <Link to="/login" className="text-white hover:underline">Login</Link>
            <Link to="/signup" className="text-white hover:underline">Signup</Link>
            
          </>
        ) : (
          <>
            <Link to={`/profile/${user._id}`} className="text-white hover:underline">Profile</Link>
            <button
              onClick={handleLogout}
              className="text-white hover:underline bg-transparent border-none cursor-pointer"
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