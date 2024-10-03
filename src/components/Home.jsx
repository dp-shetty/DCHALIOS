import React, { useState, useCallback, useEffect, useRef } from "react";
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
  const [genAI, setGenAI] = useState(null);
  const [model, setModel] = useState(null);
  const [inputQuery, setInputQuery] = useState("");
  const [finalContent, setFinalContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const outputRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showHistory, setShowHistory] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const genAIInstance = new GoogleGenerativeAI(apiKey);
    setGenAI(genAIInstance);
    const generativeModel = genAIInstance.getGenerativeModel({
      model: gModel,
    });
    setModel(generativeModel);
  }, [apiKey]);

  const handleChange = ({ target: { value } }) => {
    setInputQuery(value);
  };

  const handleShare = (index) => {
    const contentToShare = history[index];
    navigator.clipboard
      .writeText(contentToShare)
      .then(() => alert("Content copied to clipboard!"))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const getApi = async () => {
    if (!inputQuery.trim()) {
      alert("Please enter a valid prompt.");
      return;
    }

    const prompt = inputQuery;
    setIsLoading(true);
    try {
      const result = await model.generateContent(prompt);
      setFinalContent(result.response.text());
      if (editMode) {
        setHistory((prevHistory) => {
          const newHistory = [...prevHistory];
          newHistory[editIndex] = prompt; // Update the specific index
          return newHistory;
        });
        setEditMode(false);
        setEditIndex(null);
      } else {
        setHistory((prevHistory) => [...prevHistory, prompt]); // Add to history
      }
      scrollToBottom();
    } catch (error) {
      console.error("Error generating content:", error);
      alert("An error occurred while generating content. Please try again.");
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

  const handleEditHistory = (index) => {
    setInputQuery(history[index]);
    setEditMode(true);
    setEditIndex(index);
  };

  const handleDeleteHistory = (index) => {
    setHistory((prevHistory) => prevHistory.filter((_, i) => i !== index));
  };

  const handleViewHistory = (index) => {
    const prompt = history[index];
    setInputQuery(prompt);
    getApi();
  };

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
    <section
      className={`flex border border-gray-300 w-full h-screen overflow-hidden bg-gray-50`}
    >
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
            onEdit={handleEditHistory}
            onDelete={handleDeleteHistory}
            onShare={handleShare}
            onView={handleViewHistory}
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
          <p className="text-xl font-bold mob:text-base">D-CHALIOS</p>
          <p className="text-gray-500 mob:text-xs">Memory-full</p>
          <img
            src={avatar}
            alt="user"
            className="border rounded-full w-10 h-10 bg-slate-100"
          />
        </header>
        <div
          className="flex-1 mx-4 mt-4 overflow-y-auto rounded-lg shadow-md bg-gray-50 p-4 mob:mx-1"
          ref={outputRef}
        >
          <ContentDisplay finalContent={finalContent} />
          {isLoading && (
            <p className="text-gray-600 p-4 mob:p-2">
              Generating your content...
            </p>
          )}
        </div>
        <footer className="flex items-center p-3 bg-white border border-gray-300 rounded-full shadow-md mt-4 mx-4 h-14 mb-5 mob:w-full mob:mx-auto mob:p-2 mob:h-11">
          <LuMic
            className="text-gray-500 text-2xl cursor-pointer hover:text-gray-700 transition-colors mob:text-9xl"
            aria-label="Microphone"
          />
          <CgAttachment
            className="text-gray-500 text-2xl cursor-pointer hover:text-gray-700 mx-3 transition-colors mob:text-9xl"
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
            className="text-gray-500 text-3xl cursor-pointer hover:text-gray-700 transition-colors mob:text-9xl"
            onClick={handleSubmit}
            aria-label="Submit prompt"
          />
        </footer>
      </div>
    </section>
  );
}

export default Home;
