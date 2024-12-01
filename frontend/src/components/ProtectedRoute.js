import { Navigate, Outlet, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, role, userId } = useSelector((state) => state.auth);
  const params = useParams();
  const patientId = params.patientId;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  if (role === "patient" && patientId && userId !== patientId) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
