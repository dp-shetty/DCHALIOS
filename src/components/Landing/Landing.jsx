import React from "react";
import PortfolioButton from "../common/PortfolioButton";
import LoginIcon from "@mui/icons-material/Login";
import { SiGnuprivacyguard } from "react-icons/si";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import { useNavigate } from "react-router-dom";

function Landing() {
  const Navigation = useNavigate();

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
        <div className="w-1/2 h-2/3 rounded-2xl m-auto flex flex-col justify-center items-center gap-10 text-white backdrop-blur-lg backdrop-saturate-[200%] bg-[rgba(17, 25, 40, 0.6)] border border-[rgba(255, 255, 255, 0.125)] mob:w-11/12">
          <PortfolioButton
            text="LOGIN"
            icon={LoginIcon}
            className={`border pl-32 border-solid w-1/2 h-12 rounded-full flex items-center justify-between mob:w-11/12 mob:pl-8 mob:mt-4`}
            type={"button"}
            onClick={handleLogin}
          />
          <PortfolioButton
            text="SIGNUP"
            icon={SiGnuprivacyguard}
            className={`border pl-32 border-solid w-1/2 h-12 rounded-full flex items-center justify-between mob:w-11/12 mob:pl-8`}
            type={"button"}
            onClick={handleSignup}
          />
          <PortfolioButton
            text="STAY LOGGED OUT"
            icon={LogoutSharpIcon}
            className={`border pl-24 border-solid w-1/2 h-12 rounded-full flex items-center justify-between mob:w-11/12 mob:pl-7`}
            type={"button"}
            onClick={handleStayLoggedOut}
          />
        </div>
      </section>
    </>
  );
}

export default Landing;
