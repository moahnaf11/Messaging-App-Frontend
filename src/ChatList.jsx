import { NavLink } from "react-router-dom";

function ChatList({
  updateChatDisplay,
  updateGroupChatDisplay,
  acceptedFriends,
  getUser,
  openMenu,
  menuRef,
  toggleMenu,
  openProfileDialog,
  search,
  showArchived,
  groups,
  mydata,
}) {
  // group chat notification
  const getNotificationCount = (group) => {
    return group.GroupChatNotification.reduce((count, notification) => {
      return count + notification.GroupChatNotificationRecipient.length;
    }, 0);
  };
  // console.log("groups in chatlist", groups);
  const visibleGroups =
    groups && mydata
      ? groups.filter((group) =>
          group.members.some(
            (member) => member.userId === mydata.id && !member.archived
          )
        )
      : [];

  const archivedGroups =
    groups && mydata
      ? groups.filter((group) =>
          group.members.some(
            (member) => member.userId === mydata.id && member.archived // Check for archived status
          )
        )
      : [];

  if (showArchived) {
    console.log("original", acceptedFriends);
    const archivedChats = mydata
      ? acceptedFriends
          .filter((friend) => {
            const user = getUser(friend);
            console.log("user", user);
            if (user.id === friend.requester.id) {
              return friend.requestee_display === "archived";
            } else if (user.id === friend.requestee.id) {
              return friend.requester_display === "archived";
            }
            return false;
          })
          .sort((a, b) => {
            // Sort by the length of the notifications array
            return b.Notification.length - a.Notification.length; // descending order
          })
      : null;
    console.log("archived chats", archivedChats);
    return (
      <section className={`flex-1 min-h-0 overflow-y-auto`}>
        {archivedChats && archivedChats.length > 0
          ? archivedChats
              .filter((friend) => {
                const user = getUser(friend);
                if (!search) {
                  return true;
                }
                return user.username
                  .toLowerCase()
                  .includes(search.toLowerCase());
              })
              .map((friend) => {
                const user = getUser(friend);
                return (
                  <NavLink
                    to={`/chat/${friend.id}`}
                    className={({ isActive }) =>
                      `flex group relative hover:bg-gray-700 items-center p-3 justify-between ${
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
                            user.online && user.showOnlineStatus
                              ? "bg-green-600"
                              : "bg-gray-500"
                          } `}
                        ></div>
                      </button>
                      <div>{user.username}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {mydata && friend.Notification.length > 0 && (
                        <div className="text-white text-xs lg:text-sm rounded-full bg-green-600 p-1">
                          {friend.Notification.length}
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleMenu(friend.id);
                        }}
                        className="rounded-full p-1 lg:hidden lg:group-hover:block"
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
                    </div>
                    {openMenu === friend.id && (
                      <div
                        ref={menuRef}
                        key={`menu + ${friend.id}`}
                        className="absolute z-10 bg-white p-2 rounded-md text-black right-0 top-0 h-min w-36"
                      >
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // function to unarchive chat
                            updateChatDisplay(friend.id, "unarchived");
                          }}
                          className="p-2 text-sm hover:bg-gray-400 w-full block"
                        >
                          Unarchive Chat
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // function to remove chat
                            updateChatDisplay(friend.id, "hidden");
                          }}
                          className="p-2 text-sm hover:bg-gray-400 w-full block"
                        >
                          Remove Chat
                        </button>
                      </div>
                    )}
                  </NavLink>
                );
              })
          : null}
        {Array.isArray(archivedGroups) && archivedGroups.length > 0
          ? archivedGroups
              .filter((group) => {
                if (!search) {
                  return true; // If there's no search input, show all groups
                }
                return group.name.toLowerCase().includes(search.toLowerCase());
              })
              .map((group) => {
                return (
                  <NavLink
                    to={`/group/${group.id}`}
                    className={({ isActive }) =>
                      `flex group hover:bg-gray-700 items-center p-3 justify-between relative ${
                        isActive
                          ? "bg-gray-700 border-l-4 border-blue-600"
                          : "bg-gray-800 border-l-4 border-gray-800"
                      }`
                    }
                    key={group.id}
                  >
                    <div className="flex items-center gap-5">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // open group chat icon
                        }}
                        className="relative w-[45px] h-[45px] lg:w-[60px] lg:h-[60px]"
                      >
                        {/* group icon image */}
                        <img
                          className="rounded-full h-full w-full object-cover"
                          src={group.picture ? group.picture : "/group.png"}
                          alt="profile picture"
                        />
                      </button>
                      <div>{group.name}</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        updateGroupChatDisplay(group.id, false);
                      }}
                      className="lg:hidden lg:group-hover:block p-1"
                    >
                      <svg
                        className="size-5"
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
                            d="M7 20H6C4.89543 20 4 19.1046 4 18V8H20V18C20 19.1046 19.1046 20 18 20H17"
                            stroke="#ffffff"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>{" "}
                          <path
                            d="M6 4H18L20 8H4L6 4Z"
                            stroke="#ffffff"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>{" "}
                          <path
                            d="M12 20L12 14M12 14L9.5 16.5M12 14L14.5 16.5"
                            stroke="#ffffff"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>{" "}
                        </g>
                      </svg>
                    </button>
                  </NavLink>
                );
              })
          : null}
        {/* Show "No chats found" if both are empty */}
        {(!Array.isArray(archivedChats) || archivedChats.length === 0) &&
        (!Array.isArray(archivedGroups) || archivedGroups.length === 0) ? (
          <div className="font-bold font-custom">No Archived Chats found</div>
        ) : null}
      </section>
    );
  } else {
    const UnarchivedChats = mydata
      ? acceptedFriends.filter((friend) => {
          const user = getUser(friend);
          console.log("user", user);
          if (user.id === friend.requester.id) {
            return friend.requestee_display === "unarchived";
          } else if (user.id === friend.requestee.id) {
            return friend.requester_display === "unarchived";
          }
          return false;
        })
      : null;
    return (
      <section className={`flex-1 min-h-0 overflow-y-auto`}>
        {UnarchivedChats && UnarchivedChats.length > 0
          ? UnarchivedChats.filter((friend) => {
              // console.log("friend", friend);
              const user = getUser(friend);
              if (!search) {
                return true;
              }
              return user.username.toLowerCase().includes(search.toLowerCase());
            })
              .sort((a, b) => {
                // Sort by the length of the notifications array
                return b.Notification.length - a.Notification.length; // descending order
              })
              .map((friend) => {
                const user = getUser(friend);
                return (
                  <NavLink
                    to={`/chat/${friend.id}`}
                    className={({ isActive }) =>
                      `flex group hover:bg-gray-700 items-center p-3 justify-between relative ${
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
                            user.online && user.showOnlineStatus
                              ? "bg-green-600"
                              : "bg-gray-500"
                          } `}
                        ></div>
                      </button>
                      <div>{user.username}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {mydata && friend.Notification.length > 0 && (
                        <div className="text-white text-xs lg:text-sm rounded-full bg-green-600 p-1">
                          {friend.Notification.length}
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleMenu(friend.id);
                        }}
                        className="rounded-full p-1 lg:hidden lg:group-hover:block"
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
                    </div>
                    {openMenu === friend.id && (
                      <div
                        ref={menuRef}
                        key={`menu + ${friend.id}`}
                        className="absolute z-10 bg-white p-2 rounded-md text-black right-0 top-0 h-min w-36"
                      >
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // function to archive chat
                            updateChatDisplay(friend.id, "archived");
                          }}
                          className="p-2 text-sm hover:bg-gray-400 w-full block"
                        >
                          Archive Chat
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // function to remove chat
                            updateChatDisplay(friend.id, "hidden");
                          }}
                          className="p-2 text-sm hover:bg-gray-400 w-full block"
                        >
                          Remove Chat
                        </button>
                      </div>
                    )}
                  </NavLink>
                );
              })
          : null}
        {Array.isArray(visibleGroups) && visibleGroups.length > 0
          ? visibleGroups
              .filter((group) => {
                if (!search) {
                  return true; // If there's no search input, show all groups
                }
                return group.name.toLowerCase().includes(search.toLowerCase());
              })
              .map((group) => {
                const notificationCount = getNotificationCount(group);
                return (
                  <NavLink
                    to={`/group/${group.id}`}
                    className={({ isActive }) =>
                      `flex group hover:bg-gray-700 items-center p-3 justify-between relative ${
                        isActive
                          ? "bg-gray-700 border-l-4 border-blue-600"
                          : "bg-gray-800 border-l-4 border-gray-800"
                      }`
                    }
                    key={group.id}
                  >
                    <div className="flex items-center gap-5">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // open group chat icon
                        }}
                        className="relative w-[45px] h-[45px] lg:w-[60px] lg:h-[60px]"
                      >
                        {/* group icon image */}
                        <img
                          className="rounded-full h-full w-full object-cover"
                          src={group.picture ? group.picture : "/group.png"}
                          alt="profile picture"
                        />
                      </button>
                      <div>{group.name}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {notificationCount > 0 && (
                        <div className="text-white text-xs lg:text-sm rounded-full bg-green-600 p-1">
                          {notificationCount}
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          updateGroupChatDisplay(group.id, true);
                        }}
                        className="lg:hidden lg:group-hover:block p-1"
                      >
                        <svg
                          className="size-5"
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
                              d="M2 5C2 4.05719 2 3.58579 2.29289 3.29289C2.58579 3 3.05719 3 4 3H20C20.9428 3 21.4142 3 21.7071 3.29289C22 3.58579 22 4.05719 22 5C22 5.94281 22 6.41421 21.7071 6.70711C21.4142 7 20.9428 7 20 7H4C3.05719 7 2.58579 7 2.29289 6.70711C2 6.41421 2 5.94281 2 5Z"
                              fill="#ffffff"
                            ></path>{" "}
                            <path
                              d="M20.0689 8.49993C20.2101 8.49999 20.3551 8.50005 20.5 8.49805V12.9999C20.5 16.7711 20.5 18.6568 19.3284 19.8283C18.1569 20.9999 16.2712 20.9999 12.5 20.9999H11.5C7.72876 20.9999 5.84315 20.9999 4.67157 19.8283C3.5 18.6568 3.5 16.7711 3.5 12.9999V8.49805C3.64488 8.50005 3.78999 8.49999 3.93114 8.49993L11.25 8.49992L11.25 15.0454L9.55748 13.1648C9.28038 12.8569 8.80617 12.832 8.49828 13.1091C8.1904 13.3862 8.16544 13.8604 8.44254 14.1683L11.4425 17.5016C11.5848 17.6596 11.7874 17.7499 12 17.7499C12.2126 17.7499 12.4152 17.6596 12.5575 17.5016L15.5575 14.1683C15.8346 13.8604 15.8096 13.3862 15.5017 13.1091C15.1938 12.832 14.7196 12.8569 14.4425 13.1648L12.75 15.0454L12.75 8.49992L20.0689 8.49993Z"
                              fill="#ffffff"
                            ></path>{" "}
                          </g>
                        </svg>
                      </button>
                    </div>
                  </NavLink>
                );
              })
          : null}
        {/* Show "No chats found" if both are empty */}
        {(!Array.isArray(UnarchivedChats) || UnarchivedChats.length === 0) &&
        (!Array.isArray(groups) || groups.length === 0) ? (
          <div className="font-bold font-custom">No chats found</div>
        ) : null}
      </section>
    );
  }
}

export default ChatList;
