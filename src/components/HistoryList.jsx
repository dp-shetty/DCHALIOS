import React, { useState } from "react";
import { FaEllipsisH } from "react-icons/fa";

const HistoryList = ({ history, onEdit, onDelete, onShare, onView }) => {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const handleMenuToggle = (index) => {
    if (openMenuIndex === index) {
      setOpenMenuIndex(null); // Close the menu
    } else {
      setOpenMenuIndex(index); // Open the menu
    }
  };

  if (history.length === 0) {
    return <p className="text-gray-500">No history available.</p>;
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-800 rounded-lg p-2">
      {history.map((item, index) => (
        <div key={index} className="relative">
          <div
            className="flex justify-between items-center text-gray-400 p-2 hover:bg-gray-700 rounded transition duration-200 cursor-pointer"
            onClick={() => {
              onView(item); // Pass the selected item to the view function
            }}
          >
            <span className="whitespace-nowrap overflow-hidden overflow-ellipsis">
              {item}
            </span>
            <button
              className="text-gray-400 hover:text-gray-300"
              onClick={() => handleMenuToggle(index)}
            >
              <FaEllipsisH />
            </button>
          </div>
          {openMenuIndex === index && (
            <div className="absolute right-0 bg-gray-900 rounded shadow-lg mt-1">
              <button
                className="block text-blue-400 hover:bg-gray-700 px-4 py-2 text-left"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click from bubbling up
                  onEdit(index);
                }}
              >
                Edit
              </button>
              <button
                className="block text-red-400 hover:bg-gray-700 px-4 py-2 text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(index);
                }}
              >
                Delete
              </button>
              <button
                className="block text-green-400 hover:bg-gray-700 px-4 py-2 text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(index);
                }}
              >
                Share
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
