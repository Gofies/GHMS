'use client'

import { useState } from 'react'
import { Button } from "../../components/ui/admin/Button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/admin/Card.jsx"
import { Input } from "../../components/ui/admin/Input.jsx"
import { Label } from "../../components/ui/admin/Label.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/admin/Select.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/admin/Table.jsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/admin/Dialog.jsx"
import { Badge } from "../../components/ui/admin/Badge.jsx"
import { Switch } from "../../components/ui/admin/Switch.jsx"
import { Home, Users, Shield, Settings, LogOut, Search, Plus, Edit, Trash2 } from 'lucide-react'
//import Link from 'next/link'
import Sidebar from "../../components/ui/admin/Sidebar.jsx";
import Header from "../../components/ui/admin/Header.jsx";
import { Endpoint, postRequest, getRequest } from "../../helpers/Network.js";
import { toast } from 'react-toastify'

// Mock data for users
const users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Doctor", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Nurse", status: "Active" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Lab Staff", status: "Inactive" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: 5, name: "Charlie Davis", email: "charlie@example.com", role: "IT Staff", status: "Active" },
]

export default function AdminUserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', status: 'Active' })
  const [editingUser, setEditingUser] = useState(null)

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Here you would typically send the new user data to your backend
    console.log("New user created:", newUser)
    setNewUser({ name: '', email: '', role: '', status: 'Active' })
  }

  const handleEditUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Here you would typically send the updated user data to your backend
    console.log("User updated:", editingUser)
    setEditingUser(null)
  }

  const handleDeleteUser = (userId: number) => {
    // Here you would typically send a delete request to your backend
    console.log("User deleted:", userId)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Header title="User Management"/>

        {/* User Management Content */}
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
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">
                        Role
                      </Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value) => setNewUser({...newUser, role: value})}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="doctor">Doctor</SelectItem>
                          <SelectItem value="nurse">Nurse</SelectItem>
                          <SelectItem value="lab_staff">Lab Staff</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="it_staff">IT Staff</SelectItem>
                        </SelectContent>
                      </Select>
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
            <CardHeader className="flex space-between">
              <CardTitle className="text-xl font-bold">User List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handleEditUser}>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-name" className="text-right">
                                      Name
                                    </Label>
                                    <Input
                                      id="edit-name"
                                      value={editingUser?.name}
                                      onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-email" className="text-right">
                                      Email
                                    </Label>
                                    <Input
                                      id="edit-email"
                                      type="email"
                                      value={editingUser?.email}
                                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-role" className="text-right">
                                      Role
                                    </Label>
                                    <Select
                                      value={editingUser?.role}
                                      onValueChange={(value) => setEditingUser({...editingUser, role: value})}
                                    >
                                      <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select a role" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="doctor">Doctor</SelectItem>
                                        <SelectItem value="nurse">Nurse</SelectItem>
                                        <SelectItem value="lab_staff">Lab Staff</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="it_staff">IT Staff</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-status" className="text-right">
                                      Status
                                    </Label>
                                    <Switch
                                      id="edit-status"
                                      checked={editingUser?.status === 'Active'}
                                      onCheckedChange={(checked) => setEditingUser({...editingUser, status: checked ? 'Active' : 'Inactive'})}
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <Button type="submit">Update User</Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.id)}>
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
  )
}