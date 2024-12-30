import React from 'react';
import { useDarkMode } from "../../../../helpers/DarkModeContext";

export function Button({ variant = 'default', size = 'md', children, ...props }) {
  const { darkMode } = useDarkMode();
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none transition-all duration-300';
  
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
  };

  const variants = {
    default: darkMode ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-blue-600 text-white hover:bg-blue-700',
    outline: darkMode
      ? 'border border-blue-500 text-blue-400 hover:bg-blue-700 hover:text-white'
      : 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
  };

  return (
    <button className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
