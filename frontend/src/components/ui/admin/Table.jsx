import { useDarkMode } from "../../../helpers/DarkModeContext";

export const Table = ({ children }) => {
  const { darkMode } = useDarkMode();
  return (
    <table
      className={`min-w-full border-collapse border transition-all duration-300 ${
        darkMode ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-white"
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
        darkMode ? "bg-gray-700 text-white" : "bg-gray-200"
      }`}
    >
      {children}
    </thead>
  );
};

export const TableRow = ({ children }) => {
  const { darkMode } = useDarkMode();
  return (
    <tr
      className={`hover:transition-all duration-300 ${
        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
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
      className={`px-4 py-2 text-left border font-semibold transition-all duration-300 ${
        darkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-700"
      }`}
    >
      {children}
    </th>
  );
};

export const TableBody = ({ children }) => <tbody>{children}</tbody>;

export const TableCell = ({ children }) => {
  const { darkMode } = useDarkMode();
  return (
    <td
      className={`px-4 py-2 border transition-all duration-300 ${
        darkMode ? "border-gray-600 text-gray-400" : "border-gray-300 text-gray-600"
      }`}
    >
      {children}
    </td>
  );
};
