// components/ui/button.js
import React from 'react';

export function Button({ variant = 'default', children, ...props }) {
  const baseStyles = 'px-4 py-2 rounded-md font-medium focus:outline-none';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
