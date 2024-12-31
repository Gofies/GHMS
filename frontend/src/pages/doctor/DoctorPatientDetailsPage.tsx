import { useState, useEffect } from 'react'
import { Button } from "../../components/ui/doctor/patient-details/Button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/doctor/patient-details/Card.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/doctor/patient-details/Tabs.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/doctor/patient-details/Table.jsx"
import { Textarea } from "../../components/ui/doctor/patient-details/TextArea.jsx"
import { Home, Users, Clipboard, LogOut, FileText, History, Users as FamilyIcon, Pill, Calendar } from 'lucide-react'
import Link from "../../components/ui/doctor/management/Link.jsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/admin/Dialog.jsx";
import { Search, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Input } from "../../components/ui/doctor/patient-details/Input.jsx";
import { Label } from "../../components/ui/doctor/patient-details/Label.jsx";
import { useDarkMode } from '../../helpers/DarkModeContext';
import Sidebar from "../../components/ui/doctor/common/Sidebar.jsx"
import Header from "../../components/ui/admin/Header.jsx";

import { Endpoint, getRequest, postRequest, putRequest, deleteRequest } from "../../helpers/Network.js";

import { useParams } from "react-router-dom";
import { toast } from 'react-toastify'
//import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";

const testSpecializations = {
  "Blood Test": ["Hematology", "Clinical Pathology"],
  "Urinalysis": ["Biochemistry"],
  "X-Ray": ["Radiology"],
  "MRI": ["Radiology", "Neurology"]
};

export default function PatientDetails() {
  const [editingPrescription, setEditingPrescription] = useState(null);
  const { darkMode, toggleDarkMode } = useDarkMode();
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

  const [basicInfo, setBasicInfo] = useState({
    name: null,
    surname: null,
    age: null,
    gender: null,
    bloodType: null,
    height: null,
    weight: null,
  });


  const [activeTab, setActiveTab] = useState("results");
  const [labTests, setLabTests] = useState([]);
  //const [familyHistory, setFamilyHistory] = useState([]);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [patientHistory, setPatientHistory] = useState([]);
  const [prescriptionHistory, setPrescriptionHistory] = useState([]);

  const [loading, setLoading] = useState(false);

  const [updateTrigger, setUpdateTrigger] = useState(false); // Yeni bir trigger

  //const [diagnosisHistory, setDiagnosisHistory] = useState([]);
  const [patientDetails, setPatientDetails] = useState({}); // Diğer temel hasta bilgileri için

  useEffect(() => {
    const fetchAllPatientDetails = async () => {
      try {
        const response = await getRequest(`/doctor/patient/${patientId}`);
        setBasicInfo({
          name: response.patient.name,
          surname: response.patient.surname,
          age: calculateAge(response.patient.birthdate),
          gender: response.patient.gender,
          bloodType: response.patient.bloodtype,
          height: response.patient.height,
          weight: response.patient.weight,
        });
        setLabTests(response.patient.labtests);
        setPrescriptionHistory(response.patient.prescriptions);
        setAppointmentHistory(response.patient.appointments);

      } catch (err) {
        console.error('Error fetching patient details:', err);
        //setError('Failed to fetch patient details.');
        setLoading(false);
      }
    };

    fetchAllPatientDetails();
  }, [updateTrigger]);

  const [tempEditingPrescription, setTempEditingPrescription] = useState(null);

  const handleEditPrescription = (prescription) => { // yeni
    setEditingPrescription(JSON.parse(JSON.stringify(prescription))); // Derin kopya
    setTempEditingPrescription(JSON.parse(JSON.stringify(prescription))); // Geçici düzenleme için kopya
  };

  const handleInputChangeInDialog = (index, field, value) => { // yeni
    setTempEditingPrescription((prev) => {
      const updatedMedicine = [...prev.medicine];
      updatedMedicine[index][field] = value; // İlgili alanı güncelle
      return { ...prev, medicine: updatedMedicine };
    });
  };

  const handleUpdatePrescription = async (e, id) => { // yeni
    e.preventDefault();

    try {
      const updatedData = {
        ...tempEditingPrescription, // Geçici düzenleme verilerini gönder
      };

      const response = await putRequest(
        `/doctor/patient/${patientId}/prescriptions/${id}`,
        updatedData
      );

      if (response) {
        toast.success("Prescription updated successfully!");
        setUpdateTrigger((prev) => !prev); // Listeleri güncellemek için tetikleyici
        setEditingPrescription(null); // Dialog'u kapat
        setTempEditingPrescription(null); // Geçici düzenlemeleri temizle
      } else {
        toast.error("Failed to update prescription.");
      }
    } catch (error) {
      console.error("Error updating prescription:", error);
      toast.error("An error occurred while updating the prescription.");
    }
  };


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

    // Validasyon: Gerekli alanların dolu olması kontrol edilir
    if (
      !newMedicine.name ||
      !newMedicine.quantity ||
      !newMedicine.time ||
      !newMedicine.form
    ) {
      toast.error("Please fill out all fields before adding a medicine.");
      return;
    }

    // Eğer validasyon geçtiyse ilacı ekle
    setMedicine((prev) => [...prev, newMedicine]);
    setNewMedicine({ name: "", quantity: "", time: "", form: "" });
  };


  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();

    // Validasyon: Boş ilaç veya status kontrolü
    if (medicine.length === 0) {
      toast.error("Please add at least one medicine.");
      return;
    }

    const prescriptionData = {
      medicine,
      status,
    };

    try {
      const response = await postRequest(`/doctor/patient/${patientId}/prescriptions`, prescriptionData);
      if (response) {
        toast.success("Prescription submitted successfully!");
        setMedicine([]); // Formu temizle
        setStatus("ongoing");
        setUpdateTrigger((prev) => !prev); // Trigger'ı değiştirerek useEffect'i tetikle
      } else {
        toast.error("Failed to submit prescription");
      }
    } catch (error) {
      console.error("Error submitting prescription:", error);
      toast.error("An error occurred while submitting the prescription.");
    }
  };


  const handleDeletePrescription = async (prescriptionId) => {
    try {
      // Delete request gönder
      const response = await deleteRequest(`/doctor/patient/${patientId}/prescriptions/${prescriptionId}`);
      if (response) {
        toast("Prescription deleted successfully!");
        setUpdateTrigger((prev) => !prev); // Trigger'ı değiştirerek useEffect'i tetikle
      } else {
        toast("Failed to delete prescription");
      }
    } catch (error) {
      console.error("Error deleting prescription:", error);
      toast("An error occurred while deleting the prescription");
    }
  };


  const [testType, setTestType] = useState('');
  const [urgency, setUrgency] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [tests, setTests] = useState([]);

  const [availableSpecializations, setAvailableSpecializations] = useState([]);

  const handleTestTypeChange = (e) => {
    const selectedTestType = e.target.value;
    setTestType(selectedTestType);

    // Specialization seçeneklerini güncelle
    if (testSpecializations[selectedTestType]) {
      setAvailableSpecializations(testSpecializations[selectedTestType]);
      setSpecialization(''); // Specialization'ı sıfırla
      setLabTechnicians([]); // Lab technicians listesini sıfırla
      setIsLabTechnicianVisible(false); // Lab technician alanını gizle
    } else {
      setAvailableSpecializations([]);
    }
  };

  // Urgency değişiminde çalışacak metod
  const handleUrgencyChange = (e) => {
    setUrgency(e.target.value);
    console.log('Urgency Changed:', e.target.value);
  };

  const handleSpecializationChange = async (e) => {
    const selectedSpecialization = e.target.value;
    setSpecialization(selectedSpecialization);

    try {
      const response = await getRequest(`/doctor/patient/${patientId}/labTests?specialization=${selectedSpecialization}`);
      if (response && response.labTechnicians) {
        setLabTechnicians(response.labTechnicians);
        setIsLabTechnicianVisible(true); // Eğer teknisyen varsa göster
      } else {
        setLabTechnicians([]);
        setIsLabTechnicianVisible(false); // Yoksa gizle
      }
    } catch (error) {
      console.error('Error fetching lab technicians:', error);
    }
  };

  const [labTechnicians, setLabTechnicians] = useState([]);
  const [labTechnician, setLabTechnician] = useState(null);
  const [isLabTechnicianVisible, setIsLabTechnicianVisible] = useState(false); // Lab technicians sekmesinin görünürlüğü

  // Specialization değiştiğinde tetiklenen API çağrısı
  const fetchLabTechnicians = async () => {
    try {
      console.log("spec", specialization);
      const response = await getRequest(`/doctor/patient/${patientId}/labTests?specialization=${specialization}`);
      console.log("r", response);
      if (response) {
        setLabTechnicians(response.labTechnicians);
        setIsLabTechnicianVisible(true); // Eğer teknisyenler varsa sekmeyi görünür yap

      } else {
        console.error('No lab technicians found for this specialization.');
        setIsLabTechnicianVisible(false); // Teknisyen bulunamadıysa gizle

      }
    } catch (error) {
      console.error('Error fetching lab technicians:', error);
    }
  };

  useEffect(() => {
    if (specialization) {
      setLabTechnicians([]);
      setLabTechnician(null);
      setIsLabTechnicianVisible(false);
      fetchLabTechnicians();
    }
  }, [specialization]);

  const handleSubmitLabTests = async (e) => {
    e.preventDefault();

    const requestBody = {
      patientId,
      testType,
      urgency,
      specialization,
      labTechnicianId: labTechnician, // Seçilen teknisyen ID'si
    };

    try {
      console.log("Request Body:", requestBody);
      const response = await postRequest(`/doctor/patient/${patientId}/labTests`, requestBody);
      if (response) {
        console.log("Response:", response);
        toast.success("Lab test submitted successfully!");
        setTests([]); // Gönderim sonrası test listesini sıfırla
        setTestType(''); // Formu temizle
        setUrgency('');
        setSpecialization('');
        setLabTechnician(null);
        setIsLabTechnicianVisible(false);
        setUpdateTrigger((prev) => !prev); // Results listesini güncelle

      } else {
        toast.error("Failed to submit lab tests.");
      }
    } catch (error) {
      console.error("Error submitting lab tests:", error);
      toast.error("An error occurred while submitting lab tests.");
    }
  };

  const handleRemoveMedicine = (index) => {
    // UI üzerinde ilaç listesini güncelle
    setTempEditingPrescription((prev) => ({
      ...prev,
      medicine: prev.medicine.filter((_, i) => i !== index),
    }));
  };


  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-800 " : "bg-gray-100"}text-gray-900`}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header title="Patient Detail"/>
        {/* Patient Details Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Name:</strong> {basicInfo.name}</p>
                  <p><strong>Surname:</strong> {basicInfo.surname}</p>
                  <p><strong>Age:</strong> {basicInfo.age}</p>
                  <p><strong>Gender:</strong> {basicInfo.gender}</p>
                </div>
                <div>
                  <p><strong>Height:</strong> {basicInfo.height} cm</p>
                  <p><strong>Weight:</strong> {basicInfo.weight} kg</p>
                  <p><strong>Blood Type:</strong> {basicInfo.bloodType}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Tabs
              defaultValue="results"
              onValueChange={(value) => {
                setActiveTab(value);
              }}
            >
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="results">Lab Tests</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                <TabsTrigger value="new-prescription">New Prescription</TabsTrigger>
                <TabsTrigger value="new-lab-test">New Lab Test</TabsTrigger>
              </TabsList>
              <TabsContent value="results">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Lab Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Lab Technician</TableHead>
                            <TableHead>Test Type</TableHead>
                            <TableHead>Result</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {labTests && labTests.length > 0 ? (
                            labTests.map((result) => (
                              <TableRow key={result.id}>
                                <TableCell>{result.doctor?.name} {result.doctor?.surname}</TableCell>
                                <TableCell>{result.labTechnician?.name} {result.labTechnician?.surname}</TableCell>
                                <TableCell>{result.testType}</TableCell>
                                <TableCell>
                                  {result.status === 'pending' ? 'Waiting...' : result.result}
                                </TableCell>
                                <TableCell>{result.status}</TableCell>
                                <TableCell>
                                  {result.status === 'pending'
                                    ? new Date(result.createdAt).toISOString().replace('T', ' ').slice(0, 16)
                                    : result.resultdate && !isNaN(new Date(result.resultdate).getTime())
                                      ? new Date(result.resultdate).toISOString().replace('T', ' ').slice(0, 16)
                                      : 'Invalid Date'}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} style={{ textAlign: "center" }}>
                                No lab tests available.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>

                </Card>
              </TabsContent>
              <TabsContent value="appointments">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <p>Loading...</p> // Yüklenme durumunda mesaj göster
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Polyclinic</TableHead>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {appointmentHistory && appointmentHistory.length > 0 ? ( // Eğer liste doluysa
                            appointmentHistory.map((appointment) => {
                              const appointmentDate = new Date(appointment.date);
                              const today = new Date();
                              const status = appointmentDate < today ? "Completed" : "Scheduled";
                              return (
                                <TableRow key={appointment._id}>
                                  <TableCell>{appointment.polyclinic?.name}</TableCell>
                                  <TableCell>{appointment.doctor?.name} {appointment.doctor?.surname}</TableCell>
                                  <TableCell>{status}</TableCell>
                                  <TableCell>{new Date(appointment.date).toISOString().split("T")[0]}</TableCell>
                                  <TableCell>{appointment.time}</TableCell>
                                </TableRow>
                              );
                            })
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
              <TabsContent value="prescriptions">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Prescriptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        <div className="grid gap-4">
                          {prescriptionHistory && prescriptionHistory.length > 0 ? (
                            prescriptionHistory.map((prescription) => {
                              console.log("p", prescription);
                              const formattedDate = new Date(prescription.createdAt)
                                .toISOString()
                                .split("T")[0];
                              return (
                                <Card
                                  key={prescription._id}
                                  className="p-4 bg-white rounded-lg shadow-md"
                                >
                                  <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold">Prescription</h3>
                                    <span className="text-sm text-gray-500">
                                      Status: {prescription.status}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    Start Date: {formattedDate}
                                  </p>
                                  <Table className="mt-4">
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Medication Name</TableHead>
                                        <TableHead>Dosage (ml)</TableHead>
                                        <TableHead>Duration (Days)</TableHead>
                                        <TableHead>Dosage Form</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {prescription.medicine.map((med, index) => (
                                        <TableRow key={index}>
                                          <TableCell>{med.name}</TableCell>
                                          <TableCell>{med.quantity}</TableCell>
                                          <TableCell>{med.time}</TableCell>
                                          <TableCell>{med.form}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                  <div className="flex justify-end space-x-2 mt-4">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleEditPrescription(prescription)}
                                        >
                                          Edit
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Edit Prescription</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={(e) => handleUpdatePrescription(e, editingPrescription._id)}>
                                          {/* Status */}
                                          <div className="mb-4">
                                            <Label>Status</Label>
                                            <select
                                              value={tempEditingPrescription?.status || ""}
                                              onChange={(e) =>
                                                setTempEditingPrescription((prev) => ({
                                                  ...prev,
                                                  status: e.target.value,
                                                }))
                                              }
                                              className={`block w-full px-3 py-2 rounded-md shadow-sm transition-all duration-300 ${darkMode
                                                ? "bg-gray-800 text-white border-gray-600 focus:ring-blue-500"
                                                : "bg-white text-gray-900 border-gray-300 focus:ring-blue-600"
                                                }`}
                                            >
                                              <option value="ongoing">Ongoing</option>
                                              <option value="completed">Completed</option>
                                            </select>
                                          </div>
                                          {/* Medicines */}
                                          {tempEditingPrescription?.medicine.map((med, index) => (
                                            <div key={index} className="grid grid-cols-5 gap-8 mb-4 items-center" >
                                              <div>
                                                <Label>Medication Name</Label>
                                                <Input
                                                  value={med.name}
                                                  onChange={(e) =>
                                                    handleInputChangeInDialog(index, "name", e.target.value)
                                                  }
                                                />
                                              </div>
                                              <div>
                                                <Label>Dosage (per day)</Label>
                                                <Input
                                                  value={med.quantity}
                                                  onChange={(e) =>
                                                    handleInputChangeInDialog(index, "quantity", e.target.value)
                                                  }
                                                />
                                              </div>
                                              <div>
                                                <Label>Duration (Days)</Label>
                                                <Input
                                                  value={med.time}
                                                  onChange={(e) =>
                                                    handleInputChangeInDialog(index, "time", e.target.value)
                                                  }
                                                />
                                              </div>
                                              <div>
                                                <Label>Dosage Form</Label>
                                                <Input
                                                  value={med.form}
                                                  onChange={(e) =>
                                                    handleInputChangeInDialog(index, "form", e.target.value)
                                                  }
                                                />
                                              </div>
                                              <div className="flex justify-center">
                                                <Button
                                                  variant="destructive"
                                                  size="sm"
                                                  onClick={() => handleRemoveMedicine(index)}
                                                >
                                                  Remove
                                                </Button>
                                              </div>
                                            </div>
                                          ))}
                                          <div className="flex justify-end mt-4 space-x-2">
                                            <Button type="submit" size="sm" variant="outline">
                                              Save
                                            </Button>
                                          </div>
                                        </form>
                                      </DialogContent>
                                    </Dialog>

                                    <Button
                                      type="submit"
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleDeletePrescription(prescription._id)
                                      }
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </Card>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} style={{ textAlign: "center" }}>
                                No prescriptions available.
                              </TableCell>
                            </TableRow>
                          )}
                        </div>
                      </TableBody>
                    </Table>
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
                      {/* Status Field */}
                      <div className="mb-6">
                        <Label className="block text-sm font-medium mb-1">
                          Status
                        </Label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className={`block w-full px-3 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ${darkMode
                            ? 'bg-gray-800 text-white border-gray-700 focus:ring-indigo-400 focus:border-indigo-400'
                            : 'bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                            }`}
                        >
                          <option value="ongoing">Ongoing</option>
                          <option value="completed">Completed</option>
                        </select>

                      </div>

                      {/* Medicine Fields */}
                      <div className="grid grid-cols-4 gap-4 mb-6 items-center">
                        {/* Medicine Name */}
                        <div>
                          <Label className="block text-sm font-medium mb-1">
                            Medication Name
                          </Label>
                          <Input
                            type="text"
                            name="name"
                            value={newMedicine.name}
                            onChange={handleMedicineChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        {/* Quantity */}
                        <div>
                          <Label className="block text-sm font-medium mb-1">
                            Dosage
                          </Label>
                          <Input
                            type="text"
                            name="quantity"
                            value={newMedicine.quantity}
                            onChange={handleMedicineChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        {/* Time */}
                        <div>
                          <Label className="block text-sm font-medium mb-1">
                            Duration (Days)
                          </Label>
                          <Input
                            type="text"
                            name="time"
                            value={newMedicine.time}
                            onChange={handleMedicineChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        {/* Form */}
                        <div>
                          <Label className="block text-sm font-medium mb-1">
                            Dosage Form
                          </Label>
                          <Input
                            type="text"
                            name="form"
                            value={newMedicine.form}
                            onChange={handleMedicineChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          />
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

                      <div className="grid grid-cols-4 gap-4 text-sm font-semibold">
                        <div>Medication Name</div>
                        <div>Dosage (ml)</div>
                        <div>Duration (Days)</div>
                        <div>Dosage Form</div>
                      </div>
                      <ul className="space-y-2 mt-2">
                        {medicine.map((med, index) => (
                          <li
                            key={index}
                            className={`p-2 rounded-md shadow border transition-all duration-300 ${darkMode
                              ? 'bg-gray-800 border-gray-700 text-white'
                              : 'bg-gray-100 border-gray-300 text-gray-800'
                              }`}
                          >
                            <div className="grid grid-cols-4 gap-4">
                              <div>{med.name}</div>
                              <div>{med.quantity}</div>
                              <div>{med.time} days</div>
                              <div>{med.form}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
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
              <TabsContent value="new-lab-test">
                <Card className="p-6 bg-white rounded-lg shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg font-bold">
                      New Lab Test
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitLabTests}>
                      {/* Test Type Field */}
                      <div className="mb-6">
                        <Label className="block text-sm font-medium text-gray-700 mb-1">
                          Test Type
                        </Label>
                        <select
                          name="testType"
                          value={testType}
                          onChange={handleTestTypeChange}
                          className={`block w-full px-3 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ${darkMode
                            ? 'bg-gray-800 text-white border-gray-700 focus:ring-indigo-400 focus:border-indigo-400'
                            : 'bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                            }`}                        >
                          <option value="">Select test type</option>
                          <option value="Blood Test">Blood Test</option>
                          <option value="Urinalysis">Urinalysis</option>
                          <option value="X-Ray">X-Ray</option>
                          <option value="MRI">MRI</option>
                        </select>
                      </div>

                      {/* Urgency Field */}
                      <div className="mb-6">
                        <Label className="block text-sm font-medium text-gray-700 mb-1">
                          Urgency
                        </Label>
                        <select
                          name="urgency"
                          value={urgency}
                          onChange={handleUrgencyChange}
                          className={`block w-full px-3 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ${darkMode
                            ? 'bg-gray-800 text-white border-gray-700 focus:ring-indigo-400 focus:border-indigo-400'
                            : 'bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                            }`}
                        >
                          <option value="">Select urgency</option>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>

                      {/* Specialization Field */}
                      <div className="mb-6">
                        <Label className="block text-sm font-medium text-gray-700 mb-1">
                          Specialization
                        </Label>
                        <select
                          name="specialization"
                          value={specialization}
                          onChange={handleSpecializationChange}
                          className={`block w-full px-3 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ${darkMode
                            ? 'bg-gray-800 text-white border-gray-700 focus:ring-indigo-400 focus:border-indigo-400'
                            : 'bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                            }`}                        >
                          <option value="">Select specialization</option>
                          {availableSpecializations.map((spec, index) => (
                            <option key={index} value={spec}>
                              {spec}
                            </option>
                          ))}
                        </select>
                      </div>
                      {isLabTechnicianVisible && (
                        <div className="mb-6">
                          <Label className="block text-sm font-medium text-gray-700 mb-1">
                            Assign Lab Technician
                          </Label>
                          <select
                            name="labTechnician"
                            value={labTechnician}
                            onChange={(e) => setLabTechnician(e.target.value)}
                            className={`block w-full px-3 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ${darkMode
                              ? 'bg-gray-800 text-white border-gray-700 focus:ring-indigo-400 focus:border-indigo-400'
                              : 'bg-white text-gray-900 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                              }`}                                 >
                            <option value="">Select lab technician</option>
                            {labTechnicians.map((technician) => (
                              <option key={technician._id} value={technician._id}>
                                {technician.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      {/* Submit Button */}
                      <div className="flex justify-end mt-6">
                        <Button
                          type="submit"
                          className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
                        >
                          Submit Lab Tests
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