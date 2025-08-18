import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import MatchPage from "./pages/MatchPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import NavBar from "./components/NavBar";
import Profile from "./pages/Profile";
function App() {
  return (
    <Router>
      <NavBar />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/match/:id"
          element={
            <ProtectedRoute>
              <MatchPage />
            </ProtectedRoute>
          }
        />
        <Route path="/profile/:id" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
export default App;
