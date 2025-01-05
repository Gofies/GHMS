import { useState } from 'react'
import { Button } from "../../components/ui/patient/settings/Button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/patient/settings/Card.jsx"
import { Label } from "../../components/ui/patient/settings/Label.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/patient/settings/Select.jsx"
import { Switch } from "../../components/ui/patient/settings/Switch.jsx"
import { CalendarDays, Home, User, FileText, PieChart, Settings, LogOut, Moon, Bell, Lock } from 'lucide-react'
import Sidebar from "../../components/ui/doctor/common/Sidebar.jsx";
import Header from "../../components/ui/admin/Header.jsx";
import { useDarkMode } from '../../helpers/DarkModeContext.js';
import { Endpoint, getRequest, putRequest } from "../../helpers/Network.js";
import { toast } from 'react-toastify'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/patient/appointment/Dialog.jsx"
import { Input } from "../../components/ui/patient/settings/Input.jsx"
//import { Label } from '../../components/ui/login/Label';
import { EyeIcon, EyeOffIcon } from 'lucide-react';


export default function DoctorSettingsPage() {
  const [language, setLanguage] = useState('english')
  const [notifications, setNotifications] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)
  const { darkMode, toggleDarkMode } = useDarkMode(); 



  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    // Here you would typically update the language in your app
  }

  const [error, setError] = useState(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChangePassword = async (e) => {
    //setIsChangePasswordOpen(true);
    e.preventDefault();
    console.log("aaa");
    try {
      // PUT isteği gönder
      const response = await putRequest(Endpoint.DOCTOR_CHANGE_PASSWORD, {
        currentPassword: currentPassword, // Eski şifre
        newPassword: newPassword, // Yeni şifre
        newPasswordConfirm: newPasswordConfirm
      });

      // Başarılı yanıt alındığında işlem yap
      console.log("Password changed successfully:", response);
      toast("Password changed successfully!"); // Toast mesajı
    } catch (err) {
      console.error("Error changing password:", err);
      toast("Failed to change password. Please try again."); // Toast mesajı
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
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Español</SelectItem>
                    <SelectItem value="french">Français</SelectItem>
                    <SelectItem value="german">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </CardContent>
          </Card>

          {/* <Card className="mt-6">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your notification preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about appointments, test results, and more.
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </CardContent>
          </Card> */}

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your account security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account.
                  </p>
                </div>
                <Switch
                  id="two-factor"
                  checked={twoFactor}
                  onCheckedChange={setTwoFactor}
                />
              </div> */}
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

