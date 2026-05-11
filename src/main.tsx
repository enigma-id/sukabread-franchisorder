import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { persistor, store } from "@/services/store";
import App from "./App.tsx";
import "./index.css";
import { EnigmaProvider, ToastContainer } from "@/components";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <EnigmaProvider>
            <ToastContainer />
            <App />
          </EnigmaProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
