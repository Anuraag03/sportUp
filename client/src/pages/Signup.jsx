import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/axios";
import toast from "react-hot-toast";

const Signup = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", form);
      toast.success("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-black via-slate-900 to-red-950">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 shadow-2xl rounded-lg p-8 w-96 border-2 border-red-600"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
          Signup
        </h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full border-2 border-gray-700 bg-black text-white p-3 mb-4 rounded focus:border-red-600 focus:outline-none transition-colors"
        />
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
          Signup
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-500 hover:text-red-400 font-semibold transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
