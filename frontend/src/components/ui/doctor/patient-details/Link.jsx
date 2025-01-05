import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * 
 * @param {Object} props - Props for the Link component.
 * @param {string} props.href - The destination URL.
 * @param {string} props.className - Additional classes for styling.
 * @param {React.ReactNode} props.children - Content to display inside the link.
 */
const Link = ({ href, className, children }) => {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `${className} ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-600'}`
      }
    >
      {children}
    </NavLink>
  );
};

export default Link;
