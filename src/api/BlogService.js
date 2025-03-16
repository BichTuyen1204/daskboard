import axios from "axios";
const API_BASE_URL = "https://culcon-ad-be-30883260979.asia-east1.run.app/api/staff/blog";
class BlogService {
  async addBlog(formData) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(`${API_BASE_URL}/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("add successfull:", response);
      return response.data;
    } catch (error) {
      console.error(
        "Error during API calls:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  async getAllBlog(jwtToken) {
    try {
      const response = await axios.get(`${API_BASE_URL}/fetch/all`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error when API calls:", error.message);
      throw error;
    }
  }

  async getBlogDetail(id) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(`${API_BASE_URL}/fetch/${id}`, {
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

  async updateBlog(id, data) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(
        `https://culcon-ad-be-30883260979.asia-east1.run.app/api/staff/blog/edit?id=${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error when API calls:", error.message);
      throw error;
    }
  }
}

export default new BlogService();
