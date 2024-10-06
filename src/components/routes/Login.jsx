import React, { useState } from "react";
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
import axios from "axios";

function Login() {
  const [emailData, setEmailData] = useState("");
  const [emailValidation, setEmailValidation] = useState(false);
  const [inputBorderColor, setInputBorderColor] = useState("white");
  const backUrl = import.meta.env.VITE_BACKEND_URL;

  const Navigation = useNavigate();

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

  const handleContinue = async () => {
    try {
      if (emailValidation) {
        const { data } = await axios.get(`${backUrl}/signed-users`);
        const storedMail = data.some(({ email }) => email === emailData);

        if (storedMail) {
          sessionStorage.setItem("loginEmail", emailData);
          toast.success("Email found. Proceeding to authentication", {
            style: {
              width: "25rem",
              maxWidth: "800px",
            },
            duration: 3000,
          });

          setTimeout(() => {
            Navigation("/login/auth");
          }, 5000);
        } else {
          toast.error("Email not found. Please sign up.");
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to retrieve user data.");
    }
  };

  const handleSignup = () => {
    Navigation("/signup");
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const email = result.user.email
      const provider = "google"
      const providerId = result.user.providerId
      const emailVerified = result.user.emailVerified
      const photoURL = result.user.photoURL
      const displayName = result.user.displayName
      
      toast.success("Google sign-in successful!");
      await checkEmailInDatabase(email,provider,providerId,emailVerified,photoURL,displayName);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Failed to sign in with Google. Please try again.");
    }
  };

  const checkEmailInDatabase = async(loggedEmail,provider,providerId,isVerified,profilePicture,displayName)=>{
    try {
      const {data} = await axios.get(`${backUrl}/signed-users`)
      const socialUserResponse = await axios.get(`${backUrl}/social-users`)
      const userExists = data.some(({email}) => email === loggedEmail);
      const socialUsersExist = socialUserResponse.data.some(({email}) => email === loggedEmail);
      if (userExists || socialUsersExist ) {
        console.log('Email exists in the database:', loggedEmail);
        toast.success("Proceeding with the application")
      } else {
        console.log('Email does not exist in the database:', loggedEmail);
        const newUser = {
          email: loggedEmail,
          provider,
          providerId,
          isVerified,
          profilePicture,
          displayName
        };
        await axios.post(`${backUrl}/social-users`, newUser)
        // Handle the case where the email does not exist (e.g., allow registration)
      }
    } catch (error) {
      console.error('Error checking email in database:', error);
    }
  }

  // Function to handle GitHub sign-in
  const handleGithubSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      console.log(user);
      toast.success("GitHub sign-in successful!");
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      toast.error("Failed to sign in with GitHub. Please try again.");
    }
  };

  return (
    <section className="w-screen h-screen flex bg-landing-bg-image bg-no-repeat bg-center bg-cover">
      <Toaster />
      <div className="w-1/4 rounded-2xl m-auto flex flex-col items-center text-white backdrop-blur-lg backdrop-saturate-[200%] bg-[rgba(17, 25, 40, 0.6)] border border-[rgba(255, 255, 255, 0.125)] mob:w-11/12  py-4">
        <div className="email-div w-full border-b flex flex-col gap-3 justify-center items-center pb-4">
          <TextFieldComponent
            label="email"
            name="user_info"
            width="90%"
            ipBorderColor={"white"}
            ipLabelColor={"white"}
            required={true}
            textColor={"black"}
            onChange={handleChange}
            inputBorderColor={inputBorderColor}
          />
          <PortfolioButton
            text="CONTINUE"
            className={`border pl-24 border-solid w-11/12 h-12 rounded-full flex items-center justify-between mob:w-11/12 mob:pl-8 mob:mt-4`}
            type={"button"}
            onClick={handleContinue}
          />
        </div>
        <div className="firebase-auth w-full flex flex-col justify-center items-center gap-4 py-4">
          <PortfolioButton
            text="SIGNUP"
            icon={TelegramIcon}
            className={`border mob:w-11/12 mob:pl-6 pl-24 border-solid w-3/4 h-12 rounded-full flex items-center justify-between bg-transparent hover:bg-bgpfp-yellow hover:transition-all hover:duration-bg-transitio`}
            type={"submit"}
            onClick={handleSignup}
          />
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
        <div className="back text-lg w-full flex justify-center items-center gap-2">
          <ArrowBackIcon />
          <NavLink to={"/"}> GO BACK</NavLink>
        </div>
      </div>
    </section>
  );
}

export default Login;
