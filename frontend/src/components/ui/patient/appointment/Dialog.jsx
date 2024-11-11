// Dialog.js
import React, { useState } from 'react';

export const Dialog = ({ children }) => <div>{children}</div>;

export const DialogTrigger = ({ asChild, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const child = React.cloneElement(children, { onClick: () => setIsOpen(!isOpen) });
  return <>{child}</>;
};

export const DialogContent = ({ children }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-30">
    <div className="bg-white rounded-lg p-6 max-w-lg w-full">{children}</div>
  </div>
);

export const DialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-xl font-bold">{children}</h2>
);
