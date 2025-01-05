import { Link, useLocation } from "react-router-dom";
import { User, Building, Settings } from "lucide-react";
import { useSelector } from "react-redux";
import { useDarkMode } from "../../../helpers/DarkModeContext.js";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const { darkMode } = useDarkMode();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const { userId } = useSelector((state) => state.auth);

  const [currentPath, setCurrentPath] = useState(location.pathname);

  const links = [
    {
      to: `/admin/${userId}/user-management`,
      label: "Staff Management",
      icon: User,
    },
    {
      to: `/admin/${userId}/hospital-management`,
      label: "Hospital Management",
      icon: Building,
    },
    {
      to: `/admin/${userId}/system-settings`,
      label: "System Settings",
      icon: Settings,
    },
  ];

  useEffect(() => {
    if (location.pathname !== currentPath) {
      setCurrentPath(location.pathname);
      window.location.reload();
    }
  }, [location.pathname]);

  return (
    <aside
      className={`w-64 h-full shadow-lg hidden md:block transition-all duration-300 ${darkMode ? "bg-gray-900 text-gray-100 border-r border-gray-700" : "bg-white text-gray-800 border-r border-gray-200"
        }`}
    >
      <div className="p-5">
        <h2
          className={`text-3xl font-extrabold tracking-wide ${darkMode ? "text-white" : "text-gray-800"
            }`}
        >
          Hospital System
        </h2>
      </div>
      <nav className="mt-8">
        {links.map((link, index) => {
          const Icon = link.icon;
          return (
            <Link
              key={index}
              to={link.to}
              className={`flex items-center px-5 py-3 my-2 rounded-lg transition-all duration-300 ${isActive(link.to)
                  ? darkMode
                    ? "bg-gray-800 text-white font-semibold border border-gray-600"
                    : "bg-gray-100 text-gray-900 font-semibold border border-gray-300"
                  : darkMode
                    ? "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                    : "hover:bg-gray-50 text-gray-600 hover:text-gray-800"
                }`}
            >
              <Icon className="w-6 h-6 mr-3" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
