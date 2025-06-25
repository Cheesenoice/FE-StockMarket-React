import apiClient from "../config/apiClient";

// Lấy danh sách nhân viên chưa đăng ký tài khoản
export const getUnregisteredEmployees = async () => {
  try {
    const res = await apiClient.get(
      "/api/nhanvien/users/unregistered-nhanvien"
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi khi lấy danh sách nhân viên chưa đăng ký",
    };
  }
};

// Lấy danh sách nhà đầu tư chưa đăng ký tài khoản
export const getUnregisteredInvestors = async () => {
  try {
    const res = await apiClient.get(
      "/api/nhanvien/users/unregistered-nhadautu"
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi khi lấy danh sách nhà đầu tư chưa đăng ký",
    };
  }
};

// Tạo tài khoản đăng nhập cho nhân viên
export const createEmployeeLogin = async (loginData) => {
  try {
    const res = await apiClient.post(
      "/api/nhanvien/users/login-nhanvien",
      loginData
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi khi tạo tài khoản đăng nhập cho nhân viên",
    };
  }
};

// Tạo tài khoản đăng nhập cho nhà đầu tư
export const createInvestorLogin = async (loginData) => {
  try {
    const res = await apiClient.post(
      "/api/nhanvien/users/login-nhadautu",
      loginData
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi khi tạo tài khoản đăng nhập cho nhà đầu tư",
    };
  }
};

// Lấy danh sách tài khoản đăng nhập nhân viên
export const getEmployeeLogins = async () => {
  try {
    const res = await apiClient.get("/api/nhanvien/users/login-nhanvien");
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi khi lấy danh sách tài khoản đăng nhập nhân viên",
    };
  }
};

// Lấy danh sách tài khoản đăng nhập nhà đầu tư
export const getInvestorLogins = async () => {
  try {
    const res = await apiClient.get("/api/nhanvien/users/login-nhadautu");
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi khi lấy danh sách tài khoản đăng nhập nhà đầu tư",
    };
  }
};

// Xóa tài khoản đăng nhập nhân viên
export const deleteEmployeeLogin = async (loginId) => {
  try {
    const res = await apiClient.delete(
      `/api/nhanvien/users/login-nhanvien/${loginId}`
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi khi xóa tài khoản đăng nhập nhân viên",
    };
  }
};

// Xóa tài khoản đăng nhập nhà đầu tư
export const deleteInvestorLogin = async (loginId) => {
  try {
    const res = await apiClient.delete(
      `/api/nhanvien/users/login-nhadautu/${loginId}`
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi khi xóa tài khoản đăng nhập nhà đầu tư",
    };
  }
};
