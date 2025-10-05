import { useForm } from "react-hook-form";
import { EnvelopeIcon, LockClosedIcon, UserIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function SignUp() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setError, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const res = await signup(data);
    setLoading(false);

    if (res.ok) {
      toast.success("🎉 Account created successfully!");
      navigate("/");
    } else {
      const message = res.message || "";
      if (message.includes("pattern") || message.includes("password")) {
        setError("password", { type: "manual", message: "Password must include uppercase, lowercase, number, special char, and be 8+ chars" });
      } else if (message.includes("rePassword")) {
        setError("rePassword", { type: "manual", message: "Passwords do not match" });
      } else if (message.includes("dateOfBirth")) {
        setError("dateOfBirth", { type: "manual", message: "Invalid Date of Birth" });
      } else if (message.toLowerCase().includes("already exist")) {
        toast.error(message);
      } else {
        toast.error(message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 via-pink-50 to-purple-100">
      <Toaster position="top-right" />

      <div className="max-w-xl w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 m-4 border border-purple-200">
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-8">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Username</label>
            <div className="flex items-center gap-3 border-2 border-purple-300 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-purple-400">
              <UserIcon className="h-6 w-6 text-purple-500" />
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="grow text-gray-700 focus:outline-none placeholder-gray-400"
                placeholder="Enter your name"
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Email</label>
            <div className="flex items-center gap-3 border-2 border-purple-300 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-purple-400">
              <EnvelopeIcon className="h-6 w-6 text-purple-500" />
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                })}
                className="grow text-gray-700 focus:outline-none placeholder-gray-400"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Password</label>
            <div className="flex items-center gap-3 border-2 border-purple-300 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-purple-400">
              <LockClosedIcon className="h-6 w-6 text-purple-500" />
              <input
                type="password"
                {...register("password", { required: "Password is required", minLength: { value: 8, message: "At least 8 characters" } })}
                className="grow text-gray-700 focus:outline-none placeholder-gray-400"
                placeholder="Enter your password"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Confirm Password</label>
            <div className="flex items-center gap-3 border-2 border-purple-300 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-purple-400">
              <LockClosedIcon className="h-6 w-6 text-purple-500" />
              <input
                type="password"
                {...register("rePassword", {
                  required: "Confirm Password is required",
                  validate: (val) => val === watch("password") || "Passwords do not match"
                })}
                className="grow text-gray-700 focus:outline-none placeholder-gray-400"
                placeholder="Re-enter your password"
              />
            </div>
            {errors.rePassword && <p className="text-red-500 text-sm mt-1">{errors.rePassword.message}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Date of Birth</label>
            <div className="flex items-center gap-3 border-2 border-purple-300 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-purple-400">
              <CalendarIcon className="h-6 w-6 text-purple-500" />
              <input
                type="date"
                {...register("dateOfBirth", { required: "Date of Birth is required" })}
                className="grow text-gray-700 focus:outline-none placeholder-gray-400"
              />
            </div>
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Gender</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-gray-700">
                <input type="radio" value="male" {...register("gender", { required: "Gender is required" })} className="text-purple-500 focus:ring-purple-400" /> Male
              </label>
              <label className="flex items-center gap-2 text-gray-700">
                <input type="radio" value="female" {...register("gender", { required: "Gender is required" })} className="text-pink-500 focus:ring-pink-400" /> Female
              </label>
            </div>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl shadow-md transition bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 flex justify-center items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/" className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-semibold hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
