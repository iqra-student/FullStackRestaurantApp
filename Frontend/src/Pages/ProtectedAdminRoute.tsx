import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const ProtectedAdminRoute = ({ children }: Props) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "Admin") {
    return <Navigate to="/adminlogin" />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
