import { Link, useLocation } from "react-router-dom";
import { Home, User, CalendarDays, FileText, PieChart, Settings, TestTube } from "lucide-react";
import { useSelector } from "react-redux";
import { useDarkMode } from "../../../../helpers/DarkModeContext";
import { useEffect, useState } from "react";

export default function Sidebar() {
    const location = useLocation();
    const { darkMode } = useDarkMode();
    const { userId } = useSelector((state) => state.auth);

    const links = [
        {
            to: `/labtechnician/${userId}/tests`,
            label: "Tests",
            icon: TestTube,
        },
        {
            to: `/labtechnician/${userId}/settings`,
            label: "Settings",
            icon: Settings,
        },
    ];

    return (
        <aside
            className={`w-64 shadow-md hidden md:block transition-all duration-300 ${
                darkMode ? "bg-gray-900 text-white border-r border-gray-700" : "bg-white text-gray-800 border-r border-gray-200"
            }`}
        >
            <div className="p-4">
                <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                    Hospital System
                </h2>
            </div>
            <nav className="mt-6">
                {links.map((link, index) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.to;

                    return (
                        <Link
                            key={index}
                            to={link.to}
                            className={`flex items-center px-4 py-2 mt-2 rounded-md transition-all duration-300 ${
                                isActive
                                    ? darkMode
                                        ? "bg-gray-800 text-white font-bold"
                                        : "bg-gray-200 text-gray-800 font-bold"
                                    : darkMode
                                    ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <Icon className="w-5 h-5 mr-2" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
