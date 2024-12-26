import { useState, useEffect } from 'react'
import { Button } from "../../components/ui/doctor/management/Button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/doctor/management/Card.jsx"
import { Input } from "../../components/ui/doctor/management/Input.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/doctor/management/Table.jsx"
import { Home, Users, Clipboard, LogOut, Search } from 'lucide-react'
import Link from "../../components/ui/doctor/management/Link.jsx"
import { useNavigate, useLocation } from "react-router-dom";

import { Endpoint, getRequest } from "../../helpers/Network.js";

import Sidebar from "../../components/ui/doctor/common/Sidebar.jsx"
import Header from "../../components/ui/common/Header.jsx";

function calculateAge(birthdate) {
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function PatientManagement() {

  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);

  const location = useLocation();

  const paths = location.pathname.split("/");
  const doctorId = paths[2]; // /doctor/:doctorId/ kısmından doctorId'yi alır

  useEffect(() => {
    const handleViewAllPatients = async () => {
      setError(null);
      try {
        const response = await getRequest(Endpoint.GET_DOCTOR_PATIENTS);
        console.log('Patients:', response.patients);
        const a = extractPatients(response.patients);
        setPatients(Array.isArray(a) ? a : []); // Dizi kontrolü
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to fetch patients. Please try again later.');
      }
    };
    handleViewAllPatients();
  }, [])

  const extractPatients = (data) => {
    // Tüm appointments içinden patient bilgilerini toplar ve son randevu tarihini ekler
    const patientsWithLastVisit = data.appointments.reduce((acc, appointment) => {
      const patient = appointment.patient;
      const appointmentDate = new Date(appointment.date);
  
      // Eğer hasta daha önce eklenmemişse veya mevcut randevu tarihi daha yeniyse güncelle
      if (!acc[patient._id] || acc[patient._id].lastVisit < appointmentDate) {
        acc[patient._id] = {
          ...patient,
          lastVisit: appointmentDate,
        };
      }
  
      return acc;
    }, {});
  
    // Object.values ile benzersiz hastaları dizi olarak döndür
    return Object.values(patientsWithLastVisit);
  };

  const filteredPatients = Array.isArray(patients)
  ? patients.filter(patient => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        patient.name.toLowerCase().includes(searchTermLower) || // Name
        patient.surname.toLowerCase().includes(searchTermLower) || // Surname
        String(patient.age).includes(searchTermLower) || // Convert age to string and check
        patient.gender.toLowerCase().includes(searchTermLower) // Gender
      );
    })
  : [];


  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Header title="Patient Management"/>
        {/* Patient List */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                <span>Patient List</span>
                </CardTitle>

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
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Surname</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient._id}>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell>{patient.surname}</TableCell>
                        <TableCell>{calculateAge(patient.birthdate)}</TableCell>
                        <TableCell>{patient.gender}</TableCell>
                        <TableCell>{patient.lastVisit ? patient.lastVisit.toLocaleDateString() : "N/A"}</TableCell>
                        <TableCell>
                          <Link href={`/doctor/${doctorId}/patient-details/${patient._id}`}>
                            <Button variant="outline" size="sm">View Details</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        No patients found.
                      </TableCell>
                    </TableRow>
                  )}

                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}