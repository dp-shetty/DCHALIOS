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
  const [emailData, setEmailData] = useState();
  const [loading, setLoading] = useState(false);
  const [emailValidation, setEmailValidation] = useState(false);
  const [inputBorderColor, setInputBorderColor] = useState("white");

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

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
      Navigation("/signup/auth");
    } else {
      toast.error("Invalid email address!");
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userData = user.reloadUserInfo;
      const email = userData.email;
      const provider = "google";
      const providerId = user.providerId;
      const emailVerified = userData.emailVerified;
      const photoURL = userData.photoURL;
      const displayName = userData.displayName;
      await checkEmailInDatabase(
        email,
        provider,
        providerId,
        emailVerified,
        photoURL,
        displayName
      );
      window.location.replace("https://dchalios.vercel.app/dchalios-ai");
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
      const userData = user.reloadUserInfo;
      const email = userData.email;
      const provider = "github";
      const providerId = user.providerId;
      const emailVerified = userData.emailVerified;
      const photoURL = userData.photoURL;
      const displayName = userData.displayName;
      await checkEmailInDatabase(
        email,
        provider,
        providerId,
        emailVerified,
        photoURL,
        displayName
      );
      window.location.replace("https://dchalios.vercel.app/dchalios-ai");
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
      const { data } = await axios.get(`${backUrl}/signed-users`);
      const socialUserResponse = await axios.get(`${backUrl}/social-users`);
      const userExists = data.some(({ email }) => email === loggedEmail);
      const socialUsersExist = socialUserResponse.data.some(
        ({ email }) => email === loggedEmail
      );
      if (userExists || socialUsersExist) {
        console.log("Email exists in the database:", loggedEmail);
        toast.success(`Welcome Back ${displayName} !`);
      } else {
        console.log("Email does not exist in the database:", loggedEmail);
        const newUser = {
          email: loggedEmail,
          provider,
          providerId,
          isVerified,
          profilePicture,
          displayName,
        };
        toast.success(`Welcome To Dchalios AI ${displayName} !`);
        await axios.post(`${backUrl}/social-users`, newUser);
      }
    } catch (error) {
      console.error("Error checking email in database:", error);
    }
  };
  return (
    <>
      <section className="w-screen h-screen flex bg-landing-bg-image bg-no-repeat bg-center bg-cover">
        <Toaster />
        <div className="w-1/4 rounded-2xl m-auto flex flex-col items-center text-white backdrop-blur-lg backdrop-saturate-[200%] bg-[rgba(17, 25, 40, 0.6)] border border-[rgba(255, 255, 255, 0.125)] mob:w-11/12 gap-2 py-5">
          <div className="w-full flex flex-col justify-center items-center gap-5 ">
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
          </div>
          <div className="firebase-auth w-full flex flex-col items-center justify-center py-3 gap-4">
            <PortfolioButton
              text="CONTINUE WITH GOOGLE"
              icon={GoogleIcon}
              className={`border mob:w-11/12 mob:pl-4 pl-3 border-solid w-3/4 h-12 rounded-full flex items-center justify-between bg-transparent hover:bg-bgpfp-yellow hover:transition-all hover:duration-bg-transitio`}
              onClick={handleGoogleSignIn}
              type={"button"}
            />
            <PortfolioButton
              text="CONTINUE WITH GITHUB"
              icon={GitHubIcon}
              className={`border mob:w-11/12 mob:pl-4 pl-5 border-solid w-3/4 h-12 rounded-full flex items-center justify-between bg-transparent hover:bg-bgpfp-yellow hover:transition-all hover:duration-bg-transitio`}
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
