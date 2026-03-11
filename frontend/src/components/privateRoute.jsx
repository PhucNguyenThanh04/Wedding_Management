import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to={"/dashboard/login"} />;
  }

  if (["owner", "admin", "staff"].includes(user.role)) {
    return children;
  }

  return <Navigate to={"/"} />;
};

export default PrivateRoute;
