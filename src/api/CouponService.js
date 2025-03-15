import axios from "axios";
const API_BASE_URL =
  "https://culcon-ad-be-30883260979.asia-east1.run.app//api/manager/coupon";
const API_BASE_URL_2 =
  "https://culcon-ad-be-30883260979.asia-east1.run.app//api/general/coupon";
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

  async getAllCoupon() {
    try {
      const response = await axios.get(`${API_BASE_URL_2}/fetch/all`);
      return response.data;
    } catch (error) {
      console.error("Error when API calls:", error.message);
      throw error;
    }
  }

  async getCouponDetail(id) {
    try {
      const response = await axios.get(`${API_BASE_URL_2}/fetch`, {
        params: {
          id: id,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error when API calls:", error.message);
      throw error;
    }
  }

  async deleteCoupon(coupon_id) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.delete(`${API_BASE_URL}/disable`, {
        params: {
          coupon_id: coupon_id,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error when API calls:", error.message);
      throw error;
    }
  }
}

export default new CouponService();
