import { Navigate, Outlet, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, role, userId } = useSelector((state) => state.auth);
  const params = useParams();
  const { patientId, doctorId, labTechnicianId, adminId } = params;
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Role göre ID doğrulaması
  if (role === "patient" && patientId && userId !== patientId) {
    return <Navigate to="/" replace />;
  }

  if (role === "doctor" && doctorId && userId !== doctorId) {
    return <Navigate to="/" replace />;
  }

  if (role === "labtechnician" && labTechnicianId && userId !== labTechnicianId) {
    return <Navigate to="/" replace />;
  }

  if (role === "admin" && adminId && userId !== adminId) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
