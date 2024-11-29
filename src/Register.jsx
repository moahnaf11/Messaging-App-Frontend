import { Link } from "react-router-dom";
import { useState } from "react";

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

  return (
    <main className="min-h-screen p-3 bg-gray-800 flex justify-center items-center">
      <form
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
          <input
            className="border-black border-[3px] rounded-full px-2 py-1"
            type="password"
            id="password"
            name="password"
            value={registerForm.password}
            placeholder="password"
            minLength={6}
            onChange={(e) => handleChange(e)}
            required
          />
          <span className="text-red-600">{formError.password}</span>
        </div>

        <div className="flex flex-col">
          <label className="font-custom font-bold" htmlFor="confirmpassword">
            Confirm Password <span className="text-red-800">*</span>
          </label>
          <input
            className="border-black border-[3px] rounded-full px-2 py-1"
            type="password"
            id="confirmpassword"
            name="confirmpassword"
            value={registerForm.confirmpassword}
            placeholder="confirmpassword"
            minLength={6}
            onChange={(e) => handleChange(e)}
            required
          />
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

export default Register;
