// Button.js
import React from 'react';

export const Button = ({ children, onClick, variant = 'default', size = 'md' }) => {
  const baseStyle = 'inline-flex items-center justify-center rounded-md';
  const sizeStyle = size === 'sm' ? 'px-2 py-1 text-sm' : 'px-4 py-2';
  const variantStyle =
    variant === 'outline'
      ? 'border border-gray-300 text-gray-700 hover:bg-gray-100'
      : 'bg-blue-600 text-white hover:bg-blue-700';

  return (
    <button className={`${baseStyle} ${sizeStyle} ${variantStyle}`} onClick={onClick}>
      {children}
    </button>
  );
};
