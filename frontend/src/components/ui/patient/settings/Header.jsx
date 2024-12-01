import { Button } from "./Button.jsx"
import { LogOut } from 'lucide-react'

export default function Header({ title }) {
    return (
        <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            <Button variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
            </Button>
        </div>
    </header> 
    )
}
