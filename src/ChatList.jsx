import { NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

function ChatList({
  acceptedFriends,
  getUser,
  openProfileDialog,
  search,
  showArchived,
}) {
  const [openMenu, setOpenMenu] = useState(null); // Track which menu is open
  const menuRef = useRef(null); // Ref for the menu div
  const toggleMenu = (id) => {
    setOpenMenu((prev) => (prev === id ? null : id)); // Toggle open/close
  };

  // Close the menu if a click is detected outside of the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null); // Close the menu when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Listen for click outside

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Clean up listener
    };
  }, [setOpenMenu]);
  if (showArchived) {
    const archivedChats = acceptedFriends.filter(
      (friend) => friend.display === "archived"
    );
    return (
      <section className={`flex-1 pt-3 min-h-0 overflow-y-auto`}>
        {archivedChats && archivedChats.length > 0 ? (
          archivedChats
            .filter((friend) => {
              const user = getUser(friend);
              if (!search) {
                return true;
              }
              return user.username.toLowerCase().includes(search.toLowerCase());
            })
            .map((friend) => {
              const user = getUser(friend);
              return (
                <NavLink
                  to={`/chat/${friend.id}`}
                  className={({ isActive }) =>
                    `flex hover:bg-gray-700 items-center p-3 justify-between ${
                      isActive
                        ? "bg-gray-700 border-l-4 border-blue-600"
                        : "bg-gray-800 border-l-4 border-gray-800"
                    }`
                  }
                  key={friend.id}
                >
                  <div className="flex items-center gap-5">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openProfileDialog(user);
                      }}
                      className="relative w-[45px] h-[45px] lg:w-[60px] lg:h-[60px]"
                    >
                      <img
                        className="rounded-full h-full w-full object-cover"
                        src={
                          user.profilePicture
                            ? user.profilePicture
                            : "/default.jpg"
                        }
                        alt="profile picture"
                      />
                      <div
                        className={`lg:size-4 size-3 absolute bottom-0 right-0 rounded-full ${
                          user.online ? "bg-green-600" : "bg-gray-500"
                        } `}
                      ></div>
                    </button>
                    <div>{user.username}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleMenu(friend.id);
                    }}
                    className="outline outline-2 rounded-full p-1"
                  >
                    <svg
                      className="size-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      transform="rotate(90)matrix(1, 0, 0, 1, 0, 0)"
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
                          d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
                          stroke="#ffffff"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                        <path
                          d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                          stroke="#ffffff"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                        <path
                          d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
                          stroke="#ffffff"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                      </g>
                    </svg>
                  </button>
                  {openMenu === friend.id && (
                    <div
                      ref={menuRef}
                      key={friend.id}
                      className="absolute z-10 bg-white p-2 rounded-md text-black right-0 top-0 h-min w-36"
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // function to archive chat
                        }}
                        className="p-2 hover:bg-gray-400 w-full block"
                      >
                        Unarchive Chat
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // function to remove chat
                        }}
                        className="p-2 hover:bg-gray-400 w-full block"
                      >
                        Remove Chat
                      </button>
                    </div>
                  )}
                </NavLink>
              );
            })
        ) : (
          <div className="font-bold font-custom">No Archived Chats</div>
        )}
      </section>
    );
  } else {
    return (
      <section className={`flex-1 pt-3 min-h-0 overflow-y-auto`}>
        {acceptedFriends && acceptedFriends.length > 0 ? (
          acceptedFriends
            .filter((friend) => friend.display === "unarchived")
            .filter((friend) => {
              const user = getUser(friend);
              if (!search) {
                return true;
              }
              return user.username.toLowerCase().includes(search.toLowerCase());
            })
            .map((friend) => {
              const user = getUser(friend);
              return (
                <NavLink
                  to={`/chat/${friend.id}`}
                  className={({ isActive }) =>
                    `flex hover:bg-gray-700 items-center p-3 justify-between relative ${
                      isActive
                        ? "bg-gray-700 border-l-4 border-blue-600"
                        : "bg-gray-800 border-l-4 border-gray-800"
                    }`
                  }
                  key={friend.id}
                >
                  <div className="flex items-center gap-5">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openProfileDialog(user);
                      }}
                      className="relative w-[45px] h-[45px] lg:w-[60px] lg:h-[60px]"
                    >
                      <img
                        className="rounded-full h-full w-full object-cover"
                        src={
                          user.profilePicture
                            ? user.profilePicture
                            : "/default.jpg"
                        }
                        alt="profile picture"
                      />
                      <div
                        className={`lg:size-4 size-3 absolute bottom-0 right-0 rounded-full ${
                          user.online ? "bg-green-600" : "bg-gray-500"
                        } `}
                      ></div>
                    </button>
                    <div>{user.username}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleMenu(friend.id);
                    }}
                    className="outline outline-2 rounded-full p-1"
                  >
                    <svg
                      className="size-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      transform="rotate(90)matrix(1, 0, 0, 1, 0, 0)"
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
                          d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
                          stroke="#ffffff"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                        <path
                          d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                          stroke="#ffffff"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                        <path
                          d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
                          stroke="#ffffff"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                      </g>
                    </svg>
                  </button>
                  {openMenu === friend.id && (
                    <div
                      ref={menuRef}
                      key={friend.id}
                      className="absolute z-10 bg-white p-2 rounded-md text-black right-0 top-0 h-min w-36"
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // function to archive chat
                        }}
                        className="p-2 hover:bg-gray-400 w-full block"
                      >
                        Archive Chat
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // function to remove chat
                        }}
                        className="p-2 hover:bg-gray-400 w-full block"
                      >
                        Remove Chat
                      </button>
                    </div>
                  )}
                </NavLink>
              );
            })
        ) : (
          <div className="font-bold font-custom">No chats</div>
        )}
      </section>
    );
  }
}

export default ChatList;
