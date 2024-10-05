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

function Signup() {
  const Navigation = useNavigate();
  const [emailData,setEmailData] = useState()
  const [emailValidation,setEmailValidation] = useState(false)
  const [inputBorderColor, setInputBorderColor] = useState("white");

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i

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
      sessionStorage.setItem("userEmail", emailData);
      Navigation("/signup/auth");
    } else {
      toast.error("Invalid email address!");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      toast.success("Google sign-in successful!");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Failed to sign in with Google. Please try again.");
    }
  };

  // Function to handle GitHub sign-in
  const handleGithubSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      toast.success("GitHub sign-in successful!");
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      toast.error("Failed to sign in with GitHub. Please try again.");
    }
  };
  return (
    <>
      <section className="w-screen h-screen flex bg-landing-bg-image bg-no-repeat bg-center bg-cover">
      <Toaster/>
        <div className="w-1/4 rounded-2xl m-auto flex flex-col items-center text-white backdrop-blur-lg backdrop-saturate-[200%] bg-[rgba(17, 25, 40, 0.6)] border border-[rgba(255, 255, 255, 0.125)] mob:w-11/12 gap-2 py-5">
          <TextFieldComponent
            label="email"
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
            className={`border pl-24 border-solid w-11/12 h-12 rounded-full flex items-center justify-between mob:w-11/12 mob:pl-8 mob:mt-4`}
            type={"button"}
            onClick={handleSignup}
          />
          <div className="border-b w-full flex justify-center items-center gap-8 pb-3">
            <p>alredy a user ??</p>
            <NavLink to={"/login"}>Login Here</NavLink>
          </div>
          <div className="firebase-auth w-full flex flex-col justify-center items-center">
            <PortfolioButton
              text="CONTINUE WITH GOOGLE"
              icon={GoogleIcon}
              className={`border mob:w-11/12 mob:pl-4 pl-3 border-solid w-3/4 h-12 rounded-full flex items-center justify-between mb-7 bg-transparent hover:bg-bgpfp-yellow hover:transition-all hover:duration-bg-transitio`}
              onClick={handleGoogleSignIn}
              type={"button"}
            />
            <PortfolioButton
              text="CONTINUE WITH GITHUB"
              icon={GitHubIcon}
              className={`border mob:w-11/12 mob:pl-4 pl-5 border-solid w-3/4 h-12 rounded-full flex items-center justify-between mb-7 bg-transparent hover:bg-bgpfp-yellow hover:transition-all hover:duration-bg-transitio`}
              onClick={handleGithubSignIn}
              type={"button"}
            />
          </div>
          <div className="back w-full flex justify-center items-center gap-5">
            <ArrowBackIcon />
            <NavLink to={"/"}> GO BACK</NavLink>
          </div>
        </div>
      </section>
    </>
  );
}

export default Signup;
