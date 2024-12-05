import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

function Conversation() {
  const { id } = useParams();
  const { mydata } = useOutletContext();
  const [messages, setMessages] = useState([]);
  const [person, setPerson] = useState(null);

  const user = person
    ? person.requesterId === mydata.id
      ? person.requestee
      : person.requester
    : null;

  useEffect(() => {
    async function getConversation(id) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/message/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const data = await response.json();
          console.log("no messages", data);
          setMessages([]);
          setPerson(data.friend);
          return;
        }
        const data = await response.json();
        console.log("retrieved all messages", data);
        setMessages(data.messages);
        setPerson(data.friend);
      } catch (err) {
        console.log("failed in fetch messages between friends", err);
      }
    }
    getConversation(id);
  }, []);
  return (
    <>
      <section className="flex gap-5 z-10 items-center border-b border-white p-3 sticky top-20 ">
        <div className="relative size-11 rounded-full">
          <img
            className="h-full rounded-full object-cover"
            src={
              user && user.profilePicture ? user.profilePicture : "/default.jpg"
            }
            alt="prof pic"
          />
          <div
            className={`lg:size-4 size-3 absolute bottom-0 right-0 rounded-full ${
              user && user.online ? "bg-green-600" : "bg-gray-500"
            } `}
          ></div>
        </div>
        <div>{user ? user.username : null}</div>
      </section>
      {/* messages rendering */}
      <section className="h-screen flex flex-col overflow-y-auto">
        {messages && messages.length > 0 ? (
          <div></div>
        ) : (
          <div className="font-bold font-custom text-center my-auto text-xl ">
            No messages yet
          </div>
        )}
      </section>
    </>
  );
}

export default Conversation;
