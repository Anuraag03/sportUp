import { useState } from "react";
import API from "../utils/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MatchCard = ({ match, onJoined }) => {
  const [joining, setJoining] = useState(false);
  const navigate = useNavigate();

  const join = async (team) => {
    try {
      setJoining(true);
      await API.post(`/matches/${match._id}/join`, { team });
      toast.success(`Joined Team ${team}`);
      onJoined?.();
      navigate(`/match/${match._id}`);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to join");
    } finally {
      setJoining(false);
    }
  };

  const teamCount = {
    A: match.teamA?.length ?? 0,
    B: match.teamB?.length ?? 0,
  };

  const handleClick = () => {
    navigate(`/match/${match._id}`);
  };

  return (
    <div
      className="bg-slate-900 border-2 border-red-600 rounded-2xl shadow-2xl p-5 flex flex-col gap-3 hover:border-red-500 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-white">
            Match by {match.host?.username || "Host"}
          </h4>
          <p className="text-sm text-gray-400">Status: {match.status}</p>
        </div>
        <div className="text-sm text-gray-300">
          Team A: {teamCount.A} · Team B: {teamCount.B}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold disabled:opacity-60"
          onClick={(e) => {
            e.stopPropagation();
            join("A");
          }}
          disabled={joining || match.status !== "pending"}
        >
          Join Team A
        </button>
        <button
          className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-all duration-300 font-semibold disabled:opacity-60 border border-red-600"
          onClick={(e) => {
            e.stopPropagation();
            join("B");
          }}
          disabled={joining || match.status !== "pending"}
        >
          Join Team B
        </button>
      </div>
      <h3 className="text-white font-medium">{match.title}</h3>
    </div>
  );
};

export default MatchCard;
