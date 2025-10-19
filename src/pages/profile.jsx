import React, { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { motion } from "motion/react";
import { EnvelopeIcon, CalendarDaysIcon, UserIcon } from "@heroicons/react/24/solid";

export default function Profile() {
  const { user, getProfile } = useContext(AuthContext);

  useEffect(() => {
    getProfile();
  }, []);

  if (!user) {
    return (
      <p className="text-center mt-10 text-purple-600 font-medium">
        Loading profile...
      </p>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-100 via-purple-50 to-pink-200 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 w-full max-w-lg border border-pink-200 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-r from-pink-400 to-purple-500 opacity-20 rounded-full blur-2xl -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-r from-purple-400 to-pink-500 opacity-20 rounded-full blur-2xl translate-x-16 translate-y-16"></div>

        <div className="relative flex flex-col items-center text-center z-10">
          <motion.img
            src={user.photo || "/icon.jpg"}
            alt="avatar"
            className="w-32 h-32 object-cover rounded-full border-4 border-pink-400 shadow-lg hover:scale-105 transition-transform duration-300"
            onError={(e) => (e.target.src = "/icon.jpg")}
            whileHover={{ scale: 1.05 }}
          />

          <h2 className="mt-5 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700">
            {user.name}
          </h2>
          <p className="text-gray-500 mt-1">Welcome to your profile 👋</p>
        </div>

        <div className="mt-8 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 rounded-2xl p-6 shadow-inner space-y-4">
          <div className="flex items-center gap-3 text-gray-700">
            <EnvelopeIcon className="w-5 h-5 text-purple-500" />
            <p>
              <span className="font-semibold text-purple-600">Email:</span> {user.email}
            </p>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <UserIcon className="w-5 h-5 text-pink-500" />
            <p>
              <span className="font-semibold text-pink-600">Gender:</span> {user.gender}
            </p>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <CalendarDaysIcon className="w-5 h-5 text-purple-500" />
            <p>
              <span className="font-semibold text-purple-600">Date of Birth:</span>{" "}
              {user.dateOfBirth}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
