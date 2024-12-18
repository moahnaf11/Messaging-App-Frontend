import { useState } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
// import socket from "../socket";
// // socket.on("connect", () => {
// //   console.log("Connected to the server:", socket.id);
// // });

function App() {
  const [isLoggedIn, setisLoggedIn] = useState(!!localStorage.getItem("token"));
  return (
    <>
      {/* header component */}
      <Header isLoggedIn={isLoggedIn}></Header>
      <Outlet context={{ isLoggedIn, setisLoggedIn }} />
    </>
  );
}

export default App;
