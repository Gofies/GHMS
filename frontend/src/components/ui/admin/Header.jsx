import { Button } from "./Button.jsx"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../redux/authSlice.js";
import { LogOut } from "lucide-react";
import { useDarkMode } from "../../../helpers/DarkModeContext";

export default function Header({ title }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { darkMode } = useDarkMode(); // Dark mode durumunu alın

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/");
    };

    const { name, surname, role, isAuthenticated } = useSelector((state) => ({
        name: state.auth.name,
        surname: state.auth.surname,
        role: state.auth.role,
        isAuthenticated: state.auth.isAuthenticated,
    }));

    return (
        <header className={`${darkMode
                ? "bg-gray-900 text-white border-b border-gray-700"
                : "bg-white text-gray-900 border-b border-gray-200"
            } shadow-md transition-all duration-300`}>
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                {/* Sol: Title */}
                <div className="flex-1">
                    <h1 className={`text-3xl font-bold tracking-wide ${darkMode ? "text-white" : "text-gray-900"}`}>{title}</h1>
                </div>
                {/* Orta: Kullanıcı adı */}
                <div className="flex-1 text-center">
                    {isAuthenticated && (
                        <div className="text-gray-500">{role} {name} {surname}</div>
                    )}
                </div>
                {/* Sağ: Logout butonu */}
                <div className="flex-1 text-right">
                    <Button variant="outline" className={`flex items-center px-5 py-3 rounded-md transition-all duration-300 ${darkMode
                            ? "border-gray-500 text-white hover:bg-gray-800 hover:border-gray-400"
                            : "border-gray-300 text-gray-900 hover:bg-gray-100 hover:border-gray-400"
                        }`}
                        onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        <span className={`${darkMode ? "text-white" : "text-gray-900"}`}>Logout</span>
                    </Button>
                </div>
            </div>
        </header>

    )
}
