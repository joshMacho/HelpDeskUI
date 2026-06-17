import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import UnAuthorizedPage from "./pages/UnAuthorizedPage";

export default function AdminRoute() {
  const credentials = useSelector((state) => state.credentials);

  const isAdmin = credentials?.user?.role === "admin";

  return isAdmin ? <Outlet /> : <UnAuthorizedPage />;
}
