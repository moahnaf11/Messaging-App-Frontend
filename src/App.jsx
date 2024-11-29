import { useState } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      {/* header component */}
      <Header></Header>
      <Outlet />
    </>
  );
}

export default App;
