import { useState, useEffect } from 'react'
import { Button } from "../../components/ui/patient/appointment/Button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/patient/appointment/Card.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/patient/appointment/Table.jsx"
import { Plus, X } from 'lucide-react'
import Sidebar from "../../components/ui/patient/common/Sidebar.jsx";
import Header from "../../components/ui/admin/Header.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { Endpoint, getRequest, deleteRequest } from "../../helpers/Network.js";
import { toast } from 'react-toastify'
import { useDarkMode } from '../../helpers/DarkModeContext.js';

export default function AppointmentsPage() {

    const { darkMode, toggleDarkMode } = useDarkMode();
    const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
    const [newAppointmentStep, setNewAppointmentStep] = useState(1);

    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    const [appointments, setAppointments] = useState([]);
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);

    const handleNewAppointment = () => {
        setSelectedSpecialty("")
        setSelectedDoctor("")
        setSelectedDate("")
        setSelectedTime("")
        setNewAppointmentStep(1)
        setIsNewAppointmentOpen(true)
        navigate(`${location.pathname}/new`);
    }

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchPatientAppointments = async () => {
            try {
                const response = await getRequest(Endpoint.GET_HOME_APPOINTMENTS);
                setRecentAppointments(response.recentAppointments);
                setUpcomingAppointments(response.upcomingAppointments);
                const combinedAppointments = [
                    ...response.upcomingAppointments,
                    ...response.recentAppointments,
                ];
                setAppointments(combinedAppointments);
            } catch (err) {
                console.error('Error fetching patient profile:', err);
                setError('Failed to load patient profile.');
            }
        };
        fetchPatientAppointments();
    }, []);

    const handleDeleteAppointment = async (id) => {
        try {
            const response = await deleteRequest(`/patient/appointments/${id}`);
            if (response) {
                toast.success("Appointment cancelled successfully");
                const response = await getRequest(Endpoint.GET_HOME_APPOINTMENTS);
                const combinedAppointments = [
                    ...response.upcomingAppointments,
                    ...response.recentAppointments,
                ];
                setAppointments(combinedAppointments);
            }
        } catch (err) {
            console.error('Error cancelling appointment:', err);
            setError('Failed to cancel appointment.');
        }
    };

    const [error, setError] = useState(null);

    return (
        <div className={`flex h-screen ${darkMode ? "bg-gray-800 " : "bg-gray-100"}text-gray-900`}>
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
                                        <TableHead>Hospital</TableHead>
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
                                            const appointmentDate = new Date(appointment.date);
                                            const today = new Date();
                                            const status = appointmentDate < today ? "Completed" : appointment.status;
                                            return (
                                                <TableRow key={appointment.id}>
                                                    <TableCell>{appointment.hospital?.name}</TableCell>
                                                    <TableCell>{`${appointment.doctor?.name || ''} ${appointment.doctor?.surname || ''}`}</TableCell>
                                                    <TableCell>{appointment.polyclinic?.name}</TableCell>
                                                    <TableCell>{formattedDate}</TableCell>
                                                    <TableCell>{appointment.time}</TableCell>
                                                    <TableCell>{status}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDeleteAppointment(appointment._id)}
                                                        >
                                                            <X className="w-4 h-4 mr-1" />
                                                            Cancel
                                                        </Button>
                                                    </TableCell>
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
        </div >
    );
}