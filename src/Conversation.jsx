import { useEffect, useRef, useState, useContext } from "react";
import { NavLink, useOutletContext, useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import socket from "../socket";
import { ProfileDialogContext } from "./Chat";

function Conversation() {
  const { id } = useParams();
  const { openProfileDialog } = useContext(ProfileDialogContext);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const { mydata, friends } = useOutletContext();
  const [messages, setMessages] = useState([]);
  const [person, setPerson] = useState(null);
  const [sendMessage, setSendMessage] = useState("");
  const [caption, setCaption] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [updateMessageIdentifier, setUpdateMessageIdentifier] = useState(null);
  const [fileError, setFileError] = useState(null);
  const messageMediaDialog = useRef(null);
  const fileInputRef = useRef(null);
  const imageDialog = useRef(null);
  const [imageDisplay, setImageDisplay] = useState(null);

  const friendObject =
    friends && person
      ? friends.find((friend) => friend.id === person.id)
      : null;

  const user = friendObject
    ? friendObject.requesterId === mydata.id
      ? friendObject.requestee
      : friendObject.requester
    : null;

  const groupedMessages = messages.length
    ? messages.reduce((acc, message) => {
        const date = new Date(message.timestamp).toLocaleDateString("en-GB"); // Format date as DD/MM/YYYY
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(message);
        return acc;
      }, {})
    : null;

  // Listen for the 'receiveMessage' event
  useEffect(() => {
    // Setup the socket listener for incoming messages
    socket.on("receiveMessage", (messageData) => {
      // When a message is received, update the state
      setMessages((prev) => [...prev, messageData.content]);
    });

    socket.on("receiveMediaMessage", (messageMedia) => {
      setMessages((prev) => [...prev, messageMedia]);
    });

    socket.on("receiveDeleteMessage", (message) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== message.id));
    });

    socket.on("receiveUpdateMessage", (message) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== message.id) {
            return msg;
          } else {
            return message;
          }
        })
      );
    });

    // Cleanup the socket listener when the component unmounts
    return () => {
      socket.off("receiveMessage");
      socket.off("receiveMediaMessage");
      socket.off("receiveDeleteMessage");
      socket.off("receiveUpdateMessage");
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController(); // Create an AbortController
    const signal = controller.signal;
    async function getConversation(id) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/message/${id}`,
          {
            method: "GET",
            signal,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

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
        if (err.name === "AbortError") {
          console.log("Fetch request aborted");
          return;
        }
        console.log("failed in fetch messages between friends", err);
      }
    }
    getConversation(id);
    return () => {
      controller.abort();
    };
  }, [id]);

  const openMessageMedia = () => {
    messageMediaDialog.current.showModal();
  };

  const closeMessageMedia = () => {
    fileInputRef.current.value = "";
    setFileError(null);
    setCaption("");
    messageMediaDialog.current.close();
  };

  async function deleteMessage(messageId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/message/${messageId}`,
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
        console.log("failed to delete message", data);
        return;
      }
      const data = await response.json();
      console.log("message deleted successfully", data);
      setMessages((prev) => prev.filter((message) => message.id !== messageId));
      socket.emit("deleteMessage", { data, receiverId: data.receiverId });
    } catch (err) {
      console.log("failed in fetch for deleting message", err);
    }
  }
  async function handleMessageSubmit(e, MessageWithMedia) {
    e.preventDefault();
    if (!MessageWithMedia) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/message`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: sendMessage, receiverId: user.id }),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          console.log("failed to send message", data);
          return;
        }
        const data = await response.json();
        console.log("message sent successfully", data);
        setSendMessage("");
        setMessages((prev) => [...prev, data]);
        socket.emit("sendMessage", {
          content: data,
          receiverId: user.id, // Ensure you include receiverId here as well
        });
      } catch (err) {
        console.log("failed in fetch for posting message", err);
      }
    } else {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const formData = new FormData();
        const fileInput = e.target.elements.media;
        const files = fileInput.files;
        if (files) {
          for (const file of files) {
            formData.append("media", file);
          }
        }
        formData.append("content", caption);
        formData.append("receiverId", user.id);
        const response = await fetch(
          `http://localhost:3000/message/media`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const data = await response.json();
          console.log("failed to send message with media", data);
          setFileError(data.error);
          setLoading(false);
          return;
        }
        const data = await response.json();
        console.log("message with media sent successfully", data);
        closeMessageMedia();
        setLoading(false);
        setMessages((prev) => [...prev, data]);
        socket.emit("sendMediaMessage", { data, receiverId: user.id });
      } catch (err) {
        console.log("failed in fetch for posting message with media", err);
      }
    }
  }

  async function updateMessage(messageId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/message/${messageId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: sendMessage }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        console.log("failed to update message", data);
        return;
      }
      const data = await response.json();
      console.log("message updated successfully", data);
      setSendMessage("");
      setUpdateMessageIdentifier(null);
      setIsEdit(false);
      setMessages((prev) =>
        prev.map((message) => {
          if (message.id !== messageId) {
            return message;
          } else {
            return data;
          }
        })
      );
      socket.emit("updateMessage", { data, receiverId: data.receiverId });
    } catch (err) {
      console.log("failed in fetch for updating message", err);
    }
  }
  return (
    <div className="h-full flex flex-col">
      <section className="flex gap-5 sticky top-0 items-center bg-gray-800 pb-3">
        {isMobile && (
          <NavLink to="/">
            <svg
              className="size-6"
              fill="#ffffff"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 72 72"
              enable-background="new 0 0 72 72"
              xml:space="preserve"
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
                  <path d="M48.252,69.253c-2.271,0-4.405-0.884-6.011-2.489L17.736,42.258c-1.646-1.645-2.546-3.921-2.479-6.255 c-0.068-2.337,0.833-4.614,2.479-6.261L42.242,5.236c1.605-1.605,3.739-2.489,6.01-2.489c2.271,0,4.405,0.884,6.01,2.489 c3.314,3.314,3.314,8.707,0,12.021L35.519,36l18.743,18.742c3.314,3.314,3.314,8.707,0,12.021 C52.656,68.369,50.522,69.253,48.252,69.253z M48.252,6.747c-1.202,0-2.332,0.468-3.182,1.317L21.038,32.57 c-0.891,0.893-0.833,2.084-0.833,3.355c0,0.051,0,0.101,0,0.151c0,1.271-0.058,2.461,0.833,3.353l24.269,24.506 c0.85,0.85,1.862,1.317,3.063,1.317c1.203,0,2.273-0.468,3.123-1.317c1.755-1.755,1.725-4.61-0.03-6.365L31.292,37.414 c-0.781-0.781-0.788-2.047-0.007-2.828L51.438,14.43c1.754-1.755,1.753-4.61-0.001-6.365C50.587,7.215,49.454,6.747,48.252,6.747z"></path>{" "}
                </g>{" "}
              </g>
            </svg>
          </NavLink>
        )}
        <button
          onClick={() => openProfileDialog(user)}
          className="relative size-11 rounded-full"
        >
          <img
            className="h-full rounded-full w-full object-cover"
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
        </button>
        <div>{user ? user.username : null}</div>
      </section>
      {/* messages rendering */}
      <section className="flex flex-col min-h-0 flex-1 overflow-y-auto">
        {groupedMessages ? (
          Object.keys(groupedMessages).map((date) => (
            <div key={date}>
              <h2 className="max-w-max mx-auto sticky top-0 bg-gray-700 z-10 px-2 py-1 opacity-70 rounded-full">
                {date}
              </h2>
              {groupedMessages[date].map((message) => {
                const messageTime = new Date(message.timestamp);
                const updated = message.updatedAt;
                const currentTime = new Date();
                const isWithin15Minutes =
                  currentTime - messageTime <= 15 * 60 * 1000; // 15 minutes in milliseconds

                return (
                  <div
                    key={message.id}
                    className={`rounded-lg p-2 max-w-[50%] ${
                      message.senderId === mydata.id
                        ? "bg-green-400 text-black ml-auto"
                        : "bg-gray-300 text-black mr-auto"
                    }`}
                  >
                    {message.senderId === mydata.id && (
                      <div className="flex items-center justify-end gap-2 mb-2">
                        <button onClick={(e) => deleteMessage(message.id)}>
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
                        {isWithin15Minutes && message.content && (
                          <button
                            onClick={() => {
                              setIsEdit(true);
                              setSendMessage(message.content);
                              setUpdateMessageIdentifier(message.id);
                            }}
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
                                  d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                                  stroke="#000000"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>{" "}
                                <path
                                  d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                                  stroke="#000000"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>{" "}
                              </g>
                            </svg>
                          </button>
                        )}
                      </div>
                    )}
                    {message.media.length > 0 &&
                      message.media.map((file) => {
                        if (file.type === "image") {
                          return (
                            <button
                              onClick={() => {
                                setImageDisplay(file.url);
                                imageDialog.current.showModal();
                              }}
                              className="inline-block"
                              key={file.id}
                            >
                              <img
                                className="object-cover w-full"
                                src={file.url}
                                alt="file"
                              />
                            </button>
                          );
                        } else if (file.type === "video") {
                          return (
                            <div key={file.id}>
                              <video controls>
                                <source
                                  src={file.url}
                                  type={file.mimeType || "video/mp4"}
                                />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          );
                        } else {
                          // For raw files, provide a download link
                          return (
                            <div key={file.id}>
                              <a
                                className="bg-blue-400 inline-block rounded-full px-2 py-1"
                                href={file.url}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Download File
                              </a>
                            </div>
                          );
                        }
                      })}
                    <div>{message.content}</div>
                    <div className="flex justify-end text-sm">
                      {updated !== message.timestamp
                        ? "edited " +
                          new Date(updated).toLocaleTimeString("en-GB", {
                            hour12: false,
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : messageTime.toLocaleTimeString("en-GB", {
                            hour12: false,
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="font-bold font-custom text-center my-auto text-xl">
            No messages yet
          </div>
        )}
      </section>
      <form
        onSubmit={(e) => {
          if (isEdit) {
            e.preventDefault();
            updateMessage(updateMessageIdentifier);
          } else {
            handleMessageSubmit(e, false);
          }
        }}
        className="flex z-20 sticky bottom-0 pt-3 bg-gray-800 items-center justify-center gap-4"
        action="#"
      >
        <button
          onClick={openMessageMedia}
          type="button"
          className="px-2 py-1 hover:bg-gray-700 rounded-full"
        >
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
                d="M4 12H20M12 4V20"
                stroke="#ffffff"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
            </g>
          </svg>
        </button>

        <input
          className="bg-gray-900 px-2 py-1 min-w-[50%] text-center rounded-full text-gray-400"
          type="text"
          value={sendMessage}
          onChange={(e) => setSendMessage(e.target.value)}
          placeholder="message"
        />
        <button
          type="submit"
          disabled={sendMessage === ""}
          className="px-2 py-1 hover:bg-gray-700 rounded-full"
        >
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
                d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z"
                stroke={`${!sendMessage ? "#78716C" : "#ffffff"}`}
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
            </g>
          </svg>
        </button>
      </form>

      <dialog
        className="md:min-w-[40%] min-w-[85%] self-center rounded-md"
        ref={messageMediaDialog}
      >
        <form
          enctype="multipart/form-data"
          onSubmit={(e) => {
            handleMessageSubmit(e, true);
          }}
          className="bg-white p-3 flex rounded-md flex-col gap-5"
          action="#"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-custom font-bold">Upload file</h2>
            <button type="button" onClick={() => closeMessageMedia()}>
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
          <input ref={fileInputRef} type="file" name="media" multiple />
          <span className="text-red-600">{fileError}</span>
          <div className="flex flex-col">
            <label htmlFor="content">Caption</label>
            <input
              className="border-black border-[3px] flex-1 rounded-full px-2 py-1"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              id="content"
              name="content"
              placeholder="caption"
            />
          </div>
          <div className="flex">
            <button
              disabled={loading}
              className="flex px-3 py-2 rounded-full justify-center bg-green-500 font-custom font-bold border-2 border-green-500 flex-1 text-white hover:bg-white hover:text-black"
            >
              {loading ? (
                <svg
                  className="size-7 animate-spin"
                  width="28px"
                  height="28px"
                  viewBox="-0.48 -0.48 16.96 16.96"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="#000000"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <g fill="#000000" fill-rule="evenodd" clip-rule="evenodd">
                      {" "}
                      <path
                        d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z"
                        opacity=".2"
                      ></path>{" "}
                      <path d="M7.25.75A.75.75 0 018 0a8 8 0 018 8 .75.75 0 01-1.5 0A6.5 6.5 0 008 1.5a.75.75 0 01-.75-.75z"></path>{" "}
                    </g>{" "}
                  </g>
                </svg>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </dialog>
      {/* image dialog */}
      <dialog
        className="md:w-[40%] bg-gray-400 p-3 w-[85%] h-[60%] overflow-hidden self-center rounded-md"
        ref={imageDialog}
      >
        <button
          className="max-w-min mb-2 block ml-auto"
          type="button"
          onClick={() => {
            setImageDisplay(null);
            imageDialog.current.close();
          }}
        >
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

        <img
          className="h-[calc(100%-36px)] w-full object-contain"
          src={imageDisplay ? imageDisplay : null}
          alt=""
        />
      </dialog>
    </div>
  );
}

export default Conversation;
