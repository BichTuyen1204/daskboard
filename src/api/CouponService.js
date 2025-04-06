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

  async getAllCoupon(page, size, searchQuery = null) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      let url = `${API_BASE_URL_2}/fetch/all`;

      // Build query params
      const params = new URLSearchParams();
      if (page !== undefined && size !== undefined) {
        params.append("index", page - 1);
        params.append("size", size);
      }
      if (searchQuery) {
        params.append("id", searchQuery);
      }

      // Append params to URL if they exist
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return { content: [], total_page: 1 };
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
