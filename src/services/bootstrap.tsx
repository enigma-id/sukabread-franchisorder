import { store } from "./store";
import { logout, setCredentials } from "./auth/slice";
import { authApi } from "./auth/api";

export const bootstrap = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");
  if (username) {
    console.log("Bootstrap: Performing seamless login for", username);

    // 1. Sign out current session to ensure clean state
    store.dispatch(logout());

    // 2. Perform seamless login with dev token as per spec
    const payload = {
      identifier: username,
      token: "GMOH6YbLKhcOrBOW1iV4WZOIhnrC7dom",
    };

    // Use the mutation for seamless login
    try {
      const res = await store
        .dispatch(authApi.endpoints.seamless.initiate(payload))
        .unwrap();
      if (res?.message === "success") {
        store.dispatch(setCredentials(res?.data));
      }
    } catch (error) {
      console.error("Bootstrap: Seamless login failed", error);
      store.dispatch(logout());
    }
  }
  // else {
  //   // Check if we have a token but need to refresh user data
  //   const state = store.getState();
  //   if (state.auth.session?.access_token && !state.auth.session?.user) {
  //     try {
  //       await store.dispatch(authApi.endpoints.getMe.initiate()).unwrap();
  //     } catch (error) {
  //       console.error("Bootstrap: GetMe failed", error);
  //       store.dispatch(logout());
  //     }
  //   }
  // }

  // Signal app is ready
  console.log("Bootstrap: App ready");
};
