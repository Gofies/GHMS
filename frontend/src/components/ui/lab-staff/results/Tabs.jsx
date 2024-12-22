import React from 'react';

export function Tabs({ value, onValueChange, children }) {
  return <div>{children}</div>;
}

export function TabsList({ children }) {
  return <div className="flex space-x-4">{children}</div>;
}

export function TabsContent({ value, selectedValue, children }) {
    // Ensure that we only render the content if the tab is selected
    return value === selectedValue ? <div>{children}</div> : null;
  }
  
