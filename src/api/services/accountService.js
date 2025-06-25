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
