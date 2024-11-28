import { useState } from "react";
import Header from "./Header";

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      {/* header component */}
      <Header></Header>

      <main className="min-h-screen p-3 bg-gray-800 text-white flex justify-center">
        <section className="flex gap-3 outline outline-2 p-3 outline-red-200 max-w-[80%]">
          <div className="max-w-[45%] outline outline-2 outline-red-200">
            <h2 className="text-[30px] italic font-bold">
              Stay Connected, Effortlessly
            </h2>
            <p className="text-xl mt-2">
              Whispr brings your conversations to life with seamless messaging,
              real-time updates, and crystal-clear communication.
            </p>
          </div>
          <div>
            <img src="/chat.png" alt="" />
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
