import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

const PrivateRouteUser = ({ children }) => {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/" />;

  return children;
};

export default PrivateRouteUser;
