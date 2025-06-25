import apiClient from "../config/apiClient";

// Lấy danh sách nhân viên
export const getEmployees = async () => {
  try {
    const res = await apiClient.get("/api/nhanvien/users/nhanvien");
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Lỗi khi lấy danh sách nhân viên",
    };
  }
};

// Lấy danh sách nhà đầu tư
export const getInvestors = async () => {
  try {
    const res = await apiClient.get("/api/nhanvien/users/nhadautu");
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Lỗi khi lấy danh sách nhà đầu tư",
    };
  }
};

// Thêm nhân viên mới
export const addEmployee = async (employeeData) => {
  try {
    const res = await apiClient.post(
      "/api/nhanvien/users/nhanvien",
      employeeData
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi thêm nhân viên",
    };
  }
};

// Thêm nhà đầu tư mới
export const addInvestor = async (investorData) => {
  try {
    const res = await apiClient.post(
      "/api/nhanvien/users/nhadautu",
      investorData
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi thêm nhà đầu tư",
    };
  }
};

// Cập nhật thông tin nhân viên
export const updateEmployee = async (maNV, employeeData) => {
  try {
    const res = await apiClient.put(
      `/api/nhanvien/users/nhanvien/${maNV}`,
      employeeData
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Lỗi khi cập nhật thông tin nhân viên",
    };
  }
};

// Cập nhật thông tin nhà đầu tư
export const updateInvestor = async (maNDT, investorData) => {
  try {
    const res = await apiClient.put(
      `/api/nhanvien/users/nhadautu/${maNDT}`,
      investorData
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi khi cập nhật thông tin nhà đầu tư",
    };
  }
};

// Xóa nhân viên
export const deleteEmployee = async (maNV) => {
  try {
    const res = await apiClient.delete(`/api/nhanvien/users/nhanvien/${maNV}`);
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi xóa nhân viên",
    };
  }
};

// Xóa nhà đầu tư
export const deleteInvestor = async (maNDT) => {
  try {
    const res = await apiClient.delete(`/api/nhanvien/users/nhadautu/${maNDT}`);
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi xóa nhà đầu tư",
    };
  }
};
