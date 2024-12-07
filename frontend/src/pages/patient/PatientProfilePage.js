import { useState, useEffect } from 'react'
import { Button } from "../../components/ui/patient/profile/Button.jsx"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/patient/profile/Card.jsx"
import { Input } from "../../components/ui/patient/profile/Input.jsx"
import { Label } from "../../components/ui/patient/profile/Label.jsx"
import { Textarea } from "../../components/ui/patient/profile/TextArea.jsx"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/patient/profile/Avatar.jsx"
import { Endpoint, getRequest, postRequest } from "../../helpers/Network.js";
import Sidebar from "../../components/ui/patient/common/Sidebar.jsx";
import Header from "../../components/ui/common/Header.jsx";
//import { useDarkMode } from '../../helpers/DarkModeContext.js';

export default function PatientProfile() {
  //const { darkMode } = useDarkMode(); // Dark mode durumu global olarak alınır
  const [isEditing, setIsEditing] = useState(false)
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    surname: "",
    birthdate: "",
    gender: "",
    email: "",
    phone: "",
    emergencycontact: "",
    address: "",
  });
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({}); 

  const formatBirthdate = (birthdate) => {
    const date = new Date(birthdate); 
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = String(date.getFullYear()).slice(-4); 
    return `${day}-${month}-${year}`; 
  };

  const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    return today.getFullYear() - birthDate.getFullYear() - (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0);
  };

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const response = await getRequest(Endpoint.GET_PROFILE); 
        console.log("response", response)
        setPatientInfo(response.patient); 
      } catch (err) {
        console.error('Error fetching patient profile:', err);
        setError('Failed to load patient profile.');
      }
    };

    fetchPatientProfile();
  }, []); 

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setPatientInfo((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (id === "phone" || id === "emergencycontact") {
      const validationMessage = validatePhoneNumber(value);
      setValidationErrors((prev) => ({
        ...prev,
        [id]: validationMessage,
      }));
    }

    if (id === "email") {
      validateEmail(value);
    }
  };

  // Email validasyonu
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!emailRegex.test(email)) {
      setValidationErrors((prev) => ({ ...prev, email: "Invalid email format" }));
    } else {
      setValidationErrors((prev) => {
        const { email, ...rest } = prev;
        return rest;
      });
    }
  };

  const validatePhoneNumber = (phone) => {
    const numericPhone = phone.replace(/[^\d]/g, ""); 
  
    console.log(numericPhone.length)
    if (numericPhone.length === 12) {
      return null; 
    }
  
    if (numericPhone.length < 12) {
      return "Phone number must have exactly 10 digits after the area code.";
    }
  
    if (numericPhone.length > 12) {
      return "Phone number must not exceed 10 digits after the area code.";
    }
  
    return "Invalid phone number format."; 
  };
  
    const saveChanges = async () => {
    try {
      const response = await postRequest(Endpoint.UPDATE_PROFILE, patientInfo);
      console.log("Profile updated successfully:", response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    }
  };

  if (error) {
    return <div>{error}</div>; 
  }

  if (!patientInfo) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header title="Profile" />
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Personal Information</CardTitle>
              <Avatar className="w-20 h-20">
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${patientInfo.name} ${patientInfo.surname}`} />
              </Avatar>
            </CardHeader>
            <CardContent className="grid gap-4">
              {error && <p className="text-red-500">{error}</p>}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={patientInfo.name} readOnly />
                </div>
                <div>
                  <Label htmlFor="surname">Surname</Label>
                  <Input id="surname" value={patientInfo.surname} readOnly />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" value={calculateAge(patientInfo.birthdate)} readOnly />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Input id="gender" value={patientInfo.gender} readOnly />
                </div>
                <div>
                  <Label htmlFor="birthday">Birthday</Label>
                  <Input id="birthday" value={formatBirthdate(patientInfo.birthdate)} readOnly />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={patientInfo.email}
                    readOnly={!isEditing}
                    onChange={handleInputChange}
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-sm">{validationErrors.email}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel" 
                    inputMode="numeric" 
                    pattern="[0-9]*" 
                    value={patientInfo.phone}
                    readOnly={!isEditing}
                    onChange={handleInputChange}
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-sm">{validationErrors.phone}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="emergencycontact">Emergency Contact</Label>
                  <Input
                    id="emergencycontact"
                    value={patientInfo.emergencycontact}
                    readOnly={!isEditing}
                    onChange={handleInputChange}
                  />
                  {validationErrors.emergencycontact && (
                    <p className="text-red-500 text-sm">{validationErrors.emergencycontact}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" value={patientInfo.address} readOnly={!isEditing} onChange={handleInputChange} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
              {isEditing && (
                <Button onClick={saveChanges} disabled={Object.values(validationErrors).some((error) => error !== null)}>
                  Save Changes
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}