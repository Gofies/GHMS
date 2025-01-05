import React from 'react';
import { useDarkMode } from "../../../helpers/DarkModeContext";

export const Button = ({ children, onClick, variant = 'default', size = 'md' }) => {
  const { darkMode } = useDarkMode();
  const baseStyle = 'inline-flex items-center justify-center rounded-md transition-all duration-300';
  const sizeStyle = size === 'sm' ? 'px-2 py-1 text-sm' : 'px-4 py-2';
  const variantStyle =
    variant === 'outline'
      ? `${darkMode ? 'border border-gray-500 text-gray-300 hover:bg-gray-700' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`
      : `${darkMode ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-blue-600 text-white hover:bg-blue-700'}`;

  return (
    <button className={`${baseStyle} ${sizeStyle} ${variantStyle}`} onClick={onClick}>
      {children}
    </button>
  );
};
