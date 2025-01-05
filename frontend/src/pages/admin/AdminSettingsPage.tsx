import { useState } from 'react'
import { Button } from "../../components/ui/admin/Button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/admin/Card.jsx"
import { Label } from "../../components/ui/admin/Label.jsx"
import { Switch } from "../../components/ui/admin/Switch.jsx"
import { Lock } from 'lucide-react'
import Sidebar from "../../components/ui/admin/Sidebar.jsx";
import Header from "../../components/ui/admin/Header.jsx";
import { useDarkMode } from '../../helpers/DarkModeContext';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Endpoint, putRequest } from "../../helpers/Network.js";
import { toast } from 'react-toastify'
import { Dialog, DialogContent } from "../../components/ui/patient/appointment/Dialog.jsx"
import { Input } from "../../components/ui/patient/settings/Input.jsx"

export default function AdminSettingsPage() {

  const { darkMode, toggleDarkMode } = useDarkMode();
  const [error, setError] = useState(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await putRequest(Endpoint.ADMIN_CHANGE_PASSWORD, {
        currentPassword: currentPassword,
        newPassword: newPassword,
        newPasswordConfirm: newPasswordConfirm
      });
      toast.success("Password changed successfully!");
      setIsChangePasswordOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch (err) {
      toast.error("Failed to change password. Please try again.");
      setError("Failed to change password. Please try again.");
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 " : "bg-gray-100"}text-gray-900`}>
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
                onClick={() => { setIsChangePasswordOpen(true); setIsDialogOpen(true) }}
              >
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
                    type={showPassword1 ? "text" : "password"}
                    placeholder="********"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <div
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword1(!showPassword1)}
                  >
                    {showPassword1 ? (
                      <EyeOffIcon className="h-4 w-4 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="sr-only">
                      {showPassword1 ? "Hide password" : "Show password"}
                    </span>
                  </div>
                </div>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword2 ? "text" : "password"}
                    placeholder="********"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <div

                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword2(!showPassword2)}
                  >
                    {showPassword2 ? (
                      <EyeOffIcon className="h-4 w-4 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="sr-only">
                      {showPassword2 ? "Hide password" : "Show password"}
                    </span>
                  </div>
                </div>
                <Label htmlFor="newPasswordConfirm">New Password Confirm</Label>
                <div className="relative">
                  <Input
                    id="newPasswordConfirm"
                    type={showPassword3 ? "text" : "password"}
                    placeholder="********"
                    required
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  />
                  <div

                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword3(!showPassword3)}
                  >
                    {showPassword3 ? (
                      <EyeOffIcon className="h-4 w-4 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="sr-only">
                      {showPassword3 ? "Hide password" : "Show password"}
                    </span>
                  </div>
                </div>
              </div>
              {error && (
                <div className="mt-2 text-sm text-red-600">
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
                >
                  Close
                </Button>
                <Button className="ml-auto" type="submit">
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