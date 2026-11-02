// src/app/utils/socket.js

import { io } from "socket.io-client";
import { token } from "../Store/slice"; // Ensure this is your selector
import store from "../Store/store"; // Import the exported store instance

const initializeSocket = () => {
  const tokenCome = token(store.getState());

  if (!tokenCome) {
    console.error("No authentication token found for chat socket.");
    // Optionally, handle unauthenticated state (e.g., redirect to login)
    return null;
  }

  return io(`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/chat`, {
    transports: ["websocket"],
    auth: {
      token: tokenCome, // Send the token for authentication
    },
  });
};

const socket = initializeSocket();

export default socket;
