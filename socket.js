import io from "socket.io-client";

const socket = io.connect("https://messaging-app-backend-abse.onrender.com");

export default socket;
