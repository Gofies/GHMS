import { useState, useEffect } from 'react'
import { Calendars } from '../../components/ui/patient/home/Calendar'
import { Button } from '../../components/ui/patient/home/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/patient/home/Card'
import { ScrollArea } from '../../components/ui/patient/home/Scroll-area'
import { Plus, MessageCircle } from 'lucide-react'
import { useDarkMode } from '../../helpers/DarkModeContext.js';
import Sidebar from "../../components/ui/patient/common/Sidebar.jsx";
import Header from "../../components/ui/admin/Header.jsx";
import { Endpoint, getRequest } from "../../helpers/Network.js";
import { useNavigate, useLocation } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/patient/dialog/Dialog.jsx';

export default function PatientHomeScreen() {

  const [date, setDate] = useState(null);
  const [error, setError] = useState(null);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [appointmentDates, setAppointmentDates] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const handleNewAppointment = () => {
    console.log("Navigating to new appointment page")
    navigate(`${location.pathname}appointments/new`);
  }

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Aylar 0'dan başlar
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchPatientHome = async () => {
      try {
        const response = await getRequest(Endpoint.GET_HOME_APPOINTMENTS);
        console.log("e", response);

        const recentAppointments = (response.recentAppointments || []);
        const upcomingAppointments = (response.upcomingAppointments || []);

        // State'leri güncelle
        setRecentAppointments(recentAppointments);
        setUpcomingAppointments(upcomingAppointments);

        // Randevu tarihlerinin tamamını al ve Date nesnesine dönüştür
        const allDates = [
          ...(response.recentAppointments || []).map((appointment) => new Date(appointment.date)), // Date nesnesine çevir
          ...(response.upcomingAppointments || []).map((appointment) => new Date(appointment.date)),
        ];
        console.log("all", allDates);
        setAppointmentDates(allDates); // Tarihleri state'e ata
      } catch (err) {
        console.error("Error fetching patient profile:", err);
        setError("Failed to load patient profile.");
      }
    };

    fetchPatientHome();
  }, []);

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);

    // Tıklanan günün tarihini formatla
    const formattedDate = selectedDate.toLocaleDateString("en-CA"); // YYYY-MM-DD formatında

    // recentAppointments ve upcomingAppointments listelerini birleştir
    const allAppointments = [...recentAppointments, ...upcomingAppointments];

    // Tıklanan tarihe göre randevuları filtrele
    const filtered = allAppointments.filter(
      (appointment) => appointment.date.split("T")[0] === formattedDate
    );
    setFilteredAppointments(filtered);

    // Modal'ı aç
    setIsModalOpen(true);
  };




  //  CHHHHAAAAAATTT BOOOOOTTTTT

  type ChatMessage = {
    sender: string;
    type: 'text' | 'file' | 'typing';
    content: string;
    fileName?: string; // Optional property for file messages
  };

  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'bot', type: 'text', content: 'Hello! How can I assist you today?' },]);
  const [chatInput, setChatInput] = useState('');

  // const handleSendMessage = () => {
  //   if (chatInput.trim() || uploadedPhotos.length > 0 || uploadedFiles.length > 0) {
  //     // Create messages for uploaded photos
  //     const photoMessages = uploadedPhotos.map((photo) => ({
  //       sender: 'user',
  //       type: 'file' as const,
  //       content: URL.createObjectURL(photo),
  //       fileName: photo.name,
  //     }));

  //     // Create messages for uploaded files
  //     const fileMessages = uploadedFiles.map((file) => ({
  //       sender: 'user',
  //       type: 'file' as const,
  //       content: URL.createObjectURL(file),
  //       fileName: file.name,
  //     }));

  //     // Create a text message if input is provided
  //     const textMessage = chatInput.trim()
  //       ? [{ sender: 'user', type: 'text' as const, content: chatInput.trim() }]
  //       : [];

  //     // Add all messages to chat
  //     setChatMessages((prev) => [...prev, ...textMessage, ...photoMessages, ...fileMessages]);

  //     // Generate a combined bot response
  //     let botReplyContent = '';
  //     if (textMessage.length > 0 && (photoMessages.length > 0 || fileMessages.length > 0)) {
  //       botReplyContent = `You said: "${chatInput.trim()}" and uploaded ${uploadedPhotos.length} photo(s) and ${uploadedFiles.length} file(s).`;
  //     } else if (textMessage.length > 0) {
  //       botReplyContent = `You said: "${chatInput.trim()}"`;
  //     } else if (photoMessages.length > 0 || fileMessages.length > 0) {
  //       botReplyContent = `Thanks for uploading ${uploadedPhotos.length} photo(s) and ${uploadedFiles.length} file(s). I will process them shortly!`;
  //     }

  //     // Simulate chatbot reply
  //     if (botReplyContent) {
  //       setTimeout(() => {
  //         const botReply: ChatMessage = {
  //           sender: 'bot',
  //           type: 'text',
  //           content: botReplyContent,
  //         };
  //         setChatMessages((prev) => [...prev, botReply]);
  //       }, 500); // Simulate response delay
  //     }

  //     // Clear input and uploaded files/photos
  //     setChatInput('');
  //     setUploadedPhotos([]);
  //     setUploadedFiles([]);
  //   }
  // };

  const handleSendMessage = async () => {
    if (chatInput.trim()) {
      // Kullanıcı mesajını ekle
      setChatMessages((prev) => [
        ...prev,
        { sender: "user", type: "text", content: chatInput.trim() },
      ]);

      // Kullanıcı girişini temizle
      setChatInput("");

      // Botun yazıyor göstergesini ekle
      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", type: "typing", content: "..." },
      ]);

      try {
        // API'ye istek at
        const response = await fetch("https://localhost/llm/process", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            text: chatInput.trim(),
          }).toString(),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Botun yanıtını gecikmeli olarak ekle
        setTimeout(() => {
          setChatMessages((prev) => {
            // "typing" mesajını kaldır ve gerçek yanıtı ekle
            const filteredMessages = prev.filter((msg) => msg.type !== "typing");
            return [
              ...filteredMessages,
              { sender: "bot", type: "text", content: data.response || "No response from server." },
            ];
          });
        }, 2000); // 2 saniye gecikme
      } catch (error) {
        console.error("Error while sending request to LLM:", error);

        // Hata mesajını gecikmeli olarak ekle
        setTimeout(() => {
          setChatMessages((prev) => {
            // "typing" mesajını kaldır ve hata mesajını ekle
            const filteredMessages = prev.filter((msg) => msg.type !== "typing");
            return [
              ...filteredMessages,
              { sender: "bot", type: "text", content: "An error occurred while communicating with the server." },
            ];
          });
        }, 2000);
      }
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-800 " : "bg-gray-100"}text-gray-900`}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header title="Home" />
        {/* Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calendar */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Calendar</CardTitle>
                  <Button onClick={handleNewAppointment} variant="primary" size="sm" >
                    <div className="flex items-center">
                      <Plus className="w-4 h-4 mr-2" />
                      <span>New Appointment</span>
                    </div>
                  </Button>
                  {/* <Button onClick={handleLlm} variant="primary" size="sm" >
                    <div className="flex items-center">
                      <Plus className="w-4 h-4 mr-2" />
                      <span>Ask LLM</span>
                    </div>
                  </Button> */}
                </CardHeader>
                <CardContent>
                  <CardContent>
                    <div className={`${darkMode ? 'dark' : ''}`}>
                      <Calendars
                        selected={date}
                        onSelect={handleDateSelect}
                        appointmentDates={appointmentDates}
                        className={`${darkMode ? "bg-gray-900" : "text-black"}`}
                      />
                    </div>
                  </CardContent>
                </CardContent>

              </Card>

              {isModalOpen && (
                <div
                  className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${darkMode ? "bg-black bg-opacity-70" : "bg-black bg-opacity-50"
                    }`}
                >
                  <div
                    className={`p-6 rounded-lg shadow-lg w-1/3 transition-all duration-300 ${darkMode ? "bg-gray-800 text-white border border-gray-700" : "bg-white"
                      }`}
                  >
                    <h2
                      className="text-lg font-bold mb-4 flex justify-between items-center"
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                      <span>Appointments</span>
                      <span>{date ? formatDate(date) : ""}</span>
                    </h2>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((appointment) => (
                          <div key={appointment.id} className="flex items-center space-x-4 mb-4">
                            <div>
                              <p className="text-sm font-medium">
                                {appointment?.doctor?.name} {appointment?.doctor?.surname}
                              </p>
                              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {appointment.polyclinic?.name}
                              </p>
                              <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                                {appointment.date.split("T")[0]}
                              </p>
                              <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                                {appointment.time}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          No appointments on this date.
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className={`px-4 py-2 rounded-md transition-all duration-300 ${darkMode
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                          }`}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    {upcomingAppointments.length > 0 ? (
                      upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center space-x-4 mb-4">
                          {/* <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${appointment.doctor}`} />
                            <AvatarFallback>{appointment.doctor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar> */}
                          <div>
                            <p className="text-sm font-medium">
                              {appointment.doctor.name} {appointment.doctor.surname}
                            </p>
                            <p className="text-sm text-gray-500">{appointment.polyclinic?.name}</p>
                            <p className="text-xs text-gray-400">{appointment.date}</p>
                            <p className="text-xs text-gray-400">{appointment.time}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No upcoming appointments.</p>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Recent Appointments */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      {recentAppointments && recentAppointments.length > 0 ? (
                        recentAppointments.map((appointment) => {
                          // Sadece tarih kısmını al
                          const formattedDate = appointment.date.split("T")[0];
                          return (
                            <div key={appointment.id} className="p-2 border rounded-md shadow-sm">
                              {/* <Avatar>
                              <AvatarImage
                                src={`https://api.dicebear.com/6.x/initials/svg?seed=${appointment.doctor}`}
                              />
                              <AvatarFallback>{appointment.doctor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar> */}
                              <div>
                                <p className="text-sm font-medium">
                                  {appointment.doctor?.name} {appointment.doctor?.surname}
                                </p>
                                <p className="text-sm text-gray-500">{appointment.polyclinic?.name}</p>
                                <p className="text-xs text-gray-400">{formattedDate}</p> {/* Formatlanmış tarih */}
                                <p className="text-xs text-gray-400">{appointment.time}</p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-gray-500">No upcoming appointments.</p>
                      )}

                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
                {/* Sabit Konumlu Chat Butonu */}
                <DialogTrigger asChild>
                  <div
                    className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-transform transform hover:scale-110 flex items-center justify-center cursor-pointer"
                    onClick={() => setIsChatOpen(true)}
                    aria-label="Open Chat"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </div>
                </DialogTrigger>

                {/* Chat Dialog İçeriği */}
                <DialogContent className="fixed bottom-20 right-4 max-w-sm w-full rounded-lg shadow-lg bg-white p-4">
                  <DialogHeader>
                    <DialogTitle>Ask to GOFY 🔍💡</DialogTitle>
                  </DialogHeader>

                  {/* Chat Mesajları */}
                  <div className="h-[300px] overflow-y-auto border rounded p-4 mb-4">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`mb-2 p-2 rounded max-w-[75%] ${msg.sender === "user"
                          ? "bg-blue-100 text-blue-800 self-end ml-auto"
                          : "bg-gray-100 text-gray-800 self-start mr-auto"
                          }`}
                      >
                        {msg.type === "text" ? (
                          <p className="text-sm">{msg.content}</p>
                        ) : msg.type === "typing" ? (
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                          </div>
                        ) : (
                          <a
                            href={msg.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline text-sm"
                          >
                            {msg.fileName}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Input ve Send Butonu */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // Yeni satır eklenmesini engelle
                          handleSendMessage(); // Mesaj gönder
                        }
                      }}
                      className="flex-1 px-3 py-2 border rounded"
                    />

                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Send
                    </button>
                  </div>
                </DialogContent>
              </Dialog>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
