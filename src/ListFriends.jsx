import { useLocation, useOutletContext } from "react-router-dom";

function ListFriends() {
  const { friends, mydata, setFriends } = useOutletContext();
  const location = useLocation();

  const getUser = (friend) =>
    friend.requestee.id === mydata.id ? friend.requester : friend.requestee;
  const filteredFriends = friends
    ? friends.filter((friend) => {
        const user = getUser(friend);
        return user.online && friend.status === "accepted";
      })
    : null;
  const blockedfriends = friends
    ? friends.filter((friend) => {
        return friend.status === "blocked";
      })
    : null;
  const pendingRequests = friends
    ? friends.filter((friend) => {
        return friend.status === "pending";
      })
    : null;

  async function blockUser(friendId, handleBlock) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/friend/request/block/${friendId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token for authentication
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ handleBlock }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        return;
      }
      const data = await response.json();
      console.log("blocked/unblocked user", data);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/friend`, {
          method: "GET",
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
        console.log("failed in fetch friends after blocking user", err);
      }
    } catch (err) {
      console.error("Error in fetch for blocking user", err);
    }
  }
  if (location.pathname === "/friends") {
    return (
      <>
        {/* all friends */}
        {friends && friends.length > 0 ? (
          friends
            .filter((friend) => {
              return friend.status === "accepted";
            })
            .map((friend) => {
              const user = getUser(friend);
              return (
                <div
                  className="flex outline outline-2 outline-red-200 items-center p-3 justify-between"
                  key={friend.id}
                >
                  <div className="flex items-center gap-5">
                    <div className="relative w-[70px] h-[70px]">
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
                        className={`size-5 absolute bottom-0 right-0 rounded-full ${
                          user.online ? "bg-green-600" : "bg-gray-500"
                        } `}
                      ></div>
                    </div>
                    <div>{user.username}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button>
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
                    </button>
                    <button>
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
            })
        ) : (
          <div className="font-custom font-bold">No friends yet</div>
        )}
      </>
    );
  } else if (location.pathname === "/friends/online") {
    // return online friends
    return filteredFriends && filteredFriends.length > 0 ? (
      filteredFriends.map((friend) => {
        const user = getUser(friend);
        if (user.online) {
          return (
            <div
              className="flex outline outline-2 outline-red-200 items-center p-3 justify-between"
              key={friend.id}
            >
              <div className="flex items-center gap-5">
                <div className="relative w-[70px] h-[70px]">
                  <img
                    className="rounded-full h-full object-cover"
                    src={
                      user.profilePicture ? user.profilePicture : "/default.jpg"
                    }
                    alt="profile picture"
                  />
                  <div
                    className={
                      "size-5 absolute bottom-0 right-0 rounded-full bg-green-600"
                    }
                  ></div>
                </div>
                <div>{user.username}</div>
              </div>
              <div className="flex items-center gap-3">
                <button>
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
                </button>
                <button>
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
    );
  } else if (location.pathname === "/friends/requests") {
    // return requests
    return pendingRequests && pendingRequests.length > 0 ? (
      pendingRequests.map((friend) => {
        const user = getUser(friend);
        if (user.online) {
          return (
            <div
              className="flex outline outline-2 outline-red-200 items-center p-3 justify-between"
              key={friend.id}
            >
              <div className="flex items-center gap-5">
                <div className="relative w-[70px] h-[70px]">
                  <img
                    className="rounded-full h-full object-cover"
                    src={
                      user.profilePicture ? user.profilePicture : "/default.jpg"
                    }
                    alt="profile picture"
                  />
                  <div
                    className={`size-5 absolute bottom-0 right-0 rounded-full ${
                      user.online ? "bg-green-600" : "bg-gray-500"
                    } `}
                  ></div>
                </div>
                <div>{user.username}</div>
              </div>
              <div className="flex items-center gap-3">
                <button>
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
                </button>
                <button>
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
              </div>
            </div>
          );
        }
      })
    ) : (
      <div className="font-custom font-bold">No pending requests</div>
    );
  } else if (location.pathname === "/friends/blocked") {
    // return blocked friends
    return blockedfriends && blockedfriends.length > 0 ? (
      blockedfriends.map((friend) => {
        const user = getUser(friend);
        if (user.online) {
          return (
            <div
              className="flex outline outline-2 outline-red-200 items-center p-3 justify-between"
              key={friend.id}
            >
              <div className="flex items-center gap-5">
                <div className="w-[70px] h-[70px]">
                  <img
                    className="rounded-full h-full object-cover"
                    src={
                      user.profilePicture ? user.profilePicture : "/default.jpg"
                    }
                    alt="profile picture"
                  />
                </div>
                <div>{user.username}</div>
              </div>
              <div className="flex items-center gap-3">
                {friend.blocker_id === mydata.id && (
                  <button onClick={() => blockUser(friend.id, "accepted")}>
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
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M5.63604 18.364C9.15076 21.8787 14.8492 21.8787 18.364 18.364C21.8787 14.8492 21.8787 9.15076 18.364 5.63604C14.8492 2.12132 9.15076 2.12132 5.63604 5.63604C2.12132 9.15076 2.12132 14.8492 5.63604 18.364ZM7.80749 17.6067C10.5493 19.6623 14.4562 19.4433 16.9497 16.9497C19.4433 14.4562 19.6623 10.5493 17.6067 7.80749L14.8284 10.5858C14.4379 10.9763 13.8047 10.9763 13.4142 10.5858C13.0237 10.1953 13.0237 9.5621 13.4142 9.17157L16.1925 6.39327C13.4507 4.33767 9.54384 4.55666 7.05025 7.05025C4.55666 9.54384 4.33767 13.4507 6.39327 16.1925L9.17157 13.4142C9.5621 13.0237 10.1953 13.0237 10.5858 13.4142C10.9763 13.8047 10.9763 14.4379 10.5858 14.8284L7.80749 17.6067Z"
                          fill="#ffffff"
                        ></path>{" "}
                      </g>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        }
      })
    ) : (
      <div className="font-custom font-bold">No blocked users</div>
    );
  }
}

export default ListFriends;
