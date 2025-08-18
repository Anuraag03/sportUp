import { useEffect, useState } from "react";
import API from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import CreateMatchCard from "../components/CreateMatchCard";
import MatchCard from "../components/MatchCard";
import toast from "react-hot-toast";

const Home = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      const { data } = await API.get("/matches"); // pending + started
      setMatches(data);
    } catch (e) {
      toast.error("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    // Optional: poll every 10s so new matches show up for everyone
    const t = setInterval(fetchMatches, 10000);
    return () => clearInterval(t);
  }, []);

  const onCreated = (newMatch) => {
    setMatches((prev) => [newMatch, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold">Hi {user?.username} 👋</h1>
        <p className="text-gray-600 mt-1">Create or join a match below.</p>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-12">
        <CreateMatchCard onCreated={onCreated} />

        <h2 className="text-xl font-semibold mt-8 mb-4">Open Matches</h2>
        {loading ? (
          <div className="text-gray-600">Loading…</div>
        ) : matches.length === 0 ? (
          <div className="text-gray-600">No matches yet. Be the first to host!</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {matches.map((m) => (
              <MatchCard key={m._id} match={m} onJoined={fetchMatches} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
