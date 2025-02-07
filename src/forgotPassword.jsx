import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    setEmail(e.target.value);
    if (!e.target.checkValidity()) {
      let errorMessage;
      if (e.target.validity.valueMissing) {
        errorMessage = "This field is required.";
      } else if (e.target.validity.typeMismatch) {
        errorMessage = "Enter a valid email address.";
      }
      setFormError(errorMessage);
      return;
    }
    setFormError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!e.target.checkValidity()) {
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3000/users/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        if (data.error === "User not found") {
          setFormError(data.error);
        }
        setLoading(false);
        return;
      }
      const data = await response.json();
      setSuccess(data.message);
      setLoading(false);
      console.log("Password reset email sent", data);
    } catch (error) {
      console.error("Error during sending email for password reset", error);
    }
  }
  return (
    <main className="min-h-screen p-3 bg-gray-800 flex justify-center items-center">
      <div>
        <Link
          className="font-custom mb-9 flex items-center gap-4 font-bold text-white"
          to="/login"
        >
          <svg
            className="size-9"
            fill="#ffffff"
            height="256px"
            width="256px"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
            xml:space="preserve"
            stroke="#ffffff"
            stroke-width="0.00512"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g>
                {" "}
                <g>
                  {" "}
                  <g>
                    {" "}
                    <path d="M256,0C114.618,0,0,114.618,0,256s114.618,256,256,256s256-114.618,256-256S397.382,0,256,0z M256,469.333 c-117.818,0-213.333-95.515-213.333-213.333S138.182,42.667,256,42.667S469.333,138.182,469.333,256S373.818,469.333,256,469.333 z"></path>{" "}
                    <path d="M384,234.667H179.503l48.915-48.915c8.331-8.331,8.331-21.839,0-30.17s-21.839-8.331-30.17,0l-85.333,85.333 c-0.008,0.008-0.014,0.016-0.021,0.023c-0.488,0.49-0.952,1.004-1.392,1.54c-0.204,0.248-0.38,0.509-0.571,0.764 c-0.226,0.302-0.461,0.598-0.671,0.913c-0.204,0.304-0.38,0.62-0.566,0.932c-0.17,0.285-0.349,0.564-0.506,0.857 c-0.17,0.318-0.315,0.646-0.468,0.971c-0.145,0.306-0.297,0.607-0.428,0.921c-0.13,0.315-0.236,0.637-0.35,0.957 c-0.121,0.337-0.25,0.669-0.354,1.013c-0.097,0.32-0.168,0.646-0.249,0.969c-0.089,0.351-0.187,0.698-0.258,1.055 c-0.074,0.375-0.118,0.753-0.173,1.13c-0.044,0.311-0.104,0.617-0.135,0.933c-0.138,1.4-0.138,2.811,0,4.211 c0.031,0.315,0.09,0.621,0.135,0.933c0.054,0.377,0.098,0.756,0.173,1.13c0.071,0.358,0.169,0.704,0.258,1.055 c0.081,0.324,0.152,0.649,0.249,0.969c0.104,0.344,0.233,0.677,0.354,1.013c0.115,0.32,0.22,0.642,0.35,0.957 c0.13,0.314,0.283,0.615,0.428,0.921c0.153,0.325,0.297,0.653,0.468,0.971c0.157,0.293,0.336,0.572,0.506,0.857 c0.186,0.312,0.363,0.628,0.566,0.932c0.211,0.315,0.445,0.611,0.671,0.913c0.191,0.255,0.368,0.516,0.571,0.764 c0.439,0.535,0.903,1.05,1.392,1.54c0.007,0.008,0.014,0.016,0.021,0.023l85.333,85.333c8.331,8.331,21.839,8.331,30.17,0 c8.331-8.331,8.331-21.839,0-30.17l-48.915-48.915H384c11.782,0,21.333-9.551,21.333-21.333S395.782,234.667,384,234.667z"></path>{" "}
                  </g>{" "}
                </g>{" "}
              </g>{" "}
            </g>
          </svg>
          Back to Login
        </Link>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="bg-white p-3 rounded-md md:min-w-[50%] min-w-[85%] flex flex-col gap-5"
          action="#"
        >
          <h2 className="font-custom font-bold text-2xl">Forgot Password?</h2>
          <p className="text-lg">
            Enter your registered email address and we'll send you a link to
            reset your password
          </p>
          <div className="flex flex-col">
            <label htmlFor="email">
              Email <span className="text-red-800">*</span>
            </label>
            <input
              className="border-black border-2 rounded-full px-2 py-1"
              type="email"
              id="email"
              value={email}
              onChange={(e) => handleChange(e)}
              name="email"
              placeholder="name@whispr.com"
              required
            />
            <span className="text-red-600">{formError}</span>
          </div>
          <div className="text-center text-green-700">{success}</div>
          <div className="flex">
            <button
              disabled={loading}
              className="flex justify-center px-3 py-2 rounded-full bg-green-500 font-custom font-bold border-2 border-green-500 flex-1 text-white hover:bg-white hover:text-black"
              type="submit"
            >
              {loading ? (
                <svg
                  className="size-7 animate-spin"
                  width="28px"
                  height="28px"
                  viewBox="-0.48 -0.48 16.96 16.96"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="#000000"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <g fill="#000000" fill-rule="evenodd" clip-rule="evenodd">
                      {" "}
                      <path
                        d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z"
                        opacity=".2"
                      ></path>{" "}
                      <path d="M7.25.75A.75.75 0 018 0a8 8 0 018 8 .75.75 0 01-1.5 0A6.5 6.5 0 008 1.5a.75.75 0 01-.75-.75z"></path>{" "}
                    </g>{" "}
                  </g>
                </svg>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ForgotPassword;
