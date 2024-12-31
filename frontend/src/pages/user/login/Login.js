import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/login/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/login/Card';
import { Input } from '../../../components/ui/login/Input';
import { Label } from '../../../components/ui/login/Label';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { NavLink } from "react-router-dom";
import { Images } from "../../../assets/images/Images";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearError } from '../../../redux/authSlice';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, role, userId } = useSelector((state) => state.auth);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      switch (role) {
        case "admin":
          navigate(`/admin/${userId}/`);
          break;
        case "doctor":
          navigate(`/doctor/${userId}/`);
          break;
        case "labtechnician":
          navigate(`/labtechnician/${userId}`);
          break;
        case "patient":
          navigate(`/patient/${userId}/`);
          break;
        default:
          navigate("/");
      }
    }
  }, [isAuthenticated, role, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

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
            {/* Display loading state */}
            {loading && (
              <div className="mt-2 text-sm text-blue-600">Logging in...</div>
            )}

            {/* Display error message */}
            {error && (
              <div className="mt-2 text-sm text-red-600">
                {error.message || "Email or password is incorrect. Please try again."}
              </div>
            )}
            <div className="mt-4">
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <NavLink
            to="/signup"
            className="text-sm text-blue-600 hover:underline"
          >
            Signup
          </NavLink>
        </CardFooter>
      </Card>
    </div>
  );
}