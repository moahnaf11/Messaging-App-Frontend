import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect, useRef, createContext } from "react";
import { jwtDecode } from "jwt-decode";
import ProfileDialog from "./ProfileDialog";
import socket from "../socket";
import ChatList from "./ChatList";
import CreateGroupDialog from "./CreateGroupDialog";

export const ProfileDialogContext = createContext();
export const UpdateChatDisplayContext = createContext();

function Chat() {
  // location
  const location = useLocation();
  const navigate = useNavigate();
  const { setisLoggedIn } = useOutletContext();
  const pathname = useRef(location.pathname);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [mydata, setMyData] = useState(null);
  const [search, setSearch] = useState("");
  const profDialog = useRef(null);
  const addMemberDialog = useRef(null); // Reference to the dialog element
  const menuRef = useRef(null); // Ref for the menu div
  const [profDisplay, setProfDisplay] = useState(null);
  // member username
  const [username, setUsername] = useState("");
  const [memberError, setMemberError] = useState(null);
  // toggling group columns
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const groupInfoRef = useRef(null);
  const [filterText, setFilterText] = useState("");
  const [myGroup, setMyGroup] = useState(null);
  const groupImageDialog = useRef(null);
  const [groupImage, setGroupImage] = useState(null);
  const [groupImageError, setGroupImageError] = useState(null);
  const fileInputRef = useRef(null);

  const groupNameDialog = useRef(null);
  const [groupName, setGroupName] = useState("");

  const [isAdminOnly, setIsAdminOnly] = useState(false);

  // archived toggling
  const [showArchived, setShowArchived] = useState(false);
  const [openMenu, setOpenMenu] = useState(null); // Track which menu is open
  const toggleMenu = (id) => {
    setOpenMenu((prev) => (prev === id ? null : id)); // Toggle open/close
  };

  // Function to open the dialog
  const openAddMemberDialog = () => {
    addMemberDialog.current.showModal();
  };

  // Function to close the dialog
  const closeAddMemberDialog = () => {
    addMemberDialog.current.close();
  };

  // Filter members based on input value
  const filteredMembers = selectedGroup
    ? selectedGroup.members.filter((member) =>
        member.user.username.toLowerCase().includes(filterText.toLowerCase())
      )
    : [];
  const myRecord =
    selectedGroup && mydata
      ? selectedGroup.members.find((member) => member.userId === mydata.id)
      : null;
  console.log("my record", myRecord);
  console.log("selected group", selectedGroup);

  // toggle archived function
  const toggleArchived = () => {
    setShowArchived((prev) => !prev);
  };

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

  // Toggle admin-only mode
  const handleAdminToggle = async (groupId) => {
    const newMode = !selectedGroup.admin_only;
    setIsAdminOnly(newMode);

    try {
      // Send request to update the database
      const response = await fetch(
        `http://localhost:3000/group/${groupId}/admin-only`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ newMode }), // Replace with actual group ID
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSelectedGroup((prev) => ({
          ...prev,
          admin_only: data.admin_only,
        }));
        socket.emit("toggleAdminChat", data); // Notify other users
      } else {
        alert("Failed to update admin-only mode.");
      }
    } catch (err) {
      console.log("error occurred while updating admin only mode", err);
    }
  };

  // update groupchatdisplay
  const updateGroupChatDisplay = async (groupId, boolvalue) => {
    try {
      const response = await fetch(
        `http://localhost:3000/group/${groupId}/archive`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include JWT token if needed
          },
          body: JSON.stringify({ action: boolvalue }), // Send action in request body
        }
      );

      if (!response.ok) {
        const data = await response.json();
        console.log(data);
        return;
      }

      const data = await response.json();
      console.log("Group chat display status updated successfully:", data);
      setGroups((prev) => {
        return prev.map((group) => {
          if (group.id === groupId) {
            return data;
          } else {
            return {
              group,
            };
          }
        });
      });
    } catch (error) {
      console.error("Error updating group chat status:", error.message);
    }
  };

  const updateChatDisplay = async (chatId, action) => {
    try {
      console.log(chatId);
      setOpenMenu(null);
      const response = await fetch(
        `http://localhost:3000/friend/request/archive/${chatId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include JWT token if needed
          },
          body: JSON.stringify({ action }), // Send action in request body
        }
      );

      if (!response.ok) {
        const data = await response.json();
        console.log(data);
        return;
      }

      const data = await response.json();
      console.log("Chat display status updated successfully:", data);
      setFriends((prev) => {
        return prev.map((friend) => {
          // If the friend's id matches the updated chat's id, return the new chat
          if (friend.id === data.id) {
            return data; // This is the updated chat
          }
          return friend; // Otherwise, return the old chat
        });
      });
    } catch (error) {
      console.error("Error updating chat status:", error.message);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleCreateGroup = async (groupData) => {
    console.log("New Group:", groupData);
    // send `groupData` to backend
    try {
      const response = await fetch(`http://localhost:3000/group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include JWT token if needed
        },
        body: JSON.stringify(groupData), // Send action in request body
      });

      if (!response.ok) {
        const data = await response.json();
        console.log(data);
        return;
      }

      const data = await response.json();
      console.log("groupchat created successfully", data);
      setGroups((prev) => [...prev, data]);
      socket.emit("createGroup", { data, creatorId: mydata.id });
    } catch (error) {
      console.error("Error with group chat creation req", error.message);
    }
  };

  // remove member from grouo
  const removeMember = async (groupId, userId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/group/${groupId}/remove-member`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ userId }), // Sending userId in the body
        }
      );

      if (!response.ok) {
        const data = await response.json();
        console.log("failed to remove user from group", data);
      }

      const data = await response.json();
      console.log("User removed from group:", data);

      // Update UI after removal (if needed)
      setSelectedGroup((prev) => ({
        ...prev,
        members: prev.members.filter((member) => member.userId !== userId),
      }));
      socket.emit("removeMember", { groupId, userId });
      // If the removed user is YOU, remove the group from the chat list
      if (userId === mydata.id) {
        setGroups((prev) => prev.filter((group) => group.id !== groupId));
        setSelectedGroup(null); // Reset selected group if you were removed
        setShowGroupInfo(false);
        navigate("/");
      }
    } catch (error) {
      console.error("Error removing user from group:", error);
    }
  };

  // update group memberm role
  const updateGroupMemberRole = async (groupId, memberId, newRole) => {
    try {
      const response = await fetch(
        `http://localhost:3000/group/${groupId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ memberId, role: newRole }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        console.log("failed to update member role", data);
      }

      const updatedMember = await response.json();
      setSelectedGroup((prev) => ({
        ...prev,
        members: prev.members.map((member) =>
          member.userId === updatedMember.userId
            ? { ...member, role: updatedMember.role } // Update role
            : member
        ),
      }));
      // update group info
      socket.emit("updateMemberRole", updatedMember);
    } catch (error) {
      console.error("Error updating role:", error);
      return null;
    }
  };

  // delete group request
  const deleteGroupRequest = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:3000/group/${groupId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Group deleted successfully:", data);
        // Optionally, update the state to remove the deleted group from your list
        setGroups((prev) => prev.filter((group) => group.id !== groupId));
        setSelectedGroup(null);
        setShowGroupInfo(false);
        navigate("/");
        socket.emit("groupDeleted", { groupId });
      } else {
        const errorData = await response.json();
        console.log("Failed to delete group:", errorData);
      }
    } catch (error) {
      console.error("Error occurred while deleting group:", error);
    }
  };

  // add member
  const addMember = async (e, groupId) => {
    e.preventDefault(); // Prevent form submission

    // Check if username is not empty
    if (username === "") {
      return;
    }

    // Send a fetch request to add the member to the group
    try {
      const response = await fetch(
        `http://localhost:3000/group/${groupId}/add-member`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            username,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Member added successfully:", data);
        setSelectedGroup((prev) => ({
          ...prev,
          members: [...prev.members, data], // Assuming data is the new member
        }));
        closeAddMemberDialog();
        socket.emit("addMember", data);
      } else {
        const data = await response.json();
        setMemberError(data.error);
        console.log("Failed to add member", data);
      }
    } catch (error) {
      console.log("Error adding member:", error);
    }
  };

  // upload group picture
  const handleSubmit = async (e, groupId) => {
    e.preventDefault(); // Prevent the default form submission
    if (!groupImage) {
      alert("Select an image file");
      return;
    }
    const formData = new FormData();
    formData.append("groupImage", groupImage); // Append the selected file to the form data

    try {
      const response = await fetch(
        `http://localhost:3000/group/${groupId}/upload-photo`,
        {
          method: "PUT",
          body: formData, // Send the form data (which includes the file)
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Group photo uploaded successfully:", data);
        // Optionally, close the dialog after successful upload
        groupImageDialog.current.close();
        fileInputRef.current.value = null;
        setGroupImageError(null);
        setGroupImage(null);
        setGroups((prev) => {
          return prev.map((group) => {
            if (group.id === groupId) {
              return data;
            } else {
              return group;
            }
          });
        });
        setSelectedGroup((prev) => {
          if (
            prev &&
            prev.id === groupId &&
            location.pathname === `/group/${groupId}`
          ) {
            return data;
          } else {
            return prev;
          }
        });
        // socket for updating group photo
        socket.emit("updateGroupPhoto", data);
      } else {
        const errorData = await response.json();
        console.error("Failed to upload image:", errorData);
      }
    } catch (error) {
      console.error("Error occurred while uploading:", error);
    }
  };

  // delete group photo
  async function deleteGroupPhoto(groupId) {
    try {
      const response = await fetch(
        `http://localhost:3000/group/${groupId}/upload-photo`,
        {
          method: "DELETE", // Specify the HTTP method
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Example for authentication token
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Group Photo deleted successfully:", data);
        setGroups((prev) => {
          return prev.map((group) => {
            if (group.id === groupId) {
              return data;
            } else {
              return group;
            }
          });
        });
        setSelectedGroup((prev) => {
          if (
            prev &&
            prev.id === groupId &&
            location.pathname === `/group/${groupId}`
          ) {
            return data;
          } else {
            return prev;
          }
        });
        // socket for updating group photo
        socket.emit("updateGroupPhoto", data);
      } else {
        const errorData = await response.json();
        console.log("Failed to delete photo:", errorData.error);
      }
    } catch (error) {
      console.log("Error occurred while deleting the photo:", error);
    }
  }

  // edit group name
  async function updateGroupName(e, groupId) {
    e.preventDefault();
    // Check if the new group name is empty
    if (!groupName.trim()) {
      alert("Group name cannot be empty.");
      return; // Don't proceed if the group name is empty
    }

    try {
      const response = await fetch(`http://localhost:3000/group/${groupId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // if you need authentication
        },
        body: JSON.stringify({
          name: groupName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Group name updated successfully:", data);
        setGroups((prev) => {
          return prev.map((group) => {
            if (group.id === groupId) {
              return data;
            } else {
              return group;
            }
          });
        });
        setSelectedGroup((prev) => {
          if (
            prev &&
            prev.id === groupId &&
            location.pathname === `/group/${groupId}`
          ) {
            return data;
          } else {
            return prev;
          }
        });
        setGroupName("");
        groupNameDialog.current.close();
        // socket for updating group photo
        socket.emit("updateGroupPhoto", data);
      } else {
        const errorData = await response.json();
        console.log("Failed to update group name:", errorData.error);
      }
    } catch (error) {
      console.log("Error occurred while updating group name:", error);
    }
  }

  useEffect(() => {
    pathname.current = location.pathname;
    console.log("pathname", pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobile) {
      return;
    }
    function handleClickOutside(event) {
      if (
        groupInfoRef.current &&
        !groupInfoRef.current.contains(event.target)
      ) {
        setShowGroupInfo(false); // Close when clicking outside
      }
    }

    if (showGroupInfo) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showGroupInfo]);

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
    socket.on("groupCreated", (data) => {
      setGroups((prev) => [...prev, data]);
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

    socket.on("receiveRemoveMember", ({ group, userId }) => {
      const currentPath = pathname.current; // e.g., "/chat/123"
      const isChattingWithDeletedGroup = currentPath === `/group/${group.id}`;
      setGroups((prev) => prev.filter((grp) => grp.id !== group.id));
      if (isChattingWithDeletedGroup) {
        setSelectedGroup(null);
        setShowGroupInfo(false);
        navigate("/"); // Redirect to the home page
      }
    });

    socket.on("receiveAddMember", (data) => {
      setGroups((prev) => [...prev, data]);
    });

    socket.on("updateGroupInfo", (data) => {
      setSelectedGroup((prev) => {
        console.log(prev && prev.id === data.id);
        if (
          prev &&
          prev.id === data.id &&
          pathname.current === `/group/${data.id}`
        ) {
          console.log("updating group info");
          return data; // Update group info
        }
        return prev; // Keep the previous state if it doesn’t match
      });
      // works but setMyGroup as well
    });

    socket.on("receiveDeleteGroup", (groupId) => {
      setGroups((prev) => prev.filter((group) => group.id !== groupId));
      if (pathname.current === `/group/${groupId}`) {
        navigate("/");
      }
    });

    socket.on("receiveMemberRole", (data) => {
      setSelectedGroup((prev) => {
        if (
          prev &&
          prev.id === data.groupId &&
          pathname.current === `/group/${data.groupId}`
        ) {
          console.log("updating role");
          return {
            ...prev,
            members: prev.members.map((member) =>
              member.userId === data.userId
                ? { ...member, role: data.role } // Update role
                : member
            ),
          };
        } else {
          return prev;
        }
      });
    });

    socket.on("receiveUpdateGroupPhoto", (data) => {
      setGroups((prev) => {
        return prev.map((group) => {
          if (group.id === data.id) {
            return data;
          } else {
            return group;
          }
        });
      });
      setSelectedGroup((prev) => {
        if (
          prev &&
          prev.id === data.id &&
          location.pathname === `/group/${data.id}`
        ) {
          return data;
        } else {
          return prev;
        }
      });
    });

    socket.on("receiveOnlyAdminMode", (data) => {
      setSelectedGroup((prev) => {
        if (
          prev &&
          prev.id === data.id &&
          pathname.current === `/group/${data.id}`
        ) {
          return {
            ...prev,
            admin_only: data.admin_only,
          };
        } else {
          return prev;
        }
      });
    });

    return () => {
      socket.off("receiveOnline");
      socket.off("receiveFriendReq");
      socket.off("receiveRejectRequest");
      socket.off("receiveAcceptReq");
      socket.off("receiveDeleteFriend");
      socket.off("receiveBlockUser");
      socket.off("receiveDeleteAccount");
      socket.off("groupCreated");
      socket.off("receiveRemoveMember");
      socket.off("receiveAddMember");
      socket.off("updateGroupInfo");
      socket.off("receiveDeleteGroup");
      socket.off("receiveMemberRole");
      socket.off("receiveUpdateGroupPhoto");
      socket.off("receiveOnlyAdminMode");
    };
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController(); // Create an AbortController
    const signal = controller.signal;
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const [friendsRes, groupChatsRes] = await Promise.all([
          fetch(`http://localhost:3000/friend`, {
            method: "GET",
            signal,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch(`http://localhost:3000/group`, {
            method: "GET",
            signal,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        // Read responses as JSON before checking their status
        const friendsData = await friendsRes.json();
        const groupData = await groupChatsRes.json();

        // Handle friends response
        if (!friendsRes.ok) {
          if (
            friendsData.error === "token not present" ||
            friendsData.error === "invalid token"
          ) {
            setisLoggedIn(false);
            return;
          }
          console.log("No friends found", friendsData);
          setFriends([]);
        } else {
          console.log("All my friends", friendsData);
          setFriends(friendsData);
        }

        // Handle groups response
        if (!groupChatsRes.ok) {
          if (
            groupData.error === "token not present" ||
            groupData.error === "invalid token"
          ) {
            setisLoggedIn(false);
            return;
          }
          console.log("No groups found", groupData);
          setGroups([]);
        } else {
          console.log("All my groups", groupData);
          setGroups(groupData);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.log("Failed to fetch data", err.message);
      }
    }

    fetchData();
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

  // Close the menu if a click is detected outside of the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null); // Close the menu when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Listen for click outside

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Clean up listener
    };
  }, [setOpenMenu]);
  return (
    <main
      className={`relative h-[calc(100vh-3.75rem)] p-3 bg-gray-800 text-white grid md:grid-cols-[1fr_2fr]  ${
        showGroupInfo
          ? "md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_1fr_1fr]"
          : "md:grid-cols-[1fr_2fr]"
      } gap-4`}
    >
      <section
        className={`${
          !isMobile ? "border-r-2 border-white" : ""
        } p-3 min-h-0 flex flex-col gap-3`}
      >
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
        {/* archived chats */}
        <button
          onClick={toggleArchived}
          className="p-3 flex items-center gap-4 font-custom font-bold hover:bg-gray-700"
        >
          {showArchived ? (
            <svg
              className="size-7"
              viewBox="0 0 1024 1024"
              fill="#ffffff"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#ffffff"
              stroke-width="0.01024"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M669.6 849.6c8.8 8 22.4 7.2 30.4-1.6s7.2-22.4-1.6-30.4l-309.6-280c-8-7.2-8-17.6 0-24.8l309.6-270.4c8.8-8 9.6-21.6 2.4-30.4-8-8.8-21.6-9.6-30.4-2.4L360.8 480.8c-27.2 24-28 64-0.8 88.8l309.6 280z"
                  fill=""
                ></path>
              </g>
            </svg>
          ) : (
            <svg
              className="size-7"
              viewBox="-2.4 -2.4 28.80 28.80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#ffffff"
              stroke-width="0.00024000000000000003"
              transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"
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
                  d="M2 5C2 4.05719 2 3.58579 2.29289 3.29289C2.58579 3 3.05719 3 4 3H20C20.9428 3 21.4142 3 21.7071 3.29289C22 3.58579 22 4.05719 22 5C22 5.94281 22 6.41421 21.7071 6.70711C21.4142 7 20.9428 7 20 7H4C3.05719 7 2.58579 7 2.29289 6.70711C2 6.41421 2 5.94281 2 5Z"
                  fill="#ffffff"
                ></path>{" "}
                <path
                  d="M20.0689 8.49993C20.2101 8.49999 20.3551 8.50005 20.5 8.49805V12.9999C20.5 16.7711 20.5 18.6568 19.3284 19.8283C18.1569 20.9999 16.2712 20.9999 12.5 20.9999H11.5C7.72876 20.9999 5.84315 20.9999 4.67157 19.8283C3.5 18.6568 3.5 16.7711 3.5 12.9999V8.49805C3.64488 8.50005 3.78999 8.49999 3.93114 8.49993L11.25 8.49992L11.25 15.0454L9.55748 13.1648C9.28038 12.8569 8.80617 12.832 8.49828 13.1091C8.1904 13.3862 8.16544 13.8604 8.44254 14.1683L11.4425 17.5016C11.5848 17.6596 11.7874 17.7499 12 17.7499C12.2126 17.7499 12.4152 17.6596 12.5575 17.5016L15.5575 14.1683C15.8346 13.8604 15.8096 13.3862 15.5017 13.1091C15.1938 12.832 14.7196 12.8569 14.4425 13.1648L12.75 15.0454L12.75 8.49992L20.0689 8.49993Z"
                  fill="#ffffff"
                ></path>{" "}
              </g>
            </svg>
          )}
          {showArchived ? "Unarchived" : "Archived"}
        </button>

        {/* group dialog */}
        <CreateGroupDialog
          friends={friends}
          onCreateGroup={handleCreateGroup}
          getUser={getUser}
          mydata={mydata}
        />
        {/* ChatList.jsx */}
        <ChatList
          groups={groups}
          menuRef={menuRef}
          openMenu={openMenu}
          toggleMenu={toggleMenu}
          updateChatDisplay={updateChatDisplay}
          acceptedFriends={acceptedFriends}
          getUser={getUser}
          search={search}
          openProfileDialog={openProfileDialog}
          showArchived={showArchived}
          updateGroupChatDisplay={updateGroupChatDisplay}
          mydata={mydata}
        />
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
            <UpdateChatDisplayContext.Provider value={{ updateChatDisplay }}>
              <Outlet
                context={{
                  friends,
                  setFriends,
                  getUser,
                  mydata,
                  groups,
                  setGroups,
                  setSelectedGroup,
                  selectedGroup,
                  setShowGroupInfo,
                  myGroup,
                  setMyGroup,
                  myRecord,
                }}
              />
            </UpdateChatDisplayContext.Provider>
          </ProfileDialogContext.Provider>
        </div>
      )}
      <ProfileDialog
        user={profDisplay}
        profDialog={profDialog}
        closeProfileDialog={closeProfileDialog}
      />
      {/* 3rd column group info */}
      <div
        ref={groupInfoRef}
        className={`bg-gray-400 ${
          showGroupInfo
            ? "block absolute z-50 inset-0 lg:static md:col-start-2 md:col-span-1 md:row-start-1 md:row-span-1 lg:col-start-3"
            : "hidden"
        } flex flex-col text-black p-3 min-h-0 gap-2`}
      >
        <div className=" flex flex-col gap-2">
          <div className="flex">
            <button
              onClick={() => {
                setShowGroupInfo(false);
                // setSelectedGroup(null);
              }}
              className="max-w-max max-h-min rounded-full p-1 hover:bg-gray-500"
            >
              <svg
                className="size-5"
                viewBox="0 0 1024 1024"
                fill="#000000"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#000000"
                stroke-width="44.032"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M669.6 849.6c8.8 8 22.4 7.2 30.4-1.6s7.2-22.4-1.6-30.4l-309.6-280c-8-7.2-8-17.6 0-24.8l309.6-270.4c8.8-8 9.6-21.6 2.4-30.4-8-8.8-21.6-9.6-30.4-2.4L360.8 480.8c-27.2 24-28 64-0.8 88.8l309.6 280z"
                    fill=""
                  ></path>
                </g>
              </svg>
            </button>
            <div className="mx-auto flex gap-4 items-center">
              <img
                className="size-32 rounded-full object-cover"
                src={
                  selectedGroup && selectedGroup.picture
                    ? selectedGroup.picture
                    : "/group.png"
                }
                alt="group icon"
              />
              {selectedGroup && selectedGroup.picture ? (
                <button
                  onClick={() => deleteGroupPhoto(selectedGroup.id)}
                  className="p-1 rounded-full hover:bg-gray-500"
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
                        d="M10 11V17"
                        stroke="#000000"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                      <path
                        d="M14 11V17"
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
                        d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
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
              ) : (
                <button
                  onClick={() => groupImageDialog.current.showModal()}
                  className="p-1 rounded-full hover:bg-gray-500"
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
          </div>
          <div className="flex justify-center items-center gap-4 text-black font-bold font-custom text-center">
            <div>{selectedGroup && selectedGroup.name}</div>
            <button
              onClick={() => groupNameDialog.current.showModal()}
              className="p-1 rounded-full hover:bg-gray-500"
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
          </div>

          <div className="text-center">
            <div className="font-custom font-bold text-sm">
              Group - {selectedGroup && selectedGroup.members.length} members
            </div>
            <div className="text-xs">
              Created by {selectedGroup && selectedGroup.creator.username} on{" "}
              {selectedGroup &&
                new Date(selectedGroup.createdAt).toLocaleDateString("en-GB")}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="font-custom text-sm font-bold">Members</h2>
          <button
            onClick={openAddMemberDialog}
            className="p-1 rounded-full hover:bg-gray-500"
          >
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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
                <g id="Iconly/Curved/Add User">
                  {" "}
                  <g id="Add User">
                    {" "}
                    <path
                      id="Stroke 1"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.92234 21.8083C6.10834 21.8083 2.85034 21.2313 2.85034 18.9213C2.85034 16.6113 6.08734 14.5103 9.92234 14.5103C13.7363 14.5103 16.9943 16.5913 16.9943 18.9003C16.9943 21.2093 13.7573 21.8083 9.92234 21.8083Z"
                      stroke="#030303"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                    <path
                      id="Stroke 3"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.92231 11.2159C12.4253 11.2159 14.4553 9.1859 14.4553 6.6829C14.4553 4.1789 12.4253 2.1499 9.92231 2.1499C7.41931 2.1499 5.38931 4.1789 5.38931 6.6829C5.38031 9.1769 7.39631 11.2069 9.89031 11.2159H9.92231Z"
                      stroke="#030303"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                    <path
                      id="Stroke 5"
                      d="M19.1313 8.12891V12.1389"
                      stroke="#030303"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                    <path
                      id="Stroke 7"
                      d="M21.1776 10.1338H17.0876"
                      stroke="#030303"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                  </g>{" "}
                </g>{" "}
              </g>
            </svg>
          </button>
        </div>
        <input
          type="text"
          placeholder="Search members..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="p-1 rounded-md w-full border border-gray-300 text-black"
        />

        <div className="custom-scrollbar p-2 flex-1 overflow-y-auto min-h-0 flex flex-col gap-1">
          {filteredMembers.length > 0 &&
            filteredMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-2">
                <div className="relative w-10 h-10">
                  <img
                    className="rounded-full w-full h-full object-cover"
                    src={
                      member.user.usprofilePicture
                        ? member.user.profilePicture
                        : "/default.jpg"
                    }
                    alt="profile picture"
                  />
                  <div
                    className={`lg:size-3 size-2 absolute bottom-0 right-0 rounded-full ${
                      member.user.online && member.user.showOnlineStatus ? "bg-green-600" : "bg-gray-500"
                    }`}
                  ></div>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-sm">
                    {mydata.id === member.user.id
                      ? "You"
                      : member.user.username}
                  </span>
                  <span className="text-xs">({member.role})</span>
                </div>
                {myRecord &&
                  myRecord.role === "admin" &&
                  member.user.id !== mydata.id &&
                  member.role !== "admin" && (
                    <div className="ml-auto gap-2">
                      <button
                        onClick={() =>
                          removeMember(member.groupId, member.userId)
                        }
                        className="p-1 rounded-full hover:bg-gray-500"
                      >
                        <svg
                          className="size-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
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
                            <g clip-path="url(#clip0)">
                              {" "}
                              <path
                                d="M18.6213 12.1213L20.7426 10M22.864 7.87868L20.7426 10M20.7426 10L18.6213 7.87868M20.7426 10L22.864 12.1213"
                                stroke="#ff0000"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>{" "}
                              <path
                                d="M1 20V19C1 15.134 4.13401 12 8 12V12C11.866 12 15 15.134 15 19V20"
                                stroke="#ff0000"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>{" "}
                              <path
                                d="M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z"
                                stroke="#ff0000"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>{" "}
                            </g>{" "}
                            <defs>
                              {" "}
                              <clipPath id="clip0">
                                {" "}
                                <rect
                                  width="24"
                                  height="24"
                                  fill="white"
                                ></rect>{" "}
                              </clipPath>{" "}
                            </defs>{" "}
                          </g>
                        </svg>
                      </button>
                      <button
                        onClick={() =>
                          updateGroupMemberRole(
                            member.groupId,
                            member.id,
                            "admin"
                          )
                        }
                        className="p-1 rounded-full hover:bg-gray-500"
                      >
                        <svg
                          className="size-5"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="#37ff00"
                          stroke="#37ff00"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <rect
                              x="0"
                              fill="none"
                              width="20"
                              height="20"
                            ></rect>{" "}
                            <g>
                              {" "}
                              <path d="M10 9.25c-2.27 0-2.73-3.44-2.73-3.44C7 4.02 7.82 2 9.97 2c2.16 0 2.98 2.02 2.71 3.81 0 0-.41 3.44-2.68 3.44zm0 2.57L12.72 10c2.39 0 4.52 2.33 4.52 4.53v2.49s-3.65 1.13-7.24 1.13c-3.65 0-7.24-1.13-7.24-1.13v-2.49c0-2.25 1.94-4.48 4.47-4.48z"></path>{" "}
                            </g>{" "}
                          </g>
                        </svg>
                      </button>
                    </div>
                  )}
                {myRecord &&
                  myRecord.role === "admin" &&
                  member.user.id !== mydata.id &&
                  member.role === "admin" && (
                    <button
                      onClick={() =>
                        updateGroupMemberRole(
                          member.groupId,
                          member.id,
                          "member"
                        )
                      }
                      className="p-1 ml-auto rounded-full hover:bg-gray-500"
                    >
                      <svg
                        className="size-5"
                        fill="#f25a5a"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#f25a5a"
                        stroke-width="0.00024000000000000003"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path d="M20.901 10.566A1.001 1.001 0 0 0 20 10h-4V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H4a1.001 1.001 0 0 0-.781 1.625l8 10a1 1 0 0 0 1.562 0l8-10c.24-.301.286-.712.12-1.059z"></path>
                        </g>
                      </svg>
                    </button>
                  )}
              </div>
            ))}
        </div>

        {/* allow admins to send messages only */}
        {myRecord && myRecord.role === "admin" && (
          <label className="text-xs border border-gray-500 px-2 py-1 font-bold font-custom flex justify-between">
            Only Admins
            <input
              type="checkbox"
              checked={isAdminOnly}
              onChange={() => handleAdminToggle(selectedGroup.id)}
            />
          </label>
        )}

        {/* deleting group etc */}
        <div className="flex flex-col gap-1">
          {selectedGroup && selectedGroup.creatorId === mydata.id && (
            <button
              onClick={() => deleteGroupRequest(selectedGroup.id)}
              className="font-custom font-bold p-2 max-w-max text-sm hover:bg-red-400"
            >
              Delete Group
            </button>
          )}
          <button
            onClick={() => removeMember(myRecord.groupId, myRecord.userId)}
            className="font-custom font-bold p-2 max-w-max text-sm hover:bg-red-400"
          >
            Leave Group
          </button>
        </div>
        {/* Dialog */}
        <dialog
          ref={addMemberDialog}
          className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto lg:w-[50%] w-[90%]"
        >
          <h2 className="text-lg font-custom font-bold">Add Member</h2>
          <form
            onSubmit={(e) => addMember(e, selectedGroup.id)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username} // Bind the input to state
                onChange={(e) => handleUsernameChange(e)} // Update state as user types
                className="border border-gray-300 p-2 rounded-md"
              />
              {memberError && (
                <span className="text-red-600">{memberError}</span>
              )}
            </div>
            <div className="flex gap-2 justify-between">
              <button
                type="submit"
                className="p-2 font-custom font-bold flex-1 bg-blue-500 text-black rounded-md"
              >
                Add
              </button>
              <button
                type="button"
                className="p-2 font-custom font-bold flex-1 bg-red-500 rounded-md text-black"
                onClick={closeAddMemberDialog} // Close button for the dialog
              >
                Close
              </button>
            </div>
          </form>
        </dialog>

        {/* Dialog for file upload */}
        <dialog
          ref={groupImageDialog}
          className="bg-white p-4 rounded-lg shadow-lg"
        >
          <h2 className="text-lg font-bold font-custom mb-2">
            Upload Group Picture
          </h2>
          <form
            onSubmit={(e) => handleSubmit(e, selectedGroup.id)} // Handle form submission
            encType="multipart/form-data" // Ensure it's a multipart form for file upload
          >
            <input
              ref={fileInputRef}
              type="file"
              name="groupImage" // Name the file input field (it will be used by multer on the server side)
              onChange={(e) => setGroupImage(e.target.files[0])} // Handle file change
            />
            {groupImageError && (
              <span className="text-red-600">{groupImageError}</span>
            )}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="px-3 py-1 mr-2 font-bold font-custom bg-gray-300 rounded"
                onClick={() => {
                  groupImageDialog.current.close();
                  fileInputRef.current.value = null;
                  setGroupImageError(null);
                }} // Close the dialog
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 font-bold font-custom bg-blue-500 text-white rounded"
              >
                Submit
              </button>
            </div>
          </form>
        </dialog>

        {/* Dialog for editing the group name */}
        <dialog
          ref={groupNameDialog}
          className="bg-white p-4 rounded-lg shadow-lg"
        >
          <h2 className="text-lg font-bold font-custom mb-2">
            Edit Group Name
          </h2>
          <form onSubmit={(e) => updateGroupName(e, selectedGroup.id)}>
            <label className="block mb-2" htmlFor="group-name">
              Group Name
            </label>
            <input
              id="group-name"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-2 border rounded border-black"
            />
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="px-3 font-custom font-black py-1 mr-2 bg-gray-300 rounded"
                onClick={() => groupNameDialog.current.close()} // Close the dialog without saving
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 font-custom font-black py-1 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </dialog>
      </div>
    </main>
  );
}

export default Chat;
