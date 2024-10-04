import React from "react";
import { TextFieldComponent } from "../common/TextFieldComponent";
import toast, { Toaster } from "react-hot-toast";
import PortfolioButton from "../common/PortfolioButton";
import { NavLink } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import TelegramIcon from "@mui/icons-material/Telegram";
import { auth, googleProvider, githubProvider } from "../../firebase.js";
import { signInWithPopup } from "firebase/auth";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

function PasswordAuth() {
  const Navigation = useNavigate();

  const handleContinue = () => {
    Navigation("/login/auth");
  };

  const handleSignup = ()=>{
    Navigation("/signup");
  }

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Do something with the user info, e.g., set it in context or save it to your backend
      setUserData({
        user_name: user.displayName,
        user_email: user.email,
      });
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
      const user = result.user;
      // Do something with the user info, e.g., set it in context or save it to your backend
      setUserData({
        user_name: user.displayName,
        user_email: user.email,
      });
      toast.success("GitHub sign-in successful!");
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      toast.error("Failed to sign in with GitHub. Please try again.");
    }
  };

  return (
    <section className="w-screen h-screen flex bg-landing-bg-image bg-no-repeat bg-center bg-cover">
    <Toaster/>
      <div className="w-1/4 mob:w-11/12 mob:gap-1 mob:py-2 rounded-2xl m-auto flex flex-col items-center text-white backdrop-blur-lg backdrop-saturate-[200%] bg-[rgba(17, 25, 40, 0.6)] border border-[rgba(255, 255, 255, 0.125)] gap-2 py-5">
        <div className="email-div w-full border-b flex justify-center items-center flex-col p-3 gap-3 mob:gap-1 mob:p-1">
          <TextFieldComponent
            label="email / number"
            name="user_info"
            width={"90%"}
            ipBorderColor={"white"}
            ipLabelColor={"white"}
            required={false}
            disable={true}
          />
          <TextFieldComponent
            label="Password"
            name="user_info"
            width={"90%"}
            ipBorderColor={"white"}
            ipLabelColor={"white"}
            required={true}
          />
          <PortfolioButton
            text="CONTINUE"
            className={`border pl-24 border-solid w-11/12 h-12 rounded-full flex items-center justify-between mob:w-11/12 mob:pl-8 mob:mt-4`}
            type={"button"}
            onClick={handleContinue}
          />
          <div className="w-full flex items-center justify-center">
            <NavLink>Forget Password?</NavLink>
          </div>
        </div>
        <div className="firebase-auth w-full flex flex-col justify-center items-center">
          <PortfolioButton
            text="SIGNUP"
            icon={TelegramIcon}
            className={`border mob:w-11/12 mob:pl-6 pl-24 mt-4 border-solid w-3/4 h-12 rounded-full flex items-center justify-between mb-7 bg-transparent hover:bg-bgpfp-yellow hover:transition-all hover:duration-bg-transitio`}
            type={"submit"}
            onClick={handleSignup}
          />
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
            className={`border mob:w-11/12 mob:pl-4 pl-5 border-solid w-3/4 h-12 rounded-full flex items-center justify-between mb-7 mob:mb-3 bg-transparent hover:bg-bgpfp-yellow hover:transition-all hover:duration-bg-transitio`}
            onClick={handleGithubSignIn}
            type={"button"}
          />
        </div>
        <div className="back w-full flex justify-center items-center gap-5 mob:mb-1">
          <ArrowBackIcon />
          <NavLink to={"/login"}> GO BACK</NavLink>
        </div>
      </div>
    </section>
  );
}

export default PasswordAuth;
