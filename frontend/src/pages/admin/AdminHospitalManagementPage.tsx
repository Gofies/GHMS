"use client";
import { useEffect, useState } from 'react';
import { Button } from "../../components/ui/admin/Button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/admin/Card.jsx";
import { Input } from "../../components/ui/admin/Input.jsx";
import { Label } from "../../components/ui/admin/Label.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/admin/Table.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/admin/Dialog.jsx";
import { Badge } from "../../components/ui/admin/Badge.jsx";
import { Search, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/ui/admin/Sidebar.jsx";
import Header from "../../components/ui/admin/Header.jsx";
import { Endpoint, postRequest, getRequest, deleteRequest, putRequest } from "../../helpers/Network.js";
import { toast } from 'react-toastify';
import { useDarkMode } from '../../helpers/DarkModeContext';

export default function AdminHospitalManagementPage() {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [labTechnicians, setLabTechnicians] = useState([]);
  const [selectedLabTechnicians, setSelectedLabTechnicians] = useState([]);
  const [combinedLabTechnicians, setCombinedLabTechnicians] = useState([]);
  const { darkMode } = useDarkMode();

  const cities = [
    "New York",
    "San Francisco",
    "Baltimore",
    "Chicago",
    "Los Angeles",
    "Houston"
  ];

  const fetchHospitals = async () => {
    try {
      const response = await getRequest(Endpoint.GET_ADMIN_HOSPITAL);
      if (response) {
        setHospitals(response.hospitals);
        setFilteredHospitals(response.hospitals);
      } else {
        toast.error('Failed to fetch hospitals.');
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      toast.error('An error occurred while fetching hospital data.');
    }
  };

  const fetchLabTechnicians = async () => {
    try {
      const response = await getRequest(Endpoint.GET_ADMIN_LAB_TECHNICIAN);
      if (response) {
        setLabTechnicians(response.labTechnicians);
      } else {
        toast.error('Failed to fetch labtechs.');
      }
    } catch (error) {
      console.error('Error fetching labtechs:', error);
      toast.error('An error occurred while fetching labtechs data.');
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    selecteddoctors: [],
    establishmentdate: '',
    phone: '',
    email: '',
    polyclinics: []
  });

  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await fetchHospitals();
        await fetchLabTechnicians();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const handleCreateHospital = async (e) => {
    e.preventDefault();

    try {
      const responseData = await postRequest(Endpoint.GET_ADMIN_HOSPITAL, formData);
      if (responseData) {
        toast.success("Hospital created successfully!");
        setIsDialogOpen(false);
        fetchHospitals();
      } else {
        toast.error("An error occurred during hospital creation.");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An unexpected error occurred.");
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = hospitals.filter((hospital) =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHospitals(filtered);
    } else {
      setFilteredHospitals(hospitals);
    }
  }, [searchTerm, hospitals]);

  const handleLocationChange = (hospitalId) => {
    const pathParts = window.location.pathname.split("/");
    const adminId = pathParts[2];
    
    navigate(`/admin/${adminId}/polyclinic-management/${hospitalId}`);
  };

  const deleteUser = async (id) => {
    try {
      const response = await deleteRequest(`${Endpoint.GET_ADMIN_HOSPITAL}/${id}`);
      if (response) {
        toast.success('Hospital deleted successfully!');
        setHospitals(hospitals.filter(hospitals => hospitals._id !== id));
        setFilteredHospitals(filteredHospitals.filter(hospitals => hospitals._id !== id));
      } else {
        toast.error('Failed to delete hospital.');
      }
    } catch (error) {
      console.error('Error deleting hospital:', error);
      toast.error('An unexpected error occurred while deleting the hospital.');
    }
  };

  const handleEditHospital = async (hospital) => {
    setSelectedHospital(hospital);
    setSelectedLabTechnicians(hospital.labTechnicians || []);

    try {
      const response = await getRequest(Endpoint.GET_ADMIN_LAB_TECHNICIAN);
      if (response) {
        const inactiveLabTechnicians = response.labTechnicians.filter(tech => !tech.hospital);
        const combined = [
          ...inactiveLabTechnicians,
          ...response.labTechnicians.filter(tech => hospital.labTechnicians.includes(tech._id)),
        ];
        setCombinedLabTechnicians(combined);
        setLabTechnicians(response.labTechnicians)

      } else {
        toast.error('Failed to fetch labtechs.');
      }
    } catch (error) {
      console.error('Error fetching inactive labtechs:', error);
      toast.error('An error occurred while fetching labtechs data.');
    }
  };

  useEffect(() => {
    if (selectedHospital) {
      setSelectedLabTechnicians(selectedHospital.labTechnicians || []);
    }
  }, [selectedHospital]);

  const handleUpdateHospital = async (e) => {
    e.preventDefault();

    const requestBody = {
      name: selectedHospital.name,
      address: selectedHospital.address,
      establishmentdate: selectedHospital.establishmentdate,
      phone: selectedHospital.phone,
      email: selectedHospital.email,
      polyclinics: selectedHospital.polyclinics,
      doctors: selectedHospital.doctors,
      labTechnicians: selectedLabTechnicians || [],
    };

    try {
      const responseData = await putRequest(`${Endpoint.GET_ADMIN_HOSPITAL}/${selectedHospital._id}`, requestBody);
      if (responseData) {
        toast.success("Hospital updated successfully!");
        await fetchHospitals();
        setSelectedHospital(null);
        setSelectedLabTechnicians([]);
        setCombinedLabTechnicians([]);
        setIsDialogOpen(false);
      } else {
        toast.error("An error occurred during hospital update.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleLabTechnicianSelect = (techId) => {
    setSelectedLabTechnicians((prev) => {
      let updatedLabTechs;
      if (prev?.includes(techId)) {
        updatedLabTechs = prev.filter((id) => id !== techId);
      } else {
        updatedLabTechs = [...prev, techId];
      }
      setSelectedHospital((prevHospital) => ({
        ...prevHospital,
        labTechnicians: updatedLabTechs,
      }));

      return updatedLabTechs;
    });
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false); 

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 " : "bg-gray-100"}text-gray-900`}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header title="Hospital Management" />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Search className="w-5 h-5 mr-2 text-gray-500" />
              <Input
                type="text"
                placeholder="Search hospitals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}> 
                  <Plus className="w-4 h-4 mr-2" />
                  Create Hospital
                </Button>
              </DialogTrigger>
              {isDialogOpen && ( 
                <DialogContent className="dialog-large">
                  <DialogHeader>
                    <DialogTitle>Create New Hospital</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateHospital}>
                    <div className="grid grid-cols-2 gap-6 py-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Hospital Name"
                          required
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Full Address"
                          required
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-Mail</Label>
                        <Input
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="example@domain.com"
                          required
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="0212 XXX XX XX"
                          required
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label htmlFor="establishmentdate">Establishment Date</Label>
                        <Input
                          id="establishmentdate"
                          value={formData.establishmentdate}
                          onChange={handleInputChange}
                          placeholder="YYYY"
                          required
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Create Hospital</Button>
                    </div>
                  </form>
                </DialogContent>
              )}
            </Dialog>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Hospital List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHospitals.map((hospital) => (
                    <TableRow key={hospital._id}>
                      <TableCell>{hospital.name}</TableCell>
                      <TableCell>{hospital.email}</TableCell>
                      <TableCell>{hospital.phone}</TableCell>
                      <TableCell>
                        <Badge variant={hospital.status === 'Active' ? 'destructive' : 'success'}>
                          {hospital.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLocationChange(hospital._id)}
                          >
                            Polyclinics
                          </Button>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditHospital(hospital)}
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Hospital</DialogTitle>
                                  </DialogHeader>
                                  {selectedHospital && (
                                    <form onSubmit={handleUpdateHospital}>
                                      <div className="grid grid-cols-2 gap-6 py-4">
                                        <div>
                                          <Label htmlFor="name">Name</Label>
                                          <Input
                                            id="name"
                                            value={selectedHospital.name}
                                            onChange={(e) =>
                                              setSelectedHospital((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                              }))
                                            }
                                            placeholder="Hospital Name"
                                            required
                                            className="w-full"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="address">Address</Label>
                                          <Input
                                            id="address"
                                            value={selectedHospital.address}
                                            onChange={(e) =>
                                              setSelectedHospital((prev) => ({
                                                ...prev,
                                                address: e.target.value,
                                              }))
                                            }
                                            placeholder="Hospital Address"
                                            required
                                            className="w-full"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="email">Email</Label>
                                          <Input
                                            id="email"
                                            value={selectedHospital.email}
                                            onChange={(e) =>
                                              setSelectedHospital((prev) => ({
                                                ...prev,
                                                email: e.target.value,
                                              }))
                                            }
                                            placeholder="example@domain.com"
                                            required
                                            className="w-full"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="phone">Phone</Label>
                                          <Input
                                            id="phone"
                                            value={selectedHospital.phone}
                                            onChange={(e) =>
                                              setSelectedHospital((prev) => ({
                                                ...prev,
                                                phone: e.target.value,
                                              }))
                                            }
                                            placeholder="0212 XXX XX XX"
                                            required
                                            className="w-full"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="establishmentdate">Establishment Date</Label>
                                          <Input
                                            id="establishmentdate"
                                            type="number" 
                                            value={selectedHospital.establishmentdate?.split('-')[0] || ""}
                                            onChange={(e) => {
                                              const year = e.target.value;
                                              setSelectedHospital((prev) => ({
                                                ...prev,
                                                establishmentdate: `${year}-01-01T00:00:00.000Z`, 
                                              }));
                                            }}
                                            placeholder="YYYY"
                                            required
                                            className="w-full"
                                          />
                                        </div>
                                        <div>
                                          <Label>Lab Techs</Label>
                                          <div className="border p-2 rounded">
                                            {combinedLabTechnicians?.map((tech) => (
                                              <div key={tech._id} className="flex items-center mb-2">
                                                <input
                                                  type="checkbox"
                                                  id={tech._id}
                                                  checked={selectedLabTechnicians?.includes(tech._id)}
                                                  onChange={() => handleLabTechnicianSelect(tech._id)}
                                                  className="mr-2"
                                                />
                                                <label htmlFor={tech._id} className="text-sm">
                                                  {tech.name}
                                                </label>
                                              </div>
                                            ))}
                                          </div>
                                          <p className="text-sm text-gray-500">
                                            Select lab techs for this hospital
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex justify-end">
                                        <Button type="submit">Save Changes</Button>
                                      </div>
                                    </form>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteUser(hospital._id)}
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