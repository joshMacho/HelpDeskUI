import { lazy } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const UnAuthorizedPage = lazy(() => import("./pages/UnAuthorizedPage.jsx"));

export default function AdminRoute() {
  const credentials = useSelector((state) => state.credentials);

  const isAdmin = credentials?.user?.role === "admin";

  return isAdmin ? <Outlet /> : <UnAuthorizedPage />;
}
