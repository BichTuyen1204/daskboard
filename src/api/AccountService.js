import axios from "axios";
const API_BASE_URL = "http://localhost:8000/api/auth";
const API_BASE_URL_2 = "http://localhost:8000/api/manager/create";
const API_BASE_URL_3 = "http://localhost:8000/api/manager/staff/fetch";

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
      console.error("Error when API calls:", error.message);
    }
  }

  async getAllStaff() {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(`${API_BASE_URL_3}/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error when API calls:", error.message);
    }
  }

  async getStaffDetail(id) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(`${API_BASE_URL_3}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error when API calls:", error.message);
    }
  }
}

export default new AccountService();
