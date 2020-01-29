import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { MsProvider } from "./context/MsContext";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <MsProvider>
    <App />
  </MsProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
