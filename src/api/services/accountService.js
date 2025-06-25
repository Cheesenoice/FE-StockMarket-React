import apiClient from "../config/apiClient";

export const getAccounts = async () => {
  try {
    const res = await apiClient.get("/api/nhadautu/accounts");
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Lỗi khi lấy danh sách tài khoản",
    };
  }
};

export const getAccountDetail = async (maTK) => {
  try {
    const res = await apiClient.get(`/api/nhadautu/accounts/${maTK}`);
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Lỗi khi lấy chi tiết tài khoản",
    };
  }
};

export const getAccountStatement = async (maTK, tuNgay, denNgay) => {
  try {
    const res = await apiClient.get(
      `/api/nhadautu/accounts/${maTK}/sao-ke-lenh-khop`,
      {
        params: { tuNgay, denNgay },
      }
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi lấy sao kê lệnh khớp",
    };
  }
};

export const getAccountMoneyStatement = async (maTK, tuNgay, denNgay) => {
  try {
    const res = await apiClient.get(
      `/api/nhadautu/accounts/${maTK}/sao-ke-giao-dich-tien`,
      {
        params: { tuNgay, denNgay },
      }
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Lỗi khi lấy sao kê giao dịch tiền",
    };
  }
};

export const getAccountOrderStatement = async (maTK, maCP, tuNgay, denNgay) => {
  try {
    const res = await apiClient.get(
      `/api/nhadautu/accounts/${maTK}/sao-ke-giao-dich-lenh`,
      {
        params: { maCP, tuNgay, denNgay },
      }
    );
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Lỗi khi lấy sao kê giao dịch lệnh",
    };
  }
};

export const getBanks = async () => {
  try {
    const res = await apiClient.get("/api/nhadautu/banks");
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Lỗi khi lấy danh sách ngân hàng",
    };
  }
};

export const addAccount = async (MaTK, MaNH) => {
  try {
    const res = await apiClient.post("/api/nhadautu/accounts", { MaTK, MaNH });
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi thêm tài khoản",
    };
  }
};

export const deleteAccount = async (id) => {
  try {
    const res = await apiClient.delete(`/api/nhadautu/accounts/${id}`);
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi xóa tài khoản",
    };
  }
};

// Nạp tiền vào tài khoản
export const depositMoney = async (maTK, soTien, mkgd) => {
  try {
    const res = await apiClient.post(`/api/nhadautu/accounts/${maTK}/naptien`, {
      soTien,
      mkgd,
    });
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi nạp tiền",
    };
  }
};

// Rút tiền từ tài khoản
export const withdrawMoney = async (maTK, soTien, mkgd) => {
  try {
    const res = await apiClient.post(`/api/nhadautu/accounts/${maTK}/ruttien`, {
      soTien,
      mkgd,
    });
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi rút tiền",
    };
  }
};
