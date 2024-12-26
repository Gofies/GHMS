// import { useState } from 'react'
// import { Button } from "../../components/ui/doctor/prescriptions/Button.jsx"
// import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/doctor/prescriptions/Card.jsx"
// import { Input } from "../../components/ui/doctor/prescriptions/Input.jsx"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/doctor/prescriptions/Table.jsx"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/doctor/prescriptions/Dialog.jsx"
// import { Label } from "../../components/ui/doctor/prescriptions/Label.jsx"
// import { Textarea } from "../../components/ui/doctor/prescriptions/TextArea.jsx"
// import { Home, Users, Clipboard, LogOut, Search, Plus, Edit } from 'lucide-react'
// import Link from "../../components/ui/doctor/prescriptions/Link.jsx"

// import Sidebar from "../../components/ui/doctor/common/Sidebar.jsx"
// import Header from "../../components/ui/common/Header.jsx";

// // Mock data for prescriptions
// const prescriptions = [
//   { id: 1, patientName: "John Doe", medication: "Lisinopril", dosage: "10mg", frequency: "Once daily", startDate: "2023-05-15", endDate: "2023-11-15" },
//   { id: 2, patientName: "Jane Smith", medication: "Metformin", dosage: "500mg", frequency: "Twice daily", startDate: "2023-06-01", endDate: "2023-12-01" },
//   { id: 3, patientName: "Bob Johnson", medication: "Atorvastatin", dosage: "20mg", frequency: "Once daily", startDate: "2023-05-20", endDate: "2024-05-20" },
//   { id: 4, patientName: "Alice Brown", medication: "Levothyroxine", dosage: "100mcg", frequency: "Once daily", startDate: "2023-04-10", endDate: "2024-04-10" },
//   { id: 5, patientName: "Charlie Davis", medication: "Amlodipine", dosage: "5mg", frequency: "Once daily", startDate: "2023-06-05", endDate: "2023-12-05" },
// ]

// export default function Prescriptions() {
//   const [searchTerm, setSearchTerm] = useState('')
//   const [newPrescription, setNewPrescription] = useState({
//     patientName: '',
//     medication: '',
//     dosage: '',
//     frequency: '',
//     startDate: '',
//     endDate: '',
//   })

//   const filteredPrescriptions = prescriptions.filter(prescription =>
//     prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     prescription.medication.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const handleNewPrescriptionSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     // Here you would typically send the new prescription to your backend
//     console.log("New prescription submitted:", newPrescription)
//     // Reset the form
//     setNewPrescription({
//       patientName: '',
//       medication: '',
//       dosage: '',
//       frequency: '',
//       startDate: '',
//       endDate: '',
//     })
//   }

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar />

//       {/* Main Content */}
//       <main className="flex-1 overflow-y-auto">
//         <Header title="Prescriptions"/>
//         {/* Prescriptions Content */}
//         <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-2xl font-bold flex items-center justify-between">
//                 <span>Prescription List</span>
//                 <div className="flex items-center space-x-2">
//                   <div className="flex items-center">
//                     <Search className="w-5 h-5 mr-2 text-gray-500" />
//                     <Input
//                       type="text"
//                       placeholder="Search prescriptions..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="max-w-sm"
//                     />
//                   </div>
//                   {/* <Dialog>
//                     <DialogTrigger asChild>
//                       <Button>
//                         <Plus className="w-4 h-4 mr-2" />
//                         New Prescription
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent>
//                       <DialogHeader>
//                         <DialogTitle>Add New Prescription</DialogTitle>
//                       </DialogHeader>
//                       <form onSubmit={handleNewPrescriptionSubmit} className="space-y-4">
//                         <div>
//                           <Label htmlFor="patientName">Patient Name</Label>
//                           <Input
//                             id="patientName"
//                             value={newPrescription.patientName}
//                             onChange={(e) => setNewPrescription({...newPrescription, patientName: e.target.value})}
//                             required
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="medication">Medication</Label>
//                           <Input
//                             id="medication"
//                             value={newPrescription.medication}
//                             onChange={(e) => setNewPrescription({...newPrescription, medication: e.target.value})}
//                             required
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="dosage">Dosage</Label>
//                           <Input
//                             id="dosage"
//                             value={newPrescription.dosage}
//                             onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})}
//                             required
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="frequency">Frequency</Label>
//                           <Input
//                             id="frequency"
//                             value={newPrescription.frequency}
//                             onChange={(e) => setNewPrescription({...newPrescription, frequency: e.target.value})}
//                             required
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="startDate">Start Date</Label>
//                           <Input
//                             id="startDate"
//                             type="date"
//                             value={newPrescription.startDate}
//                             onChange={(e) => setNewPrescription({...newPrescription, startDate: e.target.value})}
//                             required
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="endDate">End Date</Label>
//                           <Input
//                             id="endDate"
//                             type="date"
//                             value={newPrescription.endDate}
//                             onChange={(e) => setNewPrescription({...newPrescription, endDate: e.target.value})}
//                             required
//                           />
//                         </div>
//                         <Button type="submit">Add Prescription</Button>
//                       </form>
//                     </DialogContent>
//                   </Dialog> */}
//                 </div>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Patient Name</TableHead>
//                     <TableHead>Medication</TableHead>
//                     <TableHead>Dosage</TableHead>
//                     <TableHead>Frequency</TableHead>
//                     <TableHead>Start Date</TableHead>
//                     <TableHead>End Date</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredPrescriptions.map((prescription) => (
//                     <TableRow key={prescription.id}>
//                       <TableCell>{prescription.patientName}</TableCell>
//                       <TableCell>{prescription.medication}</TableCell>
//                       <TableCell>{prescription.dosage}</TableCell>
//                       <TableCell>{prescription.frequency}</TableCell>
//                       <TableCell>{prescription.startDate}</TableCell>
//                       <TableCell>{prescription.endDate}</TableCell>
//                       <TableCell>
//                         <Button variant="outline" size="sm">
//                           <Edit className="w-4 h-4 mr-2" />
//                           Edit
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     </div>
//   )
// }