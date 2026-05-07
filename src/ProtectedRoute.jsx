import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingModal from "./components/LoadingModal";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const credentials = useSelector((state) => state.credentials);

  if (credentials.userLoading)
    return (
      <LoadingModal message={`Logging In`} open={credentials.userLoading} />
    );

  return credentials.user ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}
