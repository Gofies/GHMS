export const Table = ({ children }) => (
  <table className="min-w-full border-collapse border border-gray-300">{children}</table>
);

export const TableHeader = ({ children }) => (
  <thead className="bg-gray-200">{children}</thead>
);

export const TableRow = ({ children }) => (
  <tr className="hover:bg-gray-100">{children}</tr>
);

export const TableHead = ({ children }) => (
  <th className="px-4 py-2 text-left border border-gray-300 text-gray-700 font-semibold">
    {children}
  </th>
);

export const TableBody = ({ children }) => <tbody>{children}</tbody>;

export const TableCell = ({ children }) => (
  <td className="px-4 py-2 border border-gray-300 text-gray-600">{children}</td>
);
