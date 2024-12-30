import React from "react";
import { useDarkMode } from "../../../helpers/DarkModeContext";

export function Switch({ checked, onCheckedChange, id, className }) {
  const { darkMode } = useDarkMode();
  return (
    <label
      htmlFor={id}
      className={`relative inline-flex items-center cursor-pointer transition-all duration-300 ${className}`}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only peer"
      />
      <div
        className={`w-11 h-6 rounded-full peer-focus:ring-2 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full ${
          darkMode
            ? "bg-gray-700 peer-focus:ring-blue-500 peer-checked:bg-blue-600 after:bg-gray-300 after:border-gray-500 peer-checked:after:border-white"
            : "bg-gray-200 peer-focus:ring-indigo-400 peer-checked:bg-indigo-600 after:bg-white after:border-gray-300 peer-checked:after:border-white"
        }`}
      ></div>
    </label>
  );
}
