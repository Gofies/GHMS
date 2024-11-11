// components/ui/card.js
import React from 'react';

export function Card({ children }) {
  return <div className="bg-white shadow-md rounded-lg p-4">{children}</div>;
}

export function CardHeader({ children, className }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}
