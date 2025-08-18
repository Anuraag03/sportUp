import { useState } from "react";
import API from "../utils/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateMatchCard = ({ onCreated }) => {
  const [pin, setPin] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const createMatch = async (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(pin)) {
      toast.error("PIN must be 4 digits");
      return;
    }
    try {
      setSubmitting(true);
      const { data } = await API.post("/matches", { pin });
      toast.success("Match created!");
      onCreated?.(data);
      // go to match page
      navigate(`/match/${data._id}`);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to create match");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <h3 className="text-lg font-semibold mb-3">Host a Match</h3>
      <form onSubmit={createMatch} className="flex items-center gap-3">
        <input
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="4-digit PIN"
          maxLength={4}
          className="border rounded px-3 py-2 w-32 tracking-widest text-center"
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
        Share the PIN with players. Only the host can start/end the match.
      </p>
    </div>
  );
};

export default CreateMatchCard;
