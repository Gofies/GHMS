import React from 'react';

export function Switch({ id, checked, onCheckedChange }) {
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
        <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500 transition-all duration-300"></div>
        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-full peer-checked:left-auto transition-all duration-300"></div>
      </span>
    </label>
  );
}
