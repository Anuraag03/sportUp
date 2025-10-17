import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axios";

const Profile = () => {
  const { user, login } = useAuth();
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState({ matchesPlayed: 0, wins: 0, losses: 0 });

  useEffect(() => {
    if (user) {
      axios.get("/auth/profile").then(res => {
        login(res.data);
        setStats({
          matchesPlayed: res.data.matchesPlayed,
          wins: res.data.wins,
          losses: res.data.losses
        });
      });

      axios.get(`/matches/user/${user._id}`).then(res => {
        setMatches(res.data);
      });
    }
  }, [user]);

  if (!user) return <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-red-950 flex items-center justify-center text-white">Please login to view your profile.</div>;

  const getResult = (match) => {
    const isTeamA = match.teamA.some(p => p._id === user._id);
    const isTeamB = match.teamB.some(p => p._id === user._id);
    let result = "draw";
    if (match.winner === "A" && isTeamA) result = "win";
    if (match.winner === "A" && isTeamB) result = "loss";
    if (match.winner === "B" && isTeamB) result = "win";
    if (match.winner === "B" && isTeamA) result = "loss";
    return result;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-red-950">
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">Profile</h2>
        
        <div className="bg-slate-900 border-2 border-red-600 rounded-2xl shadow-2xl p-6 mb-6">
          <p className="text-gray-300 mb-2"><span className="font-semibold text-white">Username:</span> {user.username}</p>
          <p className="text-gray-300"><span className="font-semibold text-white">Email:</span> {user.email}</p>
        </div>

        <div className="bg-slate-900 border-2 border-red-600 rounded-2xl shadow-2xl p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-red-500">Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">{stats.matchesPlayed}</p>
              <p className="text-sm text-gray-400">Matches Played</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">{stats.wins}</p>
              <p className="text-sm text-gray-400">Wins</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">{stats.losses}</p>
              <p className="text-sm text-gray-400">Losses</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border-2 border-red-600 rounded-2xl shadow-2xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-red-500">Match History</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-left text-gray-300">Match</th>
                  <th className="py-3 px-4 text-left text-gray-300">Team A</th>
                  <th className="py-3 px-4 text-left text-gray-300">Team B</th>
                  <th className="py-3 px-4 text-left text-gray-300">Score (A - B)</th>
                  <th className="py-3 px-4 text-left text-gray-300">Result</th>
                </tr>
              </thead>
              <tbody>
                {matches.map(match => (
                  <tr key={match._id} className="border-b border-gray-800">
                    <td className="py-3 px-4 text-gray-300">{match.host?.username || "Host"}</td>
                    <td className="py-3 px-4 text-gray-300">
                      {match.teamA.map(p => p.username).join(", ")}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {match.teamB.map(p => p.username).join(", ")}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {match.scores?.teamA ?? 0} - {match.scores?.teamB ?? 0}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${getResult(match) === 'win' ? 'text-green-500' : getResult(match) === 'loss' ? 'text-red-400' : 'text-gray-400'}`}>
                        {getResult(match)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;