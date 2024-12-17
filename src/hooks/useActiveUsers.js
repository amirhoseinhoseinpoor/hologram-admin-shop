// src/hooks/useActiveUsers.js

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import store from "@/app/Store/store";
import { token } from "@/app/Store/slice";

const useActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const tokenCome = token(store.getState());

    if (!tokenCome) {
      console.error("No authentication token found for admin socket.");
      setError("No authentication token found.");
      return;
    }

    // Initialize Socket.IO client without authentication
    const socket = io(`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/admin`, {
      transports: ["websocket"],
      auth: {
        token: tokenCome, // Send the token for authentication
      },
    });

    // Listen for 'activeUsers' event
    socket.on("activeUsers", (data) => {
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
