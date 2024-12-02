import {
  NavLink,
  Link,
  useNavigate,
  useOutletContext,
  Outlet,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function Settings() {
  const { setisLoggedIn } = useOutletContext();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);

  function handleLogOut() {
    setisLoggedIn(false);
    localStorage.removeItem("token");
    navigate("/");
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(token);
        if (token) {
          const decodedPayload = jwtDecode(token);
          const response = await fetch(
            `http://localhost:3000/profile/${decodedPayload.id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`, // Pass the token for authentication
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            const data = await response.json();
            console.log("user profile not found", data);
            return;
          }

          const data = await response.json();
          console.log("users profile data", data);
          setUserProfile(data); // Store user profile data
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);
  return (
    <main className="min-h-screen p-3 bg-gray-800 text-white grid grid-cols-[1fr_2fr] gap-4">
      <div className="p-3 grid grid-cols-1 auto-rows-min gap-16">
        <div>
          <Link
            className="font-custom flex items-center gap-4 font-bold"
            to="/"
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
            Back to Chats
          </Link>
          <h2 className="font-bold mt-4 font-custom text-xl">Settings</h2>
        </div>
        {/* Setting Links */}
        <div className="flex flex-col">
          <NavLink
            to="/settings"
            className="p-3 font-custom font-bold hover:bg-white hover:text-black inline-block "
          >
            Profile
          </NavLink>
          <NavLink
            to="change-password"
            className="p-3 font-custom font-bold hover:bg-white hover:text-black inline-block "
          >
            Change Password
          </NavLink>

          <button className="p-3 font-custom font-bold flex justify-between items-center">Online
            <input className="peer hidden" type="checkbox" id="check" />
            <label
              className="peer-checked:bg-green-600 flex peer-checked:justify-end h-11 w-24 peer-checked:flex rounded-full relative before:absolute before:content-[''] before:w-11 before:h-9 before:rounded-full before:m-1 before:bg-white outline outline-2 outline-red-200"
              htmlFor="check"
            ></label>
          </button>
          <button
            onClick={handleLogOut}
            className="p-3 flex items-center justify-between font-custom font-bold hover:bg-white hover:text-black "
          >
            Log Out
            <svg
              className="size-7"
              width="256px"
              height="256px"
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
                  d="M15 12L2 12M2 12L5.5 9M2 12L5.5 15"
                  stroke="currentColor"
                  stroke-width="2.16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
                <path
                  d="M9.00195 7C9.01406 4.82497 9.11051 3.64706 9.87889 2.87868C10.7576 2 12.1718 2 15.0002 2L16.0002 2C18.8286 2 20.2429 2 21.1215 2.87868C22.0002 3.75736 22.0002 5.17157 22.0002 8L22.0002 16C22.0002 18.8284 22.0002 20.2426 21.1215 21.1213C20.3531 21.8897 19.1752 21.9862 17 21.9983M9.00195 17C9.01406 19.175 9.11051 20.3529 9.87889 21.1213C10.5202 21.7626 11.4467 21.9359 13 21.9827"
                  stroke="currentColor"
                  stroke-width="2.16"
                  stroke-linecap="round"
                ></path>{" "}
              </g>
            </svg>
          </button>
        </div>
      </div>
      <div className="bg-red-400">
        <Outlet
          context={{ userProfile, handleLogOut, setUserProfile }}
        ></Outlet>
      </div>
    </main>
  );
}

export default Settings;
