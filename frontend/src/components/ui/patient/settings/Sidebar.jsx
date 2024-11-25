import { Home, User, CalendarDays, FileText, PieChart, Settings } from 'lucide-react'

export default function Sidebar() {
    return (
        <aside className="w-64 bg-white shadow-md hidden md:block">
            <div className="p-4">
                <h2 className="text-2xl font-bold text-gray-800">Hospital System</h2>
            </div>
            <nav className="mt-6">
                <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
                    <Home className="w-5 h-5 mr-2" />
                    Home
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
                    <User className="w-5 h-5 mr-2" />
                    Profile
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100">
                    <CalendarDays className="w-5 h-5 mr-2" />
                    Appointments
                </a>
                <a href="#" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100">
                    <FileText className="w-5 h-5 mr-2" />
                    Medical Records
                </a>
                <a href="#" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100">
                    <PieChart className="w-5 h-5 mr-2" />
                    Health Metrics
                </a>
                <a href="#" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100">
                    <Settings className="w-5 h-5 mr-2" />
                    Settings
                </a>
            </nav>
        </aside>
    )
}



