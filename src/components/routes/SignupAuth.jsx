import React, { useState } from "react";
import { TextFieldComponent } from "../common/TextFieldComponent";
import toast, { Toaster } from "react-hot-toast";
import PortfolioButton from "../common/PortfolioButton";
import { NavLink, useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import { auth, googleProvider, githubProvider } from "../../firebase.js";
import { signInWithPopup } from "firebase/auth";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios"; // Import axios

function SignupAuth() {
  const [email, setEmail] = useState(sessionStorage.getItem("userEmail") || ""); // Initialize email
  const [passwordData, setPasswordData] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const navigate = useNavigate();

  const backUrl = import.meta.env.VITE_BACKEND_URL

  // Regular expressions for password validation
  const hasDigit = /\d/;
  const hasTwoSpecialChars = (password) =>
    (password.match(/\W/g) || []).length >= 2;
  const hasLetter = /[a-zA-Z]/;
  const noSpaces = (password) => !/\s/.test(password);

  // Check if all password requirements are met
  const validatePassword = () => {
    const isValid =
      hasDigit.test(passwordData) &&
      hasTwoSpecialChars(passwordData) &&
      hasLetter.test(passwordData) &&
      noSpaces(passwordData);

    setIsPasswordValid(isValid);
  };

  const handlePasswordChange = ({ target: { value } }) => {
    setPasswordData(value);
    validatePassword();
  };

  // New function to handle email signup with backend using axios
  const handleEmailSignup = async () => {

    try {
      await axios.post(
        `${backUrl}/signed-users`,
        {
          email,
          password: passwordData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log(data)

      // toast.success(response.data.message); // Show success message from backend
      // navigate("/dchalios-ai"); // Change this to the desired page
    } catch (error) {
      console.error("Error during email signup:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to sign up. Please try again.";
      toast.error(errorMessage); // Show error message from backend
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Google sign-in successful!");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Failed to sign in with Google. Please try again.");
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      toast.success("GitHub sign-in successful!");
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      toast.error("Failed to sign in with GitHub. Please try again.");
    }
  };

  return (
    <section className="w-screen h-screen flex bg-landing-bg-image bg-no-repeat bg-center bg-cover">
      <Toaster />
      <div className="w-1/4 mob:w-11/12 mob:gap-1 mob:py-2 rounded-2xl m-auto flex flex-col items-center text-white backdrop-blur-lg backdrop-saturate-[200%] bg-[rgba(17, 25, 40, 0.6)] border-[rgba(255, 255, 255, 0.125)] gap-4 py-4">
        <div className="email-div w-full border-b flex justify-center items-center flex-col p-0 gap-1 mob:mb-5">
          <TextFieldComponent
            label="email / number"
            name="user_info"
            width={"90%"}
            ipBorderColor={"white"}
            required={false}
            disable={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Add email input handler
          />
          <TextFieldComponent
            label="Password"
            name="password"
            width={"90%"}
            ipBorderColor={"white"}
            required={true}
            onChange={handlePasswordChange}
          />

          {/* Password validation requirements */}
          <div className="password-validation mt-2 mb-2">
            <ul className="text-sm">
              <li
                className={`flex items-center ${
                  hasDigit.test(passwordData)
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {hasDigit.test(passwordData) ? "✓" : "✗"} Must contain at least
                1 digit
              </li>
              <li
                className={`flex items-center ${
                  hasTwoSpecialChars(passwordData)
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {hasTwoSpecialChars(passwordData) ? "✓" : "✗"} Must contain at
                least 2 special characters
              </li>
              <li
                className={`flex items-center ${
                  hasLetter.test(passwordData)
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {hasLetter.test(passwordData) ? "✓" : "✗"} Must contain at least
                1 alphabetic character
              </li>
              <li
                className={`flex items-center ${
                  noSpaces(passwordData) ? "text-green-500" : "text-red-500"
                }`}
              >
                {noSpaces(passwordData) ? "✓" : "✗"} Must not contain spaces
              </li>
            </ul>
          </div>

          <PortfolioButton
            text="VERIFY EMAIL"
            className={`border pl-24 mb-3 border-solid w-11/12 h-12 rounded-full flex items-center justify-between mob:w-11/12 mob:pl-8 mob:mt-4`}
            type={"button"}
            onClick={() => {
              if (isPasswordValid) {
                handleEmailSignup(); // Call signup function
              } else {
                toast.error("Ensure password requirements are met.");
              }
            }}
            disabled={!isPasswordValid} // Disable button if password does not meet all requirements
          />
          <div className="w-full flex items-center justify-center pb-3">
            <NavLink>Forget Password?</NavLink>
          </div>
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
            className={`border mob:w-11/12 mob:pl-4 pl-5 border-solid w-3/4 h-12 rounded-full flex items-center justify-between mb-3 mob:mb-3 bg-transparent hover:bg-bgpfp-yellow hover:transition-all hover:duration-bg-transitio`}
            onClick={handleGithubSignIn}
            type={"button"}
          />
        </div>
        <div className="back w-full flex justify-center items-center gap-5 mob:mb-3">
          <ArrowBackIcon />
          <NavLink to="/login">Back to Login</NavLink>
        </div>
      </div>
    </section>
  );
}

export default SignupAuth;
