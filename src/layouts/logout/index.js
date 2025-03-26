import { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    sessionStorage.removeItem("jwtToken");
    console.log("Token removed");
    window.location.reload();
  }, []);

  return null;
};

export default Logout;
