import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./Pages/Main";
import Index from "./Pages/Index";
import Profile from "./Pages/Profile";
import Recommended from "./Pages/Recommended";
import List from "./Pages/List";
import SingleItem from "./Pages/SingleItem";
import Login from "./Pages/Login";
import Add from "./Pages/Add";
import ProfileChange from "./Pages/ProfileChange";
import MessagesPage from "./Pages/Messages";

const root = ReactDOM.createRoot(document.getElementById("root"));

const rooter = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/register",
    element: <Main />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/list",
    element: <List />,
  },
  {
    path: "/singleItem/:id",
    element: <SingleItem />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/add",
    element: <Add />,
  },
  {
    path: "/recommended",
    element: <Recommended />,
  },
  {
    path: "/profileChange",
    element: <ProfileChange />,
  }, {
    path: "/messages",
    element: <MessagesPage />,
  },
]);
root.render(
  <React.StrictMode>
    <RouterProvider router={rooter} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
