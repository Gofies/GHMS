import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/patient/medical-records/Table.jsx"
import Sidebar from "../../components/ui/patient/common/Sidebar.jsx";
import Header from "../../components/ui/admin/Header.jsx";
import { useDarkMode } from '../../helpers/DarkModeContext.js';
import { Endpoint, getRequest } from "../../helpers/Network.js";

export default function MedicalRecordsPage() {

  const { darkMode, toggleDarkMode } = useDarkMode();
  const [testResults, setTestResults] = useState(null);
  const [error, setError] = useState(null);

  const fetchLabTests = async () => {
    try {
      const response = await getRequest(Endpoint.GET_LAB_TESTS);
      const pendingTests = response.labTests
        .filter(test => test.status === "pending")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const completedTests = response.labTests
        .filter(test => test.status === "completed")
        .sort((a, b) => new Date(b.resultdate).getTime() - new Date(a.resultdate).getTime());

      setTestResults([...pendingTests, ...completedTests]);
    } catch (err) {
      setError("Failed to fetch lab tests.");
    }
  };

  useEffect(() => {
    fetchLabTests();
  }, []);

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-800 " : "bg-gray-100"}text-gray-900`}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header title="Lab Tests" />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Test Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(testResults) && testResults.length > 0 ? (
                  testResults.map((result) => (
                    <TableRow key={result._id}>
                      <TableCell>{result.hospital?.name || '-'}</TableCell>
                      <TableCell>{`${result.doctor?.name || ''} ${result.doctor?.surname || ''}`}</TableCell>
                      <TableCell>{result.testType}</TableCell>
                      <TableCell>{result.status}</TableCell>
                      <TableCell>
                        {result.status === 'completed' ? result.result : 'Waiting...'}
                      </TableCell>
                      <TableCell>
                        {result.status === 'completed' ?
                          (result.resultdate && !isNaN(new Date(result.resultdate).getTime())
                            ? new Date(result.resultdate).toISOString().replace('T', ' ').slice(0, 16)
                            : "Invalid Date"
                          )
                          :
                          (result.createdAt && !isNaN(new Date(result.createdAt).getTime())
                            ? new Date(result.createdAt).toISOString().replace('T', ' ').slice(0, 16)
                            : "Invalid Date"
                          )
                        }
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      No lab tests...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}

