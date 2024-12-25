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

  const [appointmentDates, setAppointmentDates] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();


  const handleNewAppointment = () => {
    console.log("Navigating to new appointment page")
    navigate(`${location.pathname}appointments/new`);
  }


  // useEffect(() => {
  //   const fetchPatientHome = async () => {
  //     try {
  //       const response = await getRequest(Endpoint.GET_HOME_APPOINTMENTS);
  //       console.log("response", response);
  //       setRecentAppointments(response.recentAppointments);
  //       setUpcomingAppointments(response.upcomingAppointments);

  //       const dates = response.recentAppointments
  //         ? response.recentAppointments.map(appointment => new Date(appointment.date))
  //         : [];
  //       setAppointmentDates(dates);

  //     } catch (err) {
  //       console.error('Error fetching patient profile:', err);
  //       setError('Failed to load patient profile.');
  //     }
  //   };
  //   fetchPatientHome();
  // }, []);

  useEffect(() => {
    const fetchPatientHome = async () => {
      try {
        const response = await getRequest(Endpoint.GET_HOME_APPOINTMENTS);
        console.log("e", response);

        const recentAppointments = (response.recentAppointments || []);
        const upcomingAppointments = (response.upcomingAppointments || []);

        // State'leri güncelle
        setRecentAppointments(recentAppointments);
        setUpcomingAppointments(upcomingAppointments);

        // Randevu tarihlerinin tamamını al ve Date nesnesine dönüştür
        const allDates = [
          ...(response.recentAppointments || []).map((appointment) => new Date(appointment.date)), // Date nesnesine çevir
          ...(response.upcomingAppointments || []).map((appointment) => new Date(appointment.date)),
        ];
        console.log("all", allDates);

        setAppointmentDates(allDates); // Tarihleri state'e ata
      } catch (err) {
        console.error("Error fetching patient profile:", err);
        setError("Failed to load patient profile.");
      }
    };

    fetchPatientHome();
  }, []);

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);

    // Tıklanan günün tarihini formatla
    const formattedDate = selectedDate.toLocaleDateString("en-CA"); // YYYY-MM-DD formatında

    // recentAppointments ve upcomingAppointments listelerini birleştir
    const allAppointments = [...recentAppointments, ...upcomingAppointments];

    // Tıklanan tarihe göre randevuları filtrele
    const filtered = allAppointments.filter(
      (appointment) => appointment.date.split("T")[0] === formattedDate
    );
    setFilteredAppointments(filtered);

    // Modal'ı aç
    setIsModalOpen(true);
  };



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
                  <Button onClick={handleNewAppointment} variant="primary" size="sm" >
                   <div className="flex items-center">
                   <Plus className="w-4 h-4 mr-2" />
                   <span>New Appointment</span>
                   </div>
                  </Button>
                </CardHeader>
                <CardContent>
                  <CardContent>
                    <Calendars
                      selected={date} // Doğru state'i kullanıyoruz
                      onSelect={handleDateSelect}
                      appointmentDates={appointmentDates} // Randevu tarihleri
                    />
                  </CardContent>
                </CardContent>

              </Card>

              {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                    <h2 className="text-lg font-bold mb-4">
                      Appointments for {date ? date.toDateString() : ""}
                    </h2>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((appointment) => (
                          <div key={appointment.id} className="flex items-center space-x-4 mb-4">
                            <div>
                            <p className="text-sm font-medium">
                              {appointment.doctor.name} {appointment.doctor.surname}
                            </p>
                              <p className="text-sm text-gray-500">{appointment.polyclinic?.name}</p>
                              <p className="text-xs text-gray-400">{appointment.date.split("T")[0]}</p>
                              <p className="text-xs text-gray-400">{appointment.time}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No appointments on this date.</p>
                      )}
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}


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
                          {/* <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${appointment.doctor}`} />
                            <AvatarFallback>{appointment.doctor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar> */}
                          <div>
                            <p className="text-sm font-medium">
                              {appointment.doctor.name} {appointment.doctor.surname}
                            </p>
                            <p className="text-sm text-gray-500">{appointment.polyclinic?.name}</p>
                            <p className="text-xs text-gray-400">{appointment.date}</p>
                            <p className="text-xs text-gray-400">{appointment.time}</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {recentAppointments && recentAppointments.length > 0 ? (
                      recentAppointments.map((appointment) => {
                        // Sadece tarih kısmını al
                        const formattedDate = appointment.date.split("T")[0];
                        return (
                          <div key={appointment.id} className="p-2 border rounded-md shadow-sm">
                            {/* <Avatar>
                              <AvatarImage
                                src={`https://api.dicebear.com/6.x/initials/svg?seed=${appointment.doctor}`}
                              />
                              <AvatarFallback>{appointment.doctor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar> */}
                            <div>
                            <p className="text-sm font-medium">
                              {appointment.doctor.name} {appointment.doctor.surname}
                            </p>
                              <p className="text-sm text-gray-500">{appointment.polyclinic?.name}</p>
                              <p className="text-xs text-gray-400">{formattedDate}</p> {/* Formatlanmış tarih */}
                              <p className="text-xs text-gray-400">{appointment.time}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500">No upcoming appointments.</p>
                    )}
                    </div>
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
