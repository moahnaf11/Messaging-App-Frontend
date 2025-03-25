import io from "socket.io-client";

const socket = io("https://messaging-app-backend-p1g9.onrender.com", {
  autoConnect: false,
});

export default socket;
