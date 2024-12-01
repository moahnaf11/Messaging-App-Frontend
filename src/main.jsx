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
      { path: "settings", element: <Settings /> },
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
