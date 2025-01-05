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
          ? `border-gray-600 ${
              readOnly ? "bg-gray-700 text-gray-400" : "bg-gray-800 text-white"
            } focus:ring-blue-500`
          : `border-gray-300 ${
              readOnly ? "bg-gray-100" : "bg-white"
            } focus:ring-blue-300`
      }`}
      rows={4}
    />
  );
}
