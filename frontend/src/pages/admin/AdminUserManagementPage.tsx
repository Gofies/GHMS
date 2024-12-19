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
import { Endpoint, postRequest, getRequest, putRequest ,deleteRequest} from "../../helpers/Network.js";
import { toast } from 'react-toastify';

export default function AdminUserManagementPage() {
  const [doctors, setDoctors] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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


  const getFormattedDate = () => {
    if (!selectedDay || !selectedMonth || !selectedYear) return null;

    const monthIndex = months.indexOf(selectedMonth) + 1; // Get month index
    return `${selectedYear}-${String(monthIndex).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  };

  const navigate = useNavigate();

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const birthdate = getFormattedDate();
    if (!birthdate) {
      alert("Please select a valid date of birth.");
      return;
    }
    const requestBody = {
      name,
      surname,
      title,
      email,
      password,
      birthdate,
      phone,
      jobstartdate,
      degree,
      specialization,
    };
    try {
      const responseData = await postRequest(Endpoint.GET_ADMIN_DOCTOR, requestBody);
      if (responseData) {
        toast.success("Account created successfully!");
        if (toast.success) {
          setTimeout(() => {
            navigate(0); // Refresh the page or redirect
          }, 1000);
        }
      } else {
        toast.error("An error occurred during user creation.");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleEditUser1 = async (e, id) => {
    e.preventDefault();
    // if (!editingUser) return;

    console.log("a");
    try {
      const responseData = await getRequest(`${Endpoint.GET_ADMIN_DOCTOR}/${id}`);
      console.log(responseData);
      if (responseData) {
        setEditingUser(responseData.doctor);
        toast.success("User fetched");
      } else {
        toast.error("An error occurred during user update.");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleEditUser2 = async (e, id) => {
   e.preventDefault();
    if (!editingUser) return;

    const birthdate = getFormattedDate();
    if (!birthdate) {
      alert("Please select a valid date of birth.");
      return;
    }

    const requestBody = {
      ...editingUser,
      name,
      surname,
      title,
      email,
      phone,
      jobstartdate,
      degree,
      specialization,
      birthdate,
    };

    try {
      const responseData = await putRequest(`${Endpoint.GET_ADMIN_DOCTOR}/${id}`, requestBody);
      console.log("r", responseData);
      if (responseData) {
        toast.success("User updated successfully!");
      } else {
        toast.error("An error occurred during user update.");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An unexpected error occurred.");
    }
  };

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

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <Header title="User Management" />

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
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateUser}>
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
                    <div>
                      <Label htmlFor="birthdate">Birthdate</Label>
                      <Input
                        id="birthdate"
                        type="date"
                        value={getFormattedDate()}
                        onChange={(e) => {
                          const [year, month, day] = e.target.value.split('-');
                          setSelectedYear(parseInt(year, 10));
                          setSelectedMonth(months[parseInt(month, 10) - 1]);
                          setSelectedDay(parseInt(day, 10));
                        }}
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="jobstartdate">Job Start Date</Label>
                      <Input
                        id="jobstartdate"
                        type="date"
                        value={jobstartdate}
                        onChange={(e) => setJobStartDate(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">Create User</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">User List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.title}</TableCell>
                      <TableCell>{user.specialization}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => { handleEditUser1(e, user._id) }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={(e) => { handleEditUser2(e, user._id)}}>
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