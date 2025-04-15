import axios from "axios";

const REACT_APP_BACKEND_API_ENDPOINT = process.env.REACT_APP_BACKEND_API_ENDPOINT;

const API_BASE_URL = `${REACT_APP_BACKEND_API_ENDPOINT}/ws/chat`;

class ChatBoxService {
  async getAllUser(page, size, searchQuery = null) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      let url = `${API_BASE_URL}/list?index=${page - 1}&size=${size}`;
      if (searchQuery && searchQuery.trim() !== "") {
        url += `&username=${encodeURIComponent(searchQuery)}`;
      }
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return { content: [], total_page: 0 };
    }
  }
}
export default new ChatBoxService();
