import { Navigate, useOutletContext } from "react-router-dom";

function AuthRoute({ children }) {
  const { isLoggedIn } = useOutletContext();
  if (isLoggedIn) {
    return children;
  }
  return <Navigate to="/home" />;
}

export default AuthRoute;
