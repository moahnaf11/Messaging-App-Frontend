import { useState } from "react";
import Header from "./Header";
import { Link } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      {/* header component */}
      <Header></Header>

      <main className="min-h-screen p-3 bg-gray-800 text-white">
        <section className="flex mx-auto justify-center gap-3 outline outline-2 p-3 outline-red-200 max-w-[80%] max-h-min">
          <div className="max-w-[60%] outline outline-2 outline-red-200 flex ">
            <div className="text-center flex flex-col my-auto gap-16">
              <div>
                <h2 className="text-[30px] italic font-bold font-custom">
                  Stay Connected, Effortlessly
                </h2>
                <p className="text-xl">
                  Whispr brings your conversations to life with seamless
                  messaging, real-time updates, and crystal-clear communication.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  className="flex-1 rounded-full font-custom font-bold inline-block bg-blue-600 px-3 py-2"
                  to="/register"
                >
                  Register
                </Link>
                <Link
                  className="flex-1 rounded-full font-custom font-bold inline-block bg-blue-600 px-3 py-2"
                  to="/login"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
          <div>
            <img className="w-[100%]" src="/chat.png" alt="" />
          </div>
        </section>

        <section className="mt-5 mx-auto flex flex-col gap-4 max-w-[80%] outline outline-2 outline-red-200">
          <h2 className="font-bold font-custom text-2xl italic">
            Why Choose Whisper?
          </h2>

          <ul>
            <li className="flex items-center gap-4 text-xl">
              <svg
                className="size-8"
                width="256px"
                height="256px"
                viewBox="0 0 192 192"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                transform="matrix(1, 0, 0, 1, 0, 0)"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    fill="#ffea00"
                    d="M18.5 46v-6a6 6 0 0 0-4.243 10.243L18.5 46ZM42 52h104V40H42v12Zm118 14v60h12V66h-12Zm-14 74H62v12h84v-12ZM42 40H18.5v12H42V40Zm6 86V76.127H36V126h12ZM14.257 50.243l18.814 18.813 8.485-8.485-18.813-18.814-8.486 8.486ZM48 76.127a22 22 0 0 0-6.444-15.556l-8.485 8.485A10 10 0 0 1 36 76.127h12ZM62 140c-7.732 0-14-6.268-14-14H36c0 14.359 11.64 26 26 26v-12Zm98-14c0 7.732-6.268 14-14 14v12c14.359 0 26-11.641 26-26h-12Zm-14-74c7.732 0 14 6.268 14 14h12c0-14.36-11.641-26-26-26v12Z"
                  ></path>
                  <path
                    stroke="#ffea00"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="10.943999999999999"
                    d="M66 84h76m-76 24h44"
                  ></path>
                </g>
              </svg>
              <p>
                Real-Time Messaging! Stay connected with instant messages that
                deliver in a blink.
              </p>
            </li>
            <li className="flex items-center gap-4 text-xl">
              <svg
                className="size-8"
                width="256px"
                height="256px"
                viewBox="0 0 192 192"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                transform="matrix(1, 0, 0, 1, 0, 0)"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    fill="#ffea00"
                    d="M18.5 46v-6a6 6 0 0 0-4.243 10.243L18.5 46ZM42 52h104V40H42v12Zm118 14v60h12V66h-12Zm-14 74H62v12h84v-12ZM42 40H18.5v12H42V40Zm6 86V76.127H36V126h12ZM14.257 50.243l18.814 18.813 8.485-8.485-18.813-18.814-8.486 8.486ZM48 76.127a22 22 0 0 0-6.444-15.556l-8.485 8.485A10 10 0 0 1 36 76.127h12ZM62 140c-7.732 0-14-6.268-14-14H36c0 14.359 11.64 26 26 26v-12Zm98-14c0 7.732-6.268 14-14 14v12c14.359 0 26-11.641 26-26h-12Zm-14-74c7.732 0 14 6.268 14 14h12c0-14.36-11.641-26-26-26v12Z"
                  ></path>
                  <path
                    stroke="#ffea00"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="10.943999999999999"
                    d="M66 84h76m-76 24h44"
                  ></path>
                </g>
              </svg>
              <p>
                Private & Secure End-to-end encryption ensures your
                conversations are safe and sound.
              </p>
            </li>
            <li className="flex items-center gap-4 text-xl">
              <svg
                className="size-8"
                width="256px"
                height="256px"
                viewBox="0 0 192 192"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                transform="matrix(1, 0, 0, 1, 0, 0)"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    fill="#ffea00"
                    d="M18.5 46v-6a6 6 0 0 0-4.243 10.243L18.5 46ZM42 52h104V40H42v12Zm118 14v60h12V66h-12Zm-14 74H62v12h84v-12ZM42 40H18.5v12H42V40Zm6 86V76.127H36V126h12ZM14.257 50.243l18.814 18.813 8.485-8.485-18.813-18.814-8.486 8.486ZM48 76.127a22 22 0 0 0-6.444-15.556l-8.485 8.485A10 10 0 0 1 36 76.127h12ZM62 140c-7.732 0-14-6.268-14-14H36c0 14.359 11.64 26 26 26v-12Zm98-14c0 7.732-6.268 14-14 14v12c14.359 0 26-11.641 26-26h-12Zm-14-74c7.732 0 14 6.268 14 14h12c0-14.36-11.641-26-26-26v12Z"
                  ></path>
                  <path
                    stroke="#ffea00"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="10.943999999999999"
                    d="M66 84h76m-76 24h44"
                  ></path>
                </g>
              </svg>
              <p>
                Cross-Platform Access Chat seamlessly across devices — desktop,
                tablet, or phone.
              </p>
            </li>
          </ul>
        </section>

        <section className="mt-5 flex flex-col gap-4 mx-auto max-w-[80%] outline outline-2 outline-red-200">
          <h2 className="font-custom font-bold text-2xl text-center">
            What Our Users say
          </h2>
          <div className="self-center p-3 overflow-x-auto flex gap-6 items-center outline outline-2 outline-red-200 w-[55%] scroll-snap-x snap-mandatory h-[400px]">
            {/* testimonial 1 */}
            <div className="flex flex-shrink-0 snap-center flex-col gap-4 w-[100%]">
              <div className="flex gap-2 items-center">
                <img
                  className="rounded-full"
                  src="https://placehold.co/100"
                  alt=""
                />
                <h3 className="font-bold font-custom italic">Sophia M</h3>
              </div>
              <p>
                "Whispr keeps me connected with my team without any hassle!"
              </p>
            </div>

            {/* testimonial 2 */}
            <div className="flex flex-shrink-0 flex-col gap-4 w-[100%]">
              <div className="flex gap-2 items-center">
                <img
                  className="rounded-full"
                  src="https://placehold.co/100"
                  alt=""
                />
                <h3 className="font-bold font-custom italic">Liam P</h3>
              </div>
              <p>
                "Love how private and sleek it feels — like it was built just
                for me!"
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
