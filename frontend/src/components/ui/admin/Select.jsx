import React from "react";
import { useDarkMode } from "../../../helpers/DarkModeContext";

export function Select({ children, disabled }) {
  const { darkMode } = useDarkMode();
  return (
    <div
      className={`relative transition-all duration-300 ${
        disabled ? "opacity-50 pointer-events-none" : ""
      } ${darkMode ? "bg-gray-800 text-white border border-gray-600" : "text-black border border-gray-300"}`}
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
          ? "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
          : "bg-white border-gray-300 text-black hover:bg-gray-100"
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

export const SelectItem = ({ value, onSelect, disabled }) => {
  const { darkMode } = useDarkMode();
  return (
    <div
      onClick={() => !disabled && onSelect(value)}
      className={`px-4 py-2 cursor-pointer transition-all duration-300 ${
        disabled
          ? darkMode
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          : darkMode
            ? 'hover:bg-gray-700 text-white'
            : 'hover:bg-gray-100 text-black'
      }`}
    >
      {value}
    </div>
  );
};
