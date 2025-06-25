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

// Tạo tài khoản đăng nhập (unified endpoint)
export const createUserLogin = async (loginData) => {
  try {
    const res = await apiClient.post("/api/nhanvien/users/create", loginData);
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Lỗi khi tạo tài khoản đăng nhập",
    };
  }
};

// Xóa tài khoản đăng nhập (unified endpoint)
export const deleteUserLogin = async (deleteData) => {
  try {
    const res = await apiClient.post("/api/nhanvien/users/delete", deleteData);
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Lỗi khi xóa tài khoản đăng nhập",
    };
  }
};

// Đổi mật khẩu tài khoản đăng nhập
export const changeUserPassword = async ({ username, newPassword }) => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.post(
      "/api/nhanvien/users/change-password",
      { username, newPassword },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi khi đổi mật khẩu tài khoản đăng nhập",
    };
  }
};

// Legacy functions for backward compatibility
export const createEmployeeLogin = async (loginData) => {
  return createUserLogin(loginData);
};

export const createInvestorLogin = async (loginData) => {
  return createUserLogin(loginData);
};

export const deleteEmployeeLogin = async (loginId) => {
  return deleteUserLogin({ login: loginId });
};

export const deleteInvestorLogin = async (loginId) => {
  return deleteUserLogin({ login: loginId });
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

// ====== STOCK MANAGEMENT ======
export const getStocks = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.get("/api/nhanvien/stocks/stocks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Lỗi khi lấy danh sách cổ phiếu",
    };
  }
};

export const addStock = async (stock) => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.post("/api/nhanvien/stocks/stocks", stock, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi thêm cổ phiếu",
    };
  }
};

export const updateStock = async (maCP, stock) => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.put(
      `/api/nhanvien/stocks/stocks/${maCP}`,
      stock,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi sửa cổ phiếu",
    };
  }
};

export const deleteStock = async (maCP) => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.delete(`/api/nhanvien/stocks/stocks/${maCP}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi xóa cổ phiếu",
    };
  }
};

export const undoStockAction = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.post(
      "/api/nhanvien/stocks/stocks/undo",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi undo thao tác",
    };
  }
};

export const redoStockAction = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.post(
      "/api/nhanvien/stocks/stocks/redo",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi redo thao tác",
    };
  }
};
// nhanvienService.js

export const getDatabases = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.get("/api/nhanvien/backup/databases", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: true,
      data: res.data.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Lỗi khi lấy danh sách databases",
    };
  }
};

export const getBackupHistory = async (databaseName) => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.get(
      `/api/nhanvien/backup/backups/${databaseName}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return {
      success: true,
      data: res.data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi lấy lịch sử backup",
    };
  }
};

export const getLogFiles = async (databaseName, fromTime, toTime) => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.get(
      `/api/nhanvien/backup/log-files/${databaseName}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { fromTime, toTime },
      }
    );
    return {
      success: true,
      data: res.data.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Lỗi khi lấy danh sách log files",
    };
  }
};

export const createBackupDevice = async (dbName) => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.post(
      "/api/nhanvien/backup/device",
      { dbName },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return {
      success: res.data.success,
      message: res.data.message || "Tạo device thành công",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi tạo device backup",
    };
  }
};

export const backupDatabase = async (
  dbName,
  overwrite = false,
  note = "",
  deleteOld = false
) => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.post(
      "/api/nhanvien/backup/backup",
      {
        dbName,
        overwrite,
        note,
        deleteOld,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return {
      success: res.data.success,
      message: res.data.message || "Backup database thành công",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi backup database",
    };
  }
};

export const backupLog = async (dbName) => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.post(
      "/api/nhanvien/backup/backup-log",
      { dbName },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return {
      success: res.data.success,
      message: res.data.message || "Backup log thành công",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi backup log",
    };
  }
};

export const restoreDatabase = async (dbName, fileIndex) => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.post(
      "/api/nhanvien/backup/restore",
      {
        dbName,
        fileIndex,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return {
      success: res.data.success,
      message: res.data.message || "Restore database thành công",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi restore database",
    };
  }
};

export const restoreDatabaseByTime = async (
  dbName,
  fileIndex,
  stopAt,
  logFiles
) => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.post(
      "/api/nhanvien/backup/restore-time",
      {
        dbName,
        fileIndex,
        stopAt,
        logFiles,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return {
      success: res.data.success,
      message: res.data.message || "Restore database theo thời gian thành công",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi khi restore database theo thời gian",
    };
  }
};

// Lấy danh sách lệnh đặt
export const getOrderList = async (params = {}) => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.get("/api/nhanvien/orders/lenhdat", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Lỗi khi lấy danh sách lệnh đặt",
    };
  }
};

// Lấy danh sách lệnh khớp
export const getMatchedOrderList = async (params = {}) => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.get("/api/nhanvien/orders/lenhkhop", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Lỗi khi lấy danh sách lệnh khớp",
    };
  }
};

// Lấy lịch sử tiền
export const getMoneyHistoryList = async (params = {}) => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.get("/api/nhanvien/orders/lichsutien", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi lấy lịch sử tiền",
    };
  }
};

// Lấy danh sách nhà đầu tư đã đăng ký tài khoản
export const getRegisteredInvestors = async () => {
  try {
    const res = await apiClient.get("/api/nhanvien/users/registered-nhadautu");
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi khi lấy danh sách nhà đầu tư đã đăng ký",
    };
  }
};

// Lấy danh sách nhân viên đã đăng ký tài khoản
export const getRegisteredEmployees = async () => {
  try {
    const res = await apiClient.get("/api/nhanvien/users/registered-nhanvien");
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi khi lấy danh sách nhân viên đã đăng ký",
    };
  }
};

// ====== ATO/ATC MANAGEMENT ======
// Thực hiện khớp lệnh ATO cho tất cả mã CP
export const executeATO = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.post(
      "/api/nhanvien/orders/ato",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Lỗi khi thực hiện khớp lệnh ATO",
    };
  }
};

// Thực hiện khớp lệnh ATC cho tất cả mã CP
export const executeATC = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.post(
      "/api/nhanvien/orders/atc",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Lỗi khi thực hiện khớp lệnh ATC",
    };
  }
};
