function ProfileDialog({ user, profDialog, getUser, closeProfileDialog }) {
  console.log("user profile dialog rerendered", user);
  return (
    <>
      <dialog
        className="md:min-w-[40%] min-w-[85%] bg-gray-400 rounded-md p-3"
        ref={profDialog}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="font-custom font-bold">Profile</h2>
            <button onClick={closeProfileDialog} type="button">
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
                    d="M10 12V17"
                    stroke="#000000"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>{" "}
                  <path
                    d="M14 12V17"
                    stroke="#000000"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>{" "}
                  <path
                    d="M4 7H20"
                    stroke="#000000"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>{" "}
                  <path
                    d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
                    stroke="#000000"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>{" "}
                  <path
                    d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                    stroke="#000000"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>{" "}
                </g>
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative w-[45px] h-[45px] lg:w-[60px] lg:h-[60px]">
              <img
                className="rounded-full h-full w-full object-cover"
                src={
                  user && user.profilePicture
                    ? user.profilePicture
                    : "/default.jpg"
                }
                alt="profile picture"
              />
              <div
                className={`lg:size-4 size-3 absolute bottom-0 right-0 rounded-full ${
                  user && user.online && user.showOnlineStatus
                    ? "bg-green-600"
                    : "bg-gray-500"
                } `}
              ></div>
            </div>
            <div>{user && user.username}</div>
          </div>
          <div>
            <h2 className="font-custom font-bold">About Me</h2>
            <p className="min-h-20">{user && user.status}</p>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default ProfileDialog;
