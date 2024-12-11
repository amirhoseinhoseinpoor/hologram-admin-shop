// src/hooks/useActiveUsers.js

import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const useActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize Socket.IO client without authentication
    const socket = io(`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/admin`, {
      transports: ["websocket"],
    });

    // Listen for 'activeUsers' event
    socket.on("activeUsers", (data) => {
      console.log("Active Users Data:", data);
      if (data && typeof data.count === "number") {
        setActiveUsers(data.count);
      }
    });

    // Handle connection errors
    socket.on("connect_error", (err) => {
      console.error("Connection Error:", err.message);
      setError("Connection error.");
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return { activeUsers, error };
};

export default useActiveUsers;
