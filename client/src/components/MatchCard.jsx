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
      className="bg-white rounded-2xl shadow p-5 flex flex-col gap-3 match-card"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold">
            Match by {match.host?.username || "Host"}
          </h4>
          <p className="text-sm text-gray-500">Status: {match.status}</p>
        </div>
        <div className="text-sm text-gray-600">
          Team A: {teamCount.A} · Team B: {teamCount.B}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
          onClick={() => join("A")}
          disabled={joining || match.status !== "pending"}
        >
          Join Team A
        </button>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
          onClick={() => join("B")}
          disabled={joining || match.status !== "pending"}
        >
          Join Team B
        </button>
      </div>
      <h3>{match.title}</h3>
    </div>
  );
};

export default MatchCard;
