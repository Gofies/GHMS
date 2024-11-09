import { useState } from 'react'
import { Button } from "../../components/ui/patient/appointment/Button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/patient/appointment/Card.jsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/patient/appointment/Dialog.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger } from "../../components/ui/patient/appointment/Select.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/patient/appointment/Table.jsx"
import { Plus, Info } from 'lucide-react'

import Sidebar from "../../components/ui/patient/appointment/Sidebar.jsx";
import Header from "../../components/ui/patient/appointment/Header.jsx";

// Mock data for appointments
const appointments = [
    { id: 1, doctor: "Dr. Smith", specialty: "Cardiology", date: "2023-06-15", time: "10:00 AM", status: "Scheduled" },
    { id: 2, doctor: "Dr. Johnson", specialty: "Orthopedics", date: "2023-06-20", time: "2:30 PM", status: "Completed" },
    { id: 3, doctor: "Dr. Williams", specialty: "Neurology", date: "2023-06-25", time: "11:15 AM", status: "Scheduled" },
]

// Mock data for specialties and doctors
const specialties = ["Cardiology", "Orthopedics", "Neurology", "Dermatology", "Pediatrics"]
const doctors = {
    "Cardiology": ["Dr. Smith", "Dr. Johnson"],
    "Orthopedics": ["Dr. Williams", "Dr. Brown"],
    "Neurology": ["Dr. Davis", "Dr. Miller"],
    "Dermatology": ["Dr. Wilson", "Dr. Moore"],
    "Pediatrics": ["Dr. Taylor", "Dr. Anderson"]
}
const times = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM"
]

export default function AppointmentsPage() {
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)
    const [newAppointmentStep, setNewAppointmentStep] = useState(1)
    const [selectedSpecialty, setSelectedSpecialty] = useState("")
    const [selectedDoctor, setSelectedDoctor] = useState("")
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedTime, setSelectedTime] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
    const [isDoctorOpen, setIsDoctorOpen] = useState(false);
    const [isTimeOpen, setIsTimeOpen] = useState(false);


    const handleSelectSpecialty = (value) => {
        setSelectedSpecialty(value);
        setSelectedDoctor(''); 
        setIsSpecialtyOpen(false);
    };

    const handleSelectDoctor = (value) => {
        setSelectedDoctor(value);
        setIsDoctorOpen(false);
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

    const handleCreateAppointment = () => {
        // Implement appointment creation logic here
        console.log("New appointment created:", { selectedSpecialty, selectedDoctor, selectedDate, selectedTime })
        setIsNewAppointmentOpen(false);
        // It will call createAppointment method
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <Header title="Appointments"/>
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
                                        <TableHead>Specialty</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {appointments.map((appointment) => (
                                        <TableRow key={appointment.id}>
                                            <TableCell>{appointment.doctor}</TableCell>
                                            <TableCell>{appointment.specialty}</TableCell>
                                            <TableCell>{appointment.date}</TableCell>
                                            <TableCell>{appointment.time}</TableCell>
                                            <TableCell>{appointment.status}</TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm" onClick={() => handleOpenDialog(appointment)}>
                                                    <Info className="w-4 h-4 mr-2" />
                                                    Details
                                                </Button>
                                                {isDialogOpen && selectedAppointment && (
                                                    <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Appointment Details</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="grid gap-4 py-4">
                                                                <div>
                                                                    <h3 className="font-semibold">Doctor:</h3>
                                                                    <p>{selectedAppointment?.doctor}</p>
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold">Specialty:</h3>
                                                                    <p>{selectedAppointment?.specialty}</p>
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold">Date:</h3>
                                                                    <p>{selectedAppointment?.date}</p>
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold">Time:</h3>
                                                                    <p>{selectedAppointment?.time}</p>
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold">Status:</h3>
                                                                    <p>{selectedAppointment?.status}</p>
                                                                </div>
                                                            </div>
                                                            {/* Close Button */}
                                                            <div className="flex justify-end mt-4">
                                                                <Button variant="outline" onClick={handleCloseDialog}>
                                                                    Close
                                                                </Button>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* New Appointment Dialog */}
            {isNewAppointmentOpen && (
                <Dialog open={isNewAppointmentOpen} onOpenChange={handleCloseNewAppointmentDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>New Appointment</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {newAppointmentStep === 1 && (
                                <div>
                                    <h3 className="font-semibold mb-2">Select Specialty:</h3>
                                    <Select>
                                        <SelectTrigger
                                            value={selectedSpecialty}
                                            onClick={() => setIsSpecialtyOpen(!isSpecialtyOpen)}
                                        />
                                        <SelectContent isOpen={isSpecialtyOpen}>
                                            {specialties.map((specialty) => (
                                                <SelectItem
                                                    key={specialty}
                                                    value={specialty}
                                                    onSelect={handleSelectSpecialty}
                                                />
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            {newAppointmentStep === 2 && selectedSpecialty && (
                                <div>
                                    <h3 className="font-semibold mb-2">Select Doctor:</h3>
                                    <Select>
                                        <SelectTrigger
                                            value={selectedDoctor}
                                            onClick={() => setIsDoctorOpen(!isDoctorOpen)}
                                        />
                                        <SelectContent isOpen={isDoctorOpen}>
                                            {doctors[selectedSpecialty]?.map((doctor) => (
                                                <SelectItem
                                                    key={doctor}
                                                    value={doctor}
                                                    onSelect={handleSelectDoctor}
                                                />
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            {newAppointmentStep === 3 && selectedSpecialty && selectedDoctor && (
                                <>
                                    <div>
                                        <h3 className="font-semibold mb-2">Select Date:</h3>
                                        <input
                                            type="date"
                                            className="w-full p-2 border rounded"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Select Time:</h3>
                                        <Select>
                                            <SelectTrigger
                                                value={selectedTime}
                                                onClick={() => setIsTimeOpen((prev) => !prev)}
                                            />
                                            <SelectContent isOpen={isTimeOpen}>
                                                {times.map((time) => (
                                                    <SelectItem
                                                        key={time}
                                                        value={time}
                                                        onSelect={handleSelectTime}
                                                    >
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )}

                        </div>
                        <div className="flex justify-between mt-4">
                            <Button variant="outline" onClick={handleCloseNewAppointmentDialog}>
                                Close
                            </Button>
                            {newAppointmentStep > 1 && (
                                <Button onClick={handlePreviousStep}>Previous</Button>
                            )}
                            {newAppointmentStep < 3 ? (
                                <Button onClick={handleNextStep}>Next</Button>
                            ) : (
                                <Button onClick={handleCreateAppointment}>Create Appointment</Button>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}

        </div>
    )
}