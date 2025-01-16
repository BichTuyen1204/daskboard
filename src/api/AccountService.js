import axios from "axios";
const API_BASE_URL = "http://localhost:8000";

class AccountService {
  async register(account) {
    try {
      const response = await axios.post(`${API_BASE_URL}/dev/create`, account);
      return response.data;
    } catch (error) {
      console.error("Registration failed: ", error.response ? error.response.data : error.message);
      throw error;
    }
  }

  async signin(account) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, account);
      const jwtToken = response.data.accessToken;
      sessionStorage.setItem("jwtToken", jwtToken);
      console.log("Info account: ", response);
    } catch (error) {
      console.error("Login failed: ", error.response ? error.response.data : error.message);
      throw error;
    }
  }
}
export default new AccountService();
