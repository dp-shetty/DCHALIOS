import React, { useEffect, useState } from "react";
import axios from "axios"; // Ensure axios is imported
import toast, { Toaster } from "react-hot-toast";
import { TextFieldComponent } from "../common/TextFieldComponent";
import PortfolioButton from "../common/PortfolioButton";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Cookies from "js-cookie"; // Import Cookies for cookie management
import {jwtDecode} from "jwt-decode"; // Import jwt-decode to decode JWT

function SessionLogin() {
  const [inputBorderColor, setInputBorderColor] = useState("white");
  const [loading, setLoading] = useState(false);
  const [backJWT, setBackJwt] = useState("");
  const [emailData, setEmailData] = useState(""); // State for email data
  const [emailValidation, setEmailValidation] = useState(false); // State for email validation
  const navigate = useNavigate(); // Initialize navigate

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getJWT = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/session`, {
        withCredentials: true, // Ensure cookies are sent with the request
      });
      if (data && data.JWT_Token) {
        Cookies.set("authToken", data.JWT_Token,{ expires: 7, sameSite: "None", secure: true });
      }
    } catch (error) {
      console.error("Error fetching JWT:", error);
      toast.error("Authentication failed!"); // Notify user of error
    }
  };

  // Call getJWT on component load
  useEffect(() => {
    getJWT();
  }, []);

  const handleChange = ({ target: { value } }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
    setLoading(true);
    try {
      if (!emailValidation) {
        toast.error("Please enter a valid email."); // Notify user if email is invalid
        return;
      }
      const token = Cookies.get("authToken");
      const decoded = jwtDecode(token);
      const emailFromToken = decoded.email;
      const userIdFromToken = decoded.id;


      console.log("email entered :",emailData)
      console.log("email from token",emailFromToken)

      if (emailData === emailFromToken) {
          const { data } = await axios.get(`${backendUrl}/email-users`, {
            withCredentials: true,
          });

          console.log(data)

          const userIdFromBackend = data._id;

          console.log("userid from backend :",userIdFromBackend)
          console.log("userid from token",userIdFromToken)
          
          if (userIdFromToken === userIdFromBackend) {
            console.log("Navigating to /dchalios-ai");
            navigate("/dchalios-ai");
          }else{
            console.log("not navigating")
          }
      }
    } catch (error) {
      console.error()
      toast.error("Authentication Failed")
    }finally{
      setLoading(false)
    }
  };

  return (
    <section className="w-screen h-screen flex bg-landing-bg-image bg-no-repeat bg-center bg-cover">
      <Toaster />
      <div className="w-1/4 rounded-2xl m-auto flex flex-col items-center text-white backdrop-blur-lg backdrop-saturate-[200%] bg-[rgba(17, 25, 40, 0.6)] border border-[rgba(255, 255, 255, 0.125)] mob:w-11/12  py-4">
        <div className="email-div w-full flex flex-col gap-3 justify-center items-center pb-4">
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
            disabled={loading} // Disable button during loading
          />
        </div>
      </div>
    </section>
  );
}

export default SessionLogin;
