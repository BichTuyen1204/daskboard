import axios from "axios";

const REACT_APP_BACKEND_API_ENDPOINT = process.env.REACT_APP_BACKEND_API_ENDPOINT;

const API_BASE_URL = `${REACT_APP_BACKEND_API_ENDPOINT}/ws/chat`;

class ChatBoxService {
  async getAllUser(page, size) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(`${API_BASE_URL}/list?index=${page - 1}&size=${size}`, {
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
export default new ChatBoxService();
