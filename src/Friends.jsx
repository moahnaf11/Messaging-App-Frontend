import { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { Outlet, NavLink, useOutletContext } from "react-router-dom";
import socket from "../socket";

function Friends() {
  const { friends, setFriends, getUser, mydata } = useOutletContext();

  const [addusername, setaddusername] = useState("");
  const [usernameError, setUsernameError] = useState(null);
  const addFriend = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const openDialog = () => {
    addFriend.current.showModal();
  };

  const closeDialog = () => {
    setUsernameError(null);
    setaddusername("");
    addFriend.current.close();
  };
  function handleUsername(e) {
    setaddusername((prev) => e.target.value);
    if (!e.target.checkValidity()) {
      let errorMessage;
      if (e.target.validity.valueMissing) {
        errorMessage = "This field is required";
      } else if (e.target.validity.tooShort) {
        errorMessage = "Username must be at least 3 characters";
      }
      setUsernameError(errorMessage);
      return;
    }
    setUsernameError(null);
  }

  async function sendFriendReq(e) {
    // add friend
    e.preventDefault();
    if (!e.target.checkValidity() || addusername === mydata.username) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://messaging-app-backend-abse.onrender.com/friend/request`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token for authentication
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: addusername }),
      });
      if (!response.ok) {
        const data = await response.json();
        setUsernameError(data.error);
        console.log("failed to send friend request", data);
        return;
      }
      const data = await response.json();
      console.log("friend req sent successfully", data);
      setFriends((prev) => [...prev, data]);
      closeDialog();
      socket.emit("sendFriendReq", data);
    } catch (err) {
      console.log("Error in fetch for sending friend req", err);
    }
  }

  async function deleteFriend(friendId) {
    const isDelete = confirm(
      "Are you sure you want to remove this friend? This action can't be undone"
    );
    if (!isDelete) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://messaging-app-backend-abse.onrender.com/friend/request/${friendId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        console.log("failed to delete friend", data);
        return;
      }
      const data = await response.json();
      console.log("deleted friend successfully", data);
      setFriends((prev) => prev.filter((friend) => friend.id !== data.id));
      socket.emit("deleteFriend", {
        data,
        id:
          data.requesterId === mydata.id ? data.requesteeId : data.requesterId,
      });
    } catch (err) {
      console.log("failed in fetch to delete friend", err);
    }
  }

  async function blockUser(friendId, handleBlock) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://messaging-app-backend-abse.onrender.com/friend/request/block/${friendId}`,
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
      setFriends((prev) => {
        return prev.map((friend) => {
          if (friend.id === data.id) {
            return data;
          } else {
            return friend;
          }
        });
      });

      socket.emit("blockuser", {
        data,
        id:
          data.requesterId === mydata.id ? data.requesteeId : data.requesterId,
      });
    } catch (err) {
      console.error("Error in fetch for blocking user", err);
    }
  }
  return (
    <main className="flex h-full flex-col gap-3">
      {isMobile && (
        <NavLink
          className="font-custom flex items-center text-sm gap-4 font-bold"
          to="/"
        >
          <svg
            className="size-6"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            fill="#ffffff"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                fill="#ffffff"
                d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
              ></path>
              <path
                fill="#ffffff"
                d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
              ></path>
            </g>
          </svg>
          to chats
        </NavLink>
      )}
      <section className="flex flex-col gap-3">
        <div className="flex justify-between">
          <h1 className="flex items-center gap-4 font-custom font-bold">
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
          </h1>
          <button
            onClick={openDialog}
            className="outline font-custom font-bold hover:bg-green-600 outline-2 outline-red-200 px-3 rounded-full bg-green-400 py-1"
          >
            Add friend
          </button>
        </div>
        <div className="flex justify-between">
          <NavLink
            to="/friends"
            end
            className={({ isActive }) =>
              isActive
                ? "p-3 font-custom font-bold bg-gray-700 border-l-4 border-blue-600 inline-block text-[12px] lg:text-[16px]"
                : "p-3 font-custom font-bold bg-gray-800 border-l-4 border-gray-800 hover:bg-gray-700 inline-block text-[12px] lg:text-[16px]"
            }
          >
            All
          </NavLink>
          <NavLink
            to="/friends/online"
            end
            className={({ isActive }) =>
              isActive
                ? "p-3 font-custom font-bold bg-gray-700 border-l-4 border-blue-600 inline-block text-[12px] lg:text-[16px]"
                : "p-3 font-custom font-bold bg-gray-800 border-l-4 border-gray-800 hover:bg-gray-700 inline-block text-[12px] lg:text-[16px]"
            }
          >
            Online
          </NavLink>
          <NavLink
            to="/friends/requests"
            className={({ isActive }) =>
              isActive
                ? "p-3 font-custom font-bold bg-gray-700 border-l-4 border-blue-600 inline-block text-[12px] lg:text-[16px]"
                : "p-3 font-custom font-bold bg-gray-800 border-l-4 border-gray-800 hover:bg-gray-700 inline-block text-[12px] lg:text-[16px]"
            }
          >
            Requests
          </NavLink>
          <NavLink
            to="/friends/blocked"
            end
            className={({ isActive }) =>
              isActive
                ? "p-3 font-custom font-bold bg-gray-700 border-l-4 border-blue-600 inline-block text-[12px] lg:text-[16px]"
                : "p-3 font-custom font-bold bg-gray-800 border-l-4 border-gray-800 hover:bg-gray-700 inline-block text-[12px] lg:text-[16px]"
            }
          >
            Blocked
          </NavLink>
        </div>
      </section>
      {/* dialog for adding friend */}
      <dialog
        ref={addFriend}
        className="md:min-w-[40%] min-w-[85%] self-center rounded-md"
      >
        <form
          onSubmit={(e) => {
            sendFriendReq(e);
          }}
          noValidate
          className="bg-white p-3 flex rounded-md flex-col gap-5"
          action="#"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-custom font-bold text-lg">Add friend</h2>
            <button type="button" onClick={closeDialog}>
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
          <div className="flex flex-col">
            <label htmlFor="username">
              Username <span className="text-red-600">*</span>
            </label>
            <input
              className="border-black border-[3px] flex-1 rounded-full px-2 py-1"
              type="text"
              id="username"
              minLength={3}
              value={addusername}
              onChange={(e) => {
                handleUsername(e);
              }}
              name="username"
              placeholder="username"
              required
            />
            <span className="text-red-600">{usernameError}</span>
          </div>
          <div className="flex">
            <button
              type="submit"
              className="px-3 py-2 rounded-full bg-green-500 font-custom font-bold border-2 border-green-500 flex-1 text-white hover:bg-white hover:text-black"
            >
              Submit
            </button>
          </div>
        </form>
      </dialog>

      <section className="flex flex-1 min-h-0 flex-col overflow-y-auto">
        <Outlet
          context={{
            friends,
            mydata,
            setFriends,
            getUser,
            blockUser,
            deleteFriend,
          }}
        />
      </section>
    </main>
  );
}

export default Friends;
