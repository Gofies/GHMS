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
import { Endpoint, postRequest, getRequest, deleteRequest } from "../../helpers/Network.js";
import { toast } from 'react-toastify';

export default function AdminHospitalManagementPage() {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [selecteddoctors, setSelectedDoctors] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [establishmentdate, setEstablishmentDate] = useState('');
  const [polyclinics, setPolyclinics] = useState([]);

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

  const fetchDoctors = async () => {
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

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await fetchHospitals(); // Hastane verilerini getir
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
    const requestBody = {
      name,
      address,
      selecteddoctors,
      establishmentdate,
      phone,
      email,
      polyclinics
    };
    try {
      const responseData = await postRequest(Endpoint.GET_ADMIN_HOSPITAL, requestBody);
      if (responseData) {
        toast.success("Hospital created successfully!");
        if (toast.success) {
          setTimeout(() => {
            navigate(0); // Refresh the page or redirect
          }, 1000);
        }
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
      setFilteredHospitals(filtered); // Filtrelenmiş listeyi güncelle
    } else {
      setFilteredHospitals(hospitals); // Tüm listeyi göster
    }
  }, [searchTerm, hospitals]);

  // useEffect(() => {
  //   //   if (searchTerm) {
  //   //     const filtered = users.filter((user) =>
  //   //       `${user.name} ${user.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
  //   //     );
  //   //     setFilteredUsers(filtered);
  //   //   } else {
  //   fetchHospitals();
  //   //   }
  // }, []);
  // // }, [searchTerm, users]);

  const handleLocationChange = (hospitalId) => {
    const pathParts = window.location.pathname.split("/");
    const adminId = pathParts[2]; 
    window.location.href = `/admin/${adminId}/polyclinic-management/${hospitalId}`;
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

  const handleAddPolyclinic = () => {
    setPolyclinics([...polyclinics, ""]); // Yeni bir boş polyclinic ekle
  };

  const handleRemovePolyclinic = (index) => {
    const updatedPolyclinics = [...polyclinics];
    updatedPolyclinics.splice(index, 1); // Belirtilen indexteki polyclinic'i kaldır
    setPolyclinics(updatedPolyclinics);
  };

  const handlePolyclinicChange = (index, value) => {
    const updatedPolyclinics = [...polyclinics];
    updatedPolyclinics[index] = value; // Belirtilen indexteki polyclinic'i güncelle
    setPolyclinics(updatedPolyclinics);
  };

  return (
    <div className="flex h-screen bg-gray-100">
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
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Hospital
                </Button>
              </DialogTrigger>
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John"
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Maslak Mak."
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-Mail</Label>
                      <Input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@domain.com"
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+90 123 456 7890"
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="selecteddoctors">Doctors</Label>
                      <Input
                        id="selecteddoctors"
                        value={selecteddoctors}
                        onChange={(e) => setSelectedDoctors(e.target.value)}
                        placeholder="Prof. Dr. Ahmet"
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="establishmentdate">Establishment Date</Label>
                      <Input
                        id="establishmentdate"
                        value={establishmentdate}
                        onChange={(e) => setEstablishmentDate(e.target.value)}
                        placeholder="2025"
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label>Polyclinics</Label>
                      <div className="border p-2 rounded">
                        <div className="max-h-40 overflow-y-auto">
                          {polyclinics.map((clinic, index) => (
                            <div key={index} className="flex items-center mb-2">
                              <Input
                                type="text"
                                value={clinic}
                                onChange={(e) => handlePolyclinicChange(index, e.target.value)}
                                placeholder="Polyclinic Name"
                                className="mr-2 flex-grow"
                              />
                              <Button
                                type="button"
                                onClick={() => handleRemovePolyclinic(index)}
                                className="text-red-500 text-sm px-2 py-1 h-8"
                              >
                                X
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2">
                          <Button
                            type="button"
                            onClick={handleAddPolyclinic}
                            className="text-sm px-4 py-2 h-8 w-full"
                          >
                            Add Polyclinic
                          </Button>
                        </div>
                      </div>
                    </div>



                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">Create Hospital</Button>
                  </div>
                </form>
              </DialogContent>
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