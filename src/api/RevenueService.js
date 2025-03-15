import axios from "axios";
const API_BASE_URL = "https://culcon-ad-be-30883260979.asia-east1.run.app/api/manager";

class RevenueService {
  async getPredictNextMonth() {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(`${API_BASE_URL}/revenue/predict-next-month`, {
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

  async getAllDays() {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(`${API_BASE_URL}/revenue`, {
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
export default new RevenueService();
