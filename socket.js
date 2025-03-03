import io from "socket.io-client";

const socket = io.connect("https://messaging-app-backend-p1g9.onrender.com");
// const socket = io.connect("http://localhost:3000");

export default socket;
