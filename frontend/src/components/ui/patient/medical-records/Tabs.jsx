import React, { useState } from "react";

export const Tabs = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={`tabs-container ${className}`}>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, { activeTab, setActiveTab });
      })}
    </div>
  );
};

export const TabsList = ({ children, activeTab, setActiveTab }) => (
  <div className="flex space-x-4 border-b border-gray-300">
    {React.Children.map(children, (child) =>
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
);

export const TabsTrigger = ({ value, activeTab, setActiveTab, children }) => (
  <button
    className={`px-4 py-2 text-sm font-medium ${
      activeTab === value
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-600 hover:text-gray-800"
    }`}
    onClick={() => setActiveTab(value)} 
  >
    {children}
  </button>
);

export const TabsContent = ({ value, activeTab, children }) => {
  if (activeTab !== value) return null;
  return <div className="mt-4">{children}</div>;
};
