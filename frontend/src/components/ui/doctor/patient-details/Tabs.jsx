import React, { useState } from 'react';

export const Tabs = ({ defaultValue, onValueChange, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (onValueChange) {
      onValueChange(value); // Parent component'in callback fonksiyonunu çağır
    }
  };

  return (
    <div className="tabs-container">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { activeTab, onTabChange: handleTabChange })
      )}
    </div>
  );
};


export const TabsList = ({ children, activeTab, onTabChange }) => (
  <div className="flex space-x-4 border-b pb-2">
    {React.Children.map(children, (child) =>
      React.cloneElement(child, { activeTab, onTabChange })
    )}
  </div>
);

export const TabsTrigger = ({ value, activeTab, onTabChange, children }) => (
  <button
    className={`px-4 py-2 text-sm font-medium ${
      activeTab === value
        ? 'text-blue-600 border-b-2 border-blue-600'
        : 'text-gray-600 hover:text-gray-800'
    }`}
    onClick={() => onTabChange(value)} // Tab değiştiğinde `onTabChange`'i çağır
  >
    {children}
  </button>
);

export const TabsContent = ({ value, activeTab, children }) => {
  if (activeTab !== value) return null; // Sadece aktif tab'ın içeriğini göster
  return <div className="mt-4">{children}</div>;
};