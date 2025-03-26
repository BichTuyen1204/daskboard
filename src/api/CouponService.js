import axios from "axios";

const REACT_APP_BACKEND_API_ENDPOINT = process.env.REACT_APP_BACKEND_API_ENDPOINT;

const API_BASE_URL = `${REACT_APP_BACKEND_API_ENDPOINT}/api/manager/coupon`;
const API_BASE_URL_2 = `${REACT_APP_BACKEND_API_ENDPOINT}/api/general/coupon`;
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
      throw error;
    }
  }

  async getAllCoupon() {
    try {
      const response = await axios.get(`${API_BASE_URL_2}/fetch/all`);
      return response.data;
    } catch (error) {
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
      throw error;
    }
  }
}

export default new CouponService();
