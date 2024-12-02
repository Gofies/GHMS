import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/patient/medical-records/Table.jsx"
import Sidebar from "../../components/ui/common/Sidebar.jsx";
import Header from "../../components/ui/common/Header.jsx";

import { Endpoint, getRequest } from "../../helpers/Network.js";

// const testResults = [
//   { id: 1, test: "Complete Blood Count", date: "2024-11-15", result: "Normal", details: "All parameters within normal range" },
//   { id: 2, test: "Lipid Panel", date: "2024-10-23", result: "Abnormal", details: "Elevated LDL cholesterol" },
//   { id: 3, test: "Thyroid Function", date: "2024-09-20", result: "Normal", details: "TSH, T3, and T4 within normal limits" },
// ]

// const analyses = [
//   { id: 1, type: "X-Ray", bodyPart: "Chest", date: "2024-09-10", finding: "No abnormalities detected" },
//   { id: 2, type: "MRI", bodyPart: "Knee", date: "2024-08-13", finding: "Minor meniscus tear in right knee" },
// ]

// const diagnoses = [
//   {
//     id: 1, condition: "Hypertension", date: "2024-10-15", status: "Current", prescriptions: [
//       { id: 1, name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
//       { id: 2, name: "Hydrochlorothiazide", dosage: "12.5mg", frequency: "Once daily" },
//     ]
//   },
//   {
//     id: 2, condition: "Type 2 Diabetes", date: "2024-09-21", status: "Current", prescriptions: [
//       { id: 3, name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
//     ]
//   },
//   {
//     id: 3, condition: "Seasonal Allergies", date: "2024-04-18", status: "Recurring", prescriptions: [
//       { id: 4, name: "Cetirizine", dosage: "10mg", frequency: "Once daily as needed" },
//     ]
//   },
// ]

export default function MedicalRecordsPage() {
  const [activeTab, setActiveTab] = useState("test-results"); 
  const [testResults, setTestResults] = useState(null);
  const [analyses, setAnalyses] = useState(null);
  const [diagnoses, setDiagnoses] = useState(null);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [error, setError] = useState(null);

  const fetchLabTests = async () => {
    try {
      const response = await getRequest(Endpoint.GET_LAB_TESTS);
      setTestResults(response.labTests);
    } catch (err) {
      setError("Failed to fetch lab tests.");
    }
  };

  const fetchOtherTests = async () => {
    try {
      const response = await getRequest(Endpoint.GET_OTHER_TESTS);
      setAnalyses(response.otherTests);
    } catch (err) {
      setError("Failed to fetch other tests.");
    }
  };

  const fetchDiagnoses = async () => {
    try {
      const response = await getRequest(Endpoint.GET_DIAGNOSES);
      setDiagnoses(response.diagnoses.diagnoses);
    } catch (err) {
      setError("Failed to fetch diagnoses.");
    }
  };

  useEffect(() => {
    if (activeTab === "test-results") {
      fetchLabTests();
    } else if (activeTab === "analyses") {
      fetchOtherTests();
    } else if (activeTab === "diagnoses") {
      fetchDiagnoses();
    }
  }, [activeTab]);

  // if (error) {
  //   return <div>{error}</div>;
  // }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header title="Medical Records" />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Tab Başlıkları */}
          <div className="flex space-x-4 border-b border-gray-300">
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === "test-results"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
                }`}
              onClick={() => setActiveTab("test-results")}
            >
              Test Results
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === "analyses"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
                }`}
              onClick={() => setActiveTab("analyses")}
            >
              Analyses
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === "diagnoses"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
                }`}
              onClick={() => setActiveTab("diagnoses")}
            >
              Diagnoses
            </button>
          </div>

          {/* Tab İçerikleri */}
          <div className="mt-4">
            {activeTab === "test-results" && (
              <div>
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
                    {Array.isArray(testResults) && testResults.length > 0 ? (
                      testResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>{result.test}</TableCell>
                          <TableCell>{result.date}</TableCell>
                          <TableCell>{result.result}</TableCell>
                          <TableCell>{result.details}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      // Boş bir satır ekleyin
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500">
                          No test results...
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {activeTab === "analyses" && (
              <div>
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
                    {Array.isArray(analyses) && analyses.length > 0 ? (
                      analyses.map((analysis) => (
                        <TableRow key={analysis.id}>
                          <TableCell>{analysis.type}</TableCell>
                          <TableCell>{analysis.bodyPart}</TableCell>
                          <TableCell>{analysis.date}</TableCell>
                          <TableCell>{analysis.finding}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500">
                          No analyses...
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {activeTab === "diagnoses" && (
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Condition</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(diagnoses) && diagnoses.length > 0 ? (
                      diagnoses.map((diagnosis) => (
                        <TableRow key={diagnosis.id}>
                          <TableCell>{diagnosis.condition}</TableCell>
                          <TableCell>{diagnosis.date}</TableCell>
                          <TableCell>{diagnosis.status}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-gray-500">
                          No diagnoses...
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
