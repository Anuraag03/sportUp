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

  if (!user) return <div>Please login to view your profile.</div>;

  // Helper to get result for user
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
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="mb-6">
        <p><span className="font-semibold">Username:</span> {user.username}</p>
        <p><span className="font-semibold">Email:</span> {user.email}</p>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Stats</h3>
        <p>Matches Played: {stats.matchesPlayed}</p>
        <p>Wins: {stats.wins}</p>
        <p>Losses: {stats.losses}</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Match History</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-blue-100">
              <th className="py-2 px-4 border">Match</th>
              <th className="py-2 px-4 border">Team A</th>
              <th className="py-2 px-4 border">Team B</th>
              <th className="py-2 px-4 border">Score (A - B)</th>
              <th className="py-2 px-4 border">Result</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(match => (
              <tr key={match._id}>
                <td className="py-2 px-4 border">{match.host?.username || "Host"}</td>
                <td className="py-2 px-4 border">
                  {match.teamA.map(p => p.username).join(", ")}
                </td>
                <td className="py-2 px-4 border">
                  {match.teamB.map(p => p.username).join(", ")}
                </td>
                <td className="py-2 px-4 border">
                  {match.scores?.teamA ?? 0} - {match.scores?.teamB ?? 0}
                </td>
                <td className="py-2 px-4 border">
                  {getResult(match)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profile;