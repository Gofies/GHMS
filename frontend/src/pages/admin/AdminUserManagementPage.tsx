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
import { Select, SelectContent, SelectItem, SelectTrigger } from "../../components/ui/admin/Select.jsx";
import { useDarkMode } from '../../helpers/DarkModeContext';

export default function AdminUserManagementPage() {

  const [doctors, setDoctors] = useState([]);
  const [labTechnicians, setLabTechnicians] = useState([]);
  const { darkMode } = useDarkMode();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('doctor'); 
  const [certificates, setCertificates] = useState(''); 
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

  const days = Array.from({ length: 31 }, (_, i) => i + 1); 
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i); 

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
      const response = await getRequest(Endpoint.GET_ADMIN_LAB_TECHNICIAN);
      if (response) {
        const labTechniciansWithRole = response.labTechnicians?.map((tech) => ({
          ...tech,
          role: "Lab Tech",
        }));
        setLabTechnicians(labTechniciansWithRole);
        setFilteredUsers(labTechniciansWithRole);
      } else {
        toast.error('Failed to fetch lab technicians.');
      }
    } catch (error) {
      console.error('Error fetching lab technicians:', error);
      toast.error('An error occurred while fetching lab technicians data.');
    }
  };

  const formatBirthdate = (day, month, year) => {
    const monthIndex = months.indexOf(month) + 1;
    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(monthIndex).padStart(2, "0");
    return `${formattedDay}.${formattedMonth}.${year}`;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!name || !surname || !email || !password || !phone || !title || !specialization) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

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
      ...(userType === 'labtechnician' && { certificates: certificates.split(',').map(item => item.trim()) }),
    };

    try {
      let responseData;
      if (userType === 'doctor') {
        responseData = await postRequest(Endpoint.GET_ADMIN_DOCTOR, requestBody);
      } else if (userType === 'labtechnician') {
        responseData = await postRequest(Endpoint.GET_ADMIN_LAB_TECHNICIAN, requestBody);
      }
      if (responseData) {
        toast.success("User created successfully!");
        if (toast.success) {
          fetchDoctors();
          fetchLabTechnicians();
        }
        setIsDialogOpen(false);
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

  const handleEditUser = async (e, id, role) => {
    e.preventDefault();

    try {
      const endpoint =
        role === "Doctor"
          ? `${Endpoint.GET_ADMIN_DOCTOR}/${id}`
          : `${Endpoint.GET_ADMIN_LAB_TECHNICIAN}/${id}`;

      const responseData = await getRequest(endpoint);
      if (responseData) {
        const userData = role === "Doctor" ? responseData.doctor : responseData.labTechnician;
        setEditingUser({ ...userData, role });
      } else {
        toast.error("An error occurred while fetching user data.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleSaveUpdatedUser = async (e, id) => {
    e.preventDefault();

    if (!editingUser?.name || !editingUser?.surname || !editingUser?.email || !editingUser?.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editingUser.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const requestBody = {
      name: editingUser.name,
      surname: editingUser.surname,
      title: editingUser.title,
      email: editingUser.email,
      phone: editingUser.phone,
      jobstartdate: editingUser.jobstartdate,
      specialization: editingUser.specialization,
      ...(editingUser.role === "Doctor" && { degree: editingUser.degree }),
      ...(editingUser.role === "Lab Technician" && { certificates: editingUser.certificates }),
    };

    try {
      const endpoint =
        editingUser.role === "Doctor"
          ? `${Endpoint.GET_ADMIN_DOCTOR}/${id}`
          : `${Endpoint.GET_ADMIN_LAB_TECHNICIAN}/${id}`;

      const responseData = await putRequest(endpoint, requestBody);

      if (responseData) {
        toast.success("User updated successfully!");
        fetchDoctors();
        fetchLabTechnicians();
        setEditingUser(null);
        setIsDialogOpen(false);
      } else {
        toast.error("An error occurred during user update.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  useEffect(() => {
    fetchDoctors();
    fetchLabTechnicians();
  }, []);

  useEffect(() => {
    const allUsers = [
      ...doctors.map((user) => ({ ...user, role: "Doctor" })),
      ...labTechnicians.map((user) => ({ ...user, role: "Lab Technician" })),
    ];

    allUsers.sort((a, b) => {
      const nameComparison = a.name.localeCompare(b.name);
      if (nameComparison !== 0) {
        return nameComparison;
      }
      return a.surname.localeCompare(b.surname);
    });

    const filtered = allUsers.filter((user) =>
      `${user.name} ${user.email} ${user.title} ${user.specialization} ${user.role}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    setFilteredUsers(filtered);
  }, [searchTerm, doctors, labTechnicians]);

  const deleteUser = async (id, role) => {
    try {
      const endpoint =
        role === "Doctor"
          ? `${Endpoint.GET_ADMIN_DOCTOR}/${id}`
          : `${Endpoint.GET_ADMIN_LAB_TECHNICIAN}/${id}`;

      const response = await deleteRequest(endpoint);

      if (response) {
        toast.success('User deleted successfully!');
        if (role === "Doctor") {
          setDoctors(doctors.filter(user => user._id !== id));
        } else if (role === "Lab Technician") {
          setLabTechnicians(labTechnicians.filter(user => user._id !== id));
        }
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
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 " : "bg-gray-100"}text-gray-900`}>
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
                      e.preventDefault();
                      handleCreateUser(e);
                    }}
                  >
                    <div className="grid grid-cols-1 gap-6 py-4">
                      <div className="col-span-1">
                        <Label htmlFor="userType">User Type</Label>
                        <select
                          id="userType"
                          value={userType}
                          onChange={(e) => setUserType(e.target.value)}
                          required
                          className={`w-full px-3 py-2 rounded-md shadow-sm transition-all duration-300 ${darkMode
                              ? "bg-gray-800 text-white border border-gray-600 focus:ring-blue-500"
                              : "bg-white text-gray-900 border border-gray-300 focus:ring-blue-600"
                            }`}
                        >
                          <option value="doctor">Doctor</option>
                          <option value="labtechnician">Lab Technician</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
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
                        {userType === 'labtechnician' ? (
                          <div>
                            <Label htmlFor="specialization">Specialization</Label>
                            <select
                              id="specialization"
                              value={specialization}
                              onChange={(e) => setSpecialization(e.target.value)}
                              required
                              className={`w-full px-3 py-2 rounded-md shadow-sm transition-all duration-300 ${darkMode
                                ? "bg-gray-800 text-white border border-gray-600 focus:ring-blue-500"
                                : "bg-white text-gray-900 border border-gray-300 focus:ring-blue-600"
                              }`}
                            >
                              <option value="" disabled>Select a specialization</option>
                              <option value="Hematology">Hematology</option>
                              <option value="Clinical Pathology">Clinical Pathology</option>
                              <option value="Biochemistry">Biochemistry</option>
                              <option value="Radiology">Radiology</option>
                              <option value="Neurology">Neurology</option>
                            </select>
                          </div>
                        ) : (
                          <div>
                            <Label htmlFor="specialization">Specialization</Label>
                            <Input
                              id="specialization"
                              value={specialization}
                              onChange={(e) => setSpecialization(e.target.value)}
                              placeholder="Enter specialization"
                              required
                              className="w-full"
                            />
                          </div>
                        )}
                        <div className="grid gap-2">
                          <Label>Date of Birth</Label>
                          <div className="flex w-full space-x-4">
                            <div className="flex-1">
                              <Select>
                                <SelectTrigger
                                  value={selectedDay}
                                  onClick={(e) => {
                                    e.preventDefault();
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
                            <div className="flex-1">
                              <Select>
                                <SelectTrigger
                                  value={selectedMonth}
                                  onClick={(e) => {
                                    e.preventDefault();
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
                            <div className="flex-1">
                              <Select>
                                <SelectTrigger
                                  value={selectedYear}
                                  onClick={(e) => {
                                    e.preventDefault();
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
                            <div className="flex-1">
                              <Select>
                                <SelectTrigger
                                  value={selectedJobStartDay}
                                  onClick={(e) => {
                                    e.preventDefault();
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
                            <div className="flex-1">
                              <Select>
                                <SelectTrigger
                                  value={selectedJobStartMonth}
                                  onClick={(e) => {
                                    e.preventDefault();
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
                            <div className="flex-1">
                              <Select>
                                <SelectTrigger
                                  value={selectedJobStartYear}
                                  onClick={(e) => {
                                    e.preventDefault();
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
                    <TableHead>Surname</TableHead>
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
                    <TableRow key={user?._id}>
                      <TableCell>{user?.name}</TableCell>
                      <TableCell>{user?.surname}</TableCell>
                      <TableCell>{user?.email}</TableCell>
                      <TableCell>{user?.role}</TableCell>
                      <TableCell>{user?.title}</TableCell>
                      <TableCell>{user?.specialization}</TableCell>
                      <TableCell>{user.hospital?.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user?.hospital ? 'success' : 'destructive'}
                        >
                          {user?.hospital ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => { handleEditUser(e, user._id, user.role) }}
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
                                  {editingUser?.role === 'Doctor' && (
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
                                  )}
                                  {editingUser?.role === 'Lab Technician' && (
                                    <div>
                                      <Label htmlFor="certificates">Certificates</Label>
                                      <Input
                                        id="certificates"
                                        value={(editingUser?.certificates || []).join(', ')}
                                        onChange={(e) =>
                                          setEditingUser((prev) => ({
                                            ...prev,
                                            certificates: e.target.value.split(',').map((item) => item.trim()),
                                          }))
                                        }
                                        placeholder="Certification1, Certification2"
                                        required
                                        className="w-full"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <Label htmlFor="specialization">Specialization</Label>
                                    {editingUser?.role === 'Lab Technician' ? (
                                      <select
                                        id="specialization"
                                        value={editingUser?.specialization || ''}
                                        onChange={(e) =>
                                          setEditingUser((prev) => ({
                                            ...prev,
                                            specialization: e.target.value,
                                          }))
                                        }
                                        required
                                        className={`w-full px-3 py-2 rounded-md shadow-sm transition-all duration-300 ${darkMode
                                          ? "bg-gray-800 text-white border border-gray-600 focus:ring-blue-500"
                                          : "bg-white text-gray-900 border border-gray-300 focus:ring-blue-600"
                                        }`}
                                      >
                                        <option value="" disabled>Select a specialization</option>
                                        <option value="Hematology">Hematology</option>
                                        <option value="Clinical Pathology">Clinical Pathology</option>
                                        <option value="Biochemistry">Biochemistry</option>
                                        <option value="Radiology">Radiology</option>
                                        <option value="Neurology">Neurology</option>
                                      </select>
                                    ) : (
                                      <Input
                                        id="specialization"
                                        value={editingUser?.specialization || ''}
                                        onChange={(e) =>
                                          setEditingUser((prev) => ({
                                            ...prev,
                                            specialization: e.target.value,
                                          }))
                                        }
                                        placeholder="Enter specialization"
                                        required
                                        className="w-full"
                                      />
                                    )}
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
                            onClick={() => deleteUser(user._id, user.role)}
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