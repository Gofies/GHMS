import React, { useState } from 'react';

export const Dialog = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDialog = () => setIsOpen(!isOpen);

  return React.Children.map(children, (child) =>
    React.cloneElement(child, { isOpen, toggleDialog })
  );
};

export const DialogTrigger = ({ asChild, toggleDialog, children }) => {
  const triggerProps = asChild ? { onClick: toggleDialog } : {};
  return React.cloneElement(children, triggerProps);
};

export const DialogContent = ({ isOpen, toggleDialog, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-md shadow-lg w-full max-w-lg p-6">
        {children}
        <button
          onClick={toggleDialog}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export const DialogHeader = ({ children }) => (
  <div className="mb-4 border-b pb-2">{children}</div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-lg font-bold text-gray-800">{children}</h2>
);
