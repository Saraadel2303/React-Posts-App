import { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      return storedUser ? { ...JSON.parse(storedUser), token: storedToken } : null;
    } catch {
      return null;
    }
  });

  const signup = async (data) => {
    try {
      const [day, month, year] = data.dateOfBirth.split("-");
      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        rePassword: data.rePassword,
        dateOfBirth: formattedDate,
        gender: data.gender,
      };

      const res = await axios.post(
        "https://linked-posts.routemisr.com/users/signup",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      return { ok: true, data: res.data };
    } catch (err) {
      const apiMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Signup failed";
      return { ok: false, message: apiMessage };
    }
  };

  const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);

    if (!token) {
      return { ok: false, message: "No token found" };
    }

    const res = await axios.get(
      "https://linked-posts.routemisr.com/users/profile-data",
      {
        headers: { token },
      }
    );

    const userData = res.data.user;

    const updatedUser = {
      ...userData,
      token,
      photo:
        userData.gender === "female"
          ? "/profile.jpg"
          : "/maleAvatar.png",
    };


    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    return { ok: true, data: updatedUser };
  } catch (err) {
    console.error("❌ getProfile error:", err.response?.data || err.message);
    return {
      ok: false,
      message: err.response?.data?.message || "Failed to fetch profile",
    };
  }
};


  const login = async (data) => {
    try {
      const res = await axios.post(
        "https://linked-posts.routemisr.com/users/signin",
        { email: data.email, password: data.password },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = res.data.token;
      const userData = res.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser({ ...userData, token });

      await getProfile();

      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, getProfile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
