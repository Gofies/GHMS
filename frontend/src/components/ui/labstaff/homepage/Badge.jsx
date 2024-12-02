import React from "react";
import PropTypes from "prop-types";

export const Badge = ({ variant = "default", children }) => {
  const variantClasses = {
    default: "bg-yellow-200 text-gray-800",
    destructive: "bg-red-500 text-white",
    secondary: "bg-blue-500 text-white",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-gray-900",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  variant: PropTypes.oneOf(["default", "destructive", "secondary", "success", "warning"]),
  children: PropTypes.node.isRequired,
};

export default Badge;
