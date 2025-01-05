import React, { useState } from 'react';
import { useDarkMode } from "../../../../helpers/DarkModeContext";

export const Dialog = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDialog = () => setIsOpen(!isOpen);

  return React.Children.map(children, (child) =>
    React.cloneElement(child, { isOpen, toggleDialog })
  );
};

export const DialogTrigger = ({ asChild, toggleDialog, children }) => {
  const triggerProps = asChild ? { onClick: toggleDialog } : {};
  return React.cloneElement(children, triggerProps);
};

export const DialogContent = ({ isOpen, toggleDialog, children }) => {
  const { darkMode } = useDarkMode();

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        darkMode ? "bg-black bg-opacity-70" : "bg-black bg-opacity-50"
      }`}
    >
      <div
        className={`relative rounded-md shadow-lg w-full max-w-lg p-6 transition-all duration-300 ${
          darkMode ? "bg-gray-800 text-white border border-gray-700" : "bg-white text-black"
        }`}
      >
        {children}
        <button
          onClick={toggleDialog}
          className={`absolute top-3 right-3 text-2xl transition-all ${
            darkMode
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export const DialogHeader = ({ children }) => {
  const { darkMode } = useDarkMode();
  return (
    <div
      className={`mb-4 pb-2 border-b ${
        darkMode ? "border-gray-700" : "border-gray-300"
      }`}
    >
      {children}
    </div>
  );
};

export const DialogTitle = ({ children }) => {
  const { darkMode } = useDarkMode();
  return (
    <h2
      className={`text-lg font-bold ${
        darkMode ? "text-white" : "text-gray-800"
      }`}
    >
      {children}
    </h2>
  );
};