import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedRouteAdmin = ({ children }) => {
  const { isAuthenticated } = useSelector((store) => store.auth);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};
