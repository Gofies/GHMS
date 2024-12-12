import { useState } from 'react'
import { Button } from "../../components/ui/lab-staff/tests/Button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/lab-staff/tests/Card.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/lab-staff/tests/Table.jsx"
import { Badge } from "../../components/ui/lab-staff/tests/Badge.jsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/lab-staff/tests/Dialog.jsx"
import { Input } from "../../components/ui/lab-staff/tests/Input.jsx"
import { Label } from "../../components/ui/lab-staff/tests/Label.jsx"
import { Textarea } from "../../components/ui/lab-staff/tests/TextArea.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/lab-staff/tests/Select.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/lab-staff/tests/Tabs.jsx"
import { Home, LogOut, FlaskRoundIcon as Flask, Clipboard, Search, AlertTriangle } from 'lucide-react'
import Link from "../../components/ui/lab-staff/tests/Link.jsx"

// Mock data for pending tests
const pendingTests = [
  { id: 1, patientName: "John Doe", testType: "Blood Test", urgency: "High", requestedBy: "Dr. Smith", requestDate: "2023-06-15" },
  { id: 2, patientName: "Jane Smith", testType: "Urinalysis", urgency: "Medium", requestedBy: "Dr. Johnson", requestDate: "2023-06-14" },
  { id: 3, patientName: "Bob Brown", testType: "X-Ray", urgency: "Low", requestedBy: "Dr. Williams", requestDate: "2023-06-13" },
  { id: 4, patientName: "Alice Green", testType: "MRI", urgency: "High", requestedBy: "Dr. Davis", requestDate: "2023-06-15" },
  { id: 5, patientName: "Charlie Wilson", testType: "CT Scan", urgency: "Medium", requestedBy: "Dr. Anderson", requestDate: "2023-06-14" },
]

// Mock data for completed tests
const completedTests = [
  { id: 1, patientName: "Eva Martinez", testType: "Blood Test", completedDate: "2023-06-14", result: "Normal" },
  { id: 2, patientName: "Frank Johnson", testType: "X-Ray", completedDate: "2023-06-13", result: "Abnormal" },
  { id: 3, patientName: "Grace Lee", testType: "Urinalysis", completedDate: "2023-06-12", result: "Normal" },
]

export default function LabStaffTests() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTest, setSelectedTest] = useState(null)
  const [testResult, setTestResult] = useState({ result: '', notes: '' })

  const filteredPendingTests = pendingTests.filter(test => 
    test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.testType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredCompletedTests = completedTests.filter(test => 
    test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.testType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTestCompletion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Here you would typically send the test result to your backend
    console.log(`Test ${selectedTest.id} completed:`, testResult)
    setTestResult({ result: '', notes: '' })
  }

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
          <Link href="#" className="flex items-center px-4 py-2 mt-2 text-gray-700 bg-gray-200">
            <Flask className="w-5 h-5 mr-2" />
            Tests
          </Link>
          <Link href="#" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200">
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
            <h1 className="text-2xl font-semibold text-gray-900">Lab Tests</h1>
            <Button variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Tests Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Search className="w-5 h-5 mr-2 text-gray-500" />
              <Input
                type="text"
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>

          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">Pending Tests</TabsTrigger>
              <TabsTrigger value="completed">Completed Tests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center">
                    <Flask className="w-5 h-5 mr-2" />
                    Pending Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Test Type</TableHead>
                        <TableHead>Urgency</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Request Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPendingTests.map((test) => (
                        <TableRow key={test.id}>
                          <TableCell>{test.patientName}</TableCell>
                          <TableCell>{test.testType}</TableCell>
                          <TableCell>
                            <Badge variant={test.urgency === 'High' ? 'destructive' : test.urgency === 'Medium' ? 'default' : 'secondary'}>
                              {test.urgency}
                            </Badge>
                          </TableCell>
                          <TableCell>{test.requestedBy}</TableCell>
                          <TableCell>{test.requestDate}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedTest(test)}>
                                  Complete Test
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Complete Test for {selectedTest?.patientName}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleTestCompletion}>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="result" className="text-right">
                                        Test Result
                                      </Label>
                                      <Select onValueChange={(value) => setTestResult({...testResult, result: value})}>
                                        <SelectTrigger className="col-span-3">
                                          <SelectValue placeholder="Select result" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="normal">Normal</SelectItem>
                                          <SelectItem value="abnormal">Abnormal</SelectItem>
                                          <SelectItem value="inconclusive">Inconclusive</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="notes" className="text-right">
                                        Additional Notes
                                      </Label>
                                      <Textarea 
                                        id="notes" 
                                        className="col-span-3"
                                        value={testResult.notes}
                                        onChange={(e) => setTestResult({...testResult, notes: e.target.value})}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end">
                                    <Button type="submit">Submit Results</Button>
                                  </div>
                                </form>
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

            <TabsContent value="completed">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center">
                    <Clipboard className="w-5 h-5 mr-2" />
                    Completed Tests
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCompletedTests.map((test) => (
                        <TableRow key={test.id}>
                          <TableCell>{test.patientName}</TableCell>
                          <TableCell>{test.testType}</TableCell>
                          <TableCell>{test.completedDate}</TableCell>
                          <TableCell>
                            <Badge variant={test.result === 'Normal' ? 'default' : 'destructive'}>
                              {test.result}
                            </Badge>
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