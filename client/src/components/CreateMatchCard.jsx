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
    <div className="bg-white rounded-2xl shadow p-5">
      <h3 className="text-lg font-semibold mb-3">Host a Match</h3>
      <form onSubmit={createMatch} className="flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Match Name"
          className="border rounded px-3 py-2"
        />
        <input
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          placeholder="Sport"
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
        >
          {submitting ? "Creating…" : "Create"}
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-2">
        PIN will be generated automatically and shown to the host.
      </p>
    </div>
  );
};

export default CreateMatchCard;
