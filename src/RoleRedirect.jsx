import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RoleRedirect() {
  const user = useSelector((state) => state.credentials.user);

  if (user?.role === "admin") return <Navigate to="/inventory" replace />;

  return <Navigate to="/incidentReport" replace />;
}
