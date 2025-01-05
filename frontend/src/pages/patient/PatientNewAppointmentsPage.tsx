import { useState, useEffect } from 'react'
import { Button } from "../../components/ui/patient/appointment/Button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/patient/appointment/Card.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/patient/appointment/Select.jsx"
import Sidebar from "../../components/ui/patient/common/Sidebar.jsx";
import Header from "../../components/ui/admin/Header.jsx";
import { Label } from "../../components/ui/patient/profile/Label.jsx"
import { Endpoint, postRequest, getRequest } from "../../helpers/Network.js";
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../helpers/DarkModeContext.js';

const cities = [
  "New York",
  "San Francisco",
  "Baltimore",
  "Chicago",
  "Los Angeles",
  "Houston"
];

const polyclinics = [
  "Urology",
  "Pediatrics",
  "Neurology",
  "Psychiatry",
  "Cardiology",
  "Ophthalmology",
  "Otolaryngology",
  "Orthopedics",
  "Dermatology"
];

export default function NewAppointmentsPage() {

  const { darkMode, toggleDarkMode } = useDarkMode();

  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTimeSlot) {
      toast.error("Please select a doctor, date, and time slot before submitting.");
      return;
    }

    const appointmentData = {
      doctorId: selectedDoctor._id,
      date: selectedDate,
      time: selectedTimeSlot,
      type: "doctor",
      testType: "aaa"
    };

    try {
      const response = await postRequest("/patient/appointments/new", appointmentData);
      if (response) {
        toast.success("Appointment successfully created!");
        const basePath = location.pathname.replace(/\/new$/, '');
        navigate(basePath);
      } else {
        console.error("Failed to create appointment:", response.statusText);
        toast.error("Failed to create appointment. Please try again.");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("An error occurred while creating the appointment.");
    }
  };

  const [selectedCity, setSelectedCity] = useState(null);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const [selectedPolyclinic, setSelectedPolyclinic] = useState(null);
  const [isPolyclinicDropdownOpen, setIsPolyclinicDropdownOpen] = useState(false);

  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [isHospitalDropdownOpen, setIsHospitalDropdownOpen] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isDoctorDropdownOpen, setIsDoctorDropdownOpen] = useState(false);

  const [selectedDoctorDates, setSelectedDoctorDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const resetSelections = (level) => {
    switch (level) {
      case "all":
        setSelectedCity(null);
        setSelectedPolyclinic(null);
        setIsPolyclinicDropdownOpen(false);
        setHospitals([]);
        setSelectedHospital(null);
        setDoctors([]);
        setSelectedDoctor(null);
        setSelectedDoctorDates([]);
        setSelectedDate(null);
        setSelectedTimeSlots([]);
        setSelectedTimeSlot(null);
        break;
      case "city":
        setSelectedPolyclinic(null);
        setIsPolyclinicDropdownOpen(false);
        setHospitals([]);
        setSelectedHospital(null);
        setDoctors([]);
        setSelectedDoctor(null);
        setSelectedDoctorDates([]);
        setSelectedDate(null);
        setSelectedTimeSlots([]);
        setSelectedTimeSlot(null);
        break;
      case "polyclinic":
        setHospitals([]);
        setSelectedHospital(null);
        setDoctors([]);
        setSelectedDoctor(null);
        setSelectedDoctorDates([]);
        setSelectedDate(null);
        setSelectedTimeSlots([]);
        setSelectedTimeSlot(null);
        break;
      case "hospital":
        setDoctors([]);
        setSelectedDoctor(null);
        setSelectedDoctorDates([]);
        setSelectedDate(null);
        setSelectedTimeSlots([]);
        setSelectedTimeSlot(null);
        break;
      case "doctor":
        setSelectedDoctorDates([]);
        setSelectedDate(null);
        setSelectedTimeSlots([]);
        setSelectedTimeSlot(null);
        break;
      case "date":
        setSelectedTimeSlots([]);
        setSelectedTimeSlot(null);
        break;
      default:
        break;
    }
  };

  const handleHospitalSelect = (hospitalId) => {
    resetSelections("hospital");
    setSelectedHospital(hospitalId);

    const selectedDoctors = queryResults
      .filter((item) => item.hospital._id === hospitalId)
      .flatMap((item) => item.doctors);

    setDoctors(selectedDoctors);
  };

  const [queryResults, setQueryResults] = useState([]);

  const handleDoctorSelect = (doctor) => {
    resetSelections("doctor");
    setSelectedDoctor(doctor);
    setSelectedSchedule(doctor.schedule.map((schedule) => schedule));
    setSelectedDoctorDates(doctor.schedule.map((schedule) => schedule.date));
    setIsDoctorDropdownOpen(false);
  };

  const handleDateSelect = (date) => {
    resetSelections("date");
    const selectedElement = selectedSchedule.find((element) => element.date === date);

    if (selectedElement) {
      const timeSlots = selectedElement.timeSlots;
      setSelectedDate(date);
      setIsDateDropdownOpen(false);
      setSelectedTimeSlots(timeSlots);
    } else {
      console.error("No time slots available for the selected date.");
    }
  };

  const handleTimeSlotSelect = (time) => {
    setSelectedTimeSlot(time);
    setIsTimeDropdownOpen(false);
  };

  const params = {
    city: selectedCity,
    polyclinicName: selectedPolyclinic,
  };

  const handleGetAvailableAppointments = async () => {
    try {
      const response = await getRequest("/patient/appointments/new/", params);

      if (response) {
        setQueryResults(response.queryResults);

        const hospitals = response.queryResults.map((item) => ({
          id: item.hospital._id,
          name: item.hospital.name,
        }));

        setHospitals(hospitals);
      } else {
        console.error("API Error:", response);
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("An error occurred.");
    }
  };

  useEffect(() => {
    if (selectedCity && selectedPolyclinic) {
      handleGetAvailableAppointments();
    }
  }, [selectedCity, selectedPolyclinic]);

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-800 " : "bg-gray-100"}text-gray-900`}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header title="New Appointment" />
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Search Appointments</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2 w-full">
                <Label className="block text-sm font-medium">Select a City</Label>
                <div className="relative">
                  <Select className="w-full max-w-md">
                    <SelectTrigger
                      className="w-full border rounded-md px-4 py-2 text-left bg-white"
                      value={selectedCity}
                      onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                    >
                      <SelectValue value={selectedCity || "Select a City"} />
                    </SelectTrigger>
                    {isCityDropdownOpen && (
                      <SelectContent isOpen={isCityDropdownOpen} className="absolute z-10 w-full max-w-md bg-white border rounded-md shadow-lg">
                        <div className="max-h-60 overflow-y-auto">
                          {cities.map((city) => (
                            <SelectItem
                              key={city}
                              value={city}
                              onSelect={() => {
                                resetSelections("city");
                                setSelectedCity(city);
                                setIsCityDropdownOpen(false);
                              }}
                            >
                              {city}
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    )}
                  </Select>
                </div>
                {selectedCity && polyclinics.length > 0 && (
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">Select a Polyclinic</Label>
                    <div className="relative">
                      <Select
                        className={`w-full max-w-md ${!selectedCity ? "bg-gray-300 cursor-not-allowed" : "bg-white"}`}
                        disabled={!selectedCity}
                      >
                        <SelectTrigger
                          className={`w-full border rounded-md px-4 py-2 text-left ${!selectedCity ? "cursor-not-allowed text-gray-500" : ""
                            }`}
                          value={selectedPolyclinic}
                          onClick={() => selectedCity && setIsPolyclinicDropdownOpen(!isPolyclinicDropdownOpen)}
                        >
                          <SelectValue
                            value={
                              selectedPolyclinic || (selectedCity ? "Select a Polyclinic" : "Select a City First")
                            }
                          />
                        </SelectTrigger>
                        {isPolyclinicDropdownOpen && selectedCity && (
                          <SelectContent isOpen={isPolyclinicDropdownOpen} className="absolute z-10 w-full max-w-md bg-white border rounded-md shadow-lg">
                            <div className="max-h-60 overflow-y-auto">
                              {polyclinics.map((polyclinic) => (
                                <SelectItem
                                  key={polyclinic}
                                  value={polyclinic}
                                  onSelect={() => {
                                    resetSelections("polyclinic");
                                    setSelectedPolyclinic(polyclinic);
                                    setIsPolyclinicDropdownOpen(false);
                                  }}
                                >
                                  {polyclinic}
                                </SelectItem>
                              ))}
                            </div>
                          </SelectContent>
                        )}
                      </Select>
                    </div>
                  </div>
                )}
                {selectedPolyclinic && hospitals.length > 0 && (
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">Select a Hospital</Label>
                    <div className="relative">
                      <Select
                        className={`w-full max-w-md ${hospitals.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-white"
                          }`}
                        disabled={hospitals.length === 0}
                      >
                        <SelectTrigger
                          className={`w-full border rounded-md px-4 py-2 text-left ${hospitals.length === 0 ? "cursor-not-allowed text-gray-500" : ""
                            }`}
                          value={selectedHospital}
                          onClick={() =>
                            hospitals.length > 0 && setIsHospitalDropdownOpen(!isHospitalDropdownOpen)
                          }
                        >
                          <SelectValue
                            value={selectedHospital || "Select a Hospital"}
                          />
                        </SelectTrigger>
                        {isHospitalDropdownOpen && hospitals.length > 0 && (
                          <SelectContent isOpen={isHospitalDropdownOpen} className="absolute z-10 w-full max-w-md bg-white border rounded-md shadow-lg">
                            <div className="max-h-60 overflow-y-auto">
                              {hospitals.map((hospital) => (
                                <SelectItem
                                  key={hospital.name}
                                  value={hospital.name}
                                  onSelect={() => {
                                    handleHospitalSelect(hospital.id);
                                    setSelectedHospital(hospital.name);
                                    setIsHospitalDropdownOpen(false);
                                  }}
                                >
                                  {hospital.name}
                                </SelectItem>
                              ))}
                            </div>
                          </SelectContent>
                        )}
                      </Select>
                    </div>
                  </div>
                )}
                {selectedHospital && doctors.length > 0 && (
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">Select a Doctor</Label>
                    <div className="relative">
                      <Select
                        className={`w-full max-w-md ${doctors.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-white"}`}
                        disabled={doctors.length === 0}
                      >
                        <SelectTrigger
                          className={`w-full border rounded-md px-4 py-2 text-left ${doctors.length === 0 ? "cursor-not-allowed text-gray-500" : ""}`}
                          value={selectedDoctor ? `${selectedDoctor.name} ${selectedDoctor.surname}` : "Select a Doctor"}
                          onClick={() => doctors.length > 0 && setIsDoctorDropdownOpen(!isDoctorDropdownOpen)}
                        >
                          <SelectValue value={selectedDoctor ? `${selectedDoctor.name} ${selectedDoctor.surname}` : "Select a Doctor"} />
                        </SelectTrigger>
                        {isDoctorDropdownOpen && doctors.length > 0 && (
                          <SelectContent isOpen={isDoctorDropdownOpen} className="absolute z-10 w-full max-w-md bg-white border rounded-md shadow-lg">
                            <div className="max-h-60 overflow-y-auto">
                              {doctors.map((doctor) => (
                                <SelectItem
                                  key={doctor._id}
                                  value={`${doctor.name} ${doctor.surname}`}
                                  onSelect={() => handleDoctorSelect(doctor)}
                                >
                                  <span>{doctor.name}</span>
                                  <span>{doctor.surname}</span>
                                </SelectItem>
                              ))}
                            </div>
                          </SelectContent>
                        )}
                      </Select>
                    </div>
                  </div>
                )}
                {selectedDoctor && selectedDoctorDates.length > 0 && (
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">Select a Date</Label>
                    <div className="relative">
                      <Select
                        className={`w-full max-w-md ${selectedDoctorDates.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-white"}`}
                        disabled={selectedDoctorDates.length === 0}
                      >
                        <SelectTrigger
                          className={`w-full border rounded-md px-4 py-2 text-left ${selectedDoctorDates.length === 0 ? "cursor-not-allowed text-gray-500" : ""}`}
                          value={selectedDate ? new Date(selectedDate).toISOString().split("T")[0] : "Select a Date"}
                          onClick={() => selectedDoctorDates.length > 0 && setIsDateDropdownOpen(!isDateDropdownOpen)}
                        >
                          <SelectValue
                            value={selectedDate ? new Date(selectedDate).toISOString().split("T")[0] : "Select a Date"}
                          />
                        </SelectTrigger>

                        {isDateDropdownOpen && selectedDoctorDates.length > 0 && (
                          <SelectContent isOpen={isDateDropdownOpen} className="absolute z-10 w-full max-w-md bg-white border rounded-md shadow-lg">
                            <div className="max-h-60 overflow-y-auto">
                              {selectedDoctorDates.map((date, index) => (
                                <SelectItem
                                  key={index}
                                  value={new Date(date).toISOString().split("T")[0]}
                                  onSelect={() => handleDateSelect(date)}
                                >
                                  {new Date(date).toISOString().split("T")[0]}
                                </SelectItem>
                              ))}


                            </div>
                          </SelectContent>
                        )}
                      </Select>
                    </div>
                  </div>
                )}
                {selectedDate && selectedTimeSlots.length > 0 && (
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">Select a Time Slot</Label>
                    <div className="relative">
                      <Select
                        className={`w-full max-w-md ${selectedTimeSlots.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-white"}`}
                        disabled={selectedTimeSlots.length === 0}
                      >
                        <SelectTrigger
                          className={`w-full border rounded-md px-4 py-2 text-left ${selectedTimeSlots.length === 0 ? "cursor-not-allowed text-gray-500" : ""}`}
                          value={selectedTimeSlot}
                          onClick={() => selectedTimeSlots.length > 0 && setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                        >
                          <SelectValue value={selectedTimeSlot || "Select a Time Slot"} />
                        </SelectTrigger>
                        {isTimeDropdownOpen && selectedTimeSlots.length > 0 && (
                          <SelectContent isOpen={isTimeDropdownOpen} className="absolute z-10 w-full max-w-md bg-white border rounded-md shadow-lg">
                            <div className="max-h-60 overflow-y-auto">
                              {selectedTimeSlots.map((timeSlot) => (
                                <SelectItem
                                  key={timeSlot._id}
                                  value={timeSlot.time}
                                  onSelect={() => handleTimeSlotSelect(timeSlot.time)}
                                  disabled={!timeSlot.isFree}
                                >
                                  <div
                                    className={`flex items-center ${timeSlot.isFree ? "" : "line-through text-red-400"}`}
                                  >
                                    {timeSlot.time}
                                  </div>
                                </SelectItem>
                              ))}
                            </div>
                          </SelectContent>
                        )}
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                onClick={() => resetSelections("all")}
                className="ml-4"
              >
                Reset Filters
              </Button>
              <Button
                onClick={handleSubmit}
                className="mr-4"
              >
                Create Appointment
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}