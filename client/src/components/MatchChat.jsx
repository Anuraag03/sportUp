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
      // Fetch persisted messages
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
    <div className="bg-white rounded shadow p-4 mt-4">
      <h4 className="font-bold mb-2">Match Chat</h4>
      <div className="h-48 overflow-y-auto mb-2 border rounded p-2 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-1">
            <span className="font-semibold">{msg.username || msg.user.username}:</span> {msg.message}
            <span className="text-xs text-gray-400 ml-2">{new Date(msg.time).toLocaleTimeString()}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Send</button>
      </form>
    </div>
  );
};

export default MatchChat;