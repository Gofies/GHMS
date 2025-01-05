"use client";
import { useEffect, useState } from 'react';
import { Button } from "../../components/ui/admin/Button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/admin/Card.jsx";
import { Input } from "../../components/ui/admin/Input.jsx";
import { Label } from "../../components/ui/admin/Label.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/admin/Table.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/admin/Dialog.jsx";
import { Badge } from "../../components/ui/admin/Badge.jsx";
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import Sidebar from "../../components/ui/admin/Sidebar.jsx";
import Header from "../../components/ui/admin/Header.jsx";
import { Endpoint, postRequest, getRequest, putRequest, deleteRequest } from "../../helpers/Network.js";
import { toast } from 'react-toastify';
import { useDarkMode } from '../../helpers/DarkModeContext';

export default function AdminPolyclinicManagementPage() {

  const [doctors, setDoctors] = useState([]);
  const [inactiveDoctors, setInactiveDoctors] = useState([]);
  const { darkMode } = useDarkMode();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [polyclinics, setPolyclinics] = useState([]);
  const [filteredPolyclinics, setFilteredPolyclinics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [name, setName] = useState('');

  const handleLocationChange = () => {
    const pathParts = window.location.pathname.split("/");
    const hospitalId = pathParts[4]; 
    return hospitalId;
  };

  const fetchDoctors = async () => {
    try {
      const response = await getRequest(Endpoint.GET_ADMIN_DOCTOR);
      if (response) {
        setDoctors(response.doctors);
        setFilteredUsers(response.doctors);
      } else {
        toast.error('Failed to fetch users.');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('An error occurred while fetching user data.');
    }
  };

  const fetchInactiveDoctors = async () => {
    try {
      const response = await getRequest(Endpoint.GET_ADMIN_DOCTOR);
      if (response) {
        const inactiveDoctors = response.doctors.filter(doctor => !doctor.polyclinic);
        setInactiveDoctors(inactiveDoctors); 
      } else {
        toast.error('Failed to fetch doctors.');
      }
    } catch (error) {
      console.error('Error fetching inactive doctors:', error);
      toast.error('An error occurred while fetching doctor data.');
    }
  };

  const fetchPolyclinics = async () => {
    try {
      const hospitalId = handleLocationChange();
      const response = await getRequest(`${Endpoint.GET_ADMIN_POLYCLINIC}/${hospitalId}`);
      if (response) {
        const fetchedPolyclinics = response.polyclinics; 
        setPolyclinics(fetchedPolyclinics); 
        setFilteredPolyclinics(fetchedPolyclinics); 
      } else {
        console.error("Invalid data format:", response);
        setPolyclinics([]); 
        setFilteredPolyclinics([]);
      }
    } catch (error) {
      console.error("Error fetching polyclinics:", error);
      setPolyclinics([]);
      setFilteredPolyclinics([]);
    }
  };

  useEffect(() => {
    fetchPolyclinics();
    fetchDoctors();
    fetchInactiveDoctors();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = polyclinics.filter((poly) =>
        poly.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPolyclinics(filtered); 
    } else {
      setFilteredPolyclinics(polyclinics);
    }
  }, [searchTerm, polyclinics]);

  const handleCreatePolyclinic = async (e) => {
    setEditMode(false);
    setName(''); 
    setSelectedDoctors([]); 
    setEditingPolyclinicId(null);
    e.preventDefault();
    try {
      fetchInactiveDoctors();
    } catch (error) {
      console.error('Error:', error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleSavePolyclinic = async (e) => {
    e.preventDefault();
    let hospitalId2 = handleLocationChange();

    const requestBody = {
      name,
      hospitalId: hospitalId2,
      doctorIds: selectedDoctors
    };
    try {
      const responseData = await postRequest(Endpoint.GET_ADMIN_POLYCLINIC, requestBody);
      if (responseData) {
        toast.success("Polyclinic created successfully!");
        fetchPolyclinics(); 

      } else {
        toast.error("An error occurred during poly creation.");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An unexpected error occurred.");
    }
  };

  const deletePolyclinic = async (id) => {
    try {
      const response = await deleteRequest(`${Endpoint.GET_ADMIN_POLYCLINIC}/${id}`);
      if (response) {
        toast.success('User deleted successfully!');
        setPolyclinics(polyclinics.filter(poly => poly._id !== id));
        setFilteredPolyclinics(filteredPolyclinics.filter(poly => poly._id !== id));
      } else {
        toast.error('Failed to delete user.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('An unexpected error occurred while deleting the user.');
    }
  };

  const [selectedDoctors, setSelectedDoctors] = useState([]);

  const handleDoctorSelect = (doctorId) => {
    setSelectedDoctors((prev) => {
      if (prev.includes(doctorId)) {
        return prev.filter((id) => id !== doctorId);
      } else {
        return [...prev, doctorId];
      }
    });
  };

  const [editMode, setEditMode] = useState(false);
  const [editingPolyclinicId, setEditingPolyclinicId] = useState(null);
  const [combinedDoctors, setCombinedDoctors] = useState([]);

  const handleEditPolyclinic = async (polyclinic) => {
    setEditingPolyclinicId(polyclinic._id);
    setName(polyclinic.name);
    setSelectedDoctors(polyclinic.doctors || []); 

    try {
      const response = await getRequest(Endpoint.GET_ADMIN_DOCTOR);
      if (response) {
        const filteredDoctors = inactiveDoctors.filter(
          (doctor) => doctor.specialization === polyclinic.name
        ); 
        setCombinedDoctors(filteredDoctors);
      } else {
        toast.error("Failed to fetch doctors.");
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("An error occurred while fetching doctor data.");
    }
  };

  const handleUpdatePolyclinic = async (e) => {
    e.preventDefault();
    const hospitalId2 = handleLocationChange();
    const requestBody = {
      name,
      hospitalId: hospitalId2,
      doctors: selectedDoctors,
    };

    try {
      const responseData = await putRequest(`${Endpoint.GET_ADMIN_POLYCLINIC}/${editingPolyclinicId}`, requestBody);
      if (responseData) {
        toast.success("Polyclinic updated successfully!");
        await fetchPolyclinics();
        setEditingPolyclinicId(null);
        setCombinedDoctors([]);
      } else {
        toast.error("An error occurred during polyclinic update.");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 " : "bg-gray-100" }text-gray-900`}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header title="Polyclinic Management" />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Search className="w-5 h-5 mr-2 text-gray-500" />
              <Input
                type="text"
                placeholder="Search polyclinics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={handleCreatePolyclinic}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Polyclinic
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Polyclinic</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSavePolyclinic}>
                  <div className="grid grid-cols-2 gap-6 py-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Cardiology"
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label>Doctors</Label>
                      <div className="border p-2 rounded">
                        {combinedDoctors.map((doctor) => (
                          <div key={doctor._id} className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              id={doctor._id}
                              checked={selectedDoctors.includes(doctor._id)}
                              onChange={() => handleDoctorSelect(doctor._id)}
                              className="mr-2"
                            />
                            <label htmlFor={doctor._id} className="text-sm">
                              {doctor.name}
                            </label>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">Select doctors for this polyclinic</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">Save Polyclinic</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Polyclinic List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Doctors</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPolyclinics.map((poly) => (
                    <TableRow key={poly._id}>
                      <TableCell>{poly.name}</TableCell>
                      <TableCell>
                        <div
                          style={{
                            maxHeight: "100px",
                            overflowY: "auto",
                            overflowX: "hidden",
                            padding: "0.5rem",
                            backgroundColor: darkMode ? "#2d3748" : "#f9f9f9",  
                            borderRadius: "4px",
                          }}
                        >
                          {poly.doctors.map((doctorId, index) => {
                            const doctor = doctors.find((doc) => doc._id === doctorId);
                            return doctor ? (
                              <div
                                key={index}
                                style={{
                                  padding: "0.5rem",
                                  backgroundColor: darkMode ? "#1a202c" : "#fff",  
                                  border: `1px solid ${darkMode ? "#4a5568" : "#ddd"}`,  
                                  borderRadius: "4px",
                                  boxShadow: darkMode
                                    ? "0 2px 4px rgba(0, 0, 0, 0.4)" 
                                    : "0 2px 4px rgba(0, 0, 0, 0.1)",
                                  fontSize: "0.875rem",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <span>{doctor.name}</span>
                              </div>
                            ) : "a";
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={poly.status === "Active" ? "destructive" : "success"}>
                          {poly.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditPolyclinic(poly)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Polyclinic</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handleUpdatePolyclinic}>
                                <div className="grid grid-cols-2 gap-6 py-4">
                                  <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                      id="name"
                                      value={name}
                                      onChange={(e) => setName(e.target.value)}
                                      placeholder="Cardiology"
                                      required
                                      className="w-full"
                                    />
                                  </div>
                                  <div>
                                    <Label>Doctors</Label>
                                    <div className="border p-2 rounded">
                                      {combinedDoctors.map((doctor) => (
                                        <div key={doctor._id} className="flex items-center mb-2">
                                          <input
                                            type="checkbox"
                                            id={doctor._id}
                                            checked={selectedDoctors.includes(doctor._id)}
                                            onChange={() => handleDoctorSelect(doctor._id)}
                                            className="mr-2"
                                          />
                                          <label htmlFor={doctor._id} className="text-sm">
                                            {doctor.name}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                    <p className="text-sm text-gray-500">
                                      Select doctors for this polyclinic
                                    </p>
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <Button type="submit">Save Polyclinic</Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deletePolyclinic(poly._id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
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
        </div>
      </main>
    </div>
  );
}