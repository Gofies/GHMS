import { useState, useEffect } from 'react'
import { Button } from "../../components/ui/patient/appointment/Button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/patient/appointment/Card.jsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/patient/appointment/Dialog.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger } from "../../components/ui/patient/appointment/Select.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/patient/appointment/Table.jsx"
import { Plus, Info } from 'lucide-react'
import Sidebar from "../../components/ui/patient/common/Sidebar.jsx";
import Header from "../../components/ui/common/Header.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { Endpoint, getRequest } from "../../helpers/Network.js";

export default function AppointmentsPage() {

    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
    const [newAppointmentStep, setNewAppointmentStep] = useState(1);

    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
    const [isDoctorOpen, setIsDoctorOpen] = useState(false);
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [isTimeOpen, setIsTimeOpen] = useState(false);

    const [appointments, setAppointments] = useState([]);
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);

    const handleSelectSpecialty = (value) => {
        setSelectedSpecialty(value);
        setIsSpecialtyOpen(false);
    };

    const handleSelectDoctor = (value) => {
        setSelectedDoctor(value);
        setIsDoctorOpen(false);
    };

    const handleSelectDate = (e) => {
        setSelectedDate(e.target.value);
        setIsDateOpen(false);
    };

    const handleSelectTime = (value) => {
        setSelectedTime(value);
        setIsTimeOpen(false);
    };

    const handleOpenDialog = (appointment) => {
        setSelectedAppointment(appointment);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setSelectedAppointment(null);
        setIsDialogOpen(false);
    };

    const handleNewAppointment = () => {
        // Reset form state
        setSelectedSpecialty("")
        setSelectedDoctor("")
        setSelectedDate("")
        setSelectedTime("")
        setNewAppointmentStep(1)
        setIsNewAppointmentOpen(true)

        navigate(`${location.pathname}/new`);

    }

    const handleNextStep = () => {
        setNewAppointmentStep(newAppointmentStep + 1)
    }

    const handlePreviousStep = () => {
        setNewAppointmentStep(newAppointmentStep - 1)
    }

    const handleCloseNewAppointmentDialog = () => {
        setIsNewAppointmentOpen(false);
    };

    const navigate = useNavigate();
    const location = useLocation();

    const handleCreateAppointment = () => {
        navigate(`${location.pathname}new`);
    }

    useEffect(() => {
        const fetchPatientAppointments = async () => {
            try {
                const response = await getRequest(Endpoint.GET_HOME_APPOINTMENTS);
                console.log("response", response)
                setRecentAppointments(response.recentAppointments);
                setUpcomingAppointments(response.upcomingAppointments);
                const combinedAppointments = [
                    ...response.recentAppointments,
                    ...response.upcomingAppointments,
                ];

                setAppointments(combinedAppointments);
   
            } catch (err) {
                console.error('Error fetching patient profile:', err);
                setError('Failed to load patient profile.');
            }
        };
        fetchPatientAppointments();
    }, []);

    const [error, setError] = useState(null);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <Header title="Appointments" />
                {/* Appointments Content */}
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="border-b pb-2 mb-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-2xl font-bold">Your Appointments</CardTitle>
                            <Button onClick={handleNewAppointment}>
                                <Plus className="w-4 h-4 mr-2" />
                                New Appointment
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Doctor</TableHead>
                                        <TableHead>Polyclinic</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {appointments && appointments.length > 0 ? (
                                        appointments.map((appointment) => {
                                            const formattedDate = appointment.date.split("T")[0]; 
                                            return (
                                                <TableRow key={appointment.id}>
                                                    <TableCell>{`${appointment.doctor?.name || ''} ${appointment.doctor?.surname || ''}`}</TableCell>
                                                    <TableCell>{appointment.polyclinic?.name}</TableCell>
                                                    <TableCell>{formattedDate}</TableCell> 
                                                    <TableCell>{appointment.time}</TableCell>
                                                    <TableCell>{appointment.status}</TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center">
                                                No appointments found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* New Appointment Dialog */}

        </div>
    );
}