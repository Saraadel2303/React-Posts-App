import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-purple-200 via-pink-100 to-purple-200 p-3 shadow-md">
      <div className="flex justify-between items-center mx-10">
        <div className="flex items-center">
          <span className="text-5xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">P</span>
          <span className="text-2xl font-bold text-purple-700 ml-1">ostify</span>
        </div>

        <div className="space-x-4 flex items-center">
          {user ? (
            <div className="relative">
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <img
                  src={user.photo || "/icon.jpg"}
                  alt="avatar"
                  className="w-12 h-12 rounded-full border-2 border-pink-400 shadow-lg hover:scale-105 transition-transform duration-300"
                />
                <span className="text-sm font-semibold text-purple-800 mt-1">{user.name}</span>
              </div>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-44 bg-white shadow-2xl rounded-xl py-2 z-20 border border-purple-100">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-purple-700 font-semibold w-full hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 rounded-md transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-red-500 font-semibold w-full hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 hover:text-red-700 rounded-md transition mt-1"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/"
              className="px-5 py-2 border-2 border-purple-600 text-purple-700 rounded-lg font-medium transition duration-300 ease-in-out hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
