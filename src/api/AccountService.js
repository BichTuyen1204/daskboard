import axios from "axios";
const API_BASE_URL = "https://culcon-admin-gg-87043777927.asia-northeast1.run.app/api/auth";
const API_BASE_URL_2 =
  "https://culcon-admin-gg-87043777927.asia-northeast1.run.app/api/manager/create";
const API_BASE_URL_3 =
  "https://culcon-admin-gg-87043777927.asia-northeast1.run.app/api/manager/staff/fetch";
const API_BASE_URL_4 =
  "https://culcon-admin-gg-87043777927.asia-northeast1.run.app/api/staff/customer/fetch";
const API_BASE_URL_5 =
  "https://culcon-admin-gg-87043777927.asia-northeast1.run.app/api/staff/customer/edit";

class AccountService {
  async signin(account) {
    try {
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
      };
      const response = await axios.post(`${API_BASE_URL}/login`, account, { headers });
      console.log("Response", response.data);

      const jwtToken = response.data.access_token;
      sessionStorage.setItem("jwtToken", jwtToken);
    } catch (error) {
      console.error("Login failed: ", error.response?.data || error.message);
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
      console.log("Add successful:", response.data);
    } catch (error) {
      console.error("Error when API calls:", error.message);
    }
  }

  async getAllStaff() {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(`${API_BASE_URL_3}/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error when API calls:", error.message);
    }
  }

  async getAllCustomer() {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(`${API_BASE_URL_4}/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error when API calls:", error.message);
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
    } catch (error) {
      console.error("Error when API calls:", error.message);
    }
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
    } catch (error) {
      console.error("Error when API calls:", error.message);
    }
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
    } catch (error) {
      console.error(
        "Error during API calls:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  async updateAccountStaff(id, data) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(
        `https://culcon-admin-gg-87043777927.asia-northeast1.run.app/api/manager/staff/edit/account?id=${id}`,
        data,
        {
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

  async updateInforCustomer(id, data) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.patch(
        `https://culcon-admin-gg-87043777927.asia-northeast1.run.app/api/staff/customer/edit/info?id=${id}`,
        data,
        {
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

  async updateInforStaff(id, data) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(
        `https://culcon-admin-gg-87043777927.asia-northeast1.run.app/api/manager/staff/edit/info?id=${id}`,
        data,
        {
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
    } catch (error) {
      console.error(
        "Error during API calls:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  async updateStatusStaff(id, status) {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(
        `https://culcon-admin-gg-87043777927.asia-northeast1.run.app/api/manager/staff/edit/status?id=${id}&status=${status}`,
        null,
        {
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
}
export default new AccountService();
