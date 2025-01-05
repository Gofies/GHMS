import React from 'react';
import { useDarkMode } from "../../../../helpers/DarkModeContext";

export const Card = ({ children }) => {
  const { darkMode } = useDarkMode();
  return (
    <div
      className={`shadow rounded-lg p-4 transition-all duration-300 ${
        darkMode ? "bg-gray-800 text-white border border-gray-700" : "bg-white text-gray-900"
      }`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children }) => {
  const { darkMode } = useDarkMode();
  return (
    <div
      className={`border-b pb-2 mb-4 flex flex-row items-center justify-between transition-all duration-300 ${
        darkMode ? "border-gray-700" : "border-gray-200"
      }`}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ children }) => {
  const { darkMode } = useDarkMode();
  return (
    <h2
      className={`text-xl font-semibold transition-all duration-300 ${
        darkMode ? "text-white" : "text-gray-900"
      }`}
    >
      {children}
    </h2>
  );
};

export const CardContent = ({ children }) => (
  <div>{children}</div>
);
