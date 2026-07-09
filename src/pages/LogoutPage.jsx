import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LogoutPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function doLogout() {
      await logout();
      navigate("/login", { replace: true });
    }
    doLogout();
  }, [logout, navigate]);

  return null;
}
