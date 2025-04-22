import axios from "axios";

const REACT_APP_BACKEND_API_ENDPOINT = process.env.REACT_APP_BACKEND_API_ENDPOINT;

const API_BASE_URL = `${REACT_APP_BACKEND_API_ENDPOINT}/api/staff/blog`;

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
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async reportComment(id) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.patch(
        `${REACT_APP_BACKEND_API_ENDPOINT}/api/staff/comment/report/unflag?id=${id}`,
        null,
        {
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

  async getAllBlog(page, size, searchQuery = null) {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      return;
    } else {
      try {
        let url = `${API_BASE_URL}/fetch/all?index=${page - 1}&size=${size}`;
        if (searchQuery) {
          url += `&title=${encodeURIComponent(searchQuery)}`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  }

  async getAllComment(id, index, size) {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      return;
    } else {
      try {
        const response = await axios.get(
          `${REACT_APP_BACKEND_API_ENDPOINT}/api/staff/comment/fetch/all?id=${id}&index=${
            index - 1
          }&size=${size}`,
          {
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
      throw error;
    }
  }

  async deleteComment(id) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.delete(
        `${REACT_APP_BACKEND_API_ENDPOINT}/api/staff/comment/delete?id=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Delete ok", response);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateBlog(id, data) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(
        `${REACT_APP_BACKEND_API_ENDPOINT}/api/staff/blog/edit?id=${id}`,
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
      throw error;
    }
  }
}

export default new BlogService();
