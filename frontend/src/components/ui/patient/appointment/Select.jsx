import React, { useState } from 'react';

export const Select = ({ children }) => {
  return <div className="relative">{children}</div>;
};

export const SelectTrigger = ({ value, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="border border-gray-300 rounded px-4 py-2 w-full text-left bg-white"
    >
      <SelectValue value={value} />
    </button>
  );
};

export const SelectValue = ({ value }) => {
  return <span>{value || 'Select an option'}</span>;
};

export const SelectContent = ({ children, isOpen }) => {
  return (
    isOpen && (
      <div className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-md mt-2">
        {children}
      </div>
    )
  );
};

export const SelectItem = ({ value, onSelect, disabled }) => {
  return (
    <div
      onClick={() => !disabled && onSelect(value)} // Eğer disabled değilse onSelect çağrılır
      className={`px-4 py-2 cursor-pointer ${
        disabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "hover:bg-gray-100"
      }`}
    >
      {value}
    </div>
  );
};
