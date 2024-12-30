import React from 'react';
import { useDarkMode } from "../../../../helpers/DarkModeContext";

export function Switch({ id, checked, onCheckedChange }) {
  const { darkMode } = useDarkMode();

  return (
    <label htmlFor={id} className="inline-flex items-center cursor-pointer">
      <span className="relative">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className={`w-10 h-6 rounded-full transition-all duration-300 peer-focus:ring-2 ${
            darkMode
              ? 'bg-gray-700 peer-checked:bg-blue-500 peer-focus:ring-blue-400'
              : 'bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-blue-500'
          }`}
        ></div>
        <div
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${
            checked
              ? 'peer-checked:translate-x-full peer-checked:left-auto'
              : ''
          }`}
        ></div>
      </span>
    </label>
  );
}
