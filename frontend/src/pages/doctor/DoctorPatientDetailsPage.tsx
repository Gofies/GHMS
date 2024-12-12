import { useState, useEffect } from 'react'
import { Button } from "../../components/ui/doctor/patient-details/Button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/doctor/patient-details/Card.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/doctor/patient-details/Tabs.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/doctor/patient-details/Table.jsx"
import { Textarea } from "../../components/ui/doctor/patient-details/TextArea.jsx"
import { Home, Users, Clipboard, LogOut, FileText, History, Users as FamilyIcon, Pill, Calendar } from 'lucide-react'
import Link from "../../components/ui/doctor/management/Link.jsx"

import Sidebar from "../../components/ui/doctor/common/Sidebar.jsx"
import Header from "../../components/ui/common/Header.jsx";

import { Endpoint, getRequest, postRequest } from "../../helpers/Network.js";

import { useParams } from "react-router-dom"; // React Router'dan patientId'yi almak için
import { toast } from 'react-toastify'


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

  function calculateAge(birthdate) {
    // Doğum tarihini Date nesnesine çevir
    const birthDate = new Date(birthdate);

    // Bugünün tarihini al
    const today = new Date();

    // Yaşı hesapla
    let age = today.getFullYear() - birthDate.getFullYear();

    // Ay ve gün kontrolü yap (tam yaş için)
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--; // Doğum günü henüz geçmemişse yaşı bir azalt
    }

    return age;
  }

  const { doctorId, patientId } = useParams();

  const [newPrescription, setNewPrescription] = useState('')
 
  const [name, setName] = useState(null);
  const [surname, setSurname] = useState(null);
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState(null);
  const [bloodType, setBloodType] = useState(null);
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);

  const [activeTab, setActiveTab] = useState("results");
  const [labTests, setLabTests] = useState([]);
  const [familyHistory, setFamilyHistory] = useState([]);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [patientHistory, setPatientHistory] = useState([]);
  const [prescriptionHistory, setPrescriptionHistory] = useState([]);

  const [loading, setLoading] = useState(false);

  const [updateTrigger, setUpdateTrigger] = useState(false); // Yeni bir trigger


  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await postRequest(`/doctor/patient/${patientId}`, { doctorId });
        console.log("Response:", response);
        setLabTests(response.patient.labtests);
        setPatientHistory(response.patient.diagnoses);
        setFamilyHistory(response.patient.family);
        setPrescriptionHistory(response.patient.prescriptions);
        setAppointmentHistory(response.patient.appointments);
        setAge(calculateAge(response.patient.birthdate));
        setGender(response.patient.gender);
        setBloodType(response.patient.bloodtype);
        setWeight(response.patient.weight);
        setHeight(response.patient.height);
        setName(response.patient.name);
        setSurname(response.patient.surname);


      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    };

    fetchPatientDetails(); // Asenkron fonksiyonu çağır
  }, [updateTrigger]);

  const [medicine, setMedicine] = useState([]);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    quantity: "",
    time: "",
    form: "",
  });
  const [status, setStatus] = useState("ongoing");

   // İlacı listeye eklemek için
   const handleMedicineChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setNewMedicine((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMedicine = (e) => {
    e.preventDefault();
    console.log("add med")
    if (
      newMedicine.name &&
      newMedicine.quantity &&
      newMedicine.time &&
      newMedicine.form
    ) {
      setMedicine((prev) => [...prev, newMedicine]);
      setNewMedicine({ name: "", quantity: "", time: "", form: "" });
    }
  };

   const handlePrescriptionSubmit = async (e) => {
    console.log("handle pres");
    e.preventDefault();

    const prescriptionData = {
      medicine,
      status,
    };

    try {
      const response = await postRequest(`/doctor/patient/${patientId}/prescriptions`, prescriptionData);
      if (response) {
        toast("Prescription submitted successfully!");
        setMedicine([]); // Clear the form after submission
        setStatus("ongoing");
        setUpdateTrigger((prev) => !prev); // Trigger'ı değiştirerek useEffect'i tetikle

      } else {
        toast("Failed to submit prescription");
      }
    } catch (error) {
      console.error("Error submitting prescription:", error);
    }
  };


  const handleClose = () => {
    // Add your close card logic here
    console.log("Card closed");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header />
        {/* Patient Details Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Surname:</strong> {surname}</p>

                  <p><strong>Age:</strong> {age}</p>
                  <p><strong>Gender:</strong> {gender}</p>
                  <p><strong>Blood Type:</strong> {bloodType}</p>
                </div>
                <div>
                  <p><strong>Height:</strong> {height}</p>
                  <p><strong>Weight:</strong> {weight}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Tabs
              defaultValue="results"
              onValueChange={(value) => {
                console.log("Active Tab Changed:", value); // Konsolda kontrol edebilirsiniz
                setActiveTab(value);
              }}
            >
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
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Test</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Result</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {labTests && labTests.length > 0 ? (
                            labTests.map((result) => (
                              <TableRow key={result.id}>
                                <TableCell>{result.test}</TableCell>
                                <TableCell>{result.date}</TableCell>
                                <TableCell>{result.result}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} style={{ textAlign: "center" }}>
                                No results available.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
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
                        {patientHistory && patientHistory.length > 0 ? (
                          patientHistory.map((history) => (
                            <TableRow key={history.id}>
                              <TableCell>{history.condition}</TableCell>
                              <TableCell>{history.diagnosedDate}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} style={{ textAlign: "center" }}>
                              No patient history available.
                            </TableCell>
                          </TableRow>
                        )}
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
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Relation</TableHead>
                            <TableHead>Condition</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {familyHistory && familyHistory.length > 0 ? (
                            familyHistory.map((history) => (
                              <TableRow key={history.id}>
                                <TableCell>{history.relation}</TableCell>
                                <TableCell>{history.condition}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} style={{ textAlign: "center" }}>
                                No family history is available.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
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
      <TableHead>Status</TableHead>
      <TableHead>Start Date</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {prescriptionHistory && prescriptionHistory.length > 0 ? (
      prescriptionHistory.map((prescription) => {
        // İlaç isimlerini ve dozajlarını birleştir
        const medicationNames = prescription.medicine
          .map((med) => med.name)
          .join(", ");
        const medicationDosages = prescription.medicine
          .map((med) => `${med.quantity} ${med.form}`)
          .join(", ");

        return (
          <TableRow key={prescription._id}>
            <TableCell>{medicationNames}</TableCell>
            <TableCell>{medicationDosages}</TableCell>
            <TableCell>{prescription.status}</TableCell>
            <TableCell>{prescription.createdAt}</TableCell>
          </TableRow>
        );
      })
    ) : (
      <TableRow>
        <TableCell colSpan={4} style={{ textAlign: "center" }}>
          No prescription history is available.
        </TableCell>
      </TableRow>
    )}
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
                    {loading ? (
                      <p>Loading...</p> // Yüklenme durumunda mesaj göster
                    ) : (
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
                          {appointmentHistory && appointmentHistory.length > 0 ? ( // Eğer liste doluysa
                            appointmentHistory.map((appointment) => (
                              <TableRow key={appointment._id}>
                                <TableCell>{appointment.date}</TableCell>
                                <TableCell>{appointment.symptoms}</TableCell>
                                <TableCell>{appointment.possibleDiagnosis}</TableCell>
                                <TableCell>{appointment.actualDiagnosis}</TableCell>
                                <TableCell>{appointment.treatment}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} style={{ textAlign: "center" }}>
                                No appointments available.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>

                </Card>
              </TabsContent>
              <TabsContent value="new-prescription">
              <Card className="p-6 bg-white rounded-lg shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-bold">
          New Prescription
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePrescriptionSubmit}>
          <div className="grid grid-cols-5 gap-4 mb-6 items-center">
            {/* Medicine Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medicine Name
              </label>
              <input
                type="text"
                name="name"
                value={newMedicine.name}
                onChange={handleMedicineChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="text"
                name="quantity"
                value={newMedicine.quantity}
                onChange={handleMedicineChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time (days)
              </label>
              <input
                type="text"
                name="time"
                value={newMedicine.time}
                onChange={handleMedicineChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Form */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Form
              </label>
              <input
                type="text"
                name="form"
                value={newMedicine.form}
                onChange={handleMedicineChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Add Button */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleAddMedicine}
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
            >
              Add Medicine
            </Button>
          </div>

          {/* Medicine List */}
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-3">Medicines:</h4>
            <ul className="space-y-2">
              {medicine.map((med, index) => (
                <li
                  key={index}
                  className="p-2 bg-gray-100 rounded-md shadow border border-gray-300"
                >
                  {med.name} - {med.quantity} - {med.time} days - {med.form}
                </li>
              ))}
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
            >
              Submit Prescription
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}