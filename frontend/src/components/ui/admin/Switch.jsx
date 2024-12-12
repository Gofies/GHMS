import React from "react";

export function Switch({ checked, onCheckedChange, id, className }) {
  return (
    <label
      htmlFor={id}
      className={`relative inline-flex items-center cursor-pointer ${className}`}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only peer"
      />
      <div
        className={`w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-2 peer-focus:ring-indigo-400 peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white`}
      ></div>
    </label>
  );
}
