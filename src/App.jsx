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
        <section className="flex flex-col-reverse md:flex-row mx-auto justify-center gap-6 p-3 md:max-w-[80%] max-h-min">
          <div className="md:max-w-[60%] flex ">
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
          <div className="my-auto">
            <img
              className="w-[70%] md:w-[100%] object-contain mx-auto"
              src="/chat.png"
              alt=""
            />
          </div>
        </section>

        <section className="mt-5 mx-auto flex flex-col gap-4 md:max-w-[80%]">
          <h2 className="font-bold font-custom text-2xl italic">
            Why Choose Whispr?
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

        <section className="mt-5 flex flex-col gap-4 mx-auto md:max-w-[80%]">
          <h2 className="font-custom font-bold text-2xl md:text-center">
            What Our Users say
          </h2>
          <div className="self-center px-3 py-6 overflow-x-auto flex gap-6 items-center w-[90%] md:w-[55%] scroll-snap-x snap-mandatory min-h-min">
            {/* testimonial 1 */}
            <div className="flex flex-shrink-0 snap-center flex-col gap-4 w-[100%]">
              <div className="flex gap-2 items-center">
                <img
                  className="rounded-full h-[100px]"
                  src="/sofia.jpg"
                  alt=""
                />
                <h3 className="font-bold font-custom italic">Sophia M</h3>
              </div>
              <p>
                "Whispr keeps me connected with my team without any hassle!"
              </p>
            </div>

            {/* testimonial 2 */}
            <div className="flex flex-shrink-0 snap-center flex-col gap-4 w-[100%]">
              <div className="flex gap-2 items-center">
                <img
                  className="rounded-full h-[100px]"
                  src="/liam.jpg"
                  alt=""
                />
                <h3 className="font-bold font-custom italic">Liam P</h3>
              </div>
              <p>
                "Love how private and sleek it feels — like it was built just
                for me!"
              </p>
            </div>

            {/* testimonial 3 */}
            <div className="flex flex-shrink-0 snap-center flex-col gap-4 w-[100%]">
              <div className="flex gap-2 items-center">
                <img
                  className="rounded-full h-[100px]"
                  src="/emma.jpg"
                  alt=""
                />
                <h3 className="font-bold font-custom italic">Emma R</h3>
              </div>
              <p>
                "I appreciate the clean and intuitive interface. It makes
                messaging so much easier!"
              </p>
            </div>

            {/* testimonial 4 */}
            <div className="flex flex-shrink-0 snap-center flex-col gap-4 w-[100%]">
              <div className="flex gap-2 items-center">
                <img
                  className="rounded-full h-[100px]"
                  src="/noah.jpg"
                  alt=""
                />
                <h3 className="font-bold font-custom italic">Noah J</h3>
              </div>
              <p>
                "I can finally organize my chats and stay on top of all my
                conversations effortlessly."
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-800 flex justify-center p-3 text-white items-center sticky bottom-0">
        <h2 className="flex items-center gap-5 font-custom font-bold">
          Follow me on Github{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/moahnaf11"
          >
            <svg
              className="size-8"
              width="256px"
              height="256px"
              viewBox="0 0 20 20"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              fill="#ffffff"
              stroke="#ffffff"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <title>github [#ffffff]</title>{" "}
                <desc>Created with Sketch.</desc> <defs> </defs>{" "}
                <g
                  id="Page-1"
                  stroke-width="0.0002"
                  fill="none"
                  fill-rule="evenodd"
                >
                  {" "}
                  <g
                    id="Dribbble-Light-Preview"
                    transform="translate(-140.000000, -7559.000000)"
                    fill="#ffffff"
                  >
                    {" "}
                    <g id="icons" transform="translate(56.000000, 160.000000)">
                      {" "}
                      <path
                        d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399"
                        id="github-[#ffffff]"
                      >
                        {" "}
                      </path>{" "}
                    </g>{" "}
                  </g>{" "}
                </g>{" "}
              </g>
            </svg>
          </a>
        </h2>
      </footer>
    </>
  );
}

export default App;
