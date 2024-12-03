import { useOutletContext } from "react-router-dom";
import { useRef, useState } from "react";
import Dialog from "./Dialog";

function Profile() {
  const { userProfile, setUserProfile, handleLogOut } = useOutletContext();
  const dialogRef = useRef(null);
  const profpicRef = useRef(null);
  const fileInputRef = useRef(null);
  // const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState(null);
  const [filedoc, setFiledoc] = useState(null);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    bio: "",
  });

  const [formError, setFormError] = useState({
    firstname: null,
    lastname: null,
    email: null,
    username: null,
    bio: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(e.target);
  };

  const handleFileChange = (e) => {
    setFiledoc(e.target.files[0]);
  };

  function validateField(input) {
    // Validate input field
    if (!input.checkValidity()) {
      // Set error message based on validity state
      let errorMessage = "";
      if (input.validity.valueMissing) {
        errorMessage = "This field is required";
      } else if (input.validity.tooShort) {
        errorMessage = "Username must be at least 3 characters long.";
      } else if (input.name === "email" && input.validity.typeMismatch) {
        errorMessage = "Enter a valid email address.";
      }

      setFormError((prev) => ({
        ...prev,
        [input.name]: errorMessage,
      }));
    } else {
      // Clear error message if input is valid
      setFormError((prev) => ({
        ...prev,
        [input.name]: null,
      }));
    }
  }

  // Function to open the dialog
  const openDialog = (selectDialog) => {
    if (selectDialog) {
      setFormData({
        firstname: userProfile.firstname,
        lastname: userProfile.lastname,
        email: userProfile.email,
        username: userProfile.username,
        bio: userProfile.status || "",
      });
      dialogRef.current.showModal();
      return;
    }
    profpicRef.current.showModal();
  };

  // Function to close the dialog
  const closeDialog = (selectDialog) => {
    if (selectDialog) {
      setFormError({
        firstname: null,
        lastname: null,
        email: null,
        username: null,
        bio: null,
      });
      dialogRef.current.close();
      return;
    }
    profpicRef.current.close();
    setPhotoError(null);
    fileInputRef.current.value = "";
  };

  function handleReset() {
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      username: "",
      bio: "",
    });

    setFormError({
      firstname: null,
      lastname: null,
      email: null,
      username: null,
      status: null,
    });
  }

  async function handleSubmit(e, selectDialog) {
    e.preventDefault();
    if (!e.target.checkValidity()) {
      return;
    }
    if (selectDialog) {
      closeDialog(selectDialog);
    }
    if (selectDialog) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/profile/${userProfile.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              firstname: formData.firstname,
              lastname: formData.lastname,
              username: formData.username,
              email: formData.email,
              bio: formData.bio,
            }),
          }
        );
        if (!response.ok) {
          const data = await response.json();
          console.log("failed to update user profile", data);
          return;
        }
        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.log("failed to update user profile details", error);
      }
      return;
    }
    // send fetch for profile picture details
    try {
      const token = localStorage.getItem("token");
      const photoFile = new FormData();

      // Append the file and other fields (if necessary) to the FormData object
      photoFile.append("profilepic", filedoc);
      const response = await fetch(
        `http://localhost:3000/profile/${userProfile.id}/upload-photo`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: photoFile,
        }
      );
      if (!response.ok) {
        const data = await response.json();
        setPhotoError(data.error);
        return;
      }
      const data = await response.json();
      setUserProfile(data);
      console.log("pic uploaded", data);
      closeDialog(selectDialog);
    } catch (error) {
      console.log("failed to update user profile details", error);
    }
  }

  async function deleteProfPic() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/profile/${userProfile.id}/upload-photo`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const data = await response.json();
        console.log("failed to delete profile picture", data);
        return;
      }
      const data = await response.json();
      setUserProfile(data);
      console.log("pic deleted", data);
    } catch (error) {
      console.log("failed to delete prof pic", error);
    }
  }

  async function deleteAccount() {
    const delAcc = confirm(
      "Are you sure you want to delete your account? This action can't be reversed!"
    );
    if (!delAcc) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/profile/${userProfile.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const data = await response.json();
        console.log("failed to delete users account", data);
        return;
      }
      const data = await response.json();
      setUserProfile(null);
      console.log("user account deleted", data);
      handleLogOut();
    } catch (error) {
      console.log("failed in fetch to delete users account", error);
    }
  }

  return (
    <main className="min-h-screen p-3 text-white flex flex-col gap-5">
      <h2 className="font-custom font-bold text-lg">My Profile</h2>
      <section className="flex items-center justify-between">
        <div className="flex relative items-center gap-5 w-[100px] h-[100px] lg:w-[150px] lg:h-[150px] rounded-full">
          <div
            className={`${
              userProfile && userProfile.online ? "bg-green-600" : "bg-gray-500"  
            } lg:size-8 md:size-6 size-5 rounded-full absolute bottom-0 right-0`}
          ></div>

          <img
            className="rounded-full h-full object-cover"
            src={
              userProfile && userProfile.profilePicture
                ? userProfile.profilePicture
                : "/default.jpg"
            }
            alt="users profile picture"
          />
          <div className="text-lg">
            {userProfile ? userProfile.username : null}
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => openDialog(false)}>
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
                  d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
                <path
                  d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </button>
          <button onClick={deleteProfPic}>
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
      </section>

      {userProfile && (
        <section className="flex flex-col min-h-screen gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold font-custom text-lg">Details</h2>
            <button onClick={() => openDialog(true)}>
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
                    d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                    stroke="#ffffff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>{" "}
                  <path
                    d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                    stroke="#ffffff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>{" "}
                </g>
              </svg>
            </button>
          </div>
          <div>
            <div className="font-custom font-bold">First Name</div>
            <div>{userProfile.firstname}</div>
          </div>

          <div>
            <div className="font-custom font-bold">Last Name</div>
            <div>{userProfile.lastname}</div>
          </div>

          <div>
            <div className="font-custom font-bold">Username</div>
            <div>{userProfile.username}</div>
          </div>
          <div>
            <div className="font-custom font-bold">Email</div>
            <div>{userProfile.email}</div>
          </div>
          <div>
            <div className="font-custom font-bold">Status</div>
            <div>{userProfile.status}</div>
          </div>

          {/* delete users account */}
          <button
            onClick={deleteAccount}
            className="px-3 py-2 mt-auto max-w-max border-2 border-red-500 font-custom font-bold text-white bg-red-500 hover:bg-transparent hover:text-red-500"
          >
            Delete Account
          </button>

          {/* dialog */}
          <Dialog
            dialogRef={dialogRef}
            profpicRef={profpicRef}
            // photo={photo}
            photoError={photoError}
            handleSubmit={handleSubmit}
            handleReset={handleReset}
            formError={formError}
            formData={formData}
            closeDialog={closeDialog}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            fileInputRef={fileInputRef}
          />
        </section>
      )}
    </main>
  );
}

export default Profile;
