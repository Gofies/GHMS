import React, { useState } from 'react';
import { useDarkMode } from "../../../../helpers/DarkModeContext";

export const Select = ({ children }) => {
  return <div className="relative">{children}</div>;
};

export const SelectTrigger = ({ value, onClick }) => {
  const { darkMode } = useDarkMode();
  return (
    <button
      onClick={onClick}
      className={`border rounded px-4 py-2 w-full text-left transition-all duration-300 ${
        darkMode
          ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700'
          : 'bg-white border-gray-300 text-black hover:bg-gray-100'
      }`}
    >
      <SelectValue value={value} />
    </button>
  );
};

export const SelectValue = ({ value }) => {
  const { darkMode } = useDarkMode();
  return (
    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
      {value || 'Select an option'}
    </span>
  );
};

export const SelectContent = ({ children, isOpen }) => {
  const { darkMode } = useDarkMode();
  return (
    isOpen && (
      <div
        className={`absolute z-10 w-full border rounded shadow-md mt-2 transition-all duration-300 ${
          darkMode
            ? 'bg-gray-800 border-gray-600 text-white'
            : 'bg-white border-gray-300 text-black'
        }`}
      >
        {children}
      </div>
    )
  );
};

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
