import React, { useState } from "react";

export function Dialog({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <div>
      {/* Trigger */}
      <div onClick={openDialog}>{children[0]}</div>

      {/* Dialog Content */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeDialog}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-1/3 max-w-lg p-6"
            onClick={(e) => e.stopPropagation()} // Dialog dışına tıklayınca kapanmasın
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
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
  return <div className="text-lg font-semibold">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-2xl font-bold">{children}</h2>;
}

