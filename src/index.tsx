import React from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { rootSaga } from "./modules";
import { rangerSagas } from "./modules/public/ranger";
import { rangerMiddleware, sagaMiddleware, store } from "./store";
import { WrappedComponentProps } from "react-intl";
import { defineCustomElements } from "@ionic/pwa-elements/loader";

const container = document.getElementById("root");
const root = createRoot(container!);

const themes = localStorage.getItem("colorTheme") || "dark";
if (themes === "dark") {
  document.body.classList.remove("light-mode");
  document.body.classList.add("dark-mode");
} else {
  document.body.classList.remove("dark-mode");
  document.body.classList.add("light-mode");
}

sagaMiddleware.run(rootSaga);
rangerMiddleware.run(rangerSagas);

export type IntlProps = WrappedComponentProps;

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
defineCustomElements(window);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
