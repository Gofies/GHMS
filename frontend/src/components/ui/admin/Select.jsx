import React from "react";
import { useDarkMode } from "../../../helpers/DarkModeContext";

export function Select({ children, disabled }) {
  const { darkMode } = useDarkMode();
  return (
    <div
      className={`relative transition-all duration-300 ${
        disabled ? "opacity-50 pointer-events-none" : ""
      } ${darkMode ? "bg-gray-800 text-white border border-gray-600" : "bg-white text-black border border-gray-300"}`}
    >
      {children}
    </div>
  );
}

export function SelectTrigger({ children, value, onClick }) {
  const { darkMode } = useDarkMode();
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-2 border rounded-md flex justify-between items-center transition-all duration-300 ${
        darkMode
          ? "bg-gray-800 border-gray-600 text-white hover:bg-gray-700 focus:ring-blue-500"
          : "bg-white border-gray-300 text-black hover:bg-gray-100 focus:ring-blue-300"
      }`}
    >
      {value || children}
    </button>
  );
}

export function SelectValue({ placeholder }) {
  const { darkMode } = useDarkMode();
  return (
    <span className={`block ${darkMode ? "text-white" : "text-black"}`}>
      {placeholder}
    </span>
  );
}

export function SelectContent({ children, isOpen }) {
  const { darkMode } = useDarkMode();
  if (!isOpen) return null;

  return (
    <div
      className={`absolute z-10 left-0 right-0 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto transition-all duration-300 ${
        darkMode
          ? "bg-gray-800 border border-gray-600 text-white"
          : "bg-white border border-gray-300 text-black"
      }`}
    >
      {children}
    </div>
  );
}

export function SelectItem({ value, children, onSelect }) {
  const { darkMode } = useDarkMode();
  return (
    <div
      className={`p-2 cursor-pointer transition-all duration-300 ${
        darkMode
          ? "hover:bg-gray-900 text-white"
          : "hover:bg-gray-100 text-black"
      }`}
      onClick={() => {
        if (onSelect) onSelect(value);
      }}
    >
      {children}
    </div>
  );
}
