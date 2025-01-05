// 'use client'

// import { useState } from 'react'
// import { Button } from "../../components/ui/admin/Button.jsx"
// import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/admin/Card.jsx"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/admin/Table.jsx"
// import { Badge } from "../../components/ui/admin/Badge.jsx"
// import { Progress } from "../../components/ui/admin/Progress.jsx"
// //import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Input } from "../../components/ui/admin/Input.jsx"
// import { Label } from "../../components/ui/admin/Label.jsx"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/admin/Select.jsx"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/admin/Tabs.jsx"
// import { Home, LogOut, Users, Shield, Activity, Settings, AlertTriangle, Plus } from 'lucide-react'
// //import Link from 'next/link'

// import Sidebar from "../../components/ui/admin/Sidebar.jsx";
// import Header from "../../components/ui/admin/Header.jsx";

// // Mock data for recent activities
// const recentActivities = [
//   { id: 1, action: "User Login", user: "Dr. Smith", timestamp: "2024-12-15 09:30:00", status: "Success" },
//   { id: 2, action: "Password Reset", user: "Nurse Johnson", timestamp: "2024-12-15 10:15:00", status: "Success" },
//   { id: 3, action: "Failed Login Attempt", user: "Unknown", timestamp: "2024-12-15 11:00:00", status: "Failed" },
//   { id: 4, action: "Patient Data Access", user: "Dr. Williams", timestamp: "2024-12-15 11:30:00", status: "Success" },
// ]

// // Mock data for system health
// const systemHealth = [
//   { id: 1, name: "Server Uptime", status: "Operational", uptime: "99.99%" },
//   { id: 2, name: "Database Performance", status: "Warning", performance: "85%" },
//   { id: 3, name: "Network Security", status: "Operational", lastCheck: "2024-12-15 08:00:00" },
//   { id: 4, name: "Backup System", status: "Operational", lastBackup: "2024-12-15 00:00:00" },
// ]

// export default function AdminHomePage() {
//   return (
//     <div className="flex h-screen bg-gray-100">
//      <Sidebar />
//       {/* Main Content */}
//       <main className="flex-1 overflow-y-auto">
//         <Header title="Home"/>

//         {/* Dashboard Content */}
//         <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//           <Tabs defaultValue="overview">
//             <TabsList>
//               <TabsTrigger value="overview">Overview</TabsTrigger>
//               <TabsTrigger value="system-health">System Health</TabsTrigger>
//             </TabsList>
            
//             <TabsContent value="overview">
//               <div className="grid gap-6 md:grid-cols-2">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="text-xl font-bold flex items-center">
//                       <Activity className="w-5 h-5 mr-2" />
//                       Recent Activities
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Action</TableHead>
//                           <TableHead>User</TableHead>
//                           <TableHead>Timestamp</TableHead>
//                           <TableHead>Status</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {recentActivities.map((activity) => (
//                           <TableRow key={activity.id}>
//                             <TableCell>{activity.action}</TableCell>
//                             <TableCell>{activity.user}</TableCell>
//                             <TableCell>{activity.timestamp}</TableCell>
//                             <TableCell>
//                               <Badge variant={activity.status === 'Success' ? 'success' : 'destructive'}>
//                                 {activity.status}
//                               </Badge>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="text-xl font-bold flex items-center">
//                       <Shield className="w-5 h-5 mr-2" />
//                       System Health
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       {systemHealth.map((item) => (
//                         <div key={item.id} className="flex items-center justify-between">
//                           <span>{item.name}</span>
//                           <Badge variant={item.status === 'Operational' ? 'default' : 'warning'}>
//                             {item.status}
//                           </Badge>
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>

//             <TabsContent value="system-health">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-xl font-bold flex items-center">
//                     <Activity className="w-5 h-5 mr-2" />
//                     System Health Details
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {systemHealth.map((item) => (
//                       <div key={item.id} className="space-y-2">
//                         <div className="flex items-center justify-between">
//                           <span className="font-semibold">{item.name}</span>
//                           <Badge variant={item.status === 'Operational' ? 'default' : 'warning'}>
//                             {item.status}
//                           </Badge>
//                         </div>
//                         {item.uptime && (
//                           <div className="flex items-center">
//                             <span className="w-1/4">Uptime:</span>
//                             <Progress value={parseFloat(item.uptime)} className="w-1/2 mr-4" />
//                             <span>{item.uptime}</span>
//                           </div>
//                         )}
//                         {item.performance && (
//                           <div className="flex items-center">
//                             <span className="w-1/4">Performance:</span>
//                             <Progress value={parseFloat(item.performance)} className="w-1/2 mr-4" />
//                             <span>{item.performance}</span>
//                           </div>
//                         )}
//                         {item.lastCheck && <p>Last Check: {item.lastCheck}</p>}
//                         {item.lastBackup && <p>Last Backup: {item.lastBackup}</p>}
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </main>
//     </div>
//   )
// }