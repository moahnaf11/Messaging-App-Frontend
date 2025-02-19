import { NavLink, useOutletContext } from "react-router-dom";
import { useState, useContext } from "react";
import { ProfileDialogContext, UpdateChatDisplayContext } from "./Chat";

function OnlineFriends() {
  const { friends, getUser, blockUser, deleteFriend } = useOutletContext();
  const [search, setSearch] = useState("");
  const { openProfileDialog } = useContext(ProfileDialogContext);
  const { updateChatDisplay } = useContext(UpdateChatDisplayContext);

  const filteredFriends = friends
    ? friends.filter((friend) => {
        const user = getUser(friend);
        // Include all online, accepted friends if search is empty
        if (!search) {
          return user.online && user.showOnlineStatus && friend.status === "accepted";
        }
        return (
          user.online && user.showOnlineStatus &&
          friend.status === "accepted" &&
          user.username.toLowerCase().includes(search.toLowerCase())
        );
      })
    : null;

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  return (
    <>
      <input
        className="bg-gray-900 px-2 py-1 min-w-[50%] text-center mb-5 mx-auto rounded-full text-gray-400"
        type="text"
        onChange={(e) => handleSearch(e)}
        value={search}
        placeholder="search"
      />
      {filteredFriends && filteredFriends.length > 0 ? (
        filteredFriends.map((friend) => {
          const user = getUser(friend);
          if (user.online && user.showOnlineStatus) {
            return (
              <div
                className="flex items-center p-3 justify-between"
                key={friend.id}
              >
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => openProfileDialog(user)}
                    className="relative w-[50px] h-[50px] lg:w-[70px] lg:h-[70px]"
                  >
                    <img
                      className="rounded-full h-full object-cover"
                      src={
                        user.profilePicture
                          ? user.profilePicture
                          : "/default.jpg"
                      }
                      alt="profile picture"
                    />
                    <div
                      className={
                        "lg:size-5 size-4 absolute bottom-0 right-0 rounded-full bg-green-600"
                      }
                    ></div>
                  </button>
                  <div>{user.username}</div>
                </div>
                <div className="flex items-center gap-3">
                  <NavLink
                    to={`/chat/${friend.id}`}
                    onClick={() => updateChatDisplay(friend.id, "unarchived")}
                  >
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
                          d="M21.0039 12C21.0039 16.9706 16.9745 21 12.0039 21C9.9675 21 3.00463 21 3.00463 21C3.00463 21 4.56382 17.2561 3.93982 16.0008C3.34076 14.7956 3.00391 13.4372 3.00391 12C3.00391 7.02944 7.03334 3 12.0039 3C16.9745 3 21.0039 7.02944 21.0039 12Z"
                          stroke="#ffffff"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                      </g>
                    </svg>
                  </NavLink>
                  <button onClick={() => deleteFriend(friend.id)}>
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
                          stroke="#ffffff"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                        <path
                          d="M14 12V17"
                          stroke="#ffffff"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                        <path
                          d="M4 7H20"
                          stroke="#ffffff"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                        <path
                          d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
                          stroke="#ffffff"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                        <path
                          d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                          stroke="#ffffff"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                      </g>
                    </svg>
                  </button>
                  <button onClick={() => blockUser(friend.id, "blocked")}>
                    <svg
                      className="size-7"
                      viewBox="0 0 24 24"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      fill="#ffffff"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <title>Blocked</title>{" "}
                        <g
                          id="Page-1"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          {" "}
                          <g id="Blocked">
                            {" "}
                            <rect
                              id="Rectangle"
                              fill-rule="nonzero"
                              x="0"
                              y="0"
                              width="24"
                              height="24"
                            >
                              {" "}
                            </rect>{" "}
                            <circle
                              id="Oval"
                              stroke="#ffffff"
                              stroke-width="2"
                              stroke-linecap="round"
                              cx="12"
                              cy="12"
                              r="9"
                            >
                              {" "}
                            </circle>{" "}
                            <line
                              x1="6"
                              y1="6"
                              x2="18"
                              y2="18"
                              id="Path"
                              stroke="#ffffff"
                              stroke-width="2"
                              stroke-linecap="round"
                            >
                              {" "}
                            </line>{" "}
                          </g>{" "}
                        </g>{" "}
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
            );
          }
        })
      ) : (
        <div className="font-custom font-bold">No online friends</div>
      )}
    </>
  );
}

export default OnlineFriends;
