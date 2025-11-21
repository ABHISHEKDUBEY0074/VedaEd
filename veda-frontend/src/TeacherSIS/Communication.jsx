import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TeacherCommunicationPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to teacher-communication logs by default
    navigate("/teacher-communication/logs", { replace: true });
  }, [navigate]);

  return null;
}
