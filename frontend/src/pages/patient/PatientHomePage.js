import { useState, useEffect } from 'react'
import { Calendars } from '../../components/ui/patient/home/Calendar'
import { Button } from '../../components/ui/patient/home/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/patient/home/Card'
import { ScrollArea } from '../../components/ui/patient/home/Scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/patient/home/Avatar'
import { Badge } from '../../components/ui/patient/home/Badge'
import { Plus } from 'lucide-react'
//import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/patient/home/Dialog'

import Sidebar from "../../components/ui/patient/common/Sidebar.jsx";
import Header from "../../components/ui/common/Header.jsx";
import { Endpoint, getRequest } from "../../helpers/Network.js";
import { useNavigate, useLocation } from 'react-router-dom'
import { applyMiddleware } from '@reduxjs/toolkit'

export default function PatientHomeScreen() {

  const [date, setDate] = useState(null);
  const [error, setError] = useState(null);
  // const [homeAppointments, setHomeAppointments] = useState(null);

  const homeAppointments = [
    { id: 1, doctor: "Dr. Smith", specialty: "Cardiology", date: "2024-11-16" },
    { id: 2, doctor: "Dr. Johnson", specialty: "Orthopedics", date: "2024-11-15" },
    { id: 3, doctor: "Dr. Williams", specialty: "Neurology", date: "2024-11-14" },
    { id: 4, doctor: "Dr. Brown", specialty: "Dermatology", date: "2024-12-03" },
    { id: 5, doctor: "Dr. Davis", specialty: "Ophthalmology", date: "2024-12-02" },
    { id: 6, doctor: "Dr. Miller", specialty: "Endocrinology", date: "2024-12-01" },
  ]

  const [appointmentDates, setAppointmentDates] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);


  const navigate = useNavigate();
  const location = useLocation();


  const handleNewAppointment = () => {
    console.log("Navigating to new appointment page")
    navigate(`${location.pathname}appointments/new`);
  }


  useEffect(() => {
    const fetchPatientHome = async () => {
      try {
        const response = await getRequest(Endpoint.GET_HOME_APPOINTMENTS);
        console.log("response", response)
        setRecentAppointments(response.recentAppointments);
        setUpcomingAppointments(response.upcomingAppointments);

        const dates = response.recentAppointments
          ? response.recentAppointments.map(appointment => new Date(appointment.date))
          : [];
        setAppointmentDates(dates);

      } catch (err) {
        console.error('Error fetching patient profile:', err);
        setError('Failed to load patient profile.');
      }
    };
    fetchPatientHome();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  // if (!homeAppointments) {
  //   return <div>Loading...</div>; 
  // }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header title="Home" />
        {/* Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calendar */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Calendar</CardTitle>
                  <Button onClick={handleNewAppointment} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Appointment
                  </Button>
                </CardHeader>
                <CardContent>
                  <Calendars
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    appointmentDates={appointmentDates || []}
                    modifiers={{
                      appointment: appointmentDates,
                    }}
                    modifiersStyles={{
                      appointment: { color: 'white', backgroundColor: 'hsl(var(--primary))' }
                    }}
                  />
                </CardContent>
              </Card>

              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    {upcomingAppointments.length > 0 ? (
                      upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center space-x-4 mb-4">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${appointment.doctor}`} />
                            <AvatarFallback>{appointment.doctor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{appointment.doctor}</p>
                            <p className="text-sm text-gray-500">{appointment.specialty}</p>
                            <p className="text-xs text-gray-400">{appointment.date}</p>
                          </div>
                          <Badge variant="outline" className="ml-auto">Upcoming</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No upcoming appointments.</p>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Recent Appointments */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    {recentAppointments && recentAppointments.length > 0 ? (
                      recentAppointments.map((appointment) => {
                        // Sadece tarih kısmını al
                        const formattedDate = appointment.date.split("T")[0];
                        return (
                          <div key={appointment.id} className="flex items-center space-x-4 mb-4">
                            <Avatar>
                              <AvatarImage
                                src={`https://api.dicebear.com/6.x/initials/svg?seed=${appointment.doctor}`}
                              />
                              <AvatarFallback>{appointment.doctor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{appointment.doctor}</p>
                              <p className="text-sm text-gray-500">{appointment.specialty}</p>
                              <p className="text-xs text-gray-400">{formattedDate}</p> {/* Formatlanmış tarih */}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500">No upcoming appointments.</p>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </main>

    </div>
  )
}
