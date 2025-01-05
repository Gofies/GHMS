import React, { useState } from 'react';
import { useDarkMode } from "../../../../helpers/DarkModeContext";

export const Dialog = ({ children }) => <div>{children}</div>;

export const DialogTrigger = ({ asChild, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const child = React.cloneElement(children, { onClick: () => setIsOpen(!isOpen) });
  return <>{child}</>;
};

export const DialogContent = ({ children }) => {
  const { darkMode } = useDarkMode();
  
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-all duration-300 ${
        darkMode ? 'bg-black bg-opacity-70' : 'bg-gray-800 bg-opacity-30'
      }`}
    >
      <div
        className={`rounded-lg p-6 max-w-lg w-full shadow-lg transition-all duration-300 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ children }) => {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`mb-4 transition-all duration-300 ${
        darkMode ? 'border-b border-gray-600' : 'border-b border-gray-300'
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
      className={`text-xl font-bold transition-all duration-300 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}
    >
      {children}
    </h2>
  );
};
