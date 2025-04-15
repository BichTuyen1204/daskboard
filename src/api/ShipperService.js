import axios from "axios";
const API_BASE_URL = "https://culcon-ad-be-30883260979.asia-southeast1.run.app";

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

  async shippingOrder(id) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) throw new Error("No JWT Token found!");
      const response = await axios.put(
        `${API_BASE_URL}/api/shipper/order/ship/${id}`,
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

  async getSumOrderShipper(status, index, size) {
    const jwtToken = sessionStorage.getItem("jwtToken");

    console.log("🔒 JWT Token:", jwtToken);
    console.log("📦 Params:", { status, index, size });

    try {
      const response = await axios.get(
        `https://culcon-ad-be-30883260979.asia-southeast1.run.app/api/shipper/order/fetch/summary?status=${status}&index=${index}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("🚨 API ERROR:", error.response?.status, error.response?.data);
      throw error;
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

  async rejectOrder(id) {
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

  async getShipmentFetchShipper(selectedType, page, size) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) throw new Error("No JWT Token found!");

      const response = await axios.get(
        `${API_BASE_URL}/api/staff/shipment/fetch?delivery_status=${selectedType}&index=${
          page - 1
        }&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return { content: [], total_page: 0 };
    }
  }

  async cancelOrder(id) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) throw new Error("No JWT Token found!");
      const response = await axios.delete(`${API_BASE_URL}/api/shipper/order/cancel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async getOrderDetailShipper(id) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/api/shipper/order/fetch/detail/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getOrderItemsShipper(id, index, size) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        return;
      }
      const response = await axios.get(
        `${API_BASE_URL}/api/shipper/order/fetch/items/${id}?index=${index - 1}&size=${size}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ShipperService();
