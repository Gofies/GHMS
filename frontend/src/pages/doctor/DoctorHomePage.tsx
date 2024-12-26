import { useState, useEffect } from 'react'
import { Button } from "../../components/ui/doctor/homepage/Button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/doctor/homepage/Card.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/doctor/homepage/Table.jsx"
import { CalendarDays, Home, Users, FileText, Clipboard, LogOut } from 'lucide-react'
import { Endpoint, getRequest } from "../../helpers/Network.js";
import { useNavigate, useLocation } from "react-router-dom";

import Sidebar from "../../components/ui/doctor/common/Sidebar.jsx"
import Header from "../../components/ui/common/Header.jsx";

export default function DoctorHomepage() {

  const [error, setError] = useState(null);
  const [homeAppointments, setHomeAppointments] = useState(null);
  const [labResults, setLabResults] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchDoctorHome = async () => {
      console.log("fdh");
      try {
        const response = await getRequest(Endpoint.GET_DOCTOR_HOME); // /doctor
        console.log("response", response);
        setHomeAppointments(response.todaysAppointments);
        setLabResults(response.filteredLabTests);
        // setHomeAppointments(response); 
      } catch (err) {
        console.error('Error fetching patient profile:', err);
        setError('Failed to load patient profile.');
      }
    };
    fetchDoctorHome();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
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
                    {homeAppointments && homeAppointments.length > 0 ? (
                      homeAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>{appointment.patient}</TableCell>
                          <TableCell>{appointment.time}</TableCell>
                          <TableCell>{appointment.type}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                          No records available
                        </TableCell>
                      </TableRow>
                    )}

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
                    {labResults && labResults.length > 0 ? (
                      labResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>{result.patient}</TableCell>
                          <TableCell>{result.test}</TableCell>
                          <TableCell>{result.date}</TableCell>
                          <TableCell>{result.status}</TableCell>
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

          {/* Quick Actions Card */}
      {/* <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button className="w-full" onClick={handleViewAllPatients}>
              <Users className="w-4 h-4 mr-2" />
              {loading ? 'Loading...' : isViewAllVisible ? 'Hide Patients' : 'View All Patients'}
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
      </Card> */}

        </div>
      </main>
    </div>
  )
}