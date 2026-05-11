import { store } from "./store";
import { $signout } from "./auth/slice";
import { authApi } from "./auth/api";

export const bootstrap = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");
  console.log(username, "username");
  if (username) {
    console.log("Bootstrap: Performing seamless login for", username);

    // 1. Sign out current session to ensure clean state
    store.dispatch($signout());

    // 2. Perform seamless login with dev token as per spec
    const payload = {
      username,
      token: "GMOH6YbLKhcOrBOW1iV4WZOIhnrC7dom",
    };

    // Use the mutation for seamless login
    try {
      const result = await store
        .dispatch(authApi.endpoints.seamless.initiate(payload))
        .unwrap();
      console.log("Bootstrap: Seamless login successful", result);
    } catch (error) {
      console.error("Bootstrap: Seamless login failed", error);
      store.dispatch($signout());
    }
  } else {
    // Check if we have a token but need to refresh user data
    const state = store.getState();
    if (state.auth.token && !state.auth.user) {
      try {
        await store.dispatch(authApi.endpoints.getMe.initiate()).unwrap();
      } catch (error) {
        console.error("Bootstrap: GetMe failed", error);
        store.dispatch($signout());
      }
    }
  }

  // Signal app is ready
  console.log("Bootstrap: App ready");
};
