import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Landing from "../Landing/Landing";
import PasswordAuth from "./PasswordAuth";
import Signup from "../Signup";
import SignupAuth from "./SignupAuth";
import Home from "../Home";

function MyRoutes() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/login/auth" element={<PasswordAuth />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/signup/auth" element={<SignupAuth />}></Route>
          <Route path="/dchalios-ai" element={<Home />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default MyRoutes;
