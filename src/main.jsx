import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/styles/landing.css";
import "./assets/styles/admin.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ensureSeedData, getState, saveState } from "./utils/storage.js";
import {
  getFirebaseState,
  isFirebaseActive,
  subscribeFirebaseState
} from "./services/firebaseStore.js";

async function prepareData() {
  ensureSeedData();

  if (!isFirebaseActive()) {
    console.warn("Firebase belum aktif. Aplikasi memakai localStorage.");
    return;
  }

  try {
    const remoteState = await getFirebaseState();

    if (remoteState) {
      saveState(
        {
          ...getState(),
          ...remoteState
        },
        { silent: true }
      );
    }

    console.info("Firebase aktif. Data dibaca dari Firestore.");
  } catch (error) {
    console.warn("Firebase gagal dimuat. Cek .env.local atau Firestore Rules.", error);
  }
}

function renderApp() {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );

  if (isFirebaseActive()) {
    subscribeFirebaseState((collectionName, rows) => {
      const currentState = getState();

      saveState(
        {
          ...currentState,
          [collectionName]: rows
        },
        { silent: false }
      );
    });
  }
}

prepareData().finally(renderApp);