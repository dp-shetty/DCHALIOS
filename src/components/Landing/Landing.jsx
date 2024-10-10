import React, { useEffect } from "react";
import PortfolioButton from "../common/PortfolioButton";
import LoginIcon from "@mui/icons-material/Login";
import { SiGnuprivacyguard } from "react-icons/si";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode to decode JWT tokens

function Landing() {
  const Navigation = useNavigate();

  useEffect(() => {
    const token = Cookies.get("authToken");

    if (token) {
      try {
        // Decode the JWT token to access its expiration date
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds

        // Check if the token is expired
        if (decodedToken.exp < currentTime) {
          Navigation("/login");
        } else {
          Navigation("/dchalios-ai");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        Navigation("/login");
      }
    } else {
      // No token found, navigate to login
      Navigation("/login");
    }
  }, [Navigation]);

  const handleLogin = () => {
    Navigation("/login");
  };

  const handleSignup = () => {
    Navigation("/signup");
  };

  const handleStayLoggedOut = () => {
    Navigation("/dchalios-ai");
  };


  return (
    <>
      <section className="w-screen h-screen flex bg-landing-bg-image bg-no-repeat bg-center bg-cover">
        <div className="w-1/2 py-5 px-2 rounded-2xl m-auto flex flex-col justify-center items-center gap-5 text-white backdrop-blur-lg backdrop-saturate-[200%] bg-[rgba(17, 25, 40, 0.6)] border border-[rgba(255, 255, 255, 0.125)] mob:w-11/12 tab-p:w-11/12">
          <div className="w-full flex flex-col gap-3">
            <p className="text-2xl text-center text-black">
              Welcome to D-CHALIOS AN AI 🤖
            </p>
            <p className="text-lg text-center text-black">
              Unleash the Sharpness as Chanakya’s Wisdom, Radiant as the Sun’s
              Intensity
            </p>
          </div>
          <PortfolioButton
            text="LOGIN"
            icon={LoginIcon}
            className={`border pl-32 border-solid w-1/2 h-12 rounded-full flex items-center justify-between mob:w-11/12 mob:pl-8 mob:mt-4 tab-p:w-3/4`}
            type={"button"}
            onClick={handleLogin}
          />
          <PortfolioButton
            text="SIGNUP"
            icon={SiGnuprivacyguard}
            className={`border pl-32 border-solid w-1/2 h-12 rounded-full flex items-center justify-between mob:w-11/12 mob:pl-8 tab-p:w-3/4`}
            type={"button"}
            onClick={handleSignup}
          />
          <PortfolioButton
            text="STAY LOGGED OUT"
            icon={LogoutSharpIcon}
            className={`border pl-24 mb-5 border-solid w-1/2 h-12 rounded-full flex items-center justify-between mob:w-11/12 mob:pl-7 tab-p:w-3/4 tab-p:pl-20`}
            type={"button"}
            onClick={handleStayLoggedOut}
          />
        </div>
      </section>
    </>
  );
}

export default Landing;
