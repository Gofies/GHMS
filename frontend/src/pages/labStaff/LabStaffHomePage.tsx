import { useState } from 'react'
import { Button } from "../../components/ui/labstaff/homepage/Button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/labstaff/homepage/Card.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/labstaff/homepage/Table.jsx"
import { Badge } from "../../components/ui/labstaff/homepage/Badge.jsx"
import { Progress } from "../../components/ui/labstaff/homepage/Progress.jsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/labstaff/homepage/Dialog.jsx"
import { Input } from "../../components/ui/labstaff/homepage/Input.jsx"
import { Label } from "../../components/ui/labstaff/homepage/Label.jsx"
import { Textarea } from "../../components/ui/labstaff/homepage/TextArea.jsx"
import { Home, LogOut, FlaskRoundIcon as Flask, Clipboard, Bell, AlertTriangle, Send } from 'lucide-react'
import Link from "../../components/ui/labstaff/homepage/Link.jsx"

// Mock data for pending tests
const pendingTests = [
  { id: 1, patientName: "John Doe", testType: "Blood Test", urgency: "High", requestedBy: "Dr. Smith" },
  { id: 2, patientName: "Jane Smith", testType: "Urinalysis", urgency: "Medium", requestedBy: "Dr. Johnson" },
  { id: 3, patientName: "Bob Brown", testType: "X-Ray", urgency: "Low", requestedBy: "Dr. Williams" },
]

// Mock data for supply levels
const supplies = [
  { id: 1, name: "Test Tubes", level: 75 },
  { id: 2, name: "Microscope Slides", level: 45 },
  { id: 3, name: "Reagents", level: 30 },
]

export default function LabStaffHome() {
 const [selectedTest, setSelectedTest] = useState(null)

  const handleTestCompletion = (testId) => {
    // Here you would typically update the test status in your backend
    console.log(`Test ${testId} completed`)
  }

  const handleSupplyReport = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Here you would typically send the supply report to your backend
    console.log("Supply shortage reported")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">Lab Management</h2>
        </div>
        <nav className="mt-6">
          <Link href="#" className="flex items-center px-4 py-2 text-gray-700 bg-gray-200">
            <Home className="w-5 h-5 mr-2" />
            Dashboard
          </Link>
          <Link href="#" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200">
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
            <h1 className="text-2xl font-semibold text-gray-900">Welcome, Emily</h1>
            <Button variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Pending Tests */}
          <Card className="mb-6">
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
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell>{test.patientName}</TableCell>
                      <TableCell>{test.testType}</TableCell>
                      <TableCell>
                        <Badge variant={test.urgency === 'High' ? 'destructive' : test.urgency === 'Medium' ? 'default' : 'secondary'}>
                          {test.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell>{test.requestedBy}</TableCell>
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
                            <form onSubmit={() => handleTestCompletion(selectedTest?.id)}>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="result" className="text-right">
                                    Test Result
                                  </Label>
                                  <Textarea id="result" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="notes" className="text-right">
                                    Additional Notes
                                  </Label>
                                  <Textarea id="notes" className="col-span-3" />
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

          {/* Supply Levels */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center justify-between">
                <span className="flex items-center">
                  <Clipboard className="w-5 h-5 mr-2" />
                  Supply Levels
                </span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Report Shortage
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report Supply Shortage</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSupplyReport}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="supply" className="text-right">
                            Supply Item
                          </Label>
                          <Input id="supply" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="quantity" className="text-right">
                            Quantity Needed
                          </Label>
                          <Input id="quantity" type="number" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="urgency" className="text-right">
                            Urgency
                          </Label>
                          <Input id="urgency" className="col-span-3" />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit">Submit Report</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supplies.map((supply) => (
                  <div key={supply.id} className="flex items-center">
                    <span className="w-1/4">{supply.name}</span>
                    <Progress value={supply.level} className="w-1/2 mr-4" />
                    <span>{supply.level}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Communicate with Doctor</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Urgent Message
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <Bell className="w-4 h-4 mr-2" />
                  View All Notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}