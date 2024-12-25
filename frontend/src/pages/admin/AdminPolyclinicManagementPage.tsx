"use client";
import { useEffect, useState } from 'react';
import { Button } from "../../components/ui/admin/Button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/admin/Card.jsx";
import { Input } from "../../components/ui/admin/Input.jsx";
import { Label } from "../../components/ui/admin/Label.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/admin/Table.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/admin/Dialog.jsx";
import { Badge } from "../../components/ui/admin/Badge.jsx";
import { Search, Plus, Edit, Trash2, Eye, EyeOff, CloudCog } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/ui/admin/Sidebar.jsx";
import Header from "../../components/ui/admin/Header.jsx";
import { Endpoint, postRequest, getRequest, putRequest, deleteRequest } from "../../helpers/Network.js";
import { toast } from 'react-toastify';

export default function AdminPolyclinicManagementPage() {
  const [doctors, setDoctors] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [polyclinics, setPolyclinics] = useState([]);
  const [filteredPolyclinics, setFilteredPolyclinics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [name, setName] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [doctorIds, setDoctorIds] = useState([]);

  const handleLocationChange = () => {
    // Mevcut URL'den adminId'yi çekiyoruz
    const pathParts = window.location.pathname.split("/");
    const hospitalId = pathParts[4]; // "/admin/{adminId}/hospital-management"

    // Yeni polyclinicId tanımla
    //const polyclinicId = "673b9827a25ee0e8d7a88ead";

    // Yeni URL'yi oluştur ve yönlendir
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

  const getDoctorNames = (doctorIds) => {
    if (!doctorIds || doctorIds.length === 0) return "No Doctors Assigned";
    console.log("a", doctorIds);
    console.log("b", doctors);
    const doctorNames = doctorIds
      .map((id) => doctors.find((doctor) => doctor._id === id)?.name)
      .filter((name) => name); // Geçersiz (undefined) isimleri filtrele
    return doctorNames.length > 0 ? doctorNames.join(", ") : "No Doctors Found";
  };

  const fetchPolyclinics = async () => {
    try {
      const hospitalId = handleLocationChange();
      const response = await getRequest(`${Endpoint.GET_ADMIN_POLYCLINIC}/${hospitalId}`);
      console.log("API Response:", response);

      if (response && response.polyclinics && Array.isArray(response.polyclinics.polyclinics)) {
        const fetchedPolyclinics = response.polyclinics.polyclinics; // Gelen veriyi sakla
        setPolyclinics(fetchedPolyclinics); // Ana listeyi güncelle
        setFilteredPolyclinics(fetchedPolyclinics); // Filtrelenmiş listeyi başlangıç olarak ata
      } else {
        console.error("Invalid data format:", response);
        setPolyclinics([]); // Ana listeyi boş yap
        setFilteredPolyclinics([]); // Filtrelenmiş listeyi boş yap
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

  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = polyclinics.filter((poly) =>
        poly.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPolyclinics(filtered); // Filtrelenmiş listeyi güncelle
    } else {
      setFilteredPolyclinics(polyclinics); // Ana listeyi geri yükle
    }
  }, [searchTerm, polyclinics]);


  const navigate = useNavigate();

  const handleCreatePolyclinic = async (e) => {
    setEditMode(false); // Edit modunu kapat
    setName(''); // Name alanını sıfırla
    setSelectedDoctors([]); // Seçili doktorları sıfırla
    setEditingPolyclinicId(null); // Editlenen ID'yi sıfırla
    e.preventDefault();
    try {
      fetchDoctors();

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
        toast.success("POLY created successfully!");
        fetchPolyclinics(); // Yeni polyclinic oluşturulduktan sonra listeyi yenile

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
      // Eğer doktor ID zaten varsa kaldır, yoksa ekle
      if (prev.includes(doctorId)) {
        return prev.filter((id) => id !== doctorId);
      } else {
        return [...prev, doctorId];
      }
    });
  };

  // Yeni durumlar
  const [editMode, setEditMode] = useState(false);
  const [editingPolyclinicId, setEditingPolyclinicId] = useState(null);

  // Edit butonuna tıklandığında dialog'u açma
  const handleEditPolyclinic = (polyclinic) => {
    //setEditMode(true);
    setEditingPolyclinicId(polyclinic._id);
    setName(polyclinic.name); // Poliklinik adını doldur
    setSelectedDoctors(polyclinic.doctors || []); // Seçili doktorları doldur
  };

  // Poliklinik güncelleme fonksiyonu
  const handleUpdatePolyclinic = async (e) => {
    e.preventDefault();
    const hospitalId2 = handleLocationChange();
    const requestBody = {
      name,
      hospitalId: hospitalId2,
      doctors: selectedDoctors
    };

    try {
      const responseData = await putRequest(`${Endpoint.GET_ADMIN_POLYCLINIC}/${editingPolyclinicId}`, requestBody);
      if (responseData) {
        toast.success("Polyclinic updated successfully!");
        fetchPolyclinics(); // Güncellemeden sonra listeyi yenile
        setEditingPolyclinicId(null); // Güncellenen ID'yi temizle
      } else {
        toast.error("An error occurred during polyclinic update.");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An unexpected error occurred.");
    }
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
                        placeholder="John"
                        required
                        className="w-full"
                      />
                    </div>


                    <div>
                      <Label>Doctors</Label>
                      <div className="border p-2 rounded">
                        {doctors.map((doctor) => (
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPolyclinics.map((poly) => (
                    <TableRow key={poly._id}>
                      <TableCell>{poly.name}</TableCell>
                      <TableCell>{poly.doctors?.length > 0 ? getDoctorNames(poly.doctors) : null}</TableCell>

                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                            <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPolyclinic(poly)}
                          >
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
                                      placeholder="John"
                                      required
                                      className="w-full"
                                    />
                                  </div>


                                  <div>
                                    <Label>Doctors</Label>
                                    <div className="border p-2 rounded">
                                      {doctors.map((doctor) => (
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