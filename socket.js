import io from "socket.io-client";

// const socket = io.connect("https://messaging-app-backend-abse.onrender.com");
const socket = io.connect("http://localhost:3000");

export default socket;
