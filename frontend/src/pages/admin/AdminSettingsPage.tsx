import { useState } from 'react'
import { Button } from "../../components/ui/admin/Button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/admin/Card.jsx"
import { Label } from "../../components/ui/admin/Label.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/admin/Select.jsx"
import { Switch } from "../../components/ui/admin/Switch.jsx"
import { CalendarDays, Home, User, FileText, PieChart, Settings, LogOut, Moon, Bell, Lock } from 'lucide-react'
import Sidebar from "../../components/ui/admin/Sidebar.jsx";
import Header from "../../components/ui/admin/Header.jsx";
import { useDarkMode } from '../../helpers/DarkModeContext';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Endpoint, getRequest, putRequest } from "../../helpers/Network.js";
import { toast } from 'react-toastify'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/patient/appointment/Dialog.jsx"
import { Input } from "../../components/ui/patient/settings/Input.jsx"


export default function AdminSettingsPage() {
  const { darkMode, toggleDarkMode } = useDarkMode(); // Context'ten alınan değerler

  const [error, setError] = useState(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const handleChangePassword = async (e) => { // api gelince çalışacak
    e.preventDefault();
    try {
      const response = await putRequest(Endpoint.CHANGE_PASSWORD, {
        currentPassword: currentPassword, // Eski şifre
        newPassword: newPassword, // Yeni şifre
        newPasswordConfirm: newPasswordConfirm
      });

      // Başarılı yanıt alındığında işlem yap
      console.log("Password changed successfully:", response);
      toast.success("Password changed successfully!"); // Toast mesajı
    } catch (err) {
      toast.error("Failed to change password. Please try again."); // Toast mesajı
      setError("Failed to change password. Please try again."); // Hata durumu
    }
  };
  
  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 " : "bg-gray-100" }text-gray-900`}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header title="Settings" />
        <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Appearance Card */}
          <Card className={"shadow-lg rounded-lg"}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks and feels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode" className="font-medium">
                    Dark Mode
                  </Label>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </CardContent>
          </Card>
  
          {/* Security Card */}
          <Card className={`mt-6 shadow-lg rounded-lg`}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Security</CardTitle>
              <CardDescription>
                Manage your account security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className={"w-full border-gray-300 text-gray-900 hover:bg-gray-100"}
                onClick={() => {setIsChangePasswordOpen(true);setIsDialogOpen(true)}}
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
  
      {/* Dialog for Change Password */}
      {isChangePasswordOpen && (
  <Dialog open={isChangePasswordOpen}>
    <DialogContent className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <form onSubmit={handleChangePassword}>
        <div className="grid gap-4">
          <Label htmlFor="currentPassword">Current Password</Label>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your current password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`${darkMode ? "bg-gray-700 text-white border-gray-600" : ""}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`absolute right-0 top-0 h-full px-3 ${
                darkMode ? "text-white hover:bg-gray-700" : ""
              }`}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          </div>

          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`${darkMode ? "bg-gray-700 text-white border-gray-600" : ""}`}
            />
          </div>

          <Label htmlFor="newPasswordConfirm">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="newPasswordConfirm"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              required
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              className={`${darkMode ? "bg-gray-700 text-white border-gray-600" : ""}`}
            />
          </div>
        </div>

        {error && (
            <div className={`text-sm ${darkMode ? "text-red-400" : "text-red-500"} mt-2`}>
              {error.message || "Email or password is incorrect. Please try again."}
            </div>
        )}
        <div className="flex justify-between mt-4">
          <Button
            type="button"
            onClick={() => {
              setIsChangePasswordOpen(false);
              setCurrentPassword("");
              setNewPassword("");
              setNewPasswordConfirm("");
            }}
            className={`${darkMode ? "bg-gray-700 hover:bg-gray-600" : ""}`}
          >
            Close
          </Button>
          <Button type="submit" className={`ml-auto ${darkMode ? "bg-blue-700 hover:bg-blue-600" : ""}`}>
            Change Password
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
)}

    </div>
  );
  
}