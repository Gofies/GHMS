import { useState } from 'react'
import { Button } from "../../components/ui/patient/signup/Button.jsx"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/patient/signup/Card.jsx"
import { Input } from "../../components/ui/patient/signup/Input.jsx"
import { Label } from "../../components/ui/patient/signup/Label.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/patient/signup/Select.jsx"
import { Checkbox } from "../../components/ui/patient/signup/Checkbox.jsx"
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom";
import { Images } from "../../assets/images/Images";
import { Endpoint, postRequest } from "../../helpers/Network.js";
import { toast } from "react-toastify";

export default function PatientSignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPhoneCode, setSelectedPhoneCode] = useState('🇹🇷 +90');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [selectedEmergencyContactCode, setSelectedEmergencyContactCode] = useState('🇹🇷 +90');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedNationality, setSelectedNationality] = useState('');
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState(2024);
  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  const days = Array.from({ length: 31 }, (_, i) => i + 1); // 1-31
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i); // Son 100 yıl

  const genders = ["Male", "Female"]

  const [isNationalityDropdownOpen, setIsNationalityDropdownOpen] = useState(false)
  const [isPhoneCodeDropdownOpen, setIsPhoneCodeDropdownOpen] = useState(false)
  const [isEmergencyContactCodeDropdownOpen, setIsEmergencyContactCodeDropdownOpen] = useState(false)

  const getFormattedDate = () => {
    if (!selectedDay || !selectedMonth || !selectedYear) return null;

    const monthIndex = months.indexOf(selectedMonth) + 1; // Ayın sırasını al
    return `${selectedYear}-${String(monthIndex).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  };

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

  const emergencyContactCodes = [
    { ecflag: "🇹🇷", eccode: "+90", eccountry: "Turkey" },
    { ecflag: "🇺🇸", eccode: "+1", eccountry: "United States" },
    { ecflag: "🇬🇧", eccode: "+44", eccountry: "United Kingdom" },
    { ecflag: "🇨🇦", eccode: "+1", eccountry: "Canada" },
    { ecflag: "🇦🇺", eccode: "+61", eccountry: "Australia" },
    { ecflag: "🇮🇳", eccode: "+91", eccountry: "India" },
    { ecflag: "🇨🇭", eccode: "+41", eccountry: "Switzerland" },
    { ecflag: "🇩🇪", eccode: "+49", eccountry: "Germany" },
    { ecflag: "🇫🇷", eccode: "+33", eccountry: "France" },
    { ecflag: "🇯🇵", eccode: "+81", eccountry: "Japan" },
    { ecflag: "🇧🇷", eccode: "+55", eccountry: "Brazil" },
    { ecflag: "🇲🇽", eccode: "+52", eccountry: "Mexico" },
    { ecflag: "🇮🇹", eccode: "+39", eccountry: "Italy" },
  ]

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

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const birthdate = getFormattedDate();
    if (!birthdate) {
      alert("Please select a valid date of birth.");
      return;
    }
    console.log("Selected Birthdate:", birthdate);

    if (!selectedGender) {
      return toast.error("Please select a gender.");

    }

    if (!selectedNationality) {
      return toast.error("Please select a nationality.");

    }

    if (password !== passwordConfirm) {
      return toast.error("Passwords do not match.");
    }

    const requestBody = {
      name,
      surname,
      gender: selectedGender,
      email,
      password,
      passwordconfirm: passwordConfirm,
      phone: `${selectedPhoneCode} ${phone}`,
      emergencycontact: `${selectedEmergencyContactCode} ${emergencyContact}`,
      birthdate: birthdate,
      nationality: selectedNationality,
      address,
    };

    try {
      const responseData = await postRequest(Endpoint.SIGNUP, requestBody);
      if (responseData) {
        toast.success("Account created successfully!");
        navigate("/");
      } else {
        const errorData = await responseData;
        toast({
          title: "Error",
          description: errorData.message || "An error occurred during signup.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{ backgroundImage: `url(${Images.LOGIN_PAGE_BACKGROUND_IMAGE})` }}
    >
      <Card className="w-full max-w-5xl p-6 bg-white">
        {/* Üst Kısım: Başlık ve Açıklama */}
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create a patient account</CardTitle>
          <CardDescription className="mt-2 text-gray-600">
            Enter your information to create your patient account
          </CardDescription>
        </CardHeader>

        {/* Form Kısmı */}
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sol Sütun */}
            <div className="grid gap-4">
              {/* Name */}
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

              {/* Surname */}
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

              {/* Email */}
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

              {/* Password */}
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
              {/* Confirm Password */}
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
                <Label>Date of Birth</Label>
                <div className="flex w-full space-x-4">
                  {/* Gün Dropdown */}
                  <div className="flex-1">
                    <Select>
                      <SelectTrigger
                        value={selectedDay}
                        onClick={() => setIsDayDropdownOpen(!isDayDropdownOpen)}
                      >
                        <SelectValue value={selectedDay} />
                      </SelectTrigger>
                      <SelectContent isOpen={isDayDropdownOpen}>
                        <div className="max-h-60 overflow-y-auto">
                          {days.map((day) => (
                            <SelectItem
                              key={day}
                              value={day}
                              onSelect={() => {
                                setSelectedDay(day);
                                setIsDayDropdownOpen(false);
                              }}
                            >
                              {day}
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Ay Dropdown */}
                  <div className="flex-1">
                    <Select>
                      <SelectTrigger
                        value={selectedMonth}
                        onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                      >
                        <SelectValue value={selectedMonth} />
                      </SelectTrigger>
                      <SelectContent isOpen={isMonthDropdownOpen}>
                        <div className="max-h-60 overflow-y-auto">
                          {months.map((month, index) => (
                            <SelectItem
                              key={index}
                              value={month}
                              onSelect={() => {
                                setSelectedMonth(month);
                                setIsMonthDropdownOpen(false);
                              }}
                            >
                              {month}
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Yıl Dropdown */}
                  <div className="flex-1">
                    <Select>
                      <SelectTrigger
                        value={selectedYear}
                        onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                      >
                        <SelectValue value={selectedYear} />
                      </SelectTrigger>
                      <SelectContent isOpen={isYearDropdownOpen}>
                        <div className="max-h-60 overflow-y-auto">
                          {years.map((year) => (
                            <SelectItem
                              key={year}
                              value={year}
                              onSelect={() => {
                                setSelectedYear(year);
                                setIsYearDropdownOpen(false);
                              }}
                            >
                              {year}
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

            </div>

            {/* Sağ Sütun */}
            <div className="grid gap-4">
              {/* Phone */}
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="flex space-x-2">
                  {/* Phone Code Dropdown */}
                  <div className="flex items-center space-x-2">
                    <Select>
                      <SelectTrigger
                        value={selectedPhoneCode}
                        onClick={() => setIsPhoneCodeDropdownOpen(!isPhoneCodeDropdownOpen)}
                      >
                        <SelectValue value={selectedPhoneCode.split(" ")[1]} /> {/* Code */}
                      </SelectTrigger>
                      <SelectContent isOpen={isPhoneCodeDropdownOpen}>
                        <div className="max-h-60 overflow-y-auto">
                          {phoneCodes.map(({ flag, code }) => (
                            <SelectItem
                              key={code}
                              value={`${flag} ${code}`}
                              onSelect={() => {
                                setSelectedPhoneCode(`${flag} ${code}`);
                                setIsPhoneCodeDropdownOpen(false);
                              }}
                            >
                              <span className="flex items-center space-x-2">
                                <span>{flag}</span>
                                <span>{code}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Phone Number Input */}
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="number"
                    placeholder="(53x)xxxxxxx"
                    required
                    className="flex-1"
                  />
                </div>
              </div>
              {/* Emergency Contact */}
              <div className="grid gap-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <div className="flex space-x-2">
                <div className="flex items-center space-x-2">
                  {/* Emergency Contact Code */}
                  <Select>
                    <SelectTrigger
                      value={selectedEmergencyContactCode}
                      onClick={() => setIsEmergencyContactCodeDropdownOpen(!isEmergencyContactCodeDropdownOpen)}
                    >
                        <SelectValue value={selectedEmergencyContactCode.split(" ")[1]} /> {/* Code */}
                        </SelectTrigger>
                    <SelectContent isOpen={isEmergencyContactCodeDropdownOpen}>
                      <div className="max-h-60 overflow-y-auto">
                        {emergencyContactCodes.map(({ ecflag, eccode }) => (
                          <SelectItem
                            key={eccode}
                            value={`${ecflag} ${eccode}`}
                            onSelect={() => {
                              setSelectedEmergencyContactCode(`${ecflag} ${eccode}`);
                              setIsEmergencyContactCodeDropdownOpen(false);
                            }}
                          >
                            <span className="flex items-center space-x-2">
                              <span>{ecflag}</span>
                              <span>{eccode}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                  </div>

                  {/* Emergency Contact Input */}
                  <Input
                    id="emergencyContact"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    type="number"
                    placeholder="(53x)xxxxxxx"
                    required
                    className="flex-1"
                  />
                </div>
              </div>
              {/* Gender */}
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
                        onSelect={() => { setSelectedGender(gender); setIsGenderDropdownOpen(false); }}
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
                          onSelect={() => { setSelectedNationality(country); setIsNationalityDropdownOpen(false) }}
                        />
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              {/* Address */}
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  required
                  className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full resize-none"
                />
              </div>



            </div>
            <div className="col-span-1 md:col-span-2">
      <Button className="w-full mt-6" type="submit">
        Create account
      </Button>
    </div>
          </form>
        </CardContent>

        {/* Alt Kısım: Button */}
        <CardFooter className="text-center">
      
          <p className="text-sm text-center text-gray-600 mt-2">
            Already have a patient account?{' '}
            <Link to="/" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>


  );
}