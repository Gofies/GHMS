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
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/ui/admin/Sidebar.jsx";
import Header from "../../components/ui/admin/Header.jsx";
import { Endpoint, postRequest, getRequest, putRequest, deleteRequest } from "../../helpers/Network.js";
import { toast } from 'react-toastify';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/patient/signup/Select.jsx";

export default function AdminUserManagementPage() {
  const [doctors, setDoctors] = useState([]);
  const [labTechnicians, setLabTechnicians] = useState([]);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [userType, setUserType] = useState('doctor'); // Varsayılan değer olarak 'doctor'
  const [certificates, setCertificates] = useState(''); // Lab Technician için kullanılan alan

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jobstartdate, setJobStartDate] = useState('');
  const [password, setPassword] = useState('');
  const [degree, setDegree] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState(2024);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedPatientUser, setUpdatedPatientUser] = useState(null);

  const days = Array.from({ length: 31 }, (_, i) => i + 1); // 1-31
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i); // Last 100 years


  const [selectedJobStartDay, setSelectedJobStartDay] = useState(1);
  const [selectedJobStartMonth, setSelectedJobStartMonth] = useState(months[0]);
  const [selectedJobStartYear, setSelectedJobStartYear] = useState(new Date().getFullYear());

  const [isJobStartDayDropdownOpen, setIsJobStartDayDropdownOpen] = useState(false);
  const [isJobStartMonthDropdownOpen, setIsJobStartMonthDropdownOpen] = useState(false);
  const [isJobStartYearDropdownOpen, setIsJobStartYearDropdownOpen] = useState(false);

  
  const fetchDoctors = async () => {
    try {
      const response = await getRequest(Endpoint.GET_ADMIN_DOCTOR);
      if (response) {
        const doctorsWithRole = response.doctors.map((doctor) => ({
          ...doctor,
          role: "Doctor",
      }));

      setDoctors(doctorsWithRole);
      setFilteredUsers(doctorsWithRole);
      } else {
        toast.error('Failed to fetch doctors.');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('An error occurred while fetching doctor data.');
    }
  };

  const fetchLabTechnicians = async () => {
    try {
      const response = await getRequest(Endpoint.GET_ADMIN_LAB_TECHNICIANS);
      if (response) {
        setLabTechnicians(response.labtechnicians);
        setFilteredUsers(response.labtechnicians);
      } else {
        toast.error('Failed to fetch lab technicians.');
      }
    } catch (error) {
      console.error('Error fetching lab technicians:', error);
      toast.error('An error occurred while fetching lab technicians data.');
    }
  };

  const navigate = useNavigate();


  const formatBirthdate = (day, month, year) => {
    // Ayı sırasına göre indeks bul ve 1 artır
    const monthIndex = months.indexOf(month) + 1;

    // Gün ve ay tek haneli ise başına '0' ekle
    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(monthIndex).padStart(2, "0");

    // Format: DD.MM.YYYY
    return `${formattedDay}.${formattedMonth}.${year}`;
  };

  // Kullanım


  const handleCreateUser = async (e) => {
    e.preventDefault();
   // Validasyon: Zorunlu alanları kontrol et
  if (!name || !surname || !email || !password || !phone || !title || !specialization) {
    toast.error("Please fill in all required fields.");
    return;
  }

  // Validasyon: E-posta formatını kontrol et
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email address.");
    return;
  }

  // Validasyon: Şifre uzunluğunu kontrol et
  if (password.length < 3) {
    toast.error("Password must be at least 3 characters long.");
    return;
  }

    const birthdate = formatBirthdate(selectedDay, selectedMonth, selectedYear);
    const jobstartdate = formatBirthdate(selectedJobStartDay, selectedJobStartMonth, selectedJobStartYear);


    if (userType === 'doctor' && !degree) {
      toast.error("Please enter the degree for the doctor.");
      return;
    }
    if (userType === 'labtechnician' && !certificates) {
      toast.error("Please enter the certificates for the lab technician.");
      return;
    }

    const requestBody = {
      name,
      surname,
      title,
      email,
      password,
      birthdate: birthdate,
      phone,
      jobstartdate: jobstartdate,
      specialization,
      ...(userType === 'doctor' && { degree }),
      ...(userType === 'labtechnician' && { certificates }),
    };

    try {
      let responseData;
      console.log("t", requestBody);
      if (userType === 'doctor') {
        responseData = await postRequest(Endpoint.GET_ADMIN_DOCTOR, requestBody);
      } else if (userType === 'labtechnician') {
        responseData = await postRequest(Endpoint.GET_ADMIN_LAB_TECHNICIANS, requestBody); 
      }
      console.log("q", responseData);
      if (responseData) {
        toast.success("Account created successfully!");
        if (toast.success) {
          fetchDoctors();
        }

            // Input alanlarını sıfırla
      setName('');
      setSurname('');
      setTitle('');
      setEmail('');
      setPassword('');
      setPhone('');
      setDegree('');
      setCertificates('');
      setSpecialization('');
      setSelectedDay(1);
      setSelectedMonth(months[0]);
      setSelectedYear(new Date().getFullYear());
      setSelectedJobStartDay(1);
      setSelectedJobStartMonth(months[0]);
      setSelectedJobStartYear(new Date().getFullYear());
      } else {
        toast.error("An error occurred during user creation.");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleEditUser = async (e, id) => {
    e.preventDefault();
    // if (!editingUser) return;
    try {
      const responseData = await getRequest(`${Endpoint.GET_ADMIN_DOCTOR}/${id}`); 
      console.log(responseData);
      if (responseData) {
        setEditingUser(responseData.doctor);
      } else {
        toast.error("An error occurred during user update.");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleSaveUpdatedUser = async (e, id) => {
    e.preventDefault();
  // Validasyon: Zorunlu alanları kontrol et
  if (!editingUser?.name || !editingUser?.surname || !editingUser?.email || !editingUser?.phone) {
    toast.error("Please fill in all required fields.");
    return;
  }

  // Validasyon: E-posta formatını kontrol et
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(editingUser.email)) {
    toast.error("Please enter a valid email address.");
    return;
  }
    const requestBody = {
      name: editingUser.name || name, // Eğer editingUser'dan gelen boşsa, mevcut state kullan
      surname: editingUser.surname || surname,
      title: editingUser.title || title,
      email: editingUser.email || email,
      phone: editingUser.phone || phone,
      jobstartdate: editingUser.jobstartdate || jobstartdate,
      degree: editingUser.degree || degree,
      specialization: editingUser.specialization || specialization,
    };
    console.log(requestBody);
    try {
      const responseData = await putRequest(`${Endpoint.GET_ADMIN_DOCTOR}/${id}`, requestBody); //  /admin/doctor
      console.log("r", responseData);
      if (responseData) {
        toast.success("User updated successfully!");
        fetchDoctors(); // Listeyi güncelle
        setEditingUser(null);

      } else {
        toast.error("An error occurred during user update.");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An unexpected error occurred.");
    }
  };


  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);


  useEffect(() => {
    //   if (searchTerm) {
    //     const filtered = users.filter((user) =>
    //       `${user.name} ${user.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
    //     );
    //     setFilteredUsers(filtered);
    //   } else {
    fetchDoctors();
    //   }
  }, []);
  // }, [searchTerm, users]);

  // useEffect(() => {
  //   fetchDoctors();
  // }, []);

  useEffect(() => {
    // Arama terimine göre filtreleme yap
    const filtered = doctors.filter((user) =>
      `${user.name} ${user.email} ${user.title} ${user.specialization}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered); // Filtrelenmiş kullanıcı listesini güncelle
  }, [searchTerm, doctors]);


  const deleteUser = async (id) => {
    try {
      const response = await deleteRequest(`${Endpoint.GET_ADMIN_DOCTOR}/${id}`);
      if (response) {
        toast.success('User deleted successfully!');
        setDoctors(doctors.filter(user => user._id !== id));
        setFilteredUsers(filteredUsers.filter(user => user._id !== id));
      } else {
        toast.error('Failed to delete user.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('An unexpected error occurred while deleting the user.');
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <Header title="Staff Management" />

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Search className="w-5 h-5 mr-2 text-gray-500" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create User
                </Button>
              </DialogTrigger>
              {isDialogOpen && (

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault(); // Varsayılan form gönderimini engelle
                      handleCreateUser(e);
                    }}
                  >
                    <div className="grid grid-cols-2 gap-6 py-4">
                      <div>
                        <Label htmlFor="userType">User Type</Label>
                        <select
                          id="userType"
                          value={userType}
                          onChange={(e) => setUserType(e.target.value)}
                          required
                          className="w-full"
                        >
                          <option value="doctor">Doctor</option>
                          <option value="labtechnician">Lab Technician</option>
                        </select>
                      </div>
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
                        <Label htmlFor="surname">Surname</Label>
                        <Input
                          id="surname"
                          value={surname}
                          onChange={(e) => setSurname(e.target.value)}
                          placeholder="Doe"
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
                      <div className="relative">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          className="w-full"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
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
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Prof. Dr."
                          required
                          className="w-full"
                        />
                      </div>
                      {userType === 'doctor' && (
                        <div>
                          <Label htmlFor="degree">Degree</Label>
                          <Input
                            id="degree"
                            value={degree}
                            onChange={(e) => setDegree(e.target.value)}
                            placeholder="PhD"
                            required
                            className="w-full"
                          />
                        </div>
                      )}
                      {userType === 'labtechnician' && (
                        <div>
                          <Label htmlFor="certificates">Certificates</Label>
                          <Input
                            id="certificates"
                            value={certificates}
                            onChange={(e) => setCertificates(e.target.value)}
                            placeholder="Certification details"
                            required
                            className="w-full"
                          />
                        </div>
                      )}
                      <div>
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                          id="specialization"
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          placeholder="Cardiology"
                          required
                          className="w-full"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Date of Birth</Label>
                        <div className="flex w-full space-x-4">
                          {/* Gün Dropdown */}
                          <div className="flex-1">
                            <Select>
                              <SelectTrigger
                                value={selectedDay}
                                onClick={(e) => {
                                  e.preventDefault(); // Varsayılan form submit davranışını engelle
                                  setIsDayDropdownOpen(!isDayDropdownOpen);
                                }}
                              />
                              <SelectContent isOpen={isDayDropdownOpen}>
                                <div className="max-h-60 overflow-y-auto">
                                  {days.map((day) => (
                                    <SelectItem
                                      key={day}
                                      value={day}
                                      onSelect={() => {
                                        setSelectedDay(day);
                                        setIsDayDropdownOpen(false);
                                      }}
                                    />
                                  ))}
                                </div>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Ay Dropdown */}
                          <div className="flex-1">
                            <Select>
                              <SelectTrigger
                                value={selectedMonth}
                                onClick={(e) => {
                                  e.preventDefault(); // Varsayılan form submit davranışını engelle
                                  setIsMonthDropdownOpen(!isMonthDropdownOpen);
                                }}
                              />
                              <SelectContent isOpen={isMonthDropdownOpen}>
                                <div className="max-h-60 overflow-y-auto">
                                  {months.map((month, index) => (
                                    <SelectItem
                                      key={index}
                                      value={month}
                                      onSelect={() => {
                                        setSelectedMonth(month);
                                        setIsMonthDropdownOpen(false);
                                      }}
                                    />
                                  ))}
                                </div>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Yıl Dropdown */}
                          <div className="flex-1">
                            <Select>
                              <SelectTrigger
                                value={selectedYear}
                                onClick={(e) => {
                                  e.preventDefault(); // Varsayılan form submit davranışını engelle
                                  setIsYearDropdownOpen(!isYearDropdownOpen);
                                }}
                              />
                              <SelectContent isOpen={isYearDropdownOpen}>
                                <div className="max-h-60 overflow-y-auto">
                                  {years.map((year) => (
                                    <SelectItem
                                      key={year}
                                      value={year}
                                      onSelect={() => {
                                        setSelectedYear(year);
                                        setIsYearDropdownOpen(false);
                                      }}
                                    />
                                  ))}
                                </div>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label>Job Start Date</Label>
                        <div className="flex w-full space-x-4">
                          {/* Gün Dropdown */}
                          <div className="flex-1">
                            <Select>
                              <SelectTrigger
                                value={selectedJobStartDay}
                                onClick={(e) => {
                                  e.preventDefault(); // Varsayılan form submit davranışını engelle
                                  setIsJobStartDayDropdownOpen(!isJobStartDayDropdownOpen);
                                }}
                              />
                              <SelectContent isOpen={isJobStartDayDropdownOpen}>
                                <div className="max-h-60 overflow-y-auto">
                                  {days.map((day) => (
                                    <SelectItem
                                      key={day}
                                      value={day}
                                      onSelect={() => {
                                        setSelectedJobStartDay(day);
                                        setIsJobStartDayDropdownOpen(false);
                                      }}
                                    />
                                  ))}
                                </div>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Ay Dropdown */}
                          <div className="flex-1">
                            <Select>
                              <SelectTrigger
                                value={selectedJobStartMonth}
                                onClick={(e) => {
                                  e.preventDefault(); // Varsayılan form submit davranışını engelle
                                  setIsJobStartMonthDropdownOpen(!isJobStartMonthDropdownOpen);
                                }}
                              />
                              <SelectContent isOpen={isJobStartMonthDropdownOpen}>
                                <div className="max-h-60 overflow-y-auto">
                                  {months.map((month, index) => (
                                    <SelectItem
                                      key={index}
                                      value={month}
                                      onSelect={() => {
                                        setSelectedJobStartMonth(month);
                                        setIsJobStartMonthDropdownOpen(false);
                                      }}
                                    />
                                  ))}
                                </div>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Yıl Dropdown */}
                          <div className="flex-1">
                            <Select>
                              <SelectTrigger
                                value={selectedJobStartYear}
                                onClick={(e) => {
                                  e.preventDefault(); // Varsayılan form submit davranışını engelle
                                  setIsJobStartYearDropdownOpen(!isJobStartYearDropdownOpen);
                                }}
                              />
                              <SelectContent isOpen={isJobStartYearDropdownOpen}>
                                <div className="max-h-60 overflow-y-auto">
                                  {years.map((year) => (
                                    <SelectItem
                                      key={year}
                                      value={year}
                                      onSelect={() => {
                                        setSelectedJobStartYear(year);
                                        setIsJobStartYearDropdownOpen(false);
                                      }}
                                    />
                                  ))}
                                </div>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button type="submit">Create User</Button>
                    </div>

                  </form>
                </DialogContent>
              )}
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Staff List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.title}</TableCell>
                      <TableCell>{user.specialization}</TableCell>
                      <TableCell>{user.hospital?.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.hospital !== null ? 'success' : 'destructive'}
                        >
                          {user.hospital ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => { handleEditUser(e, user._id) }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={(e) => { handleSaveUpdatedUser(e, user._id) }}>
                                <div className="grid grid-cols-2 gap-6 py-4">
                                  <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                      id="name"
                                      value={editingUser?.name || ''}
                                      onChange={(e) =>
                                        setEditingUser((prev) => ({
                                          ...prev,
                                          name: e.target.value,
                                        }))
                                      }
                                      placeholder="John"
                                      required
                                      className="w-full"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="surname">Surname</Label>
                                    <Input
                                      id="surname"
                                      value={editingUser?.surname || ''}
                                      onChange={(e) =>
                                        setEditingUser((prev) => ({
                                          ...prev,
                                          surname: e.target.value,
                                        }))
                                      }
                                      placeholder="Doe"
                                      required
                                      className="w-full"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="email">E-Mail</Label>
                                    <Input
                                      id="email"
                                      value={editingUser?.email || ''}
                                      onChange={(e) =>
                                        setEditingUser((prev) => ({
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
                                      value={editingUser?.phone || ''}
                                      onChange={(e) =>
                                        setEditingUser((prev) => ({
                                          ...prev,
                                          phone: e.target.value,
                                        }))
                                      }
                                      placeholder="+90 123 456 7890"
                                      required
                                      className="w-full"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                      id="title"
                                      value={editingUser?.title || ''}
                                      onChange={(e) =>
                                        setEditingUser((prev) => ({
                                          ...prev,
                                          title: e.target.value,
                                        }))
                                      }
                                      placeholder="Prof. Dr."
                                      required
                                      className="w-full"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="degree">Degree</Label>
                                    <Input
                                      id="degree"
                                      value={editingUser?.degree || ''}
                                      onChange={(e) =>
                                        setEditingUser((prev) => ({
                                          ...prev,
                                          degree: e.target.value,
                                        }))
                                      }
                                      placeholder="PhD"
                                      required
                                      className="w-full"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="specialization">Specialization</Label>
                                    <Input
                                      id="specialization"
                                      value={editingUser?.specialization || ''}
                                      onChange={(e) =>
                                        setEditingUser((prev) => ({
                                          ...prev,
                                          specialization: e.target.value,
                                        }))
                                      }
                                      placeholder="Cardiology"
                                      required
                                      className="w-full"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <Button type="submit">Save Changes</Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteUser(user._id)}
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