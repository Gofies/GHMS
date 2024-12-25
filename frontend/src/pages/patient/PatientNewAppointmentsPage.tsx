import { useState, useEffect } from 'react'
import { Button } from "../../components/ui/patient/appointment/Button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/patient/appointment/Card.jsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/patient/appointment/Dialog.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/patient/appointment/Select.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/patient/appointment/Table.jsx"
import { Plus, Info } from 'lucide-react'
import Sidebar from "../../components/ui/patient/common/Sidebar.jsx";
import Header from "../../components/ui/common/Header.jsx";
import { Input } from "../../components/ui/patient/profile/Input.jsx"
import { Label } from "../../components/ui/patient/profile/Label.jsx"
import { Endpoint, postRequest, getRequest } from "../../helpers/Network.js";
import { toast } from 'react-toastify'

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

  const handleSubmit = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTimeSlot) {
      toast("Please select a doctor, date, and time slot before submitting.");
      return;
    }

    const appointmentData = {
      doctorId: selectedDoctor._id, 
      date: selectedDate, 
      time: selectedTimeSlot, 
      type: "doctor",
      testType: "aaa"
    };

    console.log("Submitting Appointment:", appointmentData);

    try {
      const response = await postRequest("/patient/appointments/new", appointmentData);
      console.log("r", response);
      if (response) {
        //const responseData = await response.json();
        toast("Appointment successfully created!");
        console.log("API Response:", response);
      } else {
        console.error("Failed to create appointment:", response.statusText);
        toast("Failed to create appointment. Please try again.");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast("An error occurred while creating the appointment.");
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
    resetSelections("hospital"); // Altındaki seçimleri temizle

    setSelectedHospital(hospitalId);

    // queryResults'tan seçilen hastanenin doktorlarını filtrele
    const selectedDoctors = queryResults
      .filter((item) => item.hospital._id === hospitalId) // Seçilen hastane ID'sine göre filtrele
      .flatMap((item) => item.doctors); // Doktorları listele

    console.log("Selected Doctors:", selectedDoctors);
    setDoctors(selectedDoctors);
  };

  const [queryResults, setQueryResults] = useState([]);


  const handleDoctorSelect = (doctor) => {
    resetSelections("doctor"); // Altındaki seçimleri temizle
    setSelectedDoctor(doctor); // Doktor objesini kaydet
    setSelectedSchedule(doctor.schedule.map((schedule) => schedule)); // Doktorun programını kaydet
    console.log(doctor.schedule)
    setSelectedDoctorDates(doctor.schedule.map((schedule) => schedule.date)); // Doktorun tarihlerini al
    setIsDoctorDropdownOpen(false); // Dropdown'u kapat
  };


  const handleDateSelect = (date) => {
    resetSelections("date"); // Altındaki seçimleri temizle
    const selectedElement = selectedSchedule.find((element) => element.date === date);

    if (selectedElement) {
      const timeSlots = selectedElement.timeSlots;
      console.log("Time Slots for the selected date:", timeSlots);
      setSelectedDate(date); // Seçilen tarihi kaydet
      setIsDateDropdownOpen(false); // Dropdown'u kapat
      setSelectedTimeSlots(timeSlots);
    } else {
      console.log("No time slots available for the selected date.");
    }
  };


  // Time slot seçimi için handle metodu
  const handleTimeSlotSelect = (time) => {
    console.log("Selected Time Slot:", time);
    setSelectedTimeSlot(time); // Time slotu seç
    setIsTimeDropdownOpen(false);
  };


  const params = {
    city: selectedCity,
    polyclinicName: selectedPolyclinic,
  };

  const handleApiCall = async () => {
    console.log("API call initiated");
    try {
      console.log("Fetching data...");
      console.log("p", params);
      const response = await getRequest("/patient/appointments/new/", params);

      if (response) {
        console.log("API Response:", response.queryResults);
        setQueryResults(response.queryResults);

        const hospitals = response.queryResults.map((item) => ({
          id: item.hospital._id,
          name: item.hospital.name,
        }));
        console.log("Hospitals:", hospitals);
        setHospitals(hospitals);
        //toast("API call successful!");
      } else {
        console.error("API Error:", response);
        toast("API call failed!");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast("An error occurred while making the API call.");
    }
  };

  // City ve Polyclinic değişimlerini izleyen useEffect
  useEffect(() => {
    if (selectedCity && selectedPolyclinic) {
      handleApiCall();
    }
  }, [selectedCity, selectedPolyclinic]);



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
              <div className="grid gap-2 w-full">
                <Label className="block text-sm font-medium text-gray-700">Select a City</Label>
                <div className="relative">
                  <Select className="w-full max-w-md"> {/* Sabit genişlik */}
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
                                resetSelections("city"); // Altındaki seçimleri temizle
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
                        className={`w-full max-w-md ${!selectedCity ? "bg-gray-300 cursor-not-allowed" : "bg-white"
                          }`} // City seçilmediyse devre dışı
                        disabled={!selectedCity} // City seçilmediyse Select'i devre dışı bırak
                      >
                        <SelectTrigger
                          className={`w-full border rounded-md px-4 py-2 text-left ${!selectedCity ? "cursor-not-allowed text-gray-500" : ""
                            }`}
                          value={selectedPolyclinic}
                          onClick={() => selectedCity && setIsPolyclinicDropdownOpen(!isPolyclinicDropdownOpen)} // Sadece City seçildiyse aç
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
                                    resetSelections("polyclinic"); // Altındaki seçimleri temizle
                                    setSelectedPolyclinic(polyclinic);
                                    setIsPolyclinicDropdownOpen(false);
                                    //handleApiCall(); // Polyclinic seçimine göre hastaneleri getir
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

                {/* Hospital Seçimi */}
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
                                  value={hospital.name} // Hastanenin ID'sini kullan
                                  onSelect={() => {
                                    handleHospitalSelect(hospital.id); // Hastane seçildiğinde doktorları filtrele
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


                {/* Doctor Seçimi */}
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


                {/* Date seçimi */}
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
                          value={selectedDate ? new Date(selectedDate).toISOString().split("T")[0] : "Select a Date"} // Kullanıcıya yyyy-mm-dd formatında göster
                          onClick={() => selectedDoctorDates.length > 0 && setIsDateDropdownOpen(!isDateDropdownOpen)}
                        >
                          <SelectValue
                            value={selectedDate ? new Date(selectedDate).toISOString().split("T")[0] : "Select a Date"} // Kullanıcıya yyyy-mm-dd formatında göster
                          />
                        </SelectTrigger>

                        {isDateDropdownOpen && selectedDoctorDates.length > 0 && (
                          <SelectContent isOpen={isDateDropdownOpen} className="absolute z-10 w-full max-w-md bg-white border rounded-md shadow-lg">
                            <div className="max-h-60 overflow-y-auto">
                              {selectedDoctorDates.map((date, index) => (
                                <SelectItem
                                  key={index}
                                  value={new Date(date).toISOString().split("T")[0]} // Görünüm ve seçim için formatlanmış tarih
                                  onSelect={() => handleDateSelect(date)} // İşlem için orijinal tarih kullanılıyor
                                >
                                  {new Date(date).toISOString().split("T")[0]} {/* Kullanıcıya gösterilecek tarih */}
                                </SelectItem>
                              ))}


                            </div>
                          </SelectContent>
                        )}
                      </Select>
                    </div>
                  </div>
                )}

                {/* Time slot seçimi */}
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
                                  disabled={!timeSlot.isFree} // Eğer isFree false ise disabled olur
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
              {/* Reset Filters Butonu */}
              <Button
                variant="outline"
                onClick={() => resetSelections("all")} // Tüm seçimleri sıfırlamak için
                className="ml-4" // Sol tarafa hizalar
              >
                Reset Filters
              </Button>

              {/* Create Appointment Butonu */}
              <Button
                onClick={handleSubmit} // Randevu oluşturma işlemi
                className="mr-4" // Sağ tarafa hizalar
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