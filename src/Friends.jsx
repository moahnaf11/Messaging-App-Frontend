import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Outlet, NavLink } from "react-router-dom";

function Friends() {
  const [friends, setFriends] = useState(null);
  const [mydata, setMyData] = useState(null);

  useEffect(() => {
    async function getFriends() {
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
        console.log("failed in fetch friends", err);
      }
    }
    getFriends();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const data = jwtDecode(token);
    setMyData(data);
  }, []);
  return (
    <main className="flex flex-col gap-3">
      <section className="flex flex-col gap-3">
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
        <div className="flex justify-between">
          <NavLink
            to="/friends"
            end
            className={({ isActive }) =>
              isActive
                ? "p-3 font-custom font-bold bg-gray-700 border-l-4 border-blue-600 inline-block md:text-[12px] lg:text-[16px]"
                : "p-3 font-custom font-bold bg-gray-800 border-l-4 border-gray-800 hover:bg-gray-700 inline-block md:text-[12px] lg:text-[16px]"
            }
          >
            All
          </NavLink>
          <NavLink
            to="/friends/online"
            end
            className={({ isActive }) =>
              isActive
                ? "p-3 font-custom font-bold bg-gray-700 border-l-4 border-blue-600 inline-block md:text-[12px] lg:text-[16px]"
                : "p-3 font-custom font-bold bg-gray-800 border-l-4 border-gray-800 hover:bg-gray-700 inline-block md:text-[12px] lg:text-[16px]"
            }
          >
            Online
          </NavLink>
          <NavLink
            to="/friends/requests"
            end
            className={({ isActive }) =>
              isActive
                ? "p-3 font-custom font-bold bg-gray-700 border-l-4 border-blue-600 inline-block md:text-[12px] lg:text-[16px]"
                : "p-3 font-custom font-bold bg-gray-800 border-l-4 border-gray-800 hover:bg-gray-700 inline-block md:text-[12px] lg:text-[16px]"
            }
          >
            Requests
          </NavLink>
          <NavLink
            to="/friends/blocked"
            end
            className={({ isActive }) =>
              isActive
                ? "p-3 font-custom font-bold bg-gray-700 border-l-4 border-blue-600 inline-block md:text-[12px] lg:text-[16px]"
                : "p-3 font-custom font-bold bg-gray-800 border-l-4 border-gray-800 hover:bg-gray-700 inline-block md:text-[12px] lg:text-[16px]"
            }
          >
            Blocked
          </NavLink>
        </div>
      </section>

      <section className="flex flex-col">
        <Outlet context={{ friends, mydata, setFriends }} />
      </section>
    </main>
  );
}

export default Friends;