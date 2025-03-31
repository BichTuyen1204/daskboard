import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem("jwtToken");
    console.log("Token removed");
    navigate("/sign-in");
  }, []);

  return null;
};

export default Logout;
