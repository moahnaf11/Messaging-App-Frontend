import { Link } from "react-router-dom";
import { useState } from "react";

function Login() {
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [formError, setFormError] = useState({
    username: null,
    password: null,
  });

  // handle input value changes
  function handleChange(e) {
    const { value, name } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError((prev) => {
      if (name === "username") {
        return {
          ...prev,
          username:
            value.length < 3
              ? "Username must be a minimum of 3 characters"
              : null,
        };
      } else if (name === "password") {
        return {
          ...prev,
          password:
            value.length < 6
              ? "Password must be a minimum of 6 characters"
              : null,
        };
      }
    });
  }

  return (
    <main className="min-h-screen p-3 bg-gray-800 flex justify-center items-center">
      <form
        action="#"
        className="bg-white p-3 rounded-md md:min-w-[50%] min-w-[85%] flex flex-col gap-5"
      >
        <div className="flex items-center justify-between">
          <h1 className="font-custom font-bold text-2xl">Log In</h1>
          <svg
            className="size-12"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            stroke="#000000"
            stroke-width="1.6320000000000001"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path d="M0 0h48v48H0z" fill="none"></path>{" "}
              <g id="Shopicon">
                {" "}
                <path d="M33.843,26.914L24,36l-9.843-9.086C8.674,30.421,5,36.749,5,44h38C43,36.749,39.326,30.421,33.843,26.914z"></path>{" "}
                <path d="M24,28c3.55,0,6.729-1.55,8.926-4C34.831,21.876,36,19.078,36,16c0-6.627-5.373-12-12-12S12,9.373,12,16 c0,3.078,1.169,5.876,3.074,8C17.271,26.45,20.45,28,24,28z"></path>{" "}
              </g>{" "}
            </g>
          </svg>
        </div>

        <div className="flex flex-col">
          <label className="font-custom font-bold" htmlFor="username">
            Username <span className="text-red-800">*</span>
          </label>
          <input
            className="border-black border-[3px] rounded-full px-2 py-1"
            type="text"
            id="username"
            placeholder="username"
            name="username"
            minLength={3}
            onChange={(e) => handleChange(e)}
            required
          />
          <span className="text-red-600">
            {formError.username ? formError.username : null}
          </span>
        </div>
        <div className="flex flex-col">
          <label className="font-custom font-bold" htmlFor="password">
            Password <span className="text-red-800">*</span>
          </label>
          <input
            className="border-black border-[3px] rounded-full px-2 py-1"
            type="password"
            id="password"
            name="password"
            placeholder="password"
            minLength={6}
            onChange={(e) => handleChange(e)}
            required
          />
          <span className="text-red-600">
            {formError.password ? formError.password : null}
          </span>
        </div>

        <div className="flex items-center justify-between gap-5">
          <div>Don't have an account?</div>
          <Link
            className="font-custom text-[14px] md:text-[16px] font-bold border-2 border-blue-500 inline-block px-3 py-2 rounded-full bg-blue-500 text-white hover:bg-white hover:text-blue-800"
            to="/register"
          >
            Register
          </Link>
        </div>

        <div className="flex justify-center gap-5">
          <button className="px-3 py-2 rounded-full bg-green-500 font-custom font-bold border-2 border-green-500 flex-1 text-white hover:bg-white hover:text-black">
            Submit
          </button>
          <button className="px-3 py-2 rounded-full bg-gray-500 font-custom font-bold border-2 border-gray-500 flex-1 text-white hover:bg-white hover:text-black">
            Clear
          </button>
        </div>
      </form>
    </main>
  );
}

export default Login;
