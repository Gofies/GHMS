import React from 'react';
import { useDarkMode } from "../../../../helpers/DarkModeContext";

export const Table = ({ children }) => {
  const { darkMode } = useDarkMode();
  return (
    <table
      className={`min-w-full divide-y transition-all duration-300 ${
        darkMode ? 'divide-gray-700' : 'divide-gray-200'
      }`}
    >
      {children}
    </table>
  );
};

export const TableHeader = ({ children }) => {
  const { darkMode } = useDarkMode();
  return (
    <thead
      className={`transition-all duration-300 ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50'
      }`}
    >
      {children}
    </thead>
  );
};

export const TableBody = ({ children }) => {
  const { darkMode } = useDarkMode();
  return (
    <tbody
      className={`divide-y transition-all duration-300 ${
        darkMode ? 'bg-gray-900 divide-gray-700 text-white' : 'bg-white divide-gray-200'
      }`}
    >
      {children}
    </tbody>
  );
};

export const TableRow = ({ children }) => {
  const { darkMode } = useDarkMode();
  return (
    <tr
      className={`transition-all duration-300 ${
        darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
      }`}
    >
      {children}
    </tr>
  );
};

export const TableHead = ({ children }) => {
  const { darkMode } = useDarkMode();
  return (
    <th
      scope="col"
      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
        darkMode ? 'text-gray-300' : 'text-gray-500'
      }`}
    >
      {children}
    </th>
  );
};

export const TableCell = ({ children }) => {
  const { darkMode } = useDarkMode();
  return (
    <td
      className={`px-6 py-4 whitespace-nowrap text-sm transition-all duration-300 ${
        darkMode ? 'text-gray-400' : 'text-gray-700'
      }`}
    >
      {children}
    </td>
  );
};
