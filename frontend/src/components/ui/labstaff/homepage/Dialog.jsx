import React, { useState } from 'react';

export const Dialog = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDialog = () => setIsOpen(!isOpen);

  return (
    <>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { isOpen, toggleDialog })
      )}
    </>
  );
};

export const DialogTrigger = ({ toggleDialog, children }) => {
  return React.cloneElement(children, { onClick: toggleDialog });
};

export const DialogContent = ({ isOpen, toggleDialog, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md shadow-lg w-full max-w-lg p-6 relative">
        {children}
        <button
          onClick={toggleDialog}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
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
