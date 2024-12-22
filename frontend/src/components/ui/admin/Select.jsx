import React from "react";

export function Select({ children, disabled }) {
  return (
    <div className={`relative ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      {children}
    </div>
  );
}

export function SelectTrigger({ children, id }) {
  return (
    <button
      id={id}
      className="w-full p-2 border border-gray-300 rounded bg-white focus:ring focus:ring-blue-300"
    >
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }) {
  return <span>{placeholder}</span>;
}

export function SelectContent({ children }) {
  return (
    <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg">
      {children}
    </div>
  );
}

export function SelectItem({ value, children }) {
  return (
    <div
      className="p-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => console.log(`Selected: ${value}`)}
    >
      {children}
    </div>
  );
}
