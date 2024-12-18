import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect, useRef, createContext } from "react";
import { jwtDecode } from "jwt-decode";
import ProfileDialog from "./ProfileDialog";
import socket from "../socket";

export const ProfileDialogContext = createContext();

function Chat() {
  // location
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = useRef(location.pathname);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [friends, setFriends] = useState([]);
  const [mydata, setMyData] = useState(null);
  const [search, setSearch] = useState("");
  const profDialog = useRef(null);
  const [profDisplay, setProfDisplay] = useState(null);

  const getUser = (friend) =>
    friend.requestee.id === mydata.id ? friend.requester : friend.requestee;
  const acceptedFriends = friends
    ? friends.filter((friend) => friend.status === "accepted")
    : null;

  const checkMobile = () => {
    return isMobile && location.pathname === "/";
  };

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  function openProfileDialog(user) {
    setProfDisplay(user);
    profDialog.current.showModal();
  }

  function closeProfileDialog() {
    setProfDisplay(null);
    profDialog.current.close();
  }

  useEffect(() => {
    pathname.current = location.pathname;
    console.log("pathname", pathname);
  }, [location.pathname]);

  useEffect(() => {
    socket.on("receiveOnline", (data) => {
      setFriends((prev) =>
        prev.map((friend) => {
          if (
            friend.requesterId === data.id ||
            friend.requesteeId === data.id
          ) {
            if (friend.requesterId === data.id) {
              return {
                ...friend,
                requester: { ...data }, // Update requester info
              };
            } else {
              return {
                ...friend,
                requestee: { ...data }, // Update requestee info
              };
            }
          } else {
            return friend; // No update if it doesn't match
          }
        })
      );
    });

    socket.on("receiveFriendReq", (data) => {
      console.log("friend req received", data);
      setFriends((prev) => [...prev, data]);
    });

    socket.on("receiveRejectRequest", (data) => {
      setFriends((prev) => prev.filter((friend) => friend.id !== data.id));
    });

    socket.on("receiveAcceptReq", (data) => {
      setFriends((prev) =>
        prev.map((friend) => {
          if (friend.id === data.id) {
            return data;
          } else {
            return friend;
          }
        })
      );
    });

    socket.on("receiveDeleteFriend", (data) => {
      console.log(data);
      setFriends((prev) => prev.filter((friend) => friend.id !== data.id));
      // Check if the current route is /chat/:id
      const currentPath = pathname.current; // e.g., "/chat/123"
      const isChattingWithBlockedUser = currentPath === `/chat/${data.id}`;
      console.log(isChattingWithBlockedUser);

      if (isChattingWithBlockedUser) {
        navigate("/"); // Redirect to the home page
      }
    });

    socket.on("receiveBlockUser", (data) => {
      setFriends((prev) => {
        return prev.map((friend) => {
          if (friend.id === data.id) {
            return data;
          } else {
            return friend;
          }
        });
      });
      // Check if the current route is /chat/:id
      const currentPath = pathname.current; // e.g., "/chat/123"
      const isChattingWithBlockedUser = currentPath === `/chat/${data.id}`;
      console.log(isChattingWithBlockedUser);

      if (isChattingWithBlockedUser) {
        navigate("/"); // Redirect to the home page
      }
    });

    socket.on("receiveDeleteAccount", (data) => {
      let friendId;
      setFriends((prev) => {
        // Look through the friends list and find the matching friend
        const friendRelation = prev.find(
          (friend) =>
            friend.requesterId === data.id || friend.requesteeId === data.id
        );
        if (friendRelation) {
          friendId = friendRelation.id;
        }

        // Return the updated friends list after filtering the deleted user
        return prev.filter(
          (friend) =>
            friend.requesterId !== data.id && friend.requesteeId !== data.id
        );
      });
      const currentPath = pathname.current; // e.g., "/chat/123"
      const isChattingWithDeletedUser = currentPath === `/chat/${friendId}`;
      console.log(isChattingWithDeletedUser);

      if (isChattingWithDeletedUser) {
        navigate("/"); // Redirect to the home page
      }
    });

    return () => {
      socket.off("receiveOnline");
      socket.off("receiveFriendReq");
      socket.off("receiveRejectRequest");
      socket.off("receiveAcceptReq");
      socket.off("receiveDeleteFriend");
      socket.off("receiveBlockUser");
      socket.off("receiveDeleteAccount");
    };
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController(); // Create an AbortController
    const signal = controller.signal;
    async function getFriends() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/friend`, {
          method: "GET",
          signal: signal,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const data = await response.json();
          console.log("no friends found", data);
          setFriends([]);
          return;
        }
        const data = await response.json();
        console.log("all my friends", data);
        setFriends(data);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch request aborted");
          return;
        }
        console.log("failed in fetch friends", err);
      }
    }
    getFriends();
    return () => {
      controller.abort();
    };
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const data = jwtDecode(token);
    setMyData(data);
    socket.emit("login", data.id);
  }, []);
  return (
    <main className="relative h-[calc(100vh-3.75rem)] p-3 bg-gray-800 text-white grid md:grid-cols-[1fr_2fr] gap-4">
      <section
        className={`${
          !isMobile ? "border-r-2 border-white" : ""
        } p-3 min-h-0 flex flex-col gap-3`}
      >
        <div className="flex items-center justify-between">
          <h1 className="font-custom font-bold">chats</h1>
        </div>
        <NavLink
          to="/friends"
          className={({ isActive }) =>
            isActive
              ? "p-3 font-custom font-bold bg-gray-700 border-l-4 border-blue-600 flex items-center gap-4 md:text-[12px] lg:text-[16px]"
              : "p-3 font-custom font-bold bg-gray-800 border-l-4 border-gray-800 flex items-center gap-4 hover:bg-gray-700 md:text-[12px] lg:text-[16px]"
          }
        >
          <svg
            className="size-8"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#ffffff"
            stroke-width="0.00024000000000000003"
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
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 3C7.02944 3 3 7.02944 3 12C3 12.8168 3.1088 13.6081 3.31269 14.3603C3.72385 14.0549 4.18033 13.7872 4.67874 13.5718C4.25207 12.9917 3.99999 12.2753 3.99999 11.5C3.99999 9.567 5.56699 8 7.49999 8C9.43298 8 11 9.567 11 11.5C11 12.2753 10.7479 12.9918 10.3212 13.5718C10.7765 13.7685 11.1973 14.009 11.5808 14.2826C11.5933 14.2916 11.6057 14.3008 11.6177 14.3103C12.021 13.878 12.4936 13.4824 13.0284 13.1452C12.0977 12.4128 11.5 11.2762 11.5 10C11.5 7.79086 13.2908 6 15.5 6C17.7091 6 19.5 7.79086 19.5 10C19.5 10.8095 19.2595 11.5629 18.8461 12.1925C19.6192 12.3672 20.3212 12.6528 20.9432 13.0164C20.9807 12.6828 21 12.3436 21 12C21 7.02944 16.9706 3 12 3ZM10.4907 15.9573C10.4664 15.9429 10.4426 15.9274 10.4192 15.9107C9.65816 15.3678 8.67891 15 7.49999 15C6.06158 15 4.91073 15.5491 4.09526 16.3065C5.622 19.1029 8.58946 21 12 21C15.8853 21 19.1956 18.538 20.4559 15.089C20.4386 15.0778 20.4216 15.066 20.4048 15.0536C19.5686 14.4343 18.4544 14 17.0906 14C13.7836 14 12 16.529 12 18C12 18.5523 11.5523 19 11 19C10.4477 19 9.99999 18.5523 9.99999 18C9.99999 17.3385 10.1699 16.6377 10.4907 15.9573ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM15.5 8C14.3954 8 13.5 8.89543 13.5 10C13.5 11.1046 14.3954 12 15.5 12C16.6046 12 17.5 11.1046 17.5 10C17.5 8.89543 16.6046 8 15.5 8ZM5.99999 11.5C5.99999 10.6716 6.67156 10 7.49999 10C8.32841 10 8.99999 10.6716 8.99999 11.5C8.99999 12.3284 8.32841 13 7.49999 13C6.67156 13 5.99999 12.3284 5.99999 11.5Z"
                fill="#ffffff"
              ></path>{" "}
            </g>
          </svg>
          Friends
        </NavLink>
        <input
          className="border-2 border-black px-3 py-2 bg-gray-900 text-gray-400 rounded-full"
          type="text"
          value={search}
          onChange={(e) => handleSearch(e)}
          placeholder="search chats"
        />
        <section className={`flex-1 pt-3 min-h-0 overflow-y-auto`}>
          {acceptedFriends && acceptedFriends.length > 0 ? (
            acceptedFriends
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
                          className="rounded-full h-full object-cover"
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
                  </NavLink>
                );
              })
          ) : (
            <div className="font-bold font-custom">No chats</div>
          )}
        </section>
      </section>
      {!checkMobile() && (
        <div
          className={`p-3 min-h-0 ${
            isMobile ? "absolute inset-0 bg-gray-800" : ""
          }`}
        >
          <ProfileDialogContext.Provider
            value={{
              openProfileDialog,
              closeProfileDialog,
              profDisplay,
              setProfDisplay,
            }}
          >
            <Outlet context={{ friends, setFriends, getUser, mydata }} />
          </ProfileDialogContext.Provider>
        </div>
      )}
      <ProfileDialog
        user={profDisplay}
        profDialog={profDialog}
        closeProfileDialog={closeProfileDialog}
      />
    </main>
  );
}

export default Chat;
