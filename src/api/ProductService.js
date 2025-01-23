import axios from "axios";
const API_BASE_URL = "http://localhost:8000/api/staff/product";
const API_BASE_URL_2 = "http://localhost:8000/api/general/product";

class ProductService {
  async createProduct(formData) {
    try {
      console.log(formData);
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(`${API_BASE_URL}/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      // Xử lý lỗi
      if (error.response) {
        console.error("Error when adding product:", error.response.data);
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

  async allProduct() {
    try {
      const response = await axios.get(`${API_BASE_URL_2}/fetch_all`);
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

  async updateProductInfo(prod_id) {
    try {
      const response = await axios.post(`${API_BASE_URL}/update/info/prod`, {
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

  async updateProductStatus(prod_id) {
    try {
      const response = await axios.post(`${API_BASE_URL}/update/status`, {
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

  async updateProductQuantity(prod_id) {
    try {
      const response = await axios.post(`${API_BASE_URL}/update/quantity`, {
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

  async updateProductPrice(prod_id) {
    try {
      const response = await axios.post(`${API_BASE_URL}/update/price`, {
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
}

export default new ProductService();
