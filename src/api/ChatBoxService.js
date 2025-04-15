import axios from "axios";

const REACT_APP_BACKEND_API_ENDPOINT = process.env.REACT_APP_BACKEND_API_ENDPOINT;

const API_BASE_URL = `${REACT_APP_BACKEND_API_ENDPOINT}/ws/chat`;

class ChatBoxService {
  async getAllUser(page, size, username = "") {
    try {
      const token = sessionStorage.getItem("jwtToken");
      let url = `${API_BASE_URL}/list?index=${page - 1}&size=${size}`;

      // Add username parameter to the URL if it's provided
      if (username && username.trim() !== "") {
        url += `&username=${encodeURIComponent(username.trim())}`;
      }

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
}

export default new ChatBoxService();
