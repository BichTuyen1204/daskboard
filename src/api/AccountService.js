import axios from "axios";

const REACT_APP_BACKEND_API_ENDPOINT = process.env.REACT_APP_BACKEND_API_ENDPOINT;

const API_BASE_URL = `${REACT_APP_BACKEND_API_ENDPOINT}/api/auth`;
const API_BASE_URL_2 = `${REACT_APP_BACKEND_API_ENDPOINT}/api/manager/create`;
const API_BASE_URL_3 = `${REACT_APP_BACKEND_API_ENDPOINT}/api/manager/staff/fetch`;
const API_BASE_URL_4 = `${REACT_APP_BACKEND_API_ENDPOINT}/api/staff/customer/fetch`;
const API_BASE_URL_5 = `${REACT_APP_BACKEND_API_ENDPOINT}/api/staff/customer/edit`;

class AccountService {
  async signin(account) {
    try {
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
      };
      const response = await axios.post(`${API_BASE_URL}/login`, account, { headers });
      const jwtToken = response.data.access_token;
      sessionStorage.setItem("jwtToken", jwtToken);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async addStaff(staff) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(`${API_BASE_URL_2}/account`, staff, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllStaff(page, size, searchId) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      let url = `${API_BASE_URL_3}/all`;

      // Add query parameters if they exist
      const params = new URLSearchParams();
      if (page !== undefined && size !== undefined) {
        params.append("index", page - 1);
        params.append("size", size);
      }
      if (searchId) {
        params.append("id", searchId);
      }

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return { content: [], total_page: 0 }; // Return empty results on error
    }
  }

  async getAllCustomer(page, size, searchQuery = null) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      let url = `${API_BASE_URL_4}/all?index=${page - 1}&size=${size}`;

      // Add search parameter if provided
      if (searchQuery) {
        url += `&id=${encodeURIComponent(searchQuery)}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return { content: [], total_page: 0 };
    }
  }

  async getCustomerDetail(id) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(`${API_BASE_URL_4}/id/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {}
  }

  async getStaffDetail(id) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(`${API_BASE_URL_3}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {}
  }

  async updateAccountCustomer(id, data) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.patch(`${API_BASE_URL_5}/account?id=${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {}
  }

  async updateAccountStaff(id, data) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(
        `${REACT_APP_BACKEND_API_ENDPOINT}/api/manager/staff/edit/account?id=${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {}
  }

  async updateInforCustomer(id, data) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.patch(
        `${REACT_APP_BACKEND_API_ENDPOINT}/api/staff/customer/edit/info?id=${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {}
  }

  async updateInforStaff(id, data) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(
        `${REACT_APP_BACKEND_API_ENDPOINT}/api/manager/staff/edit/info?id=${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {}
  }

  async updateStatusCustomer(id, status) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.patch(
        `${API_BASE_URL_5}/status?id=${id}&status=${status}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {}
  }

  async updateStatusStaff(id, status) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(
        `${REACT_APP_BACKEND_API_ENDPOINT}/api/manager/staff/edit/status?id=${id}&status=${status}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {}
  }

  async getProfile() {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {}
  }
}
export default new AccountService();
