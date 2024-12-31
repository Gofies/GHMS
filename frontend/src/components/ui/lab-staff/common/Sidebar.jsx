import { Link, useLocation } from "react-router-dom";
import { Home, User, CalendarDays, FileText, PieChart, Settings, Clipboard, TestTube } from "lucide-react"; // Icon importlarını unutmayın
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Sidebar() {
    const location = useLocation(); 

    const isActive = (path) => location.pathname === path;
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
        <aside className="w-64 bg-white shadow-md hidden md:block">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-800">Hospital System</h2>
      </div>
      <nav className="mt-6">
        {links.map((link, index) => {
          const Icon = link.icon; 
          return (
            <Link
              key={index}
              to={link.to}
              className={`flex items-center px-4 py-2 mt-2 ${
                isActive(link.to)
                  ? "text-gray-800 bg-gray-200 font-bold"
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
