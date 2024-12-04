import { useOutletContext } from "react-router-dom";
function ReceivedReq() {
  const { friends, mydata, getUser } = useOutletContext();
  const pendingRequests = friends
    ? friends.filter((friend) => {
        return friend.requestee.id === mydata.id && friend.status === "pending";
      })
    : null;

  return (
    <>
      {pendingRequests && pendingRequests.length > 0 ? (
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
                  <button className="px-2 py-1 rounded-full hover:bg-gray-700">
                    <svg
                      className="size-9"
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
                        <path
                          d="M16.5163 8.93451L11.0597 14.7023L8.0959 11.8984"
                          stroke="#c0ff9e"
                          stroke-width="1.2"
                        ></path>
                        <path
                          d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                          stroke="#c0ff9e"
                          stroke-width="1.2"
                        ></path>
                      </g>
                    </svg>
                  </button>
                  <button className="px-2 py-1 rounded-full hover:bg-gray-700">
                    <svg
                      className="size-8"
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 128 128"
                      enable-background="new 0 0 128 128"
                      xml:space="preserve"
                      fill="#000000"
                      stroke="#000000"
                      stroke-width="0.00128"
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
                            <path
                              fill="#B0BEC5"
                              d="M64,0C28.656,0,0,28.656,0,64s28.656,64,64,64s64-28.656,64-64S99.344,0,64,0z M64,120 C33.125,120,8,94.875,8,64S33.125,8,64,8s56,25.125,56,56S94.875,120,64,120z"
                            ></path>{" "}
                          </g>{" "}
                        </g>{" "}
                        <g>
                          {" "}
                          <g>
                            {" "}
                            <path
                              fill="#F44336"
                              d="M75.313,64l16.969-16.969c3.125-3.125,3.125-8.195,0-11.313c-3.117-3.125-8.188-3.125-11.313,0L64,52.688 L47.031,35.719c-3.125-3.125-8.195-3.125-11.313,0c-3.125,3.117-3.125,8.188,0,11.313L52.688,64L35.719,80.969 c-3.125,3.125-3.125,8.195,0,11.313c3.117,3.125,8.188,3.125,11.313,0L64,75.313l16.969,16.969c3.125,3.125,8.195,3.125,11.313,0 c3.125-3.117,3.125-8.188,0-11.313L75.313,64z"
                            ></path>{" "}
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
        <div className="font-custom font-bold">
          No pending received requests
        </div>
      )}
    </>
  );
}

export default ReceivedReq;