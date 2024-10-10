import React, { useState } from "react";
import { TextFieldComponent } from "../common/TextFieldComponent";
import toast, { Toaster } from "react-hot-toast";
import PortfolioButton from "../common/PortfolioButton";
import { NavLink } from "react-router-dom";
import { auth, googleProvider, githubProvider } from "../../firebase.js";
import { signInWithPopup } from "firebase/auth";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function PasswordAuth() {
  const [loginEmail, setLoginEmail] = useState(
    sessionStorage.getItem("loginEmail") || ""
  );
  const [passwordData, setPasswordData] = useState("");
  const Navigation = useNavigate();
  const backUrl = import.meta.env.VITE_BACKEND_URL;

  const handleContinue = async () => {
    try {
      const { data } = await axios.get(`${backUrl}/email-users`, {
        withCredentials: true,
      });
      const storedPassword = data.some(
        ({ password }) => password === passwordData
      );

      if (storedPassword) {
        const { data } = await axios.post(
          `${backUrl}/loginverify`,
          {
            email: loginEmail,
            password: passwordData,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Check if the response contains the token
        if (data.JWT_Token) {
          Cookies.set("authToken", data.JWT_Token, {
            expires: 7,
            secure: true,
            sameSite: "None",
            secure: true,
          });
          toast.success("Login successful!");
          setTimeout(() => {
            navigate("/dchalios-ai");
          }, 3500);
        }
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      toast.error("Failed to authenticate.");
    }
  };

  const handleForgotPassword = async () => {
    if (!loginEmail) {
      toast.error("Please enter your email to reset your password.");
      return;
    }
    try {
      const response = await axios.post(`${backUrl}/reset-password`, {
        email: loginEmail,
      });
      toast.success(response.data.message);
      window.location.replace("https://reset-green.vercel.app/");
    } catch (error) {
      console.error("Error sending reset password email:", error);
      toast.error("Failed to send reset password email.");
    }
  };

  return (
    <section className="w-screen h-screen flex bg-landing-bg-image bg-no-repeat bg-center bg-cover">
      <Toaster />
      <div className="w-1/4 mob:w-11/12 mob:gap-1 mob:py-2 rounded-2xl m-auto flex flex-col items-center text-white backdrop-blur-lg backdrop-saturate-[200%] bg-[rgba(17, 25, 40, 0.6)] border border-[rgba(255, 255, 255, 0.125)] gap-5 py-5">
        <div className="email-div w-full border-b flex justify-center items-center flex-col p-3 gap-3 mob:gap-1 mob:p-1 mb-2">
          <TextFieldComponent
            label="email"
            name="user_info"
            width={"90%"}
            ipBorderColor={"white"}
            ipLabelColor={"white"}
            required={false}
            disable={true}
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <TextFieldComponent
            label="Password"
            name="user_info"
            width={"90%"}
            ipBorderColor={"white"}
            ipLabelColor={"white"}
            required={true}
            onChange={(e) => setPasswordData(e.target.value)}
            type="password"
          />
          <PortfolioButton
            text="CONTINUE"
            className={`border pl-24 border-solid w-11/12 h-12 rounded-full flex items-center justify-between mob:w-11/12 mob:pl-8 mob:mt-4`}
            type={"button"}
            onClick={handleContinue}
          />
          <div className="w-full flex items-center justify-center mb-3">
            <button onClick={handleForgotPassword}>Forgot Password?</button>
          </div>
        </div>
        <div className="back w-full flex justify-center items-center gap-5 mob:mb-1">
          <ArrowBackIcon />
          <NavLink to={"/signup"}> GO TO SIGNUP</NavLink>
        </div>
      </div>
    </section>
  );
}

export default PasswordAuth;
