import { Button } from "./Button.jsx";
import { useDispatch } from "react-redux";
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

  return (
    <header
      className={`${
        darkMode
          ? "bg-gray-900 text-white border-b border-gray-700"
          : "bg-white text-gray-900 border-b border-gray-200"
      } shadow-md transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto py-5 px-6 sm:px-8 lg:px-10 flex justify-between items-center">
        <h1 className={`text-3xl font-bold tracking-wide ${darkMode ? "text-white" : "text-gray-900"}`}>
          {title}
        </h1>
        <Button
          variant="outline"
          className={`flex items-center px-5 py-3 rounded-md transition-all duration-300 ${
            darkMode
              ? "border-gray-500 text-white hover:bg-gray-800 hover:border-gray-400"
              : "border-gray-300 text-gray-900 hover:bg-gray-100 hover:border-gray-400"
          }`}
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          <span className={`${darkMode ? "text-white" : "text-gray-900"}`}>Logout</span>
        </Button>
      </div>
    </header>
  );
}
