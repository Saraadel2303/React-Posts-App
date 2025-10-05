import { useForm } from "react-hook-form";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function SignIn() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const res = await login(data);
    setLoading(false);

    if (res.ok) {
      toast.success("✅ Logged in successfully!");
      navigate("/posts");
    } else {
      if (res.message?.toLowerCase().includes("email")) {
        setError("email", { type: "manual", message: res.message });
      } else if (res.message?.toLowerCase().includes("password")) {
        setError("password", { type: "manual", message: res.message });
      } else {
        toast.error(res.message || "Login failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 via-pink-50 to-purple-100 ">
      <Toaster position="top-right" />

      <div className="max-w-xl w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 m-4 border border-purple-200">
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-8">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Email</label>
            <div className="flex items-center gap-3 border-2 border-purple-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-purple-400 bg-white">
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

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Password</label>
            <div className="flex items-center gap-3 border-2 border-purple-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-purple-400 bg-white">
              <LockClosedIcon className="h-6 w-6 text-purple-500" />
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                className="grow text-gray-700 focus:outline-none placeholder-gray-400"
                placeholder="Enter your password"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl shadow-md transition bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 flex justify-center items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-semibold hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
