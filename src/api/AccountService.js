import axios from "axios";
const API_BASE_URL = "http://localhost:8000/api/auth";
const API_BASE_URL_2 = "http://localhost:8000/api/manager/create";

class AccountService {
  async signin(account) {
    try {
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
      };
      const response = await axios.post(`${API_BASE_URL}/login`, account, { headers });
      console.log("Response", response.data);

      const jwtToken = response.data.access_token;
      sessionStorage.setItem("jwtToken", jwtToken);
    } catch (error) {
      console.error("Login failed: ", error.response?.data || error.message);
      throw error;
    }
  }

  async addStaff(staff) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(`${API_BASE_URL_2}/account`, staff, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Add successful:", response.data);
    } catch (error) {
      if (error.response) {
        console.error("Error when adding staff:", error.response.data);
        if (error.response.data.message) {
          console.log("API Error Message:", error.response.data.message);
        }
      } else if (error.request) {
        console.error("No response from server:", error.request);
      } else {
        console.error("Unexpected error:", error.message);
      }
    }
  }
}

export default new AccountService();
