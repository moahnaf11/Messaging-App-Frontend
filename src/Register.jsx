import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [registerForm, setRegisterForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    confirmpassword: "",
  });
  const [formError, setFormError] = useState({
    firstname: null,
    lastname: null,
    email: null,
    username: null,
    password: null,
    confirmpassword: null,
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmpassword: false,
  });
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;

    // Update form values
    setRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(e.target);
  }

  function validateField(input) {
    // Validate input field
    if (!input.checkValidity()) {
      // Set error message based on validity state
      let errorMessage = "";
      if (input.validity.valueMissing) {
        errorMessage = "This field is required";
      } else if (input.validity.tooShort) {
        errorMessage =
          input.name === "username"
            ? "Username must be at least 3 characters long."
            : input.name === "password" || input.name === "confirmpassword"
            ? "Password must be at least 6 characters long."
            : errorMessage;
      } else if (input.name === "email" && input.validity.typeMismatch) {
        errorMessage = "Enter a valid email address.";
      }

      setFormError((prev) => ({
        ...prev,
        [input.name]: errorMessage,
      }));
    } else {
      // Clear error message if input is valid
      setFormError((prev) => ({
        ...prev,
        [input.name]: null,
      }));
    }

    // Additional logic for confirm password match
    if (input.name === "confirmpassword") {
      if (input.value !== registerForm.password) {
        setFormError((prev) => ({
          ...prev,
          confirmpassword: "Password and confirm password do not match.",
        }));
      } else {
        setFormError((prev) => ({
          ...prev,
          confirmpassword: null,
        }));
      }
    }
  }

  function handleShowPassword(field) {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  }

  function handleReset() {
    setRegisterForm({
      firstname: "",
      lastname: "",
      email: "",
      username: "",
      password: "",
      confirmpassword: "",
    });

    setFormError({
      firstname: null,
      lastname: null,
      email: null,
      username: null,
      password: null,
      confirmpassword: null,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!e.target.checkValidity()) {
      return;
    }
    const registerData = {
      firstname: registerForm.firstname,
      lastname: registerForm.lastname,
      email: registerForm.email,
      username: registerForm.username,
      password: registerForm.password,
      confirmpassword: registerForm.confirmpassword,
    };

    try {
      const response = await fetch("https://messaging-app-backend-abse.onrender.com/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });
      if (!response.ok) {
        // handle server form validation errors
        const data = await response.json();
        if (Array.isArray(data.error)) {
          const errors = data.error.reduce((acc, error) => {
            acc[error.path] = error.msg; // Match `path` to the field name
            return acc;
          }, {});
          setFormError(errors);
        } else {
          // handling register errors
          const field = data.error.includes("username") ? "username" : "email";
          setFormError((prev) => ({
            ...prev,
            [field]: data.error,
          }));
        }
        return;
      }
      const data = await response.json();

      console.log("Register successful:", data);
      // Handle success (redirect)
      navigate("/login");
    } catch (error) {
      console.error("Error during register:", error);
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
          <h1 className="font-custom font-bold text-2xl">Create an Account</h1>
          <svg
            className="size-12"
            fill="#000000"
            viewBox="0 0 16 16"
            id="register-16px"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#000000"
            stroke-width="0.00016"
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
                id="Path_184"
                data-name="Path 184"
                d="M57.5,41a.5.5,0,0,0-.5.5V43H47V31h2v.5a.5.5,0,0,0,.5.5h5a.5.5,0,0,0,.5-.5V31h2v.5a.5.5,0,0,0,1,0v-1a.5.5,0,0,0-.5-.5H55v-.5A1.5,1.5,0,0,0,53.5,28h-3A1.5,1.5,0,0,0,49,29.5V30H46.5a.5.5,0,0,0-.5.5v13a.5.5,0,0,0,.5.5h11a.5.5,0,0,0,.5-.5v-2A.5.5,0,0,0,57.5,41ZM50,29.5a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5V31H50Zm11.854,4.646-2-2a.5.5,0,0,0-.708,0l-6,6A.5.5,0,0,0,53,38.5v2a.5.5,0,0,0,.5.5h2a.5.5,0,0,0,.354-.146l6-6A.5.5,0,0,0,61.854,34.146ZM54,40V38.707l5.5-5.5L60.793,34.5l-5.5,5.5Zm-2,.5a.5.5,0,0,1-.5.5h-2a.5.5,0,0,1,0-1h2A.5.5,0,0,1,52,40.5Zm0-3a.5.5,0,0,1-.5.5h-2a.5.5,0,0,1,0-1h2A.5.5,0,0,1,52,37.5ZM54.5,35h-5a.5.5,0,0,1,0-1h5a.5.5,0,0,1,0,1Z"
                transform="translate(-46 -28)"
              ></path>{" "}
            </g>
          </svg>
        </div>

        <div className="flex flex-col">
          <label className="font-custom font-bold" htmlFor="firstname">
            First Name <span className="text-red-800">*</span>
          </label>
          <input
            className="border-black border-[3px] rounded-full px-2 py-1"
            type="text"
            id="firstname"
            value={registerForm.firstname}
            placeholder="firstname"
            name="firstname"
            onChange={(e) => handleChange(e)}
            required
          />
          <span className="text-red-600">{formError.firstname}</span>
        </div>

        <div className="flex flex-col">
          <label className="font-custom font-bold" htmlFor="lastname">
            Last Name <span className="text-red-800">*</span>
          </label>
          <input
            className="border-black border-[3px] rounded-full px-2 py-1"
            type="text"
            id="lastname"
            placeholder="lastname"
            value={registerForm.lastname}
            name="lastname"
            onChange={(e) => handleChange(e)}
            required
          />
          <span className="text-red-600">{formError.lastname}</span>
        </div>

        <div className="flex flex-col">
          <label className="font-custom font-bold" htmlFor="email">
            Email <span className="text-red-800">*</span>
          </label>
          <input
            className="border-black border-[3px] rounded-full px-2 py-1"
            type="email"
            id="email"
            value={registerForm.email}
            placeholder="email"
            name="email"
            onChange={(e) => handleChange(e)}
            required
          />
          <span className="text-red-600">{formError.email}</span>
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
            value={registerForm.username}
            name="username"
            onChange={(e) => handleChange(e)}
            minLength={3}
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
              className="border-black border-[3px] rounded-full px-2 flex-1 pr-14 py-1"
              type={showPassword.password ? "text" : "password"}
              id="password"
              name="password"
              value={registerForm.password}
              placeholder="password"
              minLength={6}
              onChange={(e) => handleChange(e)}
              required
            />
            <button
              type="button"
              onClick={() => handleShowPassword("password")}
              className="absolute right-[4%]"
            >
              {showPassword.password ? (
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

        <div className="flex flex-col">
          <label className="font-custom font-bold" htmlFor="confirmpassword">
            Confirm Password <span className="text-red-800">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              className="border-black border-[3px] rounded-full px-2 flex-1 pr-14 py-1"
              type={showPassword.confirmpassword ? "text" : "password"}
              id="confirmpassword"
              name="confirmpassword"
              value={registerForm.confirmpassword}
              placeholder="confirmpassword"
              minLength={6}
              onChange={(e) => handleChange(e)}
              required
            />
            <button
              type="button"
              onClick={() => handleShowPassword("confirmpassword")}
              className="absolute right-[4%]"
            >
              {showPassword.confirmpassword ? (
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

          <span className="text-red-600">{formError.confirmpassword}</span>
        </div>

        <div className="flex items-center justify-between gap-5">
          <div>Already have an account?</div>
          <Link
            className="font-custom text-[14px] md:text-[16px] font-bold border-2 border-blue-500 inline-block px-3 py-2 rounded-full bg-blue-500 text-white hover:bg-white hover:text-blue-800"
            to="/login"
          >
            Log In
          </Link>
        </div>

        <div className="flex justify-center gap-5">
          <button
            type="submit"
            className="px-3 py-2 rounded-full bg-green-500 font-custom font-bold border-2 border-green-500 flex-1 text-white hover:bg-white hover:text-black"
          >
            Submit
          </button>
          <button
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

export default Register;
