import React, { useState } from 'react';
import { useDarkMode } from "../../../../helpers/DarkModeContext";

export function Dialog({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode } = useDarkMode();

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <div>
      {/* Trigger */}
      <div onClick={openDialog}>{children[0]}</div>

      {/* Dialog Content */}
      {isOpen && (
        <div
          className={`fixed inset-0 flex justify-center items-center z-50 transition-all duration-300 ${
            darkMode ? "bg-black bg-opacity-70" : "bg-black bg-opacity-50"
          }`}
          onClick={closeDialog}
        >
          <div
            className={`rounded-lg shadow-lg w-1/3 max-w-lg p-6 transition-all duration-300 ${
              darkMode ? "bg-gray-800 text-white" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={`absolute top-2 right-2 transition-all duration-300 ${
                darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
              }`}
              onClick={closeDialog}
            >
              &#x2715;
            </button>
            {children[1]}
          </div>
        </div>
      )}
    </div>
  );
}

export function DialogTrigger({ asChild, children }) {
  return children;
}

export function DialogContent({ children }) {
  return <div className="space-y-4">{children}</div>;
}

export function DialogHeader({ children }) {
  const { darkMode } = useDarkMode();
  return (
    <div className={`text-lg font-semibold ${darkMode ? "text-white" : "text-black"}`}>
      {children}
    </div>
  );
}

export function DialogTitle({ children }) {
  const { darkMode } = useDarkMode();
  return (
    <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}>
      {children}
    </h2>
  );
}
