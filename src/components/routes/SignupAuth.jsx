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
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "axios";

function SignupAuth() {
  const [email, setEmail] = useState(sessionStorage.getItem("signupEmail"));
  const [passwordData, setPasswordData] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const backUrl = import.meta.env.VITE_BACKEND_URL;
  const verfyFirstUrl = import.meta.env.VITE_VERIFY_START;

  const hasDigit = /\d/;
  const hasTwoSpecialChars = (password) =>(password.match(/\W/g) || []).length >= 2;
  const hasLetter = /[a-zA-Z]/;
  const noSpaces = (password) => !/\s/.test(password);
  const has8chars = (password) => password.length>7;

  const validatePassword = (value) => {
    const isValid =
      hasDigit.test(value) &&
      hasTwoSpecialChars(value) &&
      hasLetter.test(value) &&
      noSpaces(value) &&
      has8chars(value)
      setIsPasswordValid(isValid);
  };

  const handlePasswordChange = ({ target: { value } }) => {
    setPasswordData(value);
    validatePassword(value);
  };

  const handleEmailSignup = async () => {
    setLoading(true);
      axios.post(
        `${backUrl}/email-users`,
        {
          email,
          password: passwordData,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(()=>{
        setLoading(true);
        toast.success("Verification link sent to your email.", {
          duration: 3000,
        });
        window.location.replace(verfyFirstUrl);
      })
      .catch((error)=>{
        setLoading(false);
        console.error("Error during email signup:", error);
        toast.error("Error Signing Up, try again later");
      })
  };

  return (
    <section className="w-screen h-screen flex bg-landing-bg-image bg-no-repeat bg-center bg-cover">
      <Toaster />
      <div className="w-1/4 mob:w-11/12 mob:gap-1 mob:py-2 rounded-2xl m-auto flex flex-col items-center text-white backdrop-blur-lg backdrop-saturate-[200%] bg-[rgba(17, 25, 40, 0.6)] border-[rgba(255, 255, 255, 0.125)] gap-4 py-4">
        <div className="email-div w-full border-b flex justify-center items-center flex-col p-0 gap-1 mob:mb-5">
          <TextFieldComponent
            label="email"
            name="user_info"
            width={"90%"}
            ipBorderColor={"white"}
            required={false}
            disable={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextFieldComponent
            label="Password"
            name="password"
            width={"90%"}
            ipBorderColor={"white"}
            required={true}
            type={showPassword ? "text" : "password"} // Toggle between text and password
            onChange={handlePasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

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
                  has8chars(passwordData) ? "text-green-500" : "text-red-500"
                }`}
              >
                {has8chars(passwordData) ? "✓" : "✗"} Must Be more than 7 characters
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
                handleEmailSignup();
              } else {
                toast.error("Ensure password requirements are met.");
              }
            }}
            disabled={!isPasswordValid || loading}
          />
          <div className="w-full flex items-center justify-center pb-3">
            <NavLink>Forget Password?</NavLink>
          </div>
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
