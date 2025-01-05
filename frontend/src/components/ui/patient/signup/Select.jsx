import React, { useState } from 'react';

export const Select = ({ children }) => {
  return <div className="relative">{children}</div>;
};

export const SelectTrigger = ({ value, onClick }) => {
  return (
    <button
      type="button" 
      onClick={(e) => {
        e.stopPropagation(); 
        onClick();
      }}
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
      onClick={(e) => {
        e.stopPropagation();
        !disabled && onSelect(value);
      }}
      className={`px-4 py-2 cursor-pointer transition-all duration-300 ${
        disabled ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'
      }`}
    >
      {value}
    </div>
  );
};

