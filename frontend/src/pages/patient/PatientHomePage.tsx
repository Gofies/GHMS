import { useState } from 'react'
import { Calendars } from '../../components/ui/patient/home/Calendar'
import { Button } from '../../components/ui/patient/home/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/patient/home/Card'
import { ScrollArea } from '../../components/ui/patient/home/Scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/patient/home/Avatar'
import { Badge } from '../../components/ui/patient/home/Badge'
import { CalendarDays, Home, User, FileText, PieChart, Settings, LogOut, MessageCircle, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/patient/home/Dialog'

export default function PatientHomeScreen() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const allAppointments = [
    { id: 1, doctor: "Dr. Smith", specialty: "Cardiology", date: "2023-05-15" },
    { id: 2, doctor: "Dr. Johnson", specialty: "Orthopedics", date: "2023-05-20" },
    { id: 3, doctor: "Dr. Williams", specialty: "Neurology", date: "2023-05-25" },
    { id: 4, doctor: "Dr. Brown", specialty: "Dermatology", date: "2023-06-05" },
    { id: 5, doctor: "Dr. Davis", specialty: "Ophthalmology", date: "2023-06-10" },
    { id: 6, doctor: "Dr. Miller", specialty: "Endocrinology", date: "2023-06-15" },
  ]

  const recentAppointments = allAppointments.slice(0, 3)
  const upcomingAppointments = allAppointments.slice(3)

  const appointmentDates = allAppointments.map(appointment => new Date(appointment.date))

  const handleNewAppointment = () => {
    console.log("Navigating to new appointment page")
    // Replace this with actual navigation logic
  }

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
            <User className="w-5 h-5 mr-2" />
            Profile
          </a>
          <a href="#" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100">
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Welcome, John Doe</h1>
            <Button variant="outline" onClick={() => setIsLoggedIn(!isLoggedIn)}>
              {isLoggedIn ? (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </>
              ) : (
                'Login'
              )}
            </Button>
          </div>
        </header>

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
                    appointmentDates={appointmentDates}
                    /*modifiers={{
                      appointment: appointmentDates,
                    }}
                    modifiersStyles={{
                      appointment: { color: 'white', backgroundColor: 'hsl(var(--primary))' }
                    }}*/
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
                    {upcomingAppointments.map((appointment) => (
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
                    ))}
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
                    {recentAppointments.map((appointment) => (
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
                      </div>
                    ))}
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
