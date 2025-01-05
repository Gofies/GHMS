import { useState } from 'react'
import { Button } from "../../components/ui/patient/settings/Button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/admin/Card.jsx"
import { Label } from "../../components/ui/admin/Label.jsx"
import { Switch } from "../../components/ui/patient/settings/Switch.jsx"
import { Lock } from 'lucide-react'
import { useDarkMode } from '../../helpers/DarkModeContext.js';
import Sidebar from "../../components/ui/lab-staff/common/Sidebar.jsx"
import Header from "../../components/ui/admin/Header.jsx";

import { Endpoint, putRequest } from "../../helpers/Network.js";
import { toast } from 'react-toastify'
import { Dialog, DialogContent } from "../../components/ui/lab-staff/Dialog.jsx"
import { Input } from '../../components/ui/patient/settings/Input.jsx';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export default function LabStaffSettingsPage() {
  const [error, setError] = useState(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode(); 
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await putRequest(Endpoint.LAB_TECHNICIAN_CHANGE_PASSWORD, {
        currentPassword: currentPassword, // Eski şifre
        newPassword: newPassword, // Yeni şifre
        newPasswordConfirm: newPasswordConfirm
      });
      toast.success("Password changed successfully!"); // Toast mesajı
    } catch (err) {
      toast.error("Failed to change password. Please try again."); // Toast mesajı
      setError("Failed to change password. Please try again."); // Hata durumu
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-800 " : "bg-gray-100" }text-gray-900`}>
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <Header title="Settings" />
        {/* Settings Content */}
        <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the application looks and feels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Turn on dark mode for a comfortable viewing experience in low light.
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your account security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full" onClick={() => setIsChangePasswordOpen(true)}>
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      {isChangePasswordOpen && (
        <Dialog open={isChangePasswordOpen}>
          <DialogContent>
            <form onSubmit={handleChangePassword}>
              <div className="grid gap-2 mt-4">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
                <Label htmlFor="newPasswordConfirm">New Password Confirm</Label>
                <div className="relative">
                  <Input
                    id="newPasswordConfirm"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    required
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>
              {/* Display loading state */}
              {/* {loading && (
                  <div className="mt-2 text-sm text-blue-600">Logging in...</div>
                )} */}

              {/* Display error message */}
              {error && (
                <div className="mt-2 text-sm text-red-600">
                  {error.message || "Email or password is incorrect. Please try again."}
                </div>
              )}
              <div className="flex justify-between mt-4">
                <Button
                  type="button"
                  onClick={() => {
                    setIsChangePasswordOpen(false); // Dialog'u kapat
                    setCurrentPassword(""); // Inputları sıfırla
                    setNewPassword("");
                    setNewPasswordConfirm("");
                  }}
                >
                  Close
                </Button>
                <Button className="ml-auto" type="submit"> {/* Sağ tarafa yasla */}
                  Change Password
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}


    </div>
  )
}

