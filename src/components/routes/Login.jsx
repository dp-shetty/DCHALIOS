import React from "react";
import { TextFieldComponent } from "../common/TextFieldComponent";
import PortfolioButton from "../common/PortfolioButton";
import { NavLink } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import TelegramIcon from "@mui/icons-material/Telegram";
import { auth, googleProvider, githubProvider } from "../../firebase.js";
import { signInWithPopup } from "firebase/auth";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

function Login() {
  const Navigation = useNavigate();

  const handleContinue = () => {
    Navigation("/login/auth");
  };

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
      <div className="w-1/2 rounded-2xl m-auto flex flex-col items-center text-white backdrop-blur-lg backdrop-saturate-[200%] bg-[rgba(17, 25, 40, 0.6)] border border-[rgba(255, 255, 255, 0.125)] mob:w-11/12 gap-2 py-5">
        <div className="email-div w-full border-b flex justify-center items-center flex-col p-3">
          <TextFieldComponent
            label="email / number"
            name="user_info"
            width={"50%"}
            ipBorderColor={"white"}
            ipLabelColor={"white"}
            required={true}
          />
          <PortfolioButton
            text="CONTINUE"
            className={`border pl-32 border-solid w-1/2 h-12 rounded-full flex items-center justify-between mob:w-11/12 mob:pl-8 mob:mt-4`}
            type={"button"}
            onClick={handleContinue}
          />
        </div>
        <div className="firebase-auth w-full flex flex-col justify-center items-center">
          <PortfolioButton
            text="SIGNUP"
            icon={TelegramIcon}
            className={`border pl-32 mt-4 border-solid w-1/2 h-12 rounded-full flex items-center justify-between mb-7 bg-transparent hover:bg-bgpfp-yellow hover:transition-all hover:duration-bg-transitio`}
            type={"submit"}
          />
          <PortfolioButton
            text="CONTINUE WITH GOOGLE"
            icon={GoogleIcon}
            className={`border pl-16 border-solid w-1/2 h-12 rounded-full flex items-center justify-between mb-7 bg-transparent hover:bg-bgpfp-yellow hover:transition-all hover:duration-bg-transitio`}
            onClick={handleGoogleSignIn}
            type={"button"}
          />
          <PortfolioButton
            text="CONTINUE WITH GITHUB"
            icon={GitHubIcon}
            className={`border pl-16 border-solid w-1/2 h-12 rounded-full flex items-center justify-between mb-7 bg-transparent hover:bg-bgpfp-yellow hover:transition-all hover:duration-bg-transitio`}
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
  );
}

export default Login;
