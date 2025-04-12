import axios from "axios";
const API_BASE_URL = "https://culcon-ad-be-30883260979.asia-southeast1.run.app/";

class ShipperService {
  async getOrderAwait() {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) throw new Error("No JWT Token found!");
      const response = await axios.get(`${API_BASE_URL}/api/shipper/order/fetch/await`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async getFetchCurrent() {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) throw new Error("No JWT Token found!");
      const response = await axios.get(`${API_BASE_URL}/api/shipper/order/fetch/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async acceptOrder(id) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) throw new Error("No JWT Token found!");
      const response = await axios.put(
        `${API_BASE_URL}/api/shipper/order/accept/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async orderShipped(id) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) throw new Error("No JWT Token found!");
      const response = await axios.post(
        `${API_BASE_URL}/api/shipper/order/shipped/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async cancelOrder(id) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) throw new Error("No JWT Token found!");
      const response = await axios.delete(`${API_BASE_URL}/api/shipper/order/reject/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return null;
    }
  }
}

export default new ShipperService();
