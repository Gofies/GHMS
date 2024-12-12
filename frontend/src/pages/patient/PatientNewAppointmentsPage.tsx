import { useState, useEffect } from 'react'
import { Button } from "../../components/ui/patient/appointment/Button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/patient/appointment/Card.jsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/patient/appointment/Dialog.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger } from "../../components/ui/patient/appointment/Select.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/patient/appointment/Table.jsx"
import { Plus, Info } from 'lucide-react'
import Sidebar from "../../components/ui/patient/common/Sidebar.jsx";
import Header from "../../components/ui/common/Header.jsx";
import { Input } from "../../components/ui/patient/profile/Input.jsx"
import { Label } from "../../components/ui/patient/profile/Label.jsx"

// const dummyData = {
//     cities: [
//       { id: "1", name: "Istanbul" },
//       { id: "2", name: "Ankara" },
//       { id: "3", name: "Izmir" },
//     ],
//     polyclinics: [
//       { id: "1", name: "Cardiology", cityId: "1" },
//       { id: "2", name: "Neurology", cityId: "1" },
//       { id: "3", name: "Orthopedics", cityId: "2" },
//       { id: "4", name: "Radiology", cityId: "3" },
//     ],
//     hospitals: [
//       { id: "1", name: "Hospital A", cityId: "1", polyclinicId: "1" },
//       { id: "2", name: "Hospital B", cityId: "1", polyclinicId: "2" },
//       { id: "3", name: "Hospital C", cityId: "2", polyclinicId: "3" },
//       { id: "4", name: "Hospital D", cityId: "3", polyclinicId: "4" },
//     ],
//     doctors: [
//       { id: "1", name: "Dr. Smith", hospitalId: "1" },
//       { id: "2", name: "Dr. John", hospitalId: "2" },
//       { id: "3", name: "Dr. Doe", hospitalId: "3" },
//       { id: "4", name: "Dr. Jane", hospitalId: "4" },
//     ],
//     availableTimes: [
//       { doctorId: "1", date: "2024-12-01", times: ["09:00", "09:30", "10:00", "10:30"] },
//       { doctorId: "2", date: "2024-12-01", times: ["11:00", "11:30", "12:00"] },
//       { doctorId: "3", date: "2024-12-02", times: ["09:00", "10:00", "11:00"] },
//       { doctorId: "4", date: "2024-12-03", times: ["14:00", "15:00", "16:00"] },
//     ],
//   };
const cities = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", 
  "Antalya", "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman", 
  "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", 
  "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", 
  "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", 
  "Iğdır", "Isparta", "İstanbul", "İzmir", "Kahramanmaraş", "Karabük", "Karaman", 
  "Kars", "Kastamonu", "Kayseri", "Kırıkkale", "Kırklareli", "Kırşehir", "Kilis", 
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Mardin", "Mersin", 
  "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize", "Sakarya", 
  "Samsun", "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak", "Tekirdağ", 
  "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"
];

const polyclinics = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Oncology",
  "Ophthalmology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Pulmonology",
  "Rheumatology",
  "Urology",
  "Gynecology",
  "Nephrology",
  "Hematology",
  "Infectious Diseases",
  "Otolaryngology (ENT)",
  "General Surgery",
  "Plastic Surgery"
];


export default function NewAppointmentsPage() {


    // const [filters, setFilters] = useState({
    //     city: null,
    //     polyclinic: null,
    //     hospital: null,
    //     doctor: null,
    //     date: null,
    //     time: null,
    //   });
    
    //   const [filteredData, setFilteredData] = useState({
    //     cities: dummyData.cities,
    //     polyclinics: [],
    //     hospitals: [],
    //     doctors: [],
    //     dates: [],
    //     times: [],
    //   });
    
    //   const handleCityChange = (cityId) => {
    //     setFilters({ city: cityId, polyclinic: null, hospital: null, doctor: null, date: null, time: null });
    //     const filteredPolyclinics = dummyData.polyclinics.filter((p) => p.cityId === cityId);
    //     setFilteredData({
    //       ...filteredData,
    //       polyclinics: filteredPolyclinics,
    //       hospitals: [],
    //       doctors: [],
    //       dates: [],
    //       times: [],
    //     });
    //   };
    
    //   const handlePolyclinicChange = (polyclinicId) => {
    //     setFilters({ ...filters, polyclinic: polyclinicId, hospital: null, doctor: null, date: null, time: null });
    //     const filteredHospitals = dummyData.hospitals.filter(
    //       (h) => h.cityId === filters.city && h.polyclinicId === polyclinicId
    //     );
    //     setFilteredData({
    //       ...filteredData,
    //       hospitals: filteredHospitals,
    //       doctors: [],
    //       dates: [],
    //       times: [],
    //     });
    //   };
    
    //   const handleHospitalChange = (hospitalId) => {
    //     setFilters({ ...filters, hospital: hospitalId, doctor: null, date: null, time: null });
    //     const filteredDoctors = dummyData.doctors.filter((d) => d.hospitalId === hospitalId);
    //     setFilteredData({
    //       ...filteredData,
    //       doctors: filteredDoctors,
    //       dates: [],
    //       times: [],
    //     });
    //   };
    
    //   const handleDoctorChange = (doctorId) => {
    //     setFilters({ ...filters, doctor: doctorId, date: null, time: null });
    //     const availableDates = dummyData.availableTimes
    //       .filter((a) => a.doctorId === doctorId)
    //       .map((a) => a.date);
    //     setFilteredData({
    //       ...filteredData,
    //       dates: Array.from(new Set(availableDates)), 
    //       times: [],
    //     });
    //   };
    
    //   const handleDateChange = (date) => {
    //     setFilters({ ...filters, date, time: null });
    //     const availableTimes = dummyData.availableTimes.find(
    //       (a) => a.doctorId === filters.doctor && a.date === date
    //     );
    //     setFilteredData({
    //       ...filteredData,
    //       times: availableTimes ? availableTimes.times : [],
    //     });
    //   };
    
    //   const handleTimeChange = (time) => {
    //     setFilters({ ...filters, time });
    //   };

      const handleSubmit = () => {
        console.log("submit");
      } 
    
      return (
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <Header title="New Appointment" />
            <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-2xl font-bold">Search Appointments</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                <div>
            <Label htmlFor="city">City</Label>
            <select
              id="city"
              //value={filters.city || ""}
              //onChange={(e) => handleCityChange(e.target.value)}
              className="border rounded px-4 py-2 w-full"
            >
              <option value="">Select a city</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
                  <div>
                    <Label htmlFor="polyclinic">Polyclinic</Label>
                    <select
                      id="polyclinic"
                      //value={filters.polyclinic || ""}
                      //onChange={(e) => handlePolyclinicChange(e.target.value)}
                     // disabled={city}
                      className="border rounded px-4 py-2 w-full"
                    >
                      <option value="">Select a polyclinic</option>
                      {polyclinics.map((polyclinic, index) => (
                        <option key={index} value={polyclinic}>
                          {polyclinic}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* <div>
                    <Label htmlFor="hospital">Hospital</Label>
                    <select
                      id="hospital"
                      value={filters.hospital || ""}
                      onChange={(e) => handleHospitalChange(e.target.value)}
                      disabled={!filters.polyclinic}
                      className="border rounded px-4 py-2 w-full"
                    >
                      <option value="">Select a hospital</option>
                      {filteredData.hospitals.map((hospital) => (
                        <option key={hospital.id} value={hospital.id}>
                          {hospital.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="doctor">Doctor</Label>
                    <select
                      id="doctor"
                      value={filters.doctor || ""}
                      onChange={(e) => handleDoctorChange(e.target.value)}
                      disabled={!filters.hospital}
                      className="border rounded px-4 py-2 w-full"
                    >
                      <option value="">Select a doctor</option>
                      {filteredData.doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <select
                      id="date"
                      value={filters.date || ""}
                      onChange={(e) => handleDateChange(e.target.value)}
                      disabled={!filters.doctor}
                      className="border rounded px-4 py-2 w-full"
                    >
                      <option value="">Select a date</option>
                      {filteredData.dates.map((date, index) => (
                        <option key={index} value={date}>
                          {date}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <select
                      id="time"
                      value={filters.time || ""}
                      onChange={(e) => handleTimeChange(e.target.value)}
                      disabled={!filters.date}
                      className="border rounded px-4 py-2 w-full"
                    >
                      <option value="">Select a time</option>
                      {filteredData.times.map((time, index) => (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div> */}
                </CardContent>
                <div className="flex justify-between">
                  {/* <Button variant="outline" onClick={() => setFilters({ city: null, polyclinic: null, hospital: null, doctor: null, date: null, time: null })}>
                    Reset Filters
                  </Button> */}
                  <Button onClick={handleSubmit}>Create Appointment</Button>
                </div>
              </Card>
            </div>
          </main>
        </div>
      );
    
}