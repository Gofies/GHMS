import { useState } from 'react'
import { Button } from "../../components/ui/patient/signup/Button.jsx"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/patient/signup/Card.jsx"
import { Input } from "../../components/ui/patient/signup/Input.jsx"
import { Label } from "../../components/ui/patient/signup/Label.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/patient/signup/Select.jsx"
import { Checkbox } from "../../components/ui/patient/signup/Checkbox.jsx"
import { useToast } from "../../components/ui/patient/signup/Use-Toast.jsx"
import { Eye, EyeOff } from 'lucide-react'
import { Link } from "react-router-dom";
import { Images } from "../../assets/images/Images";


export default function PatientSignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPhoneCode, setSelectedPhoneCode] = useState('🇹🇷 +90'); // Default phone code (Turkey +90)
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedNationality, setSelectedNationality] = useState('');

  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false)

  const handleSelectGender = (gender) => {
    setSelectedGender(gender)
    setIsGenderDropdownOpen(false) // Close dropdown after selection
  }
  const genders = ["Male", "Female"]


  const [isNationalityDropdownOpen, setIsNationalityDropdownOpen] = useState(false)

  const handleSelectNationality = (nationality) => {
    setSelectedNationality(nationality)
    setIsNationalityDropdownOpen(false) // Close dropdown after selection
  }

  const [isPhoneCodeDropdownOpen, setIsPhoneCodeDropdownOpen] = useState(false)

  const handleSelectPhoneCode = (code) => {
    setSelectedPhoneCode(code)
    setIsPhoneCodeDropdownOpen(false) // Close dropdown after selection
  }

  // List of country flags and telephone codes
  const phoneCodes = [
    { flag: "🇹🇷", code: "+90", country: "Turkey" },
    { flag: "🇺🇸", code: "+1", country: "United States" },
    { flag: "🇬🇧", code: "+44", country: "United Kingdom" },
    { flag: "🇨🇦", code: "+1", country: "Canada" },
    { flag: "🇦🇺", code: "+61", country: "Australia" },
    { flag: "🇮🇳", code: "+91", country: "India" },
    { flag: "🇨🇭", code: "+41", country: "Switzerland" },
    { flag: "🇩🇪", code: "+49", country: "Germany" },
    { flag: "🇫🇷", code: "+33", country: "France" },
    { flag: "🇯🇵", code: "+81", country: "Japan" },
    { flag: "🇧🇷", code: "+55", country: "Brazil" },
    { flag: "🇲🇽", code: "+52", country: "Mexico" },
    { flag: "🇮🇹", code: "+39", country: "Italy" },
  ]

  const { toast } = useToast()

  const nationalities = [
    "Turkish",
    "American",
    "Canadian",
    "Mexican",
    "British",
    "German",
    "French",
    "Australian",
    "Indian",
    "Japanese",
    "Brazilian",
    "South Korean",
    "Chinese",
    "Russian",
    "South African",
    "Italian",
    "Spanish",
    "Argentinian",
    "Nigerian",
    "Egyptian",
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    // Example validation
    if (!selectedGender) {
      return toast({
        title: "Error",
        description: "Please select a gender.",
        variant: "destructive",
      })
    }

    if (!selectedNationality) {
      return toast({
        title: "Error",
        description: "Please select your nationality.",
        variant: "destructive",
      })
    }

    // Here you would typically send the form data to your backend
    toast({
      title: "Account created",
      description: "You've successfully signed up for an account.",
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100" style={{backgroundImage: `url(${Images.LOGIN_PAGE_BACKGROUND_IMAGE})`}}>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Enter your information to create your patient account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="surname">Surname</Label>
                <Input
                  id="surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="flex space-x-2 w-full">
                  {/* Phone Code Dropdown */}
                  <div className="w-1/4">
                    <Select>
                      <SelectTrigger
                        value={selectedPhoneCode}
                        onClick={() => setIsPhoneCodeDropdownOpen(!isPhoneCodeDropdownOpen)}
                      >
                        <SelectValue value={selectedPhoneCode} />
                      </SelectTrigger>
                      <SelectContent isOpen={isPhoneCodeDropdownOpen}>
                        <div className="max-h-60 overflow-y-auto">
                          {phoneCodes.map(({ flag, code, country }) => (
                            <SelectItem
                              key={code}
                              value={`${flag} ${code}`}
                              onSelect={() => {setSelectedPhoneCode(`${flag} ${code}`); setIsPhoneCodeDropdownOpen(false);}}
                            >
                              <span>{flag} {code}</span>
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Phone Number Input */}
                  <div className="w-3/4">
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      type="tel"
                      placeholder="(53x)xxxxxxx"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="passwordconfirm">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="passwordconfirm"
                    type={showPasswordConfirm ? 'text' : 'password'}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  >
                    {showPasswordConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select>
                  <SelectTrigger
                    value={selectedGender}
                    onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                  />
                  <SelectContent isOpen={isGenderDropdownOpen}>
                    {genders.map((gender) => (
                      <SelectItem
                        key={gender}
                        value={gender}
                        onSelect={() => {setSelectedGender(gender); setIsGenderDropdownOpen(false);}}
                      />
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Select>
                  <SelectTrigger
                    value={selectedNationality}
                    onClick={() => setIsNationalityDropdownOpen(!isNationalityDropdownOpen)}
                  />
                  <SelectContent isOpen={isNationalityDropdownOpen}>
                    <div className="max-h-60 overflow-y-auto">
                      {nationalities.map((country) => (
                        <SelectItem
                          key={country}
                          value={country}
                          onSelect={() => {setSelectedNationality(country); setIsNationalityDropdownOpen(false)}}
                        />
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{' '}
                  <Link to="/terms" className="underline">
                    terms and conditions
                  </Link>
                </Label>
              </div>
            </div>

            <Button className="w-full mt-6" type="submit">
              Create account
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center text-gray-600 mt-2">
            Already have an account?{' '}
            <Link to="/" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}