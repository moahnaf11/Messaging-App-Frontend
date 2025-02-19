import { useOutletContext } from "react-router-dom";
import { useState } from "react";

function Blocked() {
  const { friends, mydata, getUser, blockUser } = useOutletContext();
  const [search, setSearch] = useState("");

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  const blockedfriends = friends
    ? friends.filter((friend) => {
        const user = getUser(friend);
        if (!search) {
          return friend.blocker_id === mydata.id && friend.status === "blocked";
        }
        return (
          friend.blocker_id === mydata.id &&
          friend.status === "blocked" &&
          user.username.toLowerCase().includes(search.toLowerCase())
        );
      })
    : null;
  // return blocked friends
  return (
    <>
      <input
        className="bg-gray-900 px-2 py-1 min-w-[50%] text-center mb-5 mx-auto rounded-full text-gray-400"
        type="text"
        onChange={(e) => handleSearch(e)}
        value={search}
        placeholder="search"
      />
      {blockedfriends && blockedfriends.length > 0 ? (
        blockedfriends.map((friend) => {
          const user = getUser(friend);
          return (
            <div
              className="flex items-center p-3 justify-between"
              key={friend.id}
            >
              <div className="flex items-center gap-5">
                <div className="w-[50px] h-[50px] lg:w-[70px] lg:h-[70px]">
                  <img
                    className="rounded-full h-full object-cover"
                    src="/default.jpg"
                    alt="profile picture"
                  />
                </div>
                <div>{user.username}</div>
              </div>
              <div className="flex items-center gap-3">
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
              </div>
            </div>
          );
        })
      ) : (
        <div className="font-custom font-bold">No blocked users</div>
      )}
    </>
  );
}

export default Blocked;
