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

import Sidebar from "../../components/ui/doctor/common/Sidebar.jsx"
import Header from "../../components/ui/common/Header.jsx";

import { Endpoint, getRequest, postRequest, putRequest, deleteRequest } from "../../helpers/Network.js";

import { useParams } from "react-router-dom";
import { toast } from 'react-toastify'
//import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";


export default function PatientDetails() {
  const [editingPrescription, setEditingPrescription] = useState(null);

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
  const [familyHistory, setFamilyHistory] = useState([]);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [patientHistory, setPatientHistory] = useState([]);
  const [prescriptionHistory, setPrescriptionHistory] = useState([]);

  const [loading, setLoading] = useState(false);

  const [updateTrigger, setUpdateTrigger] = useState(false); // Yeni bir trigger

  const [diagnosisHistory, setDiagnosisHistory] = useState([]);
  const [patientDetails, setPatientDetails] = useState({}); // Diğer temel hasta bilgileri için

  // useEffect(() => {
  //   const fetchPatientDetails = async () => {
  //     try {
  //       // Lab Test Results
  //       const labTestResponse = await getRequest(`/doctor/patient/${patientId}/test-results`);
  //       setLabTests(labTestResponse.labtests);

  //       // Appointment History
  //       const appointmentResponse = await getRequest(`/doctor/patient/${patientId}/appointment-history`);
  //       setAppointmentHistory(appointmentResponse.appointments);

  //       // Diagnosis History
  //       const diagnosisResponse = await getRequest(`/doctor/patient/${patientId}/diagnosis-history`);
  //       setDiagnosisHistory(diagnosisResponse.diagnoses);

  //       // Family History
  //       const familyResponse = await getRequest(`/doctor/patient/${patientId}/family-history`);
  //       setFamilyHistory(familyResponse.family);

  //       // Prescription History
  //       const prescriptionResponse = await getRequest(`/doctor/patient/${patientId}/prescriptions`);
  //       setPrescriptionHistory(prescriptionResponse.prescriptions);

  //       // // Basic Patient Details (optional additional API)
  //       const patientDetailsResponse = await getRequest(`/doctor/patient/${patientId}`);
  //       console.log("q", patientDetails);
  //       setPatientDetails(patientDetailsResponse.patient);

  //       setLoading(false); // Tüm veri alımı tamamlandı
  //     } catch (err) {
  //       console.error('Error fetching patient details:', err);
  //       //setError('Failed to fetch patient details.');
  //       setLoading(false);
  //     }
  //   };

  //   fetchPatientDetails();
  // }, [updateTrigger]);


  useEffect(() => {
    const fetchAllPatientDetails = async () => {
      try {
        const response = await getRequest(`/doctor/patient/${patientId}`);
        console.log("r", response);
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
        setDiagnosisHistory(response.patient.diagnoses);
        setFamilyHistory(response.patient.family);
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

  // const [showEditDialog, setShowEditDialog] = useState(false);

  //const [editingPrescription, setEditingPrescription] = useState(null);
  const [tempEditingPrescription, setTempEditingPrescription] = useState(null);


  const handleEditPrescription = (prescription) => {
    // Dialog açılırken orijinal değerleri geçici bir state'e kopyalayın
    setEditingPrescription({ ...prescription });
    setTempEditingPrescription({ ...prescription }); // Geçici düzenleme için bir kopya oluştur
    console.log("a", prescription);
    console.log("Editing Prescription:", editingPrescription);
console.log("Temp Editing Prescription:", tempEditingPrescription);

  };

  const handleInputChangeInDialog = (index, field, value) => {
    // Yalnızca geçici state üzerinde değişiklik yap
    setTempEditingPrescription((prev) => {
      const updatedMedicine = [...prev.medicine];
      updatedMedicine[index][field] = value; // İlgili alanı güncelle
      return { ...prev, medicine: updatedMedicine };
    });
  };

  const handleUpdatePrescription = async (e, id) => {
    e.preventDefault();
  
    // Validasyon: Reçetede en az bir ilaç olmalı
    if (tempEditingPrescription?.medicine.length === 0) {
      toast.error("A prescription must have at least one medicine.");
      return;
    }
  
    // Validasyon: Reçete durumunun seçilmiş olması gerekiyor
    if (!tempEditingPrescription?.status) {
      toast.error("Please select a prescription status.");
      return;
    }
  
    try {
      const updatedData = {
        medicine: tempEditingPrescription.medicine, // Yalnızca geçici state'yi kullan
        status: tempEditingPrescription.status,
      };
  
      const response = await putRequest(
        `/doctor/patient/${patientId}/prescriptions/${id}`,
        updatedData
      );
  
      if (response) {
        toast.success("Prescription updated successfully!");
        setUpdateTrigger((prev) => !prev);
        setEditingPrescription(null);
        setTempEditingPrescription(null);
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

  // const handleSaveChanges = (id) => {
  //   const updatedPrescriptions = prescriptionHistory.map((prescription) => {
  //     if (prescription._id === id) {
  //       return editingPrescription;
  //     }
  //     return prescription;
  //   });
  // }

  // const handleSavePrescription = () => {
  //   if (editingPrescription) {
  //     // API'ye uygun body formatını oluştur
  //     const updatedData = {
  //       medicine: editingPrescription.medicine.map((med) => ({
  //         name: med.name,
  //         quantity: med.quantity,
  //         time: med.time,
  //         form: med.form,
  //       })),
  //       status: editingPrescription.status,
  //     };

  //     handleUpdatePrescription(editingPrescription._id, updatedData);
  //     setEditingPrescription(null); // Dialog'u kapat
  //   }
  // };


  const handleMedicineChange2 = (index, field, value) => {
    setEditingPrescription((prev) => {
      const updatedMedicine = [...prev.medicine];
      updatedMedicine[index][field] = value;
      return { ...prev, medicine: updatedMedicine };
    });
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
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="diagnosis-history">Diagnosis History</TabsTrigger>
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
              <TabsContent value="diagnosis-history">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <History className="w-5 h-5 mr-2" />
                      Diagnosis History
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
                        {diagnosisHistory && diagnosisHistory.length > 0 ? (
                          diagnosisHistory.map((history) => (
                            <TableRow key={history.id}>
                              <TableCell>{history.condition}</TableCell>
                              <TableCell>{history.diagnosedDate}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} style={{ textAlign: "center" }}>
                              No diagnosis history available.
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
                      <FileText className="w-5 h-5 mr-2" />
                      Prescription History
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
                                        <TableHead>Dosage</TableHead>
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
                                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                            >
                                              <option value="ongoing">Ongoing</option>
                                              <option value="completed">Completed</option>
                                            </select>
                                          </div>
                                          {/* Medicines */}
                                          {tempEditingPrescription?.medicine.map((med, index) => (
                                            <div key={index} className="grid grid-cols-4 gap-4 mb-4">
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
                                                <Label>Dosage</Label>
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
                                            </div>
                                          ))}
                                          <div className="flex justify-end mt-4 space-x-2">
                                            <Button type="submit" variant="primary">
                                              Save
                                            </Button>
                                          </div>
                                        </form>
                                      </DialogContent>

                                    </Dialog>

                                    <Button
                                      variant="destructive"
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
                                No prescription history is available.
                              </TableCell>
                            </TableRow>
                          )}
                        </div>
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
                            appointmentHistory.map((appointment) => {
                              // const formattedDate = new Date(appointment.date).toISOString().split("T")[0];
                              return (
                                <TableRow key={appointment._id}>
                                  {/* <TableCell>{formattedDate}</TableCell> */}
                                  <TableCell>{appointment.symptoms}</TableCell>
                                  <TableCell>{appointment.possibleDiagnosis}</TableCell>
                                  <TableCell>{appointment.actualDiagnosis}</TableCell>
                                  <TableCell>{appointment.treatment}</TableCell>
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

                      {/* Medicine Fields */}
                      <div className="grid grid-cols-4 gap-4 mb-6 items-center">
                        {/* Medicine Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Medication Name
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
                            Dosage
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
                            Duration (Days)
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
                            Dosage Form
                          </label>
                          <input
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