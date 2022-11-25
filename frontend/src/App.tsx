import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import Login from "./screens/login/login";
import MainNavigation from "./components/mainNavigation/mainNavigation";
import { useSelector } from "react-redux";
import Home from "./screens/home/home";
import Friend from "./screens/friends/friends";
import MyProfile from "./screens/myProfile/myProfile";
import Search from "./screens/search/search";
import Messages from "./screens/messages/Messages";
function App() {
  const token = useSelector((state: any) => state.auth.token);
  let routes;
  if (token) {
    routes = (
      <Routes>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/friends" element={<Friend />}></Route>
        <Route path="/myProfile" element={<MyProfile />}></Route>
        <Route path="*" element={<div>NOt found</div>}></Route>
        <Route path="/messages" element={<Messages />}></Route>
        <Route path="/search" element={<Search />}></Route>
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="*" element={<Login />}></Route>
      </Routes>
    );
  }
  return <MainNavigation>{routes}</MainNavigation>;
}

export default App;
