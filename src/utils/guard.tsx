import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/services/store";

export function withGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  redirectTo: string,
): React.ComponentType<P> {
  const GuardedComponent = (props: P) => {
    const location = useLocation();

    const isLoggedIn = useSelector(
      (state: RootState) => state.auth.authenticated,
    );

    if (!isLoggedIn) {
      // redirect ke login dengan query param fallback (current location)
      return (
        <Navigate
          to={`${redirectTo}?fallback=${encodeURIComponent(location.pathname)}`}
          replace
        />
      );
    }

    return <WrappedComponent {...props} />;
  };

  return GuardedComponent;
}
