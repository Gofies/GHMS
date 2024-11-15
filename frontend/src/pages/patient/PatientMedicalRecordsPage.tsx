import { useState } from 'react'
import { Button } from "../../components/ui/patient/medical-records/Button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/patient/medical-records/Card.jsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/patient/medical-records/Dialog.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/patient/medical-records/Table.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/patient/medical-records/Tabs.jsx"
import { CalendarDays, Home, User, FileText, PieChart, Settings, LogOut, FileBarChart, Pill } from 'lucide-react'

// Mock data for medical records
const testResults = [
  { id: 1, test: "Complete Blood Count", date: "2023-05-15", result: "Normal", details: "All parameters within normal range" },
  { id: 2, test: "Lipid Panel", date: "2023-05-15", result: "Abnormal", details: "Elevated LDL cholesterol" },
  { id: 3, test: "Thyroid Function", date: "2023-04-20", result: "Normal", details: "TSH, T3, and T4 within normal limits" },
]

const analyses = [
  { id: 1, type: "X-Ray", bodyPart: "Chest", date: "2023-05-10", finding: "No abnormalities detected" },
  { id: 2, type: "MRI", bodyPart: "Knee", date: "2023-04-05", finding: "Minor meniscus tear in right knee" },
]

const diagnoses = [
  { id: 1, condition: "Hypertension", date: "2023-01-15", status: "Current", prescriptions: [
    { id: 1, name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
    { id: 2, name: "Hydrochlorothiazide", dosage: "12.5mg", frequency: "Once daily" },
  ]},
  { id: 2, condition: "Type 2 Diabetes", date: "2023-03-20", status: "Current", prescriptions: [
    { id: 3, name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
  ]},
  { id: 3, condition: "Seasonal Allergies", date: "2022-09-01", status: "Recurring", prescriptions: [
    { id: 4, name: "Cetirizine", dosage: "10mg", frequency: "Once daily as needed" },
  ]},
]

export default function MedicalRecordsPage() {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">Hospital System</h2>
        </div>
        <nav className="mt-6">
          <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <Home className="w-5 h-5 mr-2" />
            Home
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <User className="w-5 h-5 mr-2" />
            Profile
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <CalendarDays className="w-5 h-5 mr-2" />
            Appointments
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100">
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
            <h1 className="text-2xl font-semibold text-gray-900">Medical Records</h1>
            <Button variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Medical Records Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Tabs defaultValue="test-results" className="space-y-4">
            <TabsList>
              <TabsTrigger value="test-results">Test Results</TabsTrigger>
              <TabsTrigger value="analyses">Analyses</TabsTrigger>
              <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
            </TabsList>
            <TabsContent value="test-results">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <FileBarChart className="w-6 h-6 mr-2" />
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
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>{result.test}</TableCell>
                          <TableCell>{result.date}</TableCell>
                          <TableCell>{result.result}</TableCell>
                          <TableCell>{result.details}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analyses">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <FileBarChart className="w-6 h-6 mr-2" />
                    Analyses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Body Part</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Finding</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analyses.map((analysis) => (
                        <TableRow key={analysis.id}>
                          <TableCell>{analysis.type}</TableCell>
                          <TableCell>{analysis.bodyPart}</TableCell>
                          <TableCell>{analysis.date}</TableCell>
                          <TableCell>{analysis.finding}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="diagnoses">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <FileText className="w-6 h-6 mr-2" />
                    Diagnoses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Condition</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {diagnoses.map((diagnosis) => (
                        <TableRow key={diagnosis.id}>
                          <TableCell>{diagnosis.condition}</TableCell>
                          <TableCell>{diagnosis.date}</TableCell>
                          <TableCell>{diagnosis.status}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedDiagnosis(diagnosis)}>
                                  <Pill className="w-4 h-4 mr-2" />
                                  View Prescriptions
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Prescriptions for {selectedDiagnosis?.condition}</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  {selectedDiagnosis?.prescriptions.map((prescription) => (
                                    <div key={prescription.id} className="grid grid-cols-3 items-center gap-4">
                                      <p className="font-semibold">{prescription.name}</p>
                                      <p>{prescription.dosage}</p>
                                      <p>{prescription.frequency}</p>
                                    </div>
                                  ))}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}