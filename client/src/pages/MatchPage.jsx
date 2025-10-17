import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../utils/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import MatchChat from "../components/MatchChat";

const MatchPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialPin = location.state?.pin || "";
  const [pin, setPin] = useState(initialPin);

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const isHost = useMemo(() => {
    if (!match || !user) return false;
    return String(match.host?._id || match.host) === String(user._id);
  }, [match, user]);

  const isOnTeamA = useMemo(() => {
    return match?.teamA?.some((p) => (p._id || p) === user._id);
  }, [match, user]);

  const isOnTeamB = useMemo(() => {
    return match?.teamB?.some((p) => (p._id || p) === user._id);
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

  const joinTeam = async (team) => {
    try {
      setBusy(true);
      await API.post(`/matches/${id}/join`, { team });
      toast.success(`Joined Team ${team}`);
      fetchMatch();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to join team");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="p-6 text-white bg-gradient-to-br from-black via-slate-900 to-red-950 min-h-screen">Loading match…</div>;
  if (!match) return null;

  const teamA = match.teamA || [];
  const teamB = match.teamB || [];
  const scoreA = match.scores?.teamA ?? 0;
  const scoreB = match.scores?.teamB ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-red-950">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {/* Show PIN for host */}
        {isHost && pin && (
          <div className="mb-4 bg-red-900/30 border-l-4 border-red-600 p-4 rounded text-white">
            <span className="font-semibold">Match PIN:</span> <span className="font-mono text-lg">{pin}</span>
          </div>
        )}

        {/* Scoreboard */}
        <div className="bg-slate-900 border-2 border-red-600 rounded-2xl shadow-2xl p-6 flex items-center justify-between">
          <div className="text-center">
            <div className="text-sm text-gray-400">Team A</div>
            <div className="text-3xl font-bold text-red-500">{scoreA}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">Status</div>
            <div className="text-sm font-semibold text-white">{match.status}</div>
            {match.winner && (
              <div className="text-xs text-gray-300 mt-1">
                Winner: {match.winner === "A" ? "Team A" : match.winner === "B" ? "Team B" : "Draw"}
              </div>
            )}
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Team B</div>
            <div className="text-3xl font-bold text-red-500">{scoreB}</div>
          </div>
        </div>

        {/* Host actions */}
        {isHost && match.status === "pending" && (
          <div className="bg-slate-900 border-2 border-red-600 rounded-2xl shadow-2xl p-6 mt-4 flex items-end gap-3">
            <div className="grow">
              <label className="block text-sm text-gray-300 mb-1">Enter PIN to start</label>
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={4}
                placeholder="****"
                className="border-2 border-gray-700 bg-black text-white rounded px-3 py-2 w-40 tracking-widest text-center focus:border-red-600 focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={startMatch}
              disabled={busy}
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-red-700/50 disabled:opacity-60"
            >
              Start Match
            </button>
          </div>
        )}

        {/* Score controls */}
        {match.status === "started" && (
          <div className="bg-slate-900 border-2 border-red-600 rounded-2xl shadow-2xl p-6 mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => addPoints("A", 1)}
              disabled={busy}
              className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold disabled:opacity-60"
            >
              +1 Team A
            </button>
            <button
              onClick={() => addPoints("B", 1)}
              disabled={busy}
              className="bg-slate-700 text-white px-4 py-3 rounded-lg hover:bg-slate-600 transition-all duration-300 font-semibold border border-red-600 disabled:opacity-60"
            >
              +1 Team B
            </button>

            {isHost && (
              <button
                onClick={endMatch}
                disabled={busy}
                className="col-span-2 bg-red-700 text-white px-4 py-3 rounded-lg mt-2 hover:bg-red-800 transition-all duration-300 font-semibold disabled:opacity-60"
              >
                End Match
              </button>
            )}
          </div>
        )}

        {/* Rosters */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-900 border-2 border-red-600 rounded-2xl shadow-2xl p-5">
            <h3 className="font-semibold mb-3 text-red-500">Team A</h3>
            <ul className="space-y-1">
              {teamA.length === 0 && <li className="text-sm text-gray-400">No players yet</li>}
              {teamA.map((p) => (
                <li key={p._id || p} className="text-sm text-gray-300">
                  @{p.username || p}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 border-2 border-red-600 rounded-2xl shadow-2xl p-5">
            <h3 className="font-semibold mb-3 text-red-500">Team B</h3>
            <ul className="space-y-1">
              {teamB.length === 0 && <li className="text-sm text-gray-400">No players yet</li>}
              {teamB.map((p) => (
                <li key={p._id || p} className="text-sm text-gray-300">
                  @{p.username || p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Join team buttons */}
        {match.status === "pending" && !isOnTeamA && !isOnTeamB && (
          <div className="bg-slate-900 border-2 border-red-600 rounded-2xl shadow-2xl p-6 mt-4 flex gap-4 justify-center">
            <button
              onClick={() => joinTeam("A")}
              disabled={busy}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold disabled:opacity-60"
            >
              Join Team A
            </button>
            <button
              onClick={() => joinTeam("B")}
              disabled={busy}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-all duration-300 font-semibold border border-red-600 disabled:opacity-60"
            >
              Join Team B
            </button>
          </div>
        )}

        {/* Chat component */}
        <MatchChat matchId={id} />

        {/* Delete match button */}
        {isHost && match.status === "pending" && (
          <button
            onClick={async () => {
              setBusy(true);
              try {
                await API.delete(`/matches/${id}`);
                toast.success("Match deleted");
                navigate("/home");
              } catch (e) {
                toast.error(e.response?.data?.message || "Failed to delete match");
              } finally {
                setBusy(false);
              }
            }}
            className="w-full bg-red-700 cursor-pointer text-white px-4 py-3 rounded-lg mt-4 hover:bg-red-800 transition-all duration-300 font-semibold disabled:opacity-60"
            disabled={busy}
          >
            Delete Match
          </button>
        )}

        {/* Back link */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/home")}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchPage;
