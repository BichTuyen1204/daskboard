import axios from "axios";

const REACT_APP_BACKEND_API_ENDPOINT = process.env.REACT_APP_BACKEND_API_ENDPOINT;

const API_BASE_URL = `${REACT_APP_BACKEND_API_ENDPOINT}/api/staff`;
const API_BASE_URL_2 = `${REACT_APP_BACKEND_API_ENDPOINT}/api/general/product`;

class ProductService {
  async createProduct(formData) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(`${API_BASE_URL}/product/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error during API calls:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  async createMealkit(formData) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("No JWT token found. Please login.");
      }

      const response = await axios.post(`${API_BASE_URL}/mealkit/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Data mealkit", response.data);
      return response.data;
    } catch (error) {
      console.error("Error during API call:", error.response ? error.response.data : error.message);
      throw error;
    }
  }

  async allProduct(page, size) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(
        `${API_BASE_URL_2}/fetch_all?index=${page - 1}&size=${size}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return { content: [], total_page: 1 };
    }
  }

  async allMealkit(page, size) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(
        `${REACT_APP_BACKEND_API_ENDPOINT}/api/general/mealkit/fetch_all?index=${
          page - 1
        }&size=${size}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error during API calls:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  async getProductDetail(prod_id) {
    try {
      const response = await axios.get(`${API_BASE_URL_2}/fetch`, {
        params: {
          prod_id: prod_id,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error during API calls:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  async updateProductInfo(prod_id, data) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(
        `${API_BASE_URL}/product/update/info/prod?prod_id=${prod_id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error during API calls:", error.response?.data || error.message);
      throw error;
    }
  }

  async updateMealkitInfo(prod_id, data) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(
        `${REACT_APP_BACKEND_API_ENDPOINT}/api/staff/product/update/info/mealkit?prod_id=${prod_id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error during API calls:", error.response?.data || error.message);
      throw error;
    }
  }

  async updateProductStatus(prod_id, status) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.patch(`${API_BASE_URL}/product/update/status`, null, {
        params: {
          prod_id: prod_id,
          status: status,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error during API calls:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  async updateProductQuantity(prod_id, quantity, in_price) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.patch(`${API_BASE_URL}/product/update/quantity`, null, {
        params: {
          prod_id: prod_id,
          quantity: quantity,
          in_price: in_price,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error during API calls:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  async updateProductPrice(product_id, price, sale_percent) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.put(
        `${API_BASE_URL}/product/update/price`,
        null, // Không gửi body
        {
          params: {
            product_id: product_id,
            price: price,
            sale_percent: sale_percent,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error during API calls:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  async getHistoryProduct(prod_id) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(
        `${REACT_APP_BACKEND_API_ENDPOINT}/api/staff/product/history/stock?prod_id=${prod_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error during API calls:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }
}

export default new ProductService();
