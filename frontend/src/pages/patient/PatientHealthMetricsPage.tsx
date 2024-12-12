import { useState, useEffect } from 'react'
import { Button } from "../../components/ui/patient/health-metrics/Button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/patient/health-metrics/Card.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/patient/health-metrics/Tabs.jsx"
import { CalendarDays, Home, User, FileText, PieChart, Settings, LogOut, Activity, Heart, Weight, Ruler } from 'lucide-react'
import { LineChart } from 'recharts/es6/chart/LineChart';
import { Line } from 'recharts/es6/cartesian/Line';
import { XAxis } from 'recharts/es6/cartesian/XAxis';
import { YAxis } from 'recharts/es6/cartesian/YAxis';
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid';
import { Tooltip } from 'recharts/es6/component/Tooltip';
import { Legend } from 'recharts/es6/component/Legend';
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer';
import Sidebar from "../../components/ui/patient/common/Sidebar.jsx";
import Header from "../../components/ui/common/Header.jsx";
import { Endpoint, putRequest, getRequest } from "../../helpers/Network.js";
import { toast } from 'react-toastify'

const weightData = [
  { date: '2024-01-01', weight: 70 },
  { date: '2024-02-01', weight: 71 },
  { date: '2024-03-01', weight: 69 },
  { date: '2024-04-01', weight: 68 },
  { date: '2024-05-01', weight: 67 },
  { date: '2024-06-01', weight: 66 },
]

const bloodPressureData = [
  { date: '2024-01-01', systolic: 120, diastolic: 80 },
  { date: '2024-02-01', systolic: 118, diastolic: 78 },
  { date: '2024-03-01', systolic: 122, diastolic: 82 },
  { date: '2024-04-01', systolic: 116, diastolic: 76 },
  { date: '2024-05-01', systolic: 120, diastolic: 80 },
  { date: '2024-06-01', systolic: 118, diastolic: 78 },
]

const heartRateData = [
  { date: '2024-01-01', rate: 72 },
  { date: '2024-02-01', rate: 70 },
  { date: '2024-03-01', rate: 74 },
  { date: '2024-04-01', rate: 68 },
  { date: '2024-05-01', rate: 72 },
  { date: '2024-06-01', rate: 70 },
]

export default function HealthMetricsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [editing, setEditing] = useState(null); 
  const [weight, setWeight] = useState(""); 
  const [height, setHeight] = useState(""); 
  const [heartRate, setHeartRate] = useState("");
  const [bloodSugar, setBloodSugar] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [bmi, setBmi] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [value, setValue] = useState(""); 
  const [error, setError] = useState("")
  const [allergies, setAllergies] = useState(null); 

  const handleDelete = async (allergyToDelete) => {
    // try {
    //   // Backend'e silme isteği gönder
    //   const response = await fetch("/api/patient/allergies", {
    //     method: "DELETE",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ allergy: allergyToDelete }),
    //   });

    //   if (response.ok) {
    //     // Silme başarılı, listeyi güncelle
    //     setAllergies((prevAllergies) =>
    //       prevAllergies.filter((allergy) => allergy !== allergyToDelete)
    //     );
    //     toast("Allergy deleted successfully!");
    //   } else {
    //     const error = await response.json();
    //     toast(`Error: ${error.message}`);
    //   }
    // } catch (error) {
    //   toast(`Error deleting allergy: ${error.message}`);
    // }
  };


  const getBmiComment = (bmi) => {
    if(bmi && !isNaN(bmi)){
      if (bmi < 18.5) {
        return "Underweight";
      } else if (bmi >= 18.5 && bmi < 24.9) {
        return "Normal weight";
      } else if (bmi >= 25 && bmi < 29.9) {
        return "Overweight";
      } else {
        return "Obesity";
      }
    }
  };

  const parseBloodPressure = (bloodPressure) => {
    if (!bloodPressure) return { systolic: "-", diastolic: "-" }; 
    const [systolic, diastolic] = bloodPressure.split(" "); 
    return { systolic, diastolic }; 
  };


  useEffect(() => {
    const fetchHealthMetrics = async () => {
      try {
        const response = await getRequest(Endpoint.GET_HEALTH_METRICS);
        console.log("response", response);
        setWeight(response.metrics.weight);
        setHeartRate(response.metrics.heartrate);
        setHeight(response.metrics.height);
        setBloodSugar(response.metrics.bloodsugar);
        setBloodType(response.metrics.bloodtype);
        setBloodPressure(response.metrics.bloodpressure);
        setBmi(
          response.metrics.bmi && !isNaN(response.metrics.bmi)
            ? response.metrics.bmi
            : "-"
        );
        setAllergies(response.allergies.allergies);
      } catch (err) {
        console.error('Error fetching patient health metrics:', err);
        setError('Failed to load patient health metrics.');
      }
    };
    fetchHealthMetrics();
  }, [weight, height]);

  const formatBloodPressure = (value) => {
    return value.replace("/", " ");
  };


  const handleSave = async (type, value) => {
    try {
      const response = await putRequest(`${Endpoint.PUT_HEALTH_METRICS}/${type}`, { [type]: value });
      if (response) {
        toast(`${type} updated successfully!`);
      } else {
        toast(`Failed to update ${type}.`);
      }
      if (type === "weight") {
        setWeight(response.patient.weight);
      } else if (type === "heart-rate") {
        setHeartRate(response.patient.heartrate);
      } else if (type === "height") {
        setHeight(response.patient.height);
      } else if (type === "blood-sugar") {
        setBloodSugar(response.patient.bloodsugar);
      } else if (type === "blood-type") {
        setBloodType(response.patient.bloodtype);
      } else if (type === "allergies") {
        setAllergies(response.patient.allergies);
      } else if (type === "blood-pressure") {
        setBloodPressure(response.patient.bloodpressure);
      }

    } catch (error) {
      toast(`Error updating ${type}: ${error.message}`);
    }
    setEditing(null); 
  };

  const handleTabChange = (value) => {
    setActiveTab(value); // Update the active tab
  };

  const handleEditClick = (type) => {
    setEditing(type); 

    switch (type) {
      case "weight":
        setValue(weight);
        break;
      case "height":
        setValue(height);
        break;
      case "blood-pressure":
        const parsedBP = parseBloodPressure(bloodPressure);
        setValue(`${parsedBP.systolic}/${parsedBP.diastolic}`); 
        break;
      case "heart-rate":
        setValue(heartRate);
        break;
      case "blood-sugar":
        setValue(bloodSugar);
        break;
      case "blood-type":
        setValue(bloodType);
        break;

      default:
        setValue("");
    }
  };

  const handleCancelEdit = () => {
    setEditing(null); 
    setValue(""); 
  };

  const handleInputChange = (e) => setValue(e.target.value);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header title="Health Metrics" />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Weight Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weight</CardTitle>
              </CardHeader>
              <CardContent>
                {editing === "weight" ? (
                  <div>
                    <input
                      type="number"
                      value={value}
                      onChange={handleInputChange}
                      placeholder="Enter new weight"
                      className="border border-gray-300 rounded px-4 py-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => handleCancelEdit()}>Close</Button>
                      <Button onClick={() => handleSave("weight", value)}>Save</Button>
                    </div>
                  </div>
                ) : (
                  <>
                   <div className="text-2xl font-bold">{weight ? `${weight} kg` : "- kg"}</div>
                  </>
                )}
              </CardContent>
              <div>
                {editing !== "weight" && (
                  <Button onClick={() => handleEditClick("weight")}>Edit</Button>
                )}
              </div>
            </Card>

            {/* Height card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Height</CardTitle>
              </CardHeader>
              <CardContent>
                {editing === "height" ? (
                  <div>
                    <input
                      type="number"
                      value={value}
                      onChange={handleInputChange}
                      placeholder="Enter new height"
                      className="border border-gray-300 rounded px-4 py-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => handleCancelEdit()}>Close</Button>
                      <Button onClick={() => handleSave("height", value)}>Save</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{height ? `${height} cm` : "- cm"}</div>

                  </>
                )}
              </CardContent>
              <div>
                {editing !== "height" && (
                  <Button onClick={() => handleEditClick("height")}>Edit</Button>
                )}
              </div>
            </Card>
            {/* Blood Pressure Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
              </CardHeader>
              <CardContent>
                {editing === "blood-pressure" ? (
                  <div>
                    <input
                      type="text"
                      value={value}
                      onChange={handleInputChange}
                      placeholder="Enter new blood pressure (e.g., 120/80)"
                      className="border border-gray-300 rounded px-4 py-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => handleCancelEdit()}>Close</Button>
                      <Button onClick={() => handleSave("blood-pressure", formatBloodPressure(value))}>Save</Button>
                    </div>                  
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {parseBloodPressure(bloodPressure).systolic}/
                      {parseBloodPressure(bloodPressure).diastolic}

                    </div>
                  </>
                )}
              </CardContent>
              <div>
                {editing !== "blood-pressure" && (
                  <Button onClick={() => handleEditClick("blood-pressure")}>Edit</Button>
                )}
              </div>
            </Card>
            {/* Heart Rate Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
              </CardHeader>
              <CardContent>
                {editing === "heart-rate" ? (
                  <div>
                    <input
                      type="number"
                      value={value}
                      onChange={handleInputChange}
                      placeholder="Enter new heart rate"
                      className="border border-gray-300 rounded px-4 py-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => handleCancelEdit()}>Close</Button>
                      <Button onClick={() => handleSave("heart-rate", value)}>Save</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{heartRate ? `${heartRate} bpm` : "- bpm"}</div>
                  </>
                )}
              </CardContent>
              <div>
                {editing !== "heart-rate" && (
                  <Button onClick={() => handleEditClick("heart-rate")}>Edit</Button>
                )}
              </div>
            </Card>



            {/* Blood Sugar Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blood Sugar</CardTitle>
              </CardHeader>
              <CardContent>
                {editing === "blood-sugar" ? (
                  <div>
                    <input
                      type="number"
                      value={value}
                      onChange={handleInputChange}
                      placeholder="Enter new blood sugar"
                      className="border border-gray-300 rounded px-4 py-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => handleCancelEdit()}>Close</Button>
                      <Button onClick={() => handleSave("blood-sugar", value)}>Save</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {bloodSugar ? bloodSugar : "-"}
                    </div>
                  </>
                )}
              </CardContent>
              <div>
                {editing !== "blood-sugar" && (
                  <Button onClick={() => handleEditClick("blood-sugar")}>Edit</Button>
                )}
              </div>
            </Card>
            {/* Blood Type Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blood Type</CardTitle>
              </CardHeader>
              <CardContent>
                {editing === "blood-type" ? (
                  <div>
                    <input
                      type="text"
                      value={value}
                      onChange={handleInputChange}
                      placeholder="Enter new blood type"
                      className="border border-gray-300 rounded px-4 py-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => handleCancelEdit()}>Close</Button>
                      <Button onClick={() => handleSave("blood-type", value)}>Save</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {bloodType ? bloodType : "-"}
                    </div>
                  </>
                )}
              </CardContent>
              <div>
                {editing !== "blood-type" && (
                  <div className="flex space-x-2">
                    <Button onClick={() => handleEditClick("blood-type")}>Edit</Button>
                  </div>
                )}
              </div>
            </Card>

            {/* BMI Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">BMI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bmi ? bmi : "-"}</div>
                <p className="text-sm text-muted-foreground">{getBmiComment(bmi)}</p>
              </CardContent>
            </Card>

          </div>
          {/* Allergies Card */}
          <div className='mt-3'>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Allergies</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  {Array.isArray(allergies) && allergies.length > 0 ? (
                    allergies.map((allergy, index) => (
                      <li key={index} className="flex items-center justify-between text-sm text-gray-700">
                        <span>{index + 1}. {allergy}</span>
                        <Button
                          className="text-red-500 text-xs"
                          onClick={() => handleDelete(allergy)}
                        >
                          Delete
                        </Button>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500">No allergies</li>
                  )}
                </ul>

                {/* Yeni alerji ekleme alanı */}
                {editing === "allergies" && (
                  <div className="mt-4">
                    <input
                      type="text"
                      value={value}
                      onChange={handleInputChange}
                      placeholder="Enter new allergy"
                      className="border border-gray-300 rounded px-4 py-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => handleCancelEdit()}>Close</Button>
                      <Button onClick={() => handleSave("allergies", value)}>Save</Button>
                    </div>
                  </div>
                )}

              </CardContent>
              <div>
                {editing !== "allergies" && (
                  <Button onClick={() => handleEditClick("allergies")}>Add</Button>
                )}
              </div>
            </Card>
          </div>


        </div>
      </main>
    </div>
  );
}




