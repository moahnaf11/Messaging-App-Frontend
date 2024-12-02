function Dialog({
  dialogRef,
  handleSubmit,
  handleReset,
  closeDialog,
  formData,
  formError,
  handleChange,
  profpicRef,
  photoError,
  handleFileChange,
  fileInputRef,
}) {
  return (
    <>
      <dialog
        ref={dialogRef}
        className="md:min-w-[40%] min-w-[85%] self-center rounded-md"
      >
        <form
          noValidate
          onSubmit={(e) => handleSubmit(e, true)}
          onReset={handleReset}
          action="#"
          className="bg-white p-3 flex rounded-md flex-col gap-5"
        >
          <div className="flex justify-between items-center">
            <h2 className="font-custom font-bold text-lg">Update profile</h2>
            <button type="button" onClick={() => closeDialog(true)}>
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
            <label htmlFor="firstname">
              First Name <span className="text-red-800">*</span>
            </label>
            <input
              className="border-black border-[3px] flex-1 rounded-full px-2 pr-14 py-1"
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={(e) => handleChange(e)}
              placeholder="firstname"
              required
            />
            <span className="text-red-600">{formError.firstname}</span>
          </div>

          <div className="flex flex-col">
            <label htmlFor="lastname">
              Last Name <span className="text-red-800">*</span>
            </label>
            <input
              className="border-black border-[3px] flex-1 rounded-full px-2 pr-14 py-1"
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={(e) => handleChange(e)}
              placeholder="lastname"
              required
            />
            <span className="text-red-600">{formError.lastname}</span>
          </div>

          <div className="flex flex-col">
            <label htmlFor="username">
              Username <span className="text-red-800">*</span>
            </label>
            <input
              className="border-black border-[3px] flex-1 rounded-full px-2 pr-14 py-1"
              type="text"
              id="username"
              name="username"
              value={formData.username}
              minLength={3}
              onChange={(e) => handleChange(e)}
              placeholder="username"
              required
            />
            <span className="text-red-600">{formError.username}</span>
          </div>

          <div className="flex flex-col">
            <label htmlFor="email">
              Email <span className="text-red-800">*</span>
            </label>
            <input
              className="border-black border-[3px] flex-1 rounded-full px-2 pr-14 py-1"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleChange(e)}
              placeholder="email@example.com"
              required
            />
            <span className="text-red-600">{formError.email}</span>
          </div>

          <div className="flex flex-col">
            <label htmlFor="bio">
              Bio <span className="text-red-800">*</span>
            </label>
            <input
              className="border-black border-[3px] flex-1 rounded-full px-2 pr-14 py-1"
              type="text"
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={(e) => handleChange(e)}
              placeholder="bio"
              required
            />
            <span className="text-red-600">{formError.bio}</span>
          </div>

          <div className="flex justify-center gap-5">
            <button
              type="submit"
              className="px-3 py-2 rounded-full bg-green-500 font-custom font-bold border-2 border-green-500 flex-1 text-white hover:bg-white hover:text-black"
            >
              Submit
            </button>
            <button
              type="reset"
              className="px-3 py-2 rounded-full bg-gray-500 font-custom font-bold border-2 border-gray-500 flex-1 text-white hover:bg-white hover:text-black"
            >
              Clear
            </button>
          </div>
        </form>
      </dialog>

      {/* updating prof pic dialog*/}
      <dialog
        ref={profpicRef}
        className="md:min-w-[40%] min-w-[85%] self-center rounded-md"
      >
        <form
          onSubmit={(e) => handleSubmit(e, false)}
          noValidate
          action="#"
          enctype="multipart/form-data"
          className="bg-white p-3 flex rounded-md flex-col gap-5"
        >
          <div className="flex justify-between items-center">
            <h2 className="font-custom font-bold text-lg">
              Upload Profile Picture
            </h2>
            <button type="button" onClick={() => closeDialog(false)}>
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
          <input
            className="max-w-max"
            type="file"
            ref={fileInputRef}
            name="profilepic"
            onChange={(e) => handleFileChange(e)}
          />
          <span className="text-red-600">{photoError}</span>
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
    </>
  );
}

export default Dialog;
