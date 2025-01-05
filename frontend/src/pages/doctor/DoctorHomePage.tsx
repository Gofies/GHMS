import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/doctor/homepage/Card.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/doctor/homepage/Table.jsx"
import { CalendarDays, FileText } from 'lucide-react'
import { Endpoint, getRequest } from "../../helpers/Network.js";
import { useDarkMode } from '../../helpers/DarkModeContext';
import Sidebar from "../../components/ui/doctor/common/Sidebar.jsx"
import Header from "../../components/ui/admin/Header.jsx";

export default function DoctorHomepage() {

  const [error, setError] = useState(null);
  const [homeAppointments, setHomeAppointments] = useState(null);
  const [labResults, setLabResults] = useState(null);
  const { darkMode, toggleDarkMode } = useDarkMode(); 

  useEffect(() => {
    const fetchDoctorHome = async () => {
      try {
        const response = await getRequest(Endpoint.GET_DOCTOR_HOME); 
        setHomeAppointments(response.allAppointments);
        setLabResults(response.labtests);
      } catch (err) {
        console.error('Error fetching patient profile:', err);
        setError('Failed to load patient profile.');
      }
    };
    fetchDoctorHome();
  }, []);

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-800 " : "bg-gray-100" }text-gray-900`}>
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
       <Header title="Home"/>
        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                  <CalendarDays className="w-5 h-5 mr-2" />
                  All Appointments
                </CardTitle>
                <CardDescription>Your schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {homeAppointments && homeAppointments.length > 0 ? (
                      homeAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>{appointment.patient.name} {appointment.patient.surname}</TableCell>
                          <TableCell>{new Date(appointment.date).toISOString().split("T")[0]}</TableCell>
                          <TableCell>{appointment.time}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                          No appointments available today.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            {/* Lab Results */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Lab Tests
                </CardTitle>
                <CardDescription>Patient lab tests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lab Technician</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Test Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {labResults && labResults.length > 0 ? (
                      labResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>{result.labTechnician?.name} {result.labTechnician?.surname}</TableCell>
                          <TableCell>{result.patient?.name} {result.patient?.surname}</TableCell>
                          <TableCell>{result.testType}</TableCell>
                          <TableCell>{result.status}</TableCell>
                          <TableCell>{new Date(result.createdAt).toISOString().replace('T', ' ').slice(0, 16)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} style={{ textAlign: 'center', fontStyle: 'italic' }}>
                          No lab results available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}