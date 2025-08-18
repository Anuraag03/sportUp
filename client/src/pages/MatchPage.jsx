import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const MatchPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);

  const isHost = useMemo(() => {
    if (!match || !user) return false;
    return String(match.host?._id || match.host) === String(user._id);
  }, [match, user]);

  const fetchMatch = async () => {
    try {
      const { data } = await API.get(`/matches/${id}`);
      setMatch(data);
    } catch (e) {
      toast.error("Failed to load match");
      navigate("/home");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatch();
    // Optional: light polling to keep roster/score fresh
    const t = setInterval(fetchMatch, 5000);
    return () => clearInterval(t);
  }, [id]);

  const startMatch = async () => {
    if (!/^\d{4}$/.test(pin)) {
      toast.error("Enter the 4-digit PIN");
      return;
    }
    try {
      setBusy(true);
      const { data } = await API.post(`/matches/${id}/start`, { pin });
      setMatch(data.match);
      toast.success("Match started!");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to start");
    } finally {
      setBusy(false);
    }
  };

  const addPoints = async (team, points = 1) => {
    try {
      setBusy(true);
      const { data } = await API.put(`/matches/${id}/score`, { team, points });
      setMatch(data);
    } catch (e) {
      toast.error(e.response?.data?.message || "Score update failed");
    } finally {
      setBusy(false);
    }
  };

  const endMatch = async () => {
    try {
      setBusy(true);
      const { data } = await API.post(`/matches/${id}/end`);
      setMatch(data.match);
      toast.success("Match ended");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to end match");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="p-6">Loading match…</div>;
  if (!match) return null;

  const teamA = match.teamA || [];
  const teamB = match.teamB || [];
  const scoreA = match.scores?.teamA ?? 0;
  const scoreB = match.scores?.teamB ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {/* Scoreboard */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center justify-between">
          <div className="text-center">
            <div className="text-sm text-gray-500">Team A</div>
            <div className="text-3xl font-bold">{scoreA}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Status</div>
            <div className="text-sm font-semibold">{match.status}</div>
            {match.winner && (
              <div className="text-xs text-gray-600 mt-1">
                Winner: {match.winner === "A" ? "Team A" : match.winner === "B" ? "Team B" : "Draw"}
              </div>
            )}
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Team B</div>
            <div className="text-3xl font-bold">{scoreB}</div>
          </div>
        </div>

        {/* Host actions */}
        {isHost && match.status === "pending" && (
          <div className="bg-white rounded-2xl shadow p-6 mt-4 flex items-end gap-3">
            <div className="grow">
              <label className="block text-sm text-gray-600 mb-1">Enter PIN to start</label>
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={4}
                placeholder="****"
                className="border rounded px-3 py-2 w-40 tracking-widest text-center"
              />
            </div>
            <button
              onClick={startMatch}
              disabled={busy}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg disabled:opacity-60"
            >
              Start Match
            </button>
          </div>
        )}

        {/* Score controls (any participant while started) */}
        {match.status === "started" && (
          <div className="bg-white rounded-2xl shadow p-6 mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => addPoints("A", 1)}
              disabled={busy}
              className="bg-emerald-600 text-white px-4 py-3 rounded-lg disabled:opacity-60"
            >
              +1 Team A
            </button>
            <button
              onClick={() => addPoints("B", 1)}
              disabled={busy}
              className="bg-indigo-600 text-white px-4 py-3 rounded-lg disabled:opacity-60"
            >
              +1 Team B
            </button>

            {isHost && (
              <button
                onClick={endMatch}
                disabled={busy}
                className="col-span-2 bg-red-600 text-white px-4 py-3 rounded-lg mt-2 disabled:opacity-60"
              >
                End Match
              </button>
            )}
          </div>
        )}

        {/* Rosters */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-semibold mb-3">Team A</h3>
            <ul className="space-y-1">
              {teamA.length === 0 && <li className="text-sm text-gray-500">No players yet</li>}
              {teamA.map((p) => (
                <li key={p._id || p} className="text-sm">
                  @{p.username || p}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-semibold mb-3">Team B</h3>
            <ul className="space-y-1">
              {teamB.length === 0 && <li className="text-sm text-gray-500">No players yet</li>}
              {teamB.map((p) => (
                <li key={p._id || p} className="text-sm">
                  @{p.username || p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/home")}
            className="text-sm text-gray-600 underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchPage;
