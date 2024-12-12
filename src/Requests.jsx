import { useOutletContext, Outlet, NavLink } from "react-router-dom";

function Requests() {
  const { friends, getUser, mydata, setFriends } = useOutletContext();
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
              ? "p-3 font-custom font-bold bg-gray-700 border-l-4 border-blue-600 inline-block text-[11px] md:text-[12px] lg:text-[16px]"
              : "p-3 font-custom font-bold bg-gray-800 border-l-4 border-gray-800 hover:bg-gray-700 inline-block text-[11px] md:text-[12px] lg:text-[16px]"
          }
        >
          Received Requests
        </NavLink>
      </nav>
      <section className="flex flex-col gap-4">
        <Outlet context={{ friends, getUser, mydata, setFriends }} />
      </section>
    </>
  );
}

export default Requests;
