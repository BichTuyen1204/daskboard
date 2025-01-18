import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  useEffect(() => {
    // Xóa token khi component được render
    sessionStorage.removeItem("jwtToken");
    console.log("Token removed");
    window.location.reload();
  }, []);

  return null; // Không cần giao diện
};

export default Logout;
