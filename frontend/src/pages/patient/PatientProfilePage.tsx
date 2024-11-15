import { useState } from 'react'
import { Button } from "../../components/ui/patient/profile/Button.jsx"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/patient/profile/Card.jsx"
import { Input } from "../../components/ui/patient/profile/Input.jsx"
import { Label } from "../../components/ui/patient/profile/Label.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/patient/profile/Select.jsx"
import { Textarea } from "../../components/ui/patient/profile/TextArea.jsx"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/patient/profile/Avatar.jsx"
import { CalendarDays, Home, User, FileText, PieChart, Settings, LogOut } from 'lucide-react'

export default function PatientProfile() {
  const [isEditing, setIsEditing] = useState(false)

  const patientInfo = {
    fullName: "John Doe",
    age: 35,
    gender: "Male",
    birthday: "1988-05-15",
    height: 180, // in cm
    weight: 75, // in kg
    bloodType: "A+",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, AN 12345",
    emergencyContact: "Jane Doe (Wife) - +1 (555) 987-6543",
    medicalConditions: "Asthma, Mild hypertension",
    allergies: "Penicillin",
    medications: "Albuterol inhaler, Lisinopril 10mg daily"
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">Hospital System</h2>
        </div>
        <nav className="mt-6">
          <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <Home className="w-5 h-5 mr-2" />
            Home
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100">
            <User className="w-5 h-5 mr-2" />
            Profile
          </a>
          <a href="#" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100">
            <CalendarDays className="w-5 h-5 mr-2" />
            Appointments
          </a>
          <a href="#" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100">
            <FileText className="w-5 h-5 mr-2" />
            Medical Records
          </a>
          <a href="#" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100">
            <PieChart className="w-5 h-5 mr-2" />
            Health Metrics
          </a>
          <a href="#" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100">
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Patient Profile</h1>
            <Button variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Profile Content */}
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Personal Information</CardTitle>
              <Avatar className="w-20 h-20">
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${patientInfo.fullName}`} />
                <AvatarFallback>{patientInfo.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={patientInfo.fullName} readOnly={!isEditing} />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" value={patientInfo.age} readOnly={!isEditing} />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Input id="gender" value={patientInfo.gender} readOnly={!isEditing} />
                 {/* <Select disabled={!isEditing}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder={patientInfo.gender} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select> */}
                </div>
                <div>
                  <Label htmlFor="birthday">Birthday</Label>
                  <Input id="birthday" type="date" value={patientInfo.birthday} readOnly={!isEditing} />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" value={patientInfo.height} readOnly={!isEditing} />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" value={patientInfo.weight} readOnly={!isEditing} />
                </div>
                <div>
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Input id="bloodType" value={patientInfo.bloodType} readOnly={!isEditing} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={patientInfo.email} readOnly={!isEditing} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={patientInfo.phone} readOnly={!isEditing} />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" value={patientInfo.address} readOnly={!isEditing} />
              </div>
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input id="emergencyContact" value={patientInfo.emergencyContact} readOnly={!isEditing} />
              </div>
              <div>
                <Label htmlFor="medicalConditions">Medical Conditions</Label>
                <Textarea id="medicalConditions" value={patientInfo.medicalConditions} readOnly={!isEditing} />
              </div>
              <div>
                <Label htmlFor="allergies">Allergies</Label>
                <Input id="allergies" value={patientInfo.allergies} readOnly={!isEditing} />
              </div>
              <div>
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea id="medications" value={patientInfo.medications} readOnly={!isEditing} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
              {isEditing && (
                <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}