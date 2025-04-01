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
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async allProduct(type, page, size) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(
        `${API_BASE_URL_2}/fetch_all?type=${type}&index=${page - 1}&size=${size}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return { content: [], total_page: 1 };
    }
  }

  async allAllProduct(page, size) {
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
        `${REACT_APP_BACKEND_API_ENDPOINT}/api/general/product/fetch_all?type=MK&index=${
          page - 1
        }&size=${size}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
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
      throw error;
    }
  }

  async getHistoryProduct(prod_id, index, size) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(
        `${API_BASE_URL}/product/history/stock?prod_id=${prod_id}&index=${index - 1}&size=${size}`,
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

  async getHistoryUpdate(prod_id, index, size) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(
        `${API_BASE_URL}/product/history/price?prod_id=${prod_id}&index=${index - 1}&size=${size}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("History update", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async searchProducts(query, page) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(`${API_BASE_URL}/mealkit/create/fetch/ingredients`, {
        params: {
          search: query, // Updated to match the API parameter name
          index: page, // Page index (0-based)
          size: 7, // Number of items per page
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Return the API response
    } catch (error) {
      console.error("Error fetching products:", error);
      return { content: [], total_page: 1 }; // Return default structure on error
    }
  }
}

export default new ProductService();
