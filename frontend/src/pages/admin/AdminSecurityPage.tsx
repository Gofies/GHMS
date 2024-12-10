'use client'

import { useState } from 'react'
import { Button } from "../../components/ui/admin/Button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/admin/Card.jsx"
import { Input } from "../../components/ui/admin/Input.jsx"
import { Label } from "../../components/ui/admin/Label.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/admin/Select.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/admin/Table.jsx"
import { Badge } from "../../components/ui/admin/Badge.jsx"
import { Progress } from "../../components/ui/admin/Progress.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/admin/Tabs.jsx"
import { Home, Users, Shield, Settings, LogOut, Search, AlertTriangle, Lock, Activity } from 'lucide-react'
//import Link from 'next/link'
import Sidebar from "../../components/ui/admin/Sidebar.jsx";
import Header from "../../components/ui/admin/Header.jsx";
// Mock data for security logs
const securityLogs = [
  { id: 1, event: "Failed login attempt", user: "unknown", ip: "192.168.1.100", timestamp: "2023-06-15 10:30:00" },
  { id: 2, event: "Password changed", user: "john@example.com", ip: "192.168.1.101", timestamp: "2023-06-15 11:15:00" },
  { id: 3, event: "Unauthorized access attempt", user: "unknown", ip: "192.168.1.102", timestamp: "2023-06-15 12:00:00" },
  { id: 4, event: "User account locked", user: "jane@example.com", ip: "192.168.1.103", timestamp: "2023-06-15 13:45:00" },
  { id: 5, event: "New user created", user: "admin@example.com", ip: "192.168.1.104", timestamp: "2023-06-15 14:30:00" },
]

// Mock data for system health
const systemHealth = [
  { id: 1, name: "Firewall", status: "Operational", performance: 95 },
  { id: 2, name: "Intrusion Detection System", status: "Warning", performance: 78 },
  { id: 3, name: "Data Encryption", status: "Operational", performance: 100 },
  { id: 4, name: "Access Control", status: "Operational", performance: 92 },
]

export default function AdminSecurityPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredLogs = securityLogs.filter(log =>
    log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ip.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <Header title="Security"/>

        {/* Security Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Tabs defaultValue="logs">
            <TabsList>
              <TabsTrigger value="logs">Security Logs</TabsTrigger>
              <TabsTrigger value="health">System Health</TabsTrigger>
            </TabsList>
            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center justify-between">
                    <span className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Security Logs
                    </span>
                    <div className="flex items-center">
                      <Search className="w-5 h-5 mr-2 text-gray-500" />
                      <Input
                        type="text"
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                      />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.event}</TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>{log.ip}</TableCell>
                          <TableCell>{log.timestamp}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="health">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemHealth.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{item.name}</span>
                          <Badge variant={item.status === 'Operational' ? 'default' : 'warning'}>
                            {item.status}
                          </Badge>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24">Performance:</span>
                          <Progress value={item.performance} className="flex-1 mr-4" />
                          <span>{item.performance}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}