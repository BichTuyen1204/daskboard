import axios from "axios";
const API_BASE_URL = "https://culcon-ad-be-30883260979.asia-southeast1.run.app/api/staff/order";

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
      throw error;
      return { orders: [], totalPages: 1 };
    }
  }

  async getAllOrderOnConfirm(status, page, size) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        console.error("Error: No JWT token found in session storage.");
        return { content: [], total_page: 1 };
      }

      const response = await axios.get(
        `${API_BASE_URL}/fetch/all?status=${status}&index=${page - 1}&size=${size}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      console.error("🛑 An error occurred while fetching orders:");

      // Log the basic error message
      console.error("Message:", error.message);

      // Log Axios-specific error details
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received from the server.");
        console.error("Request details:", error.request);
      } else {
        // Something else caused the error
        console.error("Unexpected error:", error.message);
      }

      // Log the full stack trace for debugging
      console.error("Stack trace:", error.stack);

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
