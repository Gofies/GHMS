import { useState } from 'react';
import { Button } from '../../../components/ui/login/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/login/Card';
import { Input } from '../../../components/ui/login/Input';
import { Label } from '../../../components/ui/login/Label';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { NavLink } from "react-router-dom";
import { Endpoint, postRequest } from '../../../helpers/Network';
import { Images } from "../../../assets/images/Images";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await postRequest(Endpoint.LOGIN, { email, password });
      // Handle successful login (e.g., redirect, store token, etc.)
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-green-100">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${Images.LOGIN_PAGE_BACKGROUND_IMAGE})`,
          filter: "blur(5px)"
        }}
      ></div>
      <Card className="w-[350px] z-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleLogin}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2 mt-4">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            <div className="mt-4">
              <Button className="w-full" type="submit">Sign in</Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <NavLink
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot your password?
          </NavLink>
        </CardFooter>
      </Card>
    </div>
  );
}
