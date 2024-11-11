import { useState } from 'react'
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

// Mock data for health metrics
const weightData = [
  { date: '2023-01-01', weight: 70 },
  { date: '2023-02-01', weight: 71 },
  { date: '2023-03-01', weight: 69 },
  { date: '2023-04-01', weight: 68 },
  { date: '2023-05-01', weight: 67 },
  { date: '2023-06-01', weight: 66 },
]

const bloodPressureData = [
  { date: '2023-01-01', systolic: 120, diastolic: 80 },
  { date: '2023-02-01', systolic: 118, diastolic: 78 },
  { date: '2023-03-01', systolic: 122, diastolic: 82 },
  { date: '2023-04-01', systolic: 116, diastolic: 76 },
  { date: '2023-05-01', systolic: 120, diastolic: 80 },
  { date: '2023-06-01', systolic: 118, diastolic: 78 },
]

const heartRateData = [
  { date: '2023-01-01', rate: 72 },
  { date: '2023-02-01', rate: 70 },
  { date: '2023-03-01', rate: 74 },
  { date: '2023-04-01', rate: 68 },
  { date: '2023-05-01', rate: 72 },
  { date: '2023-06-01', rate: 70 },
]

export default function HealthMetricsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = (value) => {
    setActiveTab(value); // Update the active tab
  };


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
          <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <User className="w-5 h-5 mr-2" />
            Profile
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <CalendarDays className="w-5 h-5 mr-2" />
            Appointments
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
            <FileText className="w-5 h-5 mr-2" />
            Medical Records
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100">
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
            <h1 className="text-2xl font-semibold text-gray-900">Health Metrics</h1>
            <Button variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Health Metrics Content */}
        {/* Health Metrics Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            {/* Tab Navigation */}
            <TabsList>
              <div
                className={`px-4 py-2 cursor-pointer ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                onClick={() => handleTabChange('overview')}
              >
                Overview
              </div>
              <div
                className={`px-4 py-2 cursor-pointer ${activeTab === 'weight' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                onClick={() => handleTabChange('weight')}
              >
                Weight
              </div>
              <div
                className={`px-4 py-2 cursor-pointer ${activeTab === 'blood-pressure' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                onClick={() => handleTabChange('blood-pressure')}
              >
                Blood Pressure
              </div>
              <div
                className={`px-4 py-2 cursor-pointer ${activeTab === 'heart-rate' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                onClick={() => handleTabChange('heart-rate')}
              >
                Heart Rate
              </div>
            </TabsList>

            {/* Tab Content */}
            <TabsContent value="overview" selectedValue={activeTab}>
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Weight
                    </CardTitle>
                    <Weight className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{weightData[weightData.length - 1].weight} kg</div>
                    <p className="text-xs text-muted-foreground">
                      {weightData[weightData.length - 1].weight > weightData[weightData.length - 2].weight ? '+' : '-'}
                      {Math.abs(weightData[weightData.length - 1].weight - weightData[weightData.length - 2].weight)} kg from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Blood Pressure
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{bloodPressureData[bloodPressureData.length - 1].systolic}/{bloodPressureData[bloodPressureData.length - 1].diastolic}</div>
                    <p className="text-xs text-muted-foreground">
                      Last measured on {bloodPressureData[bloodPressureData.length - 1].date}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Heart Rate
                    </CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{heartRateData[heartRateData.length - 1].rate} bpm</div>
                    <p className="text-xs text-muted-foreground">
                      Average over last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      BMI
                    </CardTitle>
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{(weightData[weightData.length - 1].weight / (1.75 * 1.75)).toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">
                      Based on last weight measurement
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="weight" selectedValue={activeTab}>
              <div className="mt-4 w-full">
                <Card>
                  <CardHeader>
                    <CardTitle>Weight Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weightData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="blood-pressure" selectedValue={activeTab}>
              <div className="mt-4 w-full">
                <Card>
                  <CardHeader>
                    <CardTitle>Blood Pressure Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={bloodPressureData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="systolic" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="diastolic" stroke="#82ca9d" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="heart-rate" selectedValue={activeTab}>
              <div className="mt-4 w-full">
                <Card>
                  <CardHeader>
                    <CardTitle>Heart Rate Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={heartRateData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="rate" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}