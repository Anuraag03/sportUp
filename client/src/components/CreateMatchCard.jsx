import { useState } from "react";
import API from "../utils/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateMatchCard = ({ onCreated }) => {
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const createMatch = async (e) => {
    e.preventDefault();
    if (!name.trim() || !sport.trim()) {
      toast.error("Enter match name and sport");
      return;
    }
    try {
      setSubmitting(true);
      const { data } = await API.post("/matches", { name, sport });
      toast.success("Match created!");
      onCreated?.(data);
      navigate(`/match/${data._id}`, { state: { pin: data.pin } });
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to create match");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border-2 border-red-600 rounded-2xl shadow-2xl p-6">
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
        Host a Match
      </h3>
      <form onSubmit={createMatch} className="flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Match Name"
          className="border-2 border-gray-700 bg-black text-white rounded px-3 py-2 focus:border-red-600 focus:outline-none transition-colors"
        />
        <input
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          placeholder="Sport"
          className="border-2 border-gray-700 bg-black text-white rounded px-3 py-2 focus:border-red-600 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-red-700/50 disabled:opacity-60"
        >
          {submitting ? "Creating…" : "Create"}
        </button>
      </form>
      <p className="text-xs text-gray-400 mt-3">
        PIN will be generated automatically and shown to the host.
      </p>
    </div>
  );
};

export default CreateMatchCard;
