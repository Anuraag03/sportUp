import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-black via-slate-900 to-red-950">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
          Welcome to SportUp
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl">
          Connect with athletes, organize sports events, and elevate your game to
          the next level
        </p>
        <div className="flex gap-6 justify-center">
          <Link
            to="/login"
            className="px-8 py-3 bg-slate-900 text-white rounded-lg border-2 border-red-600 hover:bg-red-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-red-600/50"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-red-700/50"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 text-gray-500 text-sm">
        Join the sports community today
      </div>
    </div>
  );
};

export default Landing;
