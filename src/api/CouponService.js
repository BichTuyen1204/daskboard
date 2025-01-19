import axios from "axios";
const API_BASE_URL = "http://localhost:8000/api/manager/coupon";

class CouponService {
  async addCoupon(coupon) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(`${API_BASE_URL}/create`, coupon, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
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
      throw error;
    }
  }
}

export default new CouponService();
