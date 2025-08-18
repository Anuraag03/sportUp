import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to sportUp</h1>
      <div className="space-x-4">
        <Link
          to="/login"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-6 py-2 bg-green-600 text-white rounded-lg"
        >
          Signup
        </Link>
      </div>
    </div>
  );
};

export default Landing;
