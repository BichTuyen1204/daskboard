import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  useEffect(() => {
    sessionStorage.removeItem("jwtToken");
    console.log("Token removed");
    window.location.reload();
  }, []);

  return null;
};

export default Logout;
