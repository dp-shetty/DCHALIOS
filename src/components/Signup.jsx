import React, { useState } from "react";
import { TextFieldComponent } from "./common/TextFieldComponent";
import toast, { Toaster } from "react-hot-toast";
import PortfolioButton from "./common/PortfolioButton";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import { auth, googleProvider, githubProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode"; // Correct import
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const [emailData, setEmailData] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailValidation, setEmailValidation] = useState(false);
  const [inputBorderColor, setInputBorderColor] = useState("white");

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = ({ target: { value } }) => {
    if (emailRegex.test(value)) {
      setEmailData(value);
      setEmailValidation(true);
      setInputBorderColor("white");
    } else {
      setInputBorderColor("red");
      setEmailValidation(false);
    }
  };

  const handleSignup = () => {
    if (emailValidation) {
      sessionStorage.setItem("signupEmail", emailData);
      navigate("/signup/auth");
    } else {
      toast.error("Invalid email address!");
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const { email, emailVerified, photoURL, displayName } = user;
      const provider = "google";
      await checkEmailInDatabase(
        email,
        provider,
        user.providerId,
        emailVerified,
        photoURL,
        displayName
      );
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      const { email, emailVerified, photoURL, displayName } = user;
      const provider = "github";
      await checkEmailInDatabase(
        email,
        provider,
        user.providerId,
        emailVerified,
        photoURL,
        displayName
      );
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      toast.error("Failed to sign in with GitHub. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkEmailInDatabase = async (
    loggedEmail,
    provider,
    providerId,
    isVerified,
    profilePicture,
    displayName
  ) => {
    try {
      const { data: emailUsers } = await axios.get(`${backendUrl}/email-users`);
      const { data: socialUsers } = await axios.get(`${backendUrl}/social-users`);

      const userExists = emailUsers.some(({ email }) => email === loggedEmail);
      const socialUsersExist = socialUsers.some(({ email }) => email === loggedEmail);

      if (userExists || socialUsersExist) {
        const token = Cookies.get("authToken");
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {
              navigate("/login");
            } else {
              navigate("/dchalios-ai");
            }
          } catch (error) {
            console.error("Invalid token:", error);
            navigate("/login");
          }
        } else {
          navigate("/login");
        }

        toast.success(`Welcome Back ${displayName}!`);
      } else {
        await saveNewSocialUser(
          loggedEmail,
          provider,
          providerId,
          isVerified,
          profilePicture,
          displayName
        );
      }
    } catch (error) {
      console.error("Error checking email in database:", error);
    }
  };

  const saveNewSocialUser = async (
    email,
    provider,
    providerId,
    isVerified,
    profilePicture,
    displayName
  ) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/social-users`,
        {
          email,
          provider,
          providerId,
          isVerified,
          profilePicture,
          displayName,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.JWT_Token) {
        Cookies.set("authToken", data.JWT_Token, {
          expires: 7, // 7 days expiration
          secure: true,
          sameSite: "None",
        });
        toast.success(`Welcome To Dchalios AI ${displayName}!`);
        setTimeout(() => {
          navigate("/dchalios-ai");
        }, 3500);
      }
    } catch (error) {
      console.error("Error saving new user:", error);
    }
  };

  return (
    <section className="w-screen h-screen flex bg-landing-bg-image bg-no-repeat bg-center bg-cover">
      <Toaster />
      <div className="w-1/4 rounded-2xl m-auto flex flex-col items-center text-white backdrop-blur-lg bg-[rgba(17, 25, 40, 0.6)] border border-[rgba(255, 255, 255, 0.125)] mob:w-11/12 gap-2 py-5">
        <div className="w-full flex flex-col justify-center items-center gap-5">
          <TextFieldComponent
            label="Email"
            name="user_info"
            width={"90%"}
            ipBorderColor={"white"}
            ipLabelColor={"white"}
            required={false}
            onChange={handleChange}
            inputBorderColor={inputBorderColor}
          />
          <PortfolioButton
            text="CONTINUE"
            className="border pl-24 w-11/12 h-12 rounded-full flex items-center justify-between mob:w-11/12"
            type="button"
            onClick={handleSignup}
          />
          <div className="border-b w-full flex justify-center items-center gap-8 pb-3">
            <p>Already a user?</p>
            <NavLink to="/login">Login Here</NavLink>
          </div>
        </div>
        <div className="firebase-auth w-full flex flex-col items-center justify-center py-3 gap-4">
          <PortfolioButton
            text="CONTINUE WITH GOOGLE"
            icon={GoogleIcon}
            className="border mob:w-11/12 pl-3 w-3/4 h-12 rounded-full flex items-center justify-between bg-transparent hover:bg-bgpfp-yellow"
            onClick={handleGoogleSignIn}
            type="button"
          />
          <PortfolioButton
            text="CONTINUE WITH GITHUB"
            icon={GitHubIcon}
            className="border mob:w-11/12 pl-5 w-3/4 h-12 rounded-full flex items-center justify-between bg-transparent hover:bg-bgpfp-yellow"
            onClick={handleGithubSignIn}
            type="button"
          />
        </div>
        <div className="back w-full flex justify-center items-center gap-5">
          <ArrowBackIcon />
          <NavLink to="/">GO BACK</NavLink>
        </div>
      </div>
    </section>
  );
}

export default Signup;
