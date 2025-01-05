import React from "react";
import { useDarkMode } from "../../../helpers/DarkModeContext";

export function Label({ htmlFor, children, className = "" }) {
  const { darkMode } = useDarkMode();
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium transition-all duration-300 ${
        darkMode ? "text-gray-300" : "text-gray-700"
      } ${className}`}
    >
      {children}
    </label>
  );
}
