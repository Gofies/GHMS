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


// Mock data for patients
const patients = [
  { id: 1, name: "John Doe", age: 45, gender: "Male", lastVisit: "2023-05-15" },
  { id: 2, name: "Jane Smith", age: 32, gender: "Female", lastVisit: "2023-06-02" },
  { id: 3, name: "Bob Johnson", age: 58, gender: "Male", lastVisit: "2023-05-20" },
  { id: 4, name: "Alice Brown", age: 27, gender: "Female", lastVisit: "2023-06-10" },
  { id: 5, name: "Charlie Davis", age: 41, gender: "Male", lastVisit: "2023-05-30" },
]

function calculateAge(birthdate) {
  // Doğum tarihini Date nesnesine çevir
  const birthDate = new Date(birthdate);

  // Bugünün tarihini al
  const today = new Date();

  // Yaşı hesapla
  let age = today.getFullYear() - birthDate.getFullYear();

  // Ay ve gün kontrolü yap (tam yaş için)
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--; // Doğum günü henüz geçmemişse yaşı bir azalt
  }

  return age;
}

export default function PatientManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);


  const location = useLocation();

  // Doctor ID'yi mevcut URL'den alıyoruz
  const paths = location.pathname.split("/");
  console.log("paths", paths)
  const doctorId = paths[2]; // /doctor/:doctorId/ kısmından doctorId'yi alır


  useEffect(() => {
    const handleViewAllPatients = async () => {
      setError(null);

      try {
        const response = await getRequest(Endpoint.GET_DOCTOR_PATIENTS);
        console.log('Patients:', response.patients);
        const a = extractPatients(response.patients);
        console.log("a", a);
        setPatients(Array.isArray(a) ? a : []); // Dizi kontrolü
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to fetch patients. Please try again later.');
      }
    };
    handleViewAllPatients();
  }, [])

  const extractPatients = (data) => {
    // Tüm appointments içinden patient bilgilerini toplar
    const patients = data.appointments.map((appointment) => appointment.patient);
    
    // Hastaları benzersiz hale getirir (aynı hastayı birden fazla eklememek için)
    const uniquePatients = Array.from(
      new Map(patients.map((patient) => [patient._id, patient])).values()
    );
  
    return uniquePatients;
  };

  const filteredPatients = Array.isArray(patients)
    ? patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];
  // hasta ismine göre sıralıyor

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Header title="Patient Appointments"/>
        {/* Patient List */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                <span>Patient List</span>
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
              </CardTitle>
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
                        <TableCell>{patient.date}</TableCell>
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