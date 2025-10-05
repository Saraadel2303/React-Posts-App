import React, { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Profile() {
  const { user, getProfile } = useContext(AuthContext);

  useEffect(() => {
    getProfile();
  }, []);

  if (!user) {
    return <p className="text-center mt-10 text-purple-600 font-medium">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-purple-100 via-pink-50 to-purple-200 p-6">
      <div className="bg-white/80 backdrop-blur-md p-8 mt-16 rounded-3xl shadow-2xl w-full max-w-md border border-purple-200">
        {/* Title */}
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 mb-8 text-center">
         User Profile
        </h2>

        {/* User Info */}
        <div className="flex flex-col items-center gap-5">
          <img
            src={user.photo || "/icon.jpg"}
            alt="avatar"
            className="w-28 h-28 rounded-full border-4 border-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:scale-105 transition-transform duration-300"
            onError={(e) => (e.target.src = "/icon.jpg")}
          />
          <h3 className="text-2xl font-semibold text-pink-500">{user.name}</h3>
          
          <div className="space-y-3 text-center w-full">
            <p className="text-gray-700 text-lg">
              <span className="font-bold text-purple-500"> Email:</span> {user.email}
            </p>
            <p className="text-gray-700 text-lg">
              <span className="font-bold text-purple-500"> Gender:</span> {user.gender}
            </p>
            <p className="text-gray-700 text-lg">
              <span className="font-bold text-purple-500"> Date of Birth:</span> {user.dateOfBirth}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
