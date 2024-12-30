import { useDarkMode } from "../../../helpers/DarkModeContext";

export function Card({ children, className = "" }) {
  const { darkMode } = useDarkMode();
  return (
    <div
      className={`shadow-md rounded-lg p-6 transition-all duration-300 ${
        darkMode
          ? "bg-gray-800 text-white border border-gray-700"
          : "bg-white text-gray-900 border border-gray-200"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  const { darkMode } = useDarkMode();
  return (
    <div
      className={`pb-4 mb-4 border-b transition-all duration-300 ${
        darkMode ? "border-gray-700" : "border-gray-200"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  const { darkMode } = useDarkMode();
  return (
    <div
      className={`pt-4 mt-4 border-t transition-all duration-300 ${
        darkMode ? "border-gray-700" : "border-gray-200"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }) {
  const { darkMode } = useDarkMode();
  return (
    <h2
      className={`text-xl font-bold transition-all duration-300 ${
        darkMode ? "text-white" : "text-gray-900"
      } ${className}`}
    >
      {children}
    </h2>
  );
}

export function CardDescription({ children, className = "" }) {
  const { darkMode } = useDarkMode();
  return (
    <p
      className={`transition-all duration-300 ${
        darkMode ? "text-gray-400" : "text-gray-600"
      } ${className}`}
    >
      {children}
    </p>
  );
}
