import { useState } from 'react'
import { Button } from "../../components/ui/doctor/management/Button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/doctor/management/Card.jsx"
import { Input } from "../../components/ui/doctor/management/Input.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/doctor/management/Table.jsx"
import { Home, Users, Clipboard, LogOut, Search } from 'lucide-react'
import Link from "../../components/ui/doctor/management/Link.jsx"

// Mock data for patients
const patients = [
  { id: 1, name: "John Doe", age: 45, gender: "Male", lastVisit: "2023-05-15" },
  { id: 2, name: "Jane Smith", age: 32, gender: "Female", lastVisit: "2023-06-02" },
  { id: 3, name: "Bob Johnson", age: 58, gender: "Male", lastVisit: "2023-05-20" },
  { id: 4, name: "Alice Brown", age: 27, gender: "Female", lastVisit: "2023-06-10" },
  { id: 5, name: "Charlie Davis", age: 41, gender: "Male", lastVisit: "2023-05-30" },
]

export default function PatientManagement() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">Hospital System</h2>
        </div>
        <nav className="mt-6">
          <Link href="/doctor/" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <Home className="w-5 h-5 mr-2" />
            Home
          </Link>
          <Link href="/doctor/patient-management/" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100">
            <Users className="w-5 h-5 mr-2" />
            Patient Management
          </Link>
          <Link href="/doctor/prescriptions/" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100">
            <Clipboard className="w-5 h-5 mr-2" />
            Prescriptions
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Patient Management</h1>
            <Button variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Patient List */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                <span>Patient List</span>
                <div className="flex items-center">
                  <Search className="w-5 h-5 mr-2 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.lastVisit}</TableCell>
                      <TableCell>
                        <Link href={`/doctor/patient-details/${patient.id}`}>
                          <Button variant="outline" size="sm">View Details</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}