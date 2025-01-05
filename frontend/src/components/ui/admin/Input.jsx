import React from "react";
import { useDarkMode } from "../../../helpers/DarkModeContext";

export function Input({ type = "text", className = "", ...props }) {
  const { darkMode } = useDarkMode();
  return (
    <input
      type={type}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-300 ${
        darkMode
          ? "bg-gray-800 text-white border-gray-600 focus:ring-blue-500"
          : "bg-white text-gray-900 border-gray-300 focus:ring-blue-600"
      } ${className}`}
      {...props}
    />
  );
}
