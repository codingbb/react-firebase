import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Nav from "./Nav";
import Profile from "../routes/Profile";

const AppRouter = ({ isLoggedIn, userObj }) => {
  return (
    <>
      <h1>Post Board</h1>
      {isLoggedIn && <Nav />}
      <Routes>
        {isLoggedIn ? (
          <>
            {/* 로그인 정보 있으면 이쪽  */}
            <Route path="/" element={<Home userObj={userObj} />} />
            <Route path="/profile" element={<Profile />} />
          </>
        ) : (
          // 로그인 정보 없으면 이쪽
          <Route path="/" element={<Auth />} />
        )}
      </Routes>
    </>
  );
};

export default AppRouter;
