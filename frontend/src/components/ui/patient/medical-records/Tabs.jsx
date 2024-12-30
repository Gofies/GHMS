import React, { useState } from "react";
import { useDarkMode } from "../../../helpers/DarkModeContext";

export const Tabs = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={`tabs-container ${className}`}>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, { activeTab, setActiveTab });
      })}
    </div>
  );
};

export const TabsList = ({ children, activeTab, setActiveTab }) => {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`flex space-x-4 border-b transition-all duration-300 ${
        darkMode ? "border-gray-700" : "border-gray-300"
      }`}
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
};

export const TabsTrigger = ({ value, activeTab, setActiveTab, children }) => {
  const { darkMode } = useDarkMode();

  return (
    <button
      className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
        activeTab === value
          ? darkMode
            ? "text-blue-400 border-b-2 border-blue-500"
            : "text-blue-600 border-b-2 border-blue-600"
          : darkMode
          ? "text-gray-400 hover:text-gray-200"
          : "text-gray-600 hover:text-gray-800"
      }`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, activeTab, children }) => {
  const { darkMode } = useDarkMode();
  if (activeTab !== value) return null;
  
  return (
    <div
      className={`mt-4 transition-all duration-300 ${
        darkMode ? "text-white" : "text-black"
      }`}
    >
      {children}
    </div>
  );
};
