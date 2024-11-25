import React from "react";

export function Textarea({ id, value, readOnly, onChange, placeholder }) {
  return (
    <textarea
      id={id}
      value={value}
      readOnly={readOnly}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-2 border border-gray-300 rounded ${
        readOnly ? "bg-gray-100" : "bg-white"
      } focus:ring focus:ring-blue-300`}
      rows={4}
    />
  );
}
