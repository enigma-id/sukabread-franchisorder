import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/services/store";

const UnauthorizedRoute = () => {
  const authenticated = useSelector(
    (state: RootState) => state.auth.authenticated,
  );

  if (authenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default UnauthorizedRoute;
