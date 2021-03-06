import App from "./App";
import { config } from "./firebaseConfig";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import "@fontsource/roboto";
import { Slide } from "@material-ui/core";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

firebase.initializeApp(config);

ReactDOM.render(
  <>
    {/* SnackbarProvider allows components to access snackbar actions */}
    <SnackbarProvider
      maxSnack={2}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center"
      }}
      TransitionComponent={Slide}
      autoHideDuration={2500}
    >
      {/* The router is responsible for handling react-router-dom stuff */}
      <Router>
        {/* Render our App :) */}
        <App />
      </Router>
    </SnackbarProvider>
  </>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
