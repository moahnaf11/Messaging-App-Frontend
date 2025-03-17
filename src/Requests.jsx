import { useOutletContext, Outlet, NavLink } from "react-router-dom";
import { FriendNotificationContext } from "./Chat";
import { useContext } from "react";

function Requests() {
  const { friends, getUser, mydata, setFriends } = useOutletContext();
  const { friendNoti } = useContext(FriendNotificationContext);
  // return requests
  return (
    <>
      <nav className="flex justify-center gap-7 mb-5">
        <NavLink
          to="/friends/requests"
          end
          className={({ isActive }) =>
            isActive
              ? "p-3 font-custom font-bold bg-gray-700 border-l-4 border-blue-600 inline-block text-[11px] md:text-[12px] lg:text-[16px]"
              : "p-3 font-custom font-bold bg-gray-800 border-l-4 border-gray-800 hover:bg-gray-700 inline-block text-[11px] md:text-[12px] lg:text-[16px]"
          }
        >
          Sent Requests
        </NavLink>
        <NavLink
          to="/friends/requests/received"
          end
          className={({ isActive }) =>
            isActive
              ? "p-3 font-custom font-bold bg-gray-700 border-l-4 border-blue-600 text-[11px] md:text-[12px] lg:text-[16px] flex items-center justify-between gap-3"
              : "p-3 font-custom font-bold bg-gray-800 border-l-4 border-gray-800 hover:bg-gray-700 text-[11px] md:text-[12px] lg:text-[16px] flex items-center justify-between gap-3"
          }
        >
          Received Requests
          {friendNoti && (
            <svg
              className="size-3 lg:size-5"
              viewBox="0 0 16 16"
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
                <circle cx="8" cy="8" r="8" fill="#ff0000"></circle>{" "}
              </g>
            </svg>
          )}
        </NavLink>
      </nav>
      <section className="flex flex-col gap-4">
        <Outlet context={{ friends, getUser, mydata, setFriends }} />
      </section>
    </>
  );
}

export default Requests;
