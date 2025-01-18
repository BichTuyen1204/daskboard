import axios from "axios";
const API_BASE_URL = "http://localhost:8000/api/auth";

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
      console.log("Đăng nhập thành công: ", response.data);
    } catch (error) {
      console.error("Login failed: ", error.response?.data || error.message);
      throw error;
    }
  }
}

export default new AccountService();
