import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../utils/axios";
import toast from "react-hot-toast";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", form);
      login(data);
      toast.success("Login successful!");
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-black via-slate-900 to-red-950">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 shadow-2xl rounded-lg p-8 w-96 border-2 border-red-600"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
          Login
        </h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border-2 border-gray-700 bg-black text-white p-3 mb-4 rounded focus:border-red-600 focus:outline-none transition-colors"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border-2 border-gray-700 bg-black text-white p-3 mb-6 rounded focus:border-red-600 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-red-700/50"
        >
          Login
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-gray-300">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-red-500 hover:text-red-400 font-semibold transition-colors"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
