import { Button } from "../../components/ui/doctor/homepage/Button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/doctor/homepage/Card.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/doctor/homepage/Table.jsx"
import { CalendarDays, Home, Users, FileText, Clipboard, LogOut } from 'lucide-react'

// Mock data for appointments
const appointments = [
  { id: 1, patient: "John Doe", time: "09:00 AM", type: "Check-up" },
  { id: 2, patient: "Jane Smith", time: "10:30 AM", type: "Follow-up" },
  { id: 3, patient: "Bob Johnson", time: "02:00 PM", type: "Consultation" },
  { id: 4, patient: "Alice Brown", time: "03:30 PM", type: "Check-up" },
]

// Mock data for recent lab results
const labResults = [
  { id: 1, patient: "John Doe", test: "Blood Test", date: "2023-06-01", status: "Normal" },
  { id: 2, patient: "Jane Smith", test: "X-Ray", date: "2023-06-02", status: "Abnormal" },
  { id: 3, patient: "Bob Johnson", test: "MRI", date: "2023-06-03", status: "Pending" },
]

export default function DoctorHomepage() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">Hospital System</h2>
        </div>
        <nav className="mt-6">
          <a href="#" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100">
            <Home className="w-5 h-5 mr-2" />
            Home
          </a>
          <a href="#" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100">
            <Users className="w-5 h-5 mr-2" />
            Patient Management
          </a>
          <a href="#" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100">
            <Clipboard className="w-5 h-5 mr-2" />
            Prescriptions
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Welcome, Dr. Smith</h1>
            <Button variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                  <CalendarDays className="w-5 h-5 mr-2" />
                  Today's Appointments
                </CardTitle>
                <CardDescription>Your schedule for today</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.patient}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>{appointment.type}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Recent Lab Results */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Recent Lab Results
                </CardTitle>
                <CardDescription>Latest patient test results</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Test</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {labResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>{result.patient}</TableCell>
                        <TableCell>{result.test}</TableCell>
                        <TableCell>{result.date}</TableCell>
                        <TableCell>{result.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  View All Patients
                </Button>
                <Button className="w-full">
                  <Clipboard className="w-4 h-4 mr-2" />
                  Write Prescription
                </Button>
                <Button className="w-full">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}