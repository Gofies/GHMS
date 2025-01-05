import { useState, useEffect } from 'react'
import { Button } from "../../components/ui/lab-staff/tests/Button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/lab-staff/tests/Card.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/lab-staff/tests/Table.jsx"
import { Badge } from "../../components/ui/lab-staff/tests/Badge.jsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/lab-staff/tests/Dialog.jsx"
import { Input } from "../../components/ui/lab-staff/tests/Input.jsx"
import { Label } from "../../components/ui/lab-staff/tests/Label.jsx"
import { Textarea } from "../../components/ui/lab-staff/tests/TextArea.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/lab-staff/tests/Tabs.jsx"
import { FlaskRoundIcon as Flask, Clipboard, Search } from 'lucide-react'
import { useDarkMode } from '../../helpers/DarkModeContext.js';
import Sidebar from "../../components/ui/lab-staff/common/Sidebar.jsx"
import Header from "../../components/ui/admin/Header.jsx";
import { Endpoint, getRequest, putRequest, deleteRequest } from "../../helpers/Network.js";
import { toast } from 'react-toastify';

export default function LabStaffTests() {

  const { darkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTest, setSelectedTest] = useState(null)
  const [testResult, setTestResult] = useState({ result: '' })
  const [pendingTests, setPendingTests] = useState(null)
  const [completedTests, setCompletedTests] = useState(null)
  const [error, setError] = useState(null);

  const fetchAllLabTests = async () => {
    try {
      const response = await getRequest(Endpoint.GET_LAB_TECHNICIAN_TESTS);
      setPendingTests(response.pendingTests);
      setCompletedTests(response.completedTests);
    } catch (err) {
      console.error('Error fetching patient profile:', err);
      setError('Failed to load patient profile.');
    }
  };

  useEffect(() => {
    fetchAllLabTests();
  }, []);

  const handleTestCompletion = async (e) => {
    e.preventDefault();

    if (!selectedTest) {
      console.error("No test selected.");
      return;
    }

    try {
      const requestedBody = {
        testId: selectedTest._id,
        result: testResult.result,
      };

      const response = await putRequest(Endpoint.PUT_COMPLETE_TEST, requestedBody);
      if (response) {
        const updatedLabTests = await getRequest(Endpoint.GET_LAB_TECHNICIAN_TESTS);
        setPendingTests(updatedLabTests.pendingTests);
        setCompletedTests(updatedLabTests.completedTests);
        setSelectedTest(null);
        setTestResult({ result: "" });
      } else {
        throw new Error("Failed to complete test");
      }
    } catch (error) {
      console.error("Error completing test:", error);
      setError("Failed to complete test. Please try again.");
    }
  };

  const handleDelete = async (labTestId) => {
    try {
      const response = await deleteRequest(`/labtechnician/test/labTests/${labTestId}`);
      if (response) {
        toast.success('Lab test deleted successfully!');
        fetchAllLabTests();
      } else {
        const errorData = await response.json();
        toast.error(`Failed to delete lab test: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting lab test:', error);
      toast.error('An error occurred while deleting the lab test.');
    }
  };

  const urgencyOrder = {
    High: 1,
    Medium: 2,
    Low: 3,
  };

  const filteredPendingTests = Array.isArray(pendingTests)
    ? pendingTests
      .filter(test => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          test.patient?.name.toLowerCase().includes(searchTermLower) ||
          test.patient?.surname.toLowerCase().includes(searchTermLower) ||
          test.testType?.toLowerCase().includes(searchTermLower) ||
          test.urgency?.toLowerCase().includes(searchTermLower)
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
          return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        }
        return dateB - dateA;
      })
    : [];

  const filteredCompletedTests = Array.isArray(completedTests)
    ? completedTests.filter(test => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        test.patient?.name.toLowerCase().includes(searchTermLower) ||
        test.patient?.surname.toLowerCase().includes(searchTermLower) ||
        test.testType?.toLowerCase().includes(searchTermLower) ||
        test.urgency?.toLowerCase().includes(searchTermLower) ||
        test.result?.toLowerCase().includes(searchTermLower)
      );
    })
    : [];

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-800 " : "bg-gray-100"}text-gray-900`}>
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Header title="Tests" />
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
                        <TableHead>Patient</TableHead>
                        <TableHead>Test Type</TableHead>
                        <TableHead>Urgency</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Request Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPendingTests?.map((test) => (
                        <TableRow key={test._id}>
                          <TableCell>{test.patient.name} {test.patient.surname}</TableCell>
                          <TableCell>{test.testType}</TableCell>
                          <TableCell>
                            <Badge variant={test.urgency === 'High' ? 'destructive' : test.urgency === 'Medium' ? 'default' : 'secondary'}>
                              {test.urgency}
                            </Badge>
                          </TableCell>
                          <TableCell>{test.doctor.name} {test.doctor.surname}</TableCell>
                          <TableCell>
                            {new Date(test.createdAt).toISOString().replace('T', ' ').slice(0, 16)}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Dialog
                                isOpen={isDialogOpen}
                                onClose={() => setIsDialogOpen(false)}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    className="text-blue-500 underline"
                                    onClick={() => { setIsDialogOpen(true); setSelectedTest(test); }}
                                  >
                                    Complete Test
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      <DialogTitle>
                                        Complete Test for {selectedTest?.patient?.name || "Unknown"} {selectedTest?.patient?.surname || ""}
                                      </DialogTitle>
                                    </DialogTitle>
                                  </DialogHeader>
                                  <form onSubmit={handleTestCompletion}>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="result" className="text-right">
                                          Test Result
                                        </Label>
                                        <Textarea
                                          id="result"
                                          className="col-span-4"
                                          value={testResult.result}
                                          onChange={(e) =>
                                            setTestResult((prev) => ({ ...prev, result: e.target.value }))
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="flex justify-end">
                                      <Button type="submit">Submit Results</Button>
                                    </div>
                                  </form>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="danger"
                                onClick={() => handleDelete(test._id)}
                              >
                                Delete
                              </Button>
                            </div>

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
                        <TableHead>Patient</TableHead>
                        <TableHead>Test Type</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Completed Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCompletedTests?.map((test) => (
                        <TableRow key={test._id}>
                          <TableCell>{test.patient.name} {test.patient.surname}</TableCell>
                          <TableCell>{test.testType}</TableCell>
                          <TableCell>{test.doctor.name} {test.doctor.surname}</TableCell>
                          <TableCell>
                            {test.result}
                          </TableCell>
                          <TableCell>
                            {test.resultDate && !isNaN(new Date(test.resultDate).getTime())
                              ? new Date(test.resultDate).toISOString().replace('T', ' ').slice(0, 16)
                              : "Invalid Date"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="danger"
                              onClick={() => handleDelete(test._id)}
                            >
                              Delete
                            </Button>
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