import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function ChangePassword() {
  const [formdata, setFormdata] = useState({
    password: "",
    newpassword: "",
    confirmnewpassword: "",
  });

  const [formError, setFormError] = useState({
    password: null,
    newpassword: null,
    confirmnewpassword: null,
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    newpassword: false,
    confirmnewpassword: false,
  });

  const { userProfile, handleLogOut } = useOutletContext();

  function handleChange(e) {
    const { value, name } = e.target;
    setFormdata((prev) => ({
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
        errorMessage = "Password must be at least 6 characters.";
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

    // Additional logic for confirm password match
    if (input.name === "confirmnewpassword") {
      if (input.value !== formdata.newpassword) {
        setFormError((prev) => ({
          ...prev,
          confirmnewpassword:
            "New password and confirm new password do not match.",
        }));
      } else {
        setFormError((prev) => ({
          ...prev,
          confirmnewpassword: null,
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!e.target.checkValidity()) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://messaging-app-backend-p1g9.onrender.com/profile/${userProfile.id}/change-password`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token for authentication
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: formdata.password,
            newpassword: formdata.newpassword,
            confirmnewpassword: formdata.confirmnewpassword,
          }),
        }
      );
      if (!response.ok) {
        // handle server form validation errors
        const data = await response.json();
        if (Array.isArray(data.error)) {
          const errors = data.error.reduce((acc, error) => {
            acc[error.path] = error.msg; // Match `path` to the field name
            return acc;
          }, {});
          setFormError(errors);
        } else if (
          data.error === "couldnt change password, user does not exist"
        ) {
          console.log("user does not exist", data);
        } else {
          setFormError((prev) => ({
            ...prev,
            password: data.error,
          }));
        }
        return;
      }
      const data = await response.json();
      alert("password has been changed successfully!");
      handleLogOut();
    } catch (err) {
      console.error("Error changing password", err);
    }
  }

  return (
    <main className="min-h-screen p-3 text-white flex flex-col items-center gap-6">
      <h2 className="font-custom font-bold text-lg self-start">
        Change Password
      </h2>
      <form
        onSubmit={(e) => handleSubmit(e)}
        action="#"
        className="bg-white text-black p-3 rounded-md md:min-w-[50%] min-w-[85%] flex flex-col gap-5"
      >
        <div className="flex flex-col">
          <label htmlFor="password">
            Current Password <span className="text-red-600">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              className="border-black border-[3px] flex-1 rounded-full px-2 pr-14 py-1"
              type={showPassword.password ? "text" : "password"}
              id="password"
              name="password"
              value={formdata.password}
              placeholder="password"
              onChange={(e) => handleChange(e)}
              required
              minLength={6}
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
          <label htmlFor="newpassword">
            New Password <span className="text-red-600">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              className="border-black border-[3px] flex-1 rounded-full px-2 pr-14 py-1"
              type={showPassword.newpassword ? "text" : "password"}
              id="newpassword"
              name="newpassword"
              value={formdata.newpassword}
              placeholder="password"
              onChange={(e) => handleChange(e)}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => handleShowPassword("newpassword")}
              className="absolute right-[4%]"
            >
              {showPassword.newpassword ? (
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
          <span className="text-red-600">{formError.newpassword}</span>
        </div>

        <div className="flex flex-col">
          <label htmlFor="confirmnewpassword">
            Confirm New Password <span className="text-red-600">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              className="border-black border-[3px] flex-1 rounded-full px-2 pr-14 py-1"
              type={showPassword.confirmnewpassword ? "text" : "password"}
              id="confirmnewpassword"
              name="confirmnewpassword"
              value={formdata.confirmnewpassword}
              placeholder="password"
              onChange={(e) => handleChange(e)}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => handleShowPassword("confirmnewpassword")}
              className="absolute right-[4%]"
            >
              {showPassword.confirmnewpassword ? (
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
          <span className="text-red-600">{formError.confirmnewpassword}</span>
        </div>
        <div className="flex justify-center gap-5">
          <button
            className="px-3 py-2 rounded-full bg-green-500 font-custom font-bold border-2 border-green-500 flex-1 text-white hover:bg-white hover:text-black"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}

export default ChangePassword;
