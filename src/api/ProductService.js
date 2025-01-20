import axios from "axios";
const API_BASE_URL = "http://localhost:8000/api/staff/product";

class ProductService {
  async createProduct(formData) {
    try {
      console.log(formData);
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(`${API_BASE_URL}/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Quan trọng: Sử dụng multipart/form-data
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      // Xử lý lỗi
      if (error.response) {
        console.error("Error when adding product:", error.response.data);
        if (error.response.data.message) {
          console.log("API Error Message:", error.response.data.message);
        }
      } else if (error.request) {
        console.error("No response from server:", error.request);
      } else {
        console.error("Unexpected error:", error.message);
      }
      throw error;
    }
  }
}

export default new ProductService();
