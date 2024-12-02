import { useState } from 'react'
import { Button } from "../../components/ui/doctor/patient-details/Button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/doctor/patient-details/Card.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/doctor/patient-details/Tabs.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/doctor/patient-details/Table.jsx"
import { Textarea } from "../../components/ui/doctor/patient-details/TextArea.jsx"
import { Home, Users, Clipboard, LogOut, FileText, History, Users as FamilyIcon, Pill, Calendar } from 'lucide-react'
import Link from "../../components/ui/doctor/management/Link.jsx"

// Mock data for patient details
const patientDetails = {
  id: 1,
  name: "John Doe",
  age: 45,
  gender: "Male",
  bloodType: "A+",
  height: "180 cm",
  weight: "75 kg",
  results: [
    { id: 1, test: "Blood Test", date: "2023-05-15", result: "Normal" },
    { id: 2, test: "X-Ray", date: "2023-04-20", result: "Abnormal" },
  ],
  patientHistory: [
    { id: 1, condition: "Hypertension", diagnosedDate: "2020-03-10" },
    { id: 2, condition: "Type 2 Diabetes", diagnosedDate: "2021-07-22" },
  ],
  familyHistory: [
    { id: 1, relation: "Father", condition: "Heart Disease" },
    { id: 2, relation: "Mother", condition: "Breast Cancer" },
  ],
  prescriptionHistory: [
    { id: 1, medication: "Lisinopril", dosage: "10mg", startDate: "2020-03-15", endDate: "Ongoing" },
    { id: 2, medication: "Metformin", dosage: "500mg", startDate: "2021-07-25", endDate: "Ongoing" },
  ],
  appointmentHistory: [
    { 
      id: 1, 
      date: "2023-05-15", 
      symptoms: "Persistent cough, fatigue", 
      possibleDiagnosis: "Upper respiratory infection",
      actualDiagnosis: "Bronchitis",
      treatment: "Prescribed antibiotics and rest"
    },
    { 
      id: 2, 
      date: "2023-03-02", 
      symptoms: "Joint pain, stiffness in hands", 
      possibleDiagnosis: "Arthritis, Carpal tunnel syndrome",
      actualDiagnosis: "Early-stage rheumatoid arthritis",
      treatment: "Referred to rheumatologist, prescribed anti-inflammatory medication"
    },
    { 
      id: 3, 
      date: "2023-01-10", 
      symptoms: "Headache, dizziness, high blood pressure reading", 
      possibleDiagnosis: "Hypertension exacerbation",
      actualDiagnosis: "Hypertension exacerbation",
      treatment: "Adjusted blood pressure medication dosage"
    },
  ],
}

export default function PatientDetails() {
  const [newPrescription, setNewPrescription] = useState('')

  const handlePrescriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the new prescription to your backend
    console.log("New prescription submitted:", newPrescription)
    setNewPrescription('')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">Hospital System</h2>
        </div>
        <nav className="mt-6">
          <Link href="/doctor/" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <Home className="w-5 h-5 mr-2" />
            Home
          </Link>
          <Link href="/doctor/patient-management" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <Users className="w-5 h-5 mr-2" />
            Patient Management
          </Link>
          <Link href="/doctor/prescriptions/" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100">
            <Clipboard className="w-5 h-5 mr-2" />
            Prescriptions
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Patient Details: {patientDetails.name}</h1>
            <Button variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Patient Details Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Age:</strong> {patientDetails.age}</p>
                  <p><strong>Gender:</strong> {patientDetails.gender}</p>
                  <p><strong>Blood Type:</strong> {patientDetails.bloodType}</p>
                </div>
                <div>
                  <p><strong>Height:</strong> {patientDetails.height}</p>
                  <p><strong>Weight:</strong> {patientDetails.weight}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="results">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="patient-history">Patient History</TabsTrigger>
              <TabsTrigger value="family-history">Family History</TabsTrigger>
              <TabsTrigger value="prescription-history">Prescription History</TabsTrigger>
              <TabsTrigger value="appointment-history">Appointment History</TabsTrigger>
              <TabsTrigger value="new-prescription">New Prescription</TabsTrigger>
            </TabsList>
            <TabsContent value="results">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Test Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Result</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patientDetails.results.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>{result.test}</TableCell>
                          <TableCell>{result.date}</TableCell>
                          <TableCell>{result.result}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="patient-history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <History className="w-5 h-5 mr-2" />
                    Patient History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Condition</TableHead>
                        <TableHead>Diagnosed Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patientDetails.patientHistory.map((history) => (
                        <TableRow key={history.id}>
                          <TableCell>{history.condition}</TableCell>
                          <TableCell>{history.diagnosedDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="family-history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FamilyIcon className="w-5 h-5 mr-2" />
                    Family History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Relation</TableHead>
                        <TableHead>Condition</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patientDetails.familyHistory.map((history) => (
                        <TableRow key={history.id}>
                          <TableCell>{history.relation}</TableCell>
                          <TableCell>{history.condition}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="prescription-history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Pill className="w-5 h-5 mr-2" />
                    Prescription History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medication</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patientDetails.prescriptionHistory.map((prescription) => (
                        <TableRow key={prescription.id}>
                          <TableCell>{prescription.medication}</TableCell>
                          <TableCell>{prescription.dosage}</TableCell>
                          <TableCell>{prescription.startDate}</TableCell>
                          <TableCell>{prescription.endDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="appointment-history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Appointment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Symptoms</TableHead>
                        <TableHead>Possible Diagnosis</TableHead>
                        <TableHead>Actual Diagnosis</TableHead>
                        <TableHead>Treatment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patientDetails.appointmentHistory.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>{appointment.date}</TableCell>
                          <TableCell>{appointment.symptoms}</TableCell>
                          <TableCell>{appointment.possibleDiagnosis}</TableCell>
                          <TableCell>{appointment.actualDiagnosis}</TableCell>
                          <TableCell>{appointment.treatment}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="new-prescription">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clipboard className="w-5 h-5 mr-2" />
                    New Prescription
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePrescriptionSubmit}>
                    <Textarea
                      placeholder="Enter new prescription details..."
                      value={newPrescription}
                      onChange={(e) => setNewPrescription(e.target.value)}
                      className="mb-4"
                    />
                    <Button type="submit">Submit Prescription</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}