import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login.jsx";
import LandingPage from "./LandingPage.jsx";
import Register from "./Register.jsx";
import ForgotPassword from "./forgotPassword.jsx";
import ResetPassword from "./ResetPassword.jsx";
import Chat from "./Chat.jsx";
import AuthRoute from "./AuthRoute.jsx";
import Settings from "./Settings.jsx";
import Profile from "./Profile.jsx";
import ChangePassword from "./ChangePassword.jsx";
import Friends from "./Friends.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <AuthRoute>
            <Chat />
          </AuthRoute>
        ),
      },
      // children of Chat
      {
        path: "friends",
        element: (
          <AuthRoute>
            <Chat />
          </AuthRoute>
        ),
        children: [{ index: true, element: <Friends /> }],
      },
      {
        path: "settings",
        element: <Settings />,
        children: [
          { index: true, element: <Profile /> },
          { path: "change-password", element: <ChangePassword /> },
        ],
      },
      {
        path: "home",
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "register",
        element: <Register />,
      },
      { path: "reset-password/:resetToken", element: <ResetPassword /> },
    ],
  },
]);

const route = createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
