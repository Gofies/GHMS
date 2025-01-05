import React from "react";
import { useDarkMode } from "../../../../helpers/DarkModeContext";

export function Textarea({ id, value, readOnly, onChange, placeholder }) {
  const { darkMode } = useDarkMode();

  return (
    <textarea
      id={id}
      value={value}
      readOnly={readOnly}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-2 border rounded transition-all duration-300 ${
        darkMode
          ? readOnly
            ? "bg-gray-700 text-gray-400 border-gray-600"
            : "bg-gray-800 text-white border-gray-600 focus:ring-blue-500"
          : readOnly
          ? "bg-gray-100 text-gray-500 border-gray-300"
          : "bg-white text-black border-gray-300 focus:ring-blue-300"
      }`}
      rows={4}
    />
  ); 
}
