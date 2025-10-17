import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import API from "../utils/axios";

const socket = io("http://localhost:3000");

const MatchChat = ({ matchId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user && matchId) {
      socket.emit("joinMatch", { matchId, user: { username: user.username, _id: user._id } });
      API.get(`/matches/${matchId}/messages`).then(res => {
        setMessages(res.data);
      });
    }

    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, [user, matchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit("chatMessage", {
        matchId,
        user: { username: user.username, _id: user._id },
        message: input
      });
      setInput("");
    }
  };

  return (
    <div className="bg-slate-900 border-2 border-red-600 rounded-2xl shadow-2xl p-4 mt-4">
      <h4 className="font-bold mb-3 text-red-500">Match Chat</h4>
      <div className="h-48 overflow-y-auto mb-3 border-2 border-gray-700 rounded p-3 bg-black">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <span className="font-semibold text-red-500">{msg.username || msg.user.username}:</span>{" "}
            <span className="text-gray-300">{msg.message}</span>
            <span className="text-xs text-gray-500 ml-2">{new Date(msg.time).toLocaleTimeString()}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border-2 border-gray-700 bg-black text-white rounded px-3 py-2 flex-1 focus:border-red-600 focus:outline-none transition-colors"
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-all duration-300 font-semibold">
          Send
        </button>
      </form>
    </div>
  );
};

export default MatchChat;