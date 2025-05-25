import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedRouteClient = ({ children }) => {
  const { isAuthenticated } = useSelector((store) => store.client);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};
