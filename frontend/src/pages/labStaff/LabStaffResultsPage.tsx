import { useState } from 'react'
import { Button } from "../../components/ui/lab-staff/results/Button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/lab-staff/results/Card.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/lab-staff/results/Table.jsx"
import { Badge } from"../../components/ui/lab-staff/results/Badge.jsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/lab-staff/results/Dialog.jsx"
import { Input } from "../../components/ui/lab-staff/results/Input.jsx"
import { Label } from "../../components/ui/lab-staff/results/Label.jsx"
import { Home, LogOut, FlaskRoundIcon as Flask, Clipboard, Search, Eye, Download } from 'lucide-react'
import Link from "../../components/ui/lab-staff/results/Link.jsx"

// Mock data for test results
const testResults = [
  { id: 1, patientName: "John Doe", testType: "Blood Test", completedDate: "2023-06-15", result: "Normal", reviewedBy: "Dr. Smith", urgency: "Low" },
  { id: 2, patientName: "Jane Smith", testType: "X-Ray", completedDate: "2023-06-14", result: "Abnormal", reviewedBy: "Dr. Johnson", urgency: "High" },
  { id: 3, patientName: "Bob Brown", testType: "Urinalysis", completedDate: "2023-06-13", result: "Normal", reviewedBy: "Dr. Williams", urgency: "Medium" },
  { id: 4, patientName: "Alice Green", testType: "MRI", completedDate: "2023-06-12", result: "Inconclusive", reviewedBy: "Dr. Davis", urgency: "High" },
  { id: 5, patientName: "Charlie Wilson", testType: "CT Scan", completedDate: "2023-06-11", result: "Normal", reviewedBy: "Dr. Anderson", urgency: "Low" },
]

export default function LabStaffResults() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedResult, setSelectedResult] = useState(null)

  const filteredResults = testResults.filter(result => 
    result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.result.toLowerCase().includes(searchTerm.toLowerCase())
  )


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">Lab Management</h2>
        </div>
        <nav className="mt-6">
          <Link href="/lab-staff-home" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200">
            <Home className="w-5 h-5 mr-2" />
            Dashboard
          </Link>
          <Link href="/lab-staff-tests" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200">
            <Flask className="w-5 h-5 mr-2" />
            Tests
          </Link>
          <Link href="#" className="flex items-center px-4 py-2 mt-2 text-gray-700 bg-gray-200">
            <Clipboard className="w-5 h-5 mr-2" />
            Results
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Test Results</h1>
            <Button variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Results Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Search className="w-5 h-5 mr-2 text-gray-500" />
              <Input
                type="text"
                placeholder="Search results..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <Clipboard className="w-5 h-5 mr-2" />
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Test Type</TableHead>
                    <TableHead>Completed Date</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Reviewed By</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>{result.patientName}</TableCell>
                      <TableCell>{result.testType}</TableCell>
                      <TableCell>{result.completedDate}</TableCell>
                      <TableCell>
                        <Badge variant={result.result === 'Normal' ? 'default' : result.result === 'Abnormal' ? 'destructive' : 'secondary'}>
                          {result.result}
                        </Badge>
                      </TableCell>
                      <TableCell>{result.reviewedBy}</TableCell>
                      <TableCell>
                        <Badge variant={result.urgency === 'High' ? 'destructive' : result.urgency === 'Medium' ? 'default' : 'secondary'}>
                          {result.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedResult(result)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Test Result Details</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Patient Name</Label>
                                  <div className="col-span-3">{selectedResult?.patientName}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Test Type</Label>
                                  <div className="col-span-3">{selectedResult?.testType}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Completed Date</Label>
                                  <div className="col-span-3">{selectedResult?.completedDate}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Result</Label>
                                  <div className="col-span-3">
                                    <Badge variant={selectedResult?.result === 'Normal' ? 'default' : selectedResult?.result === 'Abnormal' ? 'destructive' : 'secondary'}>
                                      {selectedResult?.result}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Reviewed By</Label>
                                  <div className="col-span-3">{selectedResult?.reviewedBy}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Urgency</Label>
                                  <div className="col-span-3">
                                    <Badge variant={selectedResult?.urgency === 'High' ? 'destructive' : selectedResult?.urgency === 'Medium' ? 'default' : 'secondary'}>
                                      {selectedResult?.urgency}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}