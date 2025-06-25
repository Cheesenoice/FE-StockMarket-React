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

// Thêm nhà đầu tư
export const addNhaDauTu = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.post("/api/nhanvien/users/nhadautu/add", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi thêm nhà đầu tư",
    };
  }
};

// Sửa nhà đầu tư
export const updateNhaDauTu = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.put(
      "/api/nhanvien/users/nhadautu/update",
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi sửa nhà đầu tư",
    };
  }
};

// Xóa nhà đầu tư
export const deleteNhaDauTu = async (maNDT) => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.delete(
      `/api/nhanvien/users/nhadautu/delete/${maNDT}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi xóa nhà đầu tư",
    };
  }
};

// Thêm nhân viên
export const addNhanVien = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.post("/api/nhanvien/users/nhanvien/add", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi thêm nhân viên",
    };
  }
};

// Sửa nhân viên
export const updateNhanVien = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.put(
      "/api/nhanvien/users/nhanvien/update",
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi sửa nhân viên",
    };
  }
};

// Xóa nhân viên
export const deleteNhanVien = async (maNV) => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.delete(
      `/api/nhanvien/users/nhanvien/delete/${maNV}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi xóa nhân viên",
    };
  }
};

// Undo thao tác gần nhất với user
export const undoUserAction = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.post(
      "/api/nhanvien/users/undo-user",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Lỗi khi hoàn tác thao tác user",
    };
  }
};

// Redo thao tác vừa undo với user
export const redoUserAction = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.post(
      "/api/nhanvien/users/redo-user",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi làm lại thao tác user",
    };
  }
};
