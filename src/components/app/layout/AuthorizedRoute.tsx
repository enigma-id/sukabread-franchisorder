import { useSelector } from "react-redux";
import type { RootState } from "@/services/store";
import { Navigate, Outlet } from "react-router-dom";

const AuthorizedRoute = () => {
  const authenticated = useSelector(
    (state: RootState) => state.auth.authenticated,
  );

  if (!authenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default AuthorizedRoute;
