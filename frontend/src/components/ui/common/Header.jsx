import { Button } from "./Button.jsx";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../redux/authSlice.js";
import { LogOut } from 'lucide-react';
import { useDarkMode } from "../../../helpers/DarkModeContext";

export default function Header({ title }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { darkMode } = useDarkMode();

    const handleLogout = () => {
      dispatch(logoutUser());
      navigate("/"); 
    };

    return (
        <header className={`shadow-sm transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{title}</h1>
            <Button variant="outline" onClick={handleLogout} className={`flex items-center px-4 py-2 rounded ${darkMode ? "border-gray-500 text-white hover:bg-gray-700" : "border-gray-300 text-gray-900 hover:bg-gray-100"}`}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
            </Button>
        </div>
    </header> 
    );
}