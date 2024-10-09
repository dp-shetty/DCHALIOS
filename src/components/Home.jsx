import React, { useState, useCallback, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import avatar from "../assets/avatar.svg";
import { CgAttachment } from "react-icons/cg";
import { LuMic } from "react-icons/lu";
import { FaArrowAltCircleUp, FaBars } from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ContentDisplay from "./ContentDisplay";
import HistoryList from "./HistoryList";

function Home() {
  const apiKey = import.meta.env.VITE_GOOGLE;
  const gModel = import.meta.env.VITE_GOOGLE_MODEL;
  const backendUrl = import.meta.VITE_BACKEND_URL;
  const [model, setModel] = useState(null);
  const [inputQuery, setInputQuery] = useState("");
  const [finalContent, setFinalContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const outputRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(window.innerWidth >= 768);
  const [backJWT,setBackJwt] = useState()

  // Check for the user's session
const checkSession = async () => {

  try {
    const {data} = axios.get(`${backendUrl}/session`, {
    withCredentials: true, // Include cookies in the request
  })
  if(data){
    setBackJwt(data?.JWT_Token)
  }
  } catch (error) {
    console.error(error)
  }

  const response = await fetch();
  
  if (response.ok) {
    const userData = await response.json();
    console.log(userData)
    // Proceed with authenticated actions
  } else {
    // Handle unauthenticated state
  }
};

// Call checkSession on app load
useEffect(() => {
  checkSession();
}, []);


  useEffect(() => {
    const genAIInstance = new GoogleGenerativeAI(apiKey);
    const generativeModel = genAIInstance.getGenerativeModel({
      model: gModel,
    });
    setModel(generativeModel);
  }, [apiKey]);

  const handleChange = ({ target: { value } }) => {
    setInputQuery(value);
  };

  const getApi = async () => {
    if (!inputQuery.trim()) {
      toast.error("Please enter a valid prompt.");
      return;
    }

    const prompt = inputQuery;
    setIsLoading(true);
    try {
      const result = await model.generateContent(prompt);
      setFinalContent(result.response.text());
      scrollToBottom();
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Error generating content.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === "Enter") {
        getApi();
        setInputQuery("");
      }
    },
    [getApi]
  );

  const handleSubmit = useCallback(() => {
    getApi();
    setInputQuery("");
  }, [getApi]);

  const scrollToBottom = () => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [finalContent]);

  const toggleHistory = () => {
    setShowHistory((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      setShowHistory(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className={`flex w-full h-screen overflow-hidden bg-gray-50`}>
      <Toaster />
      {showHistory && (
        <div className="bg-gray-800 w-1/4 p-4 border-r border-gray-200 mob:w-full flex flex-col">
          <div className="flex items-center justify-between w-1/2">
            <button onClick={toggleHistory} aria-label="Toggle history">
              <FaBars className="text-gray-500 text-2xl mob:text-lg" />
            </button>
            <p className="text-xl font-semibold text-white mob:text-lg">
              History
            </p>
          </div>
          <HistoryList
            history={history}
            // onEdit={handleEditHistory}
            // onDelete={handleDeleteHistory}
            // onShare={handleShare}
            // onView={handleViewHistory}
          />
        </div>
      )}
      <div
        className={`flex flex-col w-full bg-white transition-all duration-300 ${
          showHistory && "mob:w-0"
        }`}
      >
        <header className="flex justify-between items-center px-4 py-2 border-b border-slate-300 shadow-md bg-white">
          <button
            className="mr-4"
            onClick={toggleHistory}
            aria-label="Toggle history"
          >
            <FaBars className="text-gray-500 text-2xl mob:text-lg" />
          </button>
          <p className="text-xl font-bold mob:text-base">D-CHALIOS 🤖</p>
          <img
            src={avatar}
            alt="user"
            className="border rounded-full w-10 h-10 bg-slate-100"
          />
        </header>
        <div
          className="mt-6 mx-4 h-full overflow-y-auto rounded-lg mob:mx-1"
          ref={outputRef}
        >
          <ContentDisplay finalContent={finalContent} />
          {isLoading && (
            <p className="text-gray-600 p-4 mob:p-2">
              Generating your content...
            </p>
          )}
        </div>
        <footer className="flex items-center p-3 bg-white border border-gray-300 rounded-full shadow-md mt-4 mx-4 h-14 mb-5 mob:w-[99%] mob:mx-auto ">
          <LuMic
            className="text-gray-500 text-2xl cursor-pointer hover:text-gray-700 transition-colors mob:text-4xl"
            aria-label="Microphone"
          />
          <CgAttachment
            className="text-gray-500 text-2xl cursor-pointer hover:text-gray-700 mx-3 transition-colors mob:text-4xl"
            aria-label="Attachment"
          />
          <input
            type="text"
            placeholder="Type your prompt..."
            value={inputQuery}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            className="flex-1 border-0 outline-none rounded-md h-full px-3 py-2"
            aria-label="Input prompt"
          />
          <FaArrowAltCircleUp
            className="text-gray-500 text-3xl cursor-pointer hover:text-gray-700 transition-colors mob:text-4xl"
            onClick={handleSubmit}
            aria-label="Submit prompt"
          />
        </footer>
      </div>
    </section>
  );
}

export default Home;
