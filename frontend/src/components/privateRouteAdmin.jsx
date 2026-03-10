import { Navigate } from "react-router-dom";
import { useAdmin } from "../hooks/useAdmin";

const PrivateRouteAdmin = ({ children }) => {
  const { admin, isLoading } = useAdmin();

  if (isLoading) return <div>Loading...</div>;

  if (!admin) return <Navigate to="/dashboard/login" />;

  return children;
};

export default PrivateRouteAdmin;
