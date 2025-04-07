import axios from "axios";
const API_BASE_URL = "https://culcon-ad-be-30883260979.asia-east1.run.app/api/staff/order";

class OrderService {
  async getAllOrder(page, size) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) throw new Error("No JWT Token found!");

      const response = await axios.get(`${API_BASE_URL}/fetch/all?index=${page - 1}&size=${size}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return { orders: [], totalPages: 1 };
    }
  }

  async getAllOrderOnConfirm(status, page, size) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        return;
      }
      const response = await axios.get(
        `${API_BASE_URL}/fetch/status?status=${status}&index=${page - 1}&size=${size}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      return { content: [], total_page: 1 };
    }
  }

  async getOrderDetail(id) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/fetch/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getOrderItem(id, index, size) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        return;
      }
      const response = await axios.get(
        `${API_BASE_URL}/fetch/${id}/items?index=${index - 1}&size=${size}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async cancelOrder(id) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("No JWT token found");
      }
      const response = await axios.post(
        `${API_BASE_URL}/cancel/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async processingOrder(id) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("No JWT token found");
      }
      const response = await axios.post(
        `${API_BASE_URL}/accept/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async shippingOrder(id) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("No JWT token found");
      }
      const response = await axios.post(
        `${API_BASE_URL}/ship/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async shippedOrder(id) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("No JWT token found");
      }
      const response = await axios.post(
        `${API_BASE_URL}/shipped/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new OrderService();
