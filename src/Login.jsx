import { Link, useNavigate, useOutletContext } from "react-router-dom";
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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setisLoggedIn } = useOutletContext();

  // handle input value changes
  function handleChange(e) {
    const { value, name } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(e.target);
  }

  function validateField(input) {
    // Check if the input is valid
    if (!input.checkValidity()) {
      // Set custom error message based on the validity property
      let errorMessage;
      if (input.validity.valueMissing) {
        errorMessage = "This field is required.";
      } else if (input.validity.tooShort) {
        errorMessage =
          input.name === "username"
            ? "Username must be at least 3 characters."
            : "Password must be at least 6 characters.";
      }

      // Update the formError state
      setFormError((prev) => ({
        ...prev,
        [input.name]: errorMessage,
      }));
    } else {
      // Clear the error if the field is valid
      setFormError((prev) => ({
        ...prev,
        [input.name]: null,
      }));
    }
  }

  function handleShowPassword() {
    setShowPassword((prev) => !prev);
  }

  function handleReset() {
    setLoginForm({
      username: "",
      password: "",
    });

    setFormError({
      username: null,
      password: null,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (e.target.checkValidity()) {
      const loginData = {
        username: loginForm.username,
        password: loginForm.password,
      };

      try {
        setLoading(true);
        const response = await fetch(
          "https://messaging-app-backend-abse.onrender.com/users/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
          }
        );
        if (!response.ok) {
          // handle server form validation errors
          setLoading(false);
          const data = await response.json();
          if (Array.isArray(data.error)) {
            const errors = data.error.reduce((acc, error) => {
              acc[error.path] = error.msg; // Match `path` to the field name
              return acc;
            }, {});
            setFormError(errors);
          } else {
            // handling login errors
            const field = data.error.includes("username")
              ? "username"
              : "password";
            setFormError((prev) => ({
              ...prev,
              [field]: data.error,
            }));
          }
          return;
        }
        const data = await response.json();

        console.log("Login successful:", data);
        // Handle success (store token)
        localStorage.setItem("token", data.token);
        setisLoggedIn(true);
        setLoading(false);
        // redirect to chat page
        navigate("/");
      } catch (error) {
        console.error("Error during login:", error);
      }
    }
  }

  return (
    <main className="min-h-screen p-3 bg-gray-800 flex justify-center items-center">
      <form
        onSubmit={(e) => handleSubmit(e)}
        onReset={handleReset}
        noValidate
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
            value={loginForm.username}
            name="username"
            minLength={3}
            onChange={(e) => handleChange(e)}
            required
          />
          <span className="text-red-600">{formError.username}</span>
        </div>
        <div className="flex flex-col">
          <label className="font-custom font-bold" htmlFor="password">
            Password <span className="text-red-800">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              className="border-black border-[3px] flex-1 rounded-full px-2 pr-14 py-1"
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="password"
              value={loginForm.password}
              minLength={6}
              onChange={(e) => handleChange(e)}
              required
            />
            <button
              type="button"
              onClick={handleShowPassword}
              className="absolute right-[4%]"
            >
              {showPassword ? (
                <svg
                  className="size-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5"
                      stroke="#000000"
                      stroke-width="1.7759999999999998"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                  </g>
                </svg>
              ) : (
                <svg
                  className="size-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z"
                      stroke="#000000"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                    <path
                      d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z"
                      stroke="#000000"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                  </g>
                </svg>
              )}
            </button>
          </div>
          <span className="text-red-600">{formError.password}</span>
        </div>

        <div>
          <Link className="text-blue-700" to="/forgot-password">
            Forgot Password?
          </Link>
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
          <button
            disabled={loading}
            type="submit"
            className="px-3 py-2 rounded-full bg-green-500 font-custom font-bold border-2 border-green-500 flex-1 text-white hover:bg-white hover:text-black"
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
          <button
            disabled={loading}
            type="reset"
            className="px-3 py-2 rounded-full bg-gray-500 font-custom font-bold border-2 border-gray-500 flex-1 text-white hover:bg-white hover:text-black"
          >
            Clear
          </button>
        </div>
      </form>
    </main>
  );
}

export default Login;
