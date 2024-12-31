import { useState, useEffect } from 'react'
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

import Sidebar from "../../components/ui/lab-staff/common/Sidebar.jsx"
import Header from "../../components/ui/admin/Header.jsx";

import { Endpoint, getRequest, putRequest, deleteRequest } from "../../helpers/Network.js";

import { toast } from 'react-toastify';


export default function LabStaffTests() {

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTest, setSelectedTest] = useState(null)
  const [testResult, setTestResult] = useState({ result: '' })
  const [additionalNotes, setAdditionalNotes] = useState(null);
  const [pendingTests, setPendingTests] = useState(null)
  const [completedTests, setCompletedTests] = useState(null)


  const [error, setError] = useState(null);

  const fetchAllLabTests = async () => {
    try {
      const response = await getRequest(Endpoint.GET_LAB_TECHNICIAN_TESTS);
      console.log("response", response);
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
        testId: selectedTest._id, // Seçilen testin ID'si
        result: testResult.result, // Test sonucu
      };

      console.log("Requested Body:", requestedBody);

      const response = await putRequest(Endpoint.PUT_COMPLETE_TEST, requestedBody);

      console.log("Test completion response:", response);

      if (response) {
        // Pending ve Completed listeleri yeniden çek
        const updatedLabTests = await getRequest(Endpoint.GET_LAB_TECHNICIAN_TESTS);

        setPendingTests(updatedLabTests.pendingTests);
        setCompletedTests(updatedLabTests.completedTests);

        // Test seçimini ve formu sıfırla
        setSelectedTest(null);
        setTestResult({ result: "" });

        console.log("Test completed and lists updated successfully.");
      } else {
        throw new Error("Failed to complete test");
      }
    } catch (error) {
      console.error("Error completing test:", error);
      setError("Failed to complete test. Please try again.");
    }
  };


  const handleDelete = async (labTestId) => {
    console.log("ti", labTestId);
    try {
      // Silme isteğini backend'e gönder
      const response = await deleteRequest(`/labtechnician/test/labTests/${labTestId}`);
      console.log("reee", response);
      if (response) {
        toast.success('Lab test deleted successfully!');
        fetchAllLabTests();
        // Listeyi güncellemek için mevcut lab testleri yeniden yükle
        //setLabTests((prevTests) => prevTests.filter(test => test._id !== labTestId));
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
            test.patient?.name.toLowerCase().includes(searchTermLower) || // Hasta adı
            test.patient?.surname.toLowerCase().includes(searchTermLower) || // Hasta soyadı
            test.testType?.toLowerCase().includes(searchTermLower) || // Test türü
            test.urgency?.toLowerCase().includes(searchTermLower) // Aciliyet
          );
        })
        .sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
        
          // Önce urgency seviyesine göre sıralama
          if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
            return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
          }
        
          // Aynı urgency seviyesine sahip olanları createdAt'e göre descending sırala
          return dateB - dateA;
        })
    : [];
  


  const filteredCompletedTests = Array.isArray(completedTests)
    ? completedTests.filter(test => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        test.patient?.name.toLowerCase().includes(searchTermLower) || // Hasta adı
        test.patient?.surname.toLowerCase().includes(searchTermLower) || // Hasta soyadı
        test.testType?.toLowerCase().includes(searchTermLower) || // Test türü
        test.urgency?.toLowerCase().includes(searchTermLower) || // Aciliyet
        test.result?.toLowerCase().includes(searchTermLower)
      );
    })
    : [];



  return (
    <div className="flex h-screen bg-gray-100">
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
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Patient Surname</TableHead>
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
                          <TableCell>{test.patient.name}</TableCell>
                          <TableCell>{test.patient.surname}</TableCell>
                          <TableCell>{test.testType}</TableCell>
                          <TableCell>
                            <Badge variant={test.urgency === 'High' ? 'destructive' : test.urgency === 'Medium' ? 'default' : 'secondary'}>
                              {test.urgency}
                            </Badge>
                          </TableCell>
                          <TableCell>{test.doctor.name}</TableCell>
                          <TableCell>
                            {new Date(test.createdAt).toISOString().replace('T', ' ').slice(0, 16)}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedTest(test); // Test seçimini yap
                                    console.log("Selected test set:", test);
                                  }}
                                >
                                  Complete Test
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Complete Test for {selectedTest?.patient?.name || "Unknown"}
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
                                        className="col-span-3"
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
                              variant="primary"
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
                        <TableHead>Patient Surname</TableHead>
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
                          <TableCell>{test.patient.name}</TableCell>
                          <TableCell>{test.patient.surname}</TableCell>
                          <TableCell>{test.testType}</TableCell>
                          <TableCell>{test.doctor.name}</TableCell>
                          <TableCell>
                            {/* <Badge variant={test.result === 'Normal' ? 'default' : 'destructive'}> */}
                            {test.result}
                            {/* </Badge> */}
                          </TableCell>
                          <TableCell>
                            {test.resultDate && !isNaN(new Date(test.resultDate).getTime())
                              ? new Date(test.resultDate).toISOString().replace('T', ' ').slice(0, 16)
                              : "Invalid Date"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="primary"
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