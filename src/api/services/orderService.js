import apiClient from "../config/apiClient";

// Lấy danh sách cổ phiếu
export const getStocks = async () => {
  try {
    const res = await apiClient.get("/api/nhadautu/stocks");
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Lỗi khi lấy danh sách cổ phiếu",
    };
  }
};

// Lấy thông tin giá cổ phiếu
export const getStocksPrice = async (maCP) => {
  try {
    const res = await apiClient.get(`/api/nhadautu/stocks/${maCP}/price`);
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Lỗi khi lấy thông tin giá cổ phiếu",
    };
  }
};

// Đặt lệnh giao dịch
export const placeOrder = async (orderData) => {
  try {
    const res = await apiClient.post("/api/nhadautu/order", orderData);
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi đặt lệnh giao dịch",
    };
  }
};

// Lấy danh sách lệnh đã đặt
export const getOrders = async () => {
  try {
    const res = await apiClient.get("/api/nhadautu/orders");
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi lấy danh sách lệnh",
    };
  }
};

// Hủy lệnh
export const cancelOrder = async (orderId) => {
  try {
    const res = await apiClient.delete(`/api/nhadautu/orders/${orderId}`);
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi hủy lệnh",
    };
  }
};

// Lấy danh sách lệnh chờ khớp
export const getPendingOrders = async () => {
  try {
    const res = await apiClient.get("/api/nhadautu/order/pending");
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Lỗi khi lấy danh sách lệnh chờ khớp",
    };
  }
};

// Hủy lệnh chờ khớp
export const cancelPendingOrder = async (maGD, mkgd) => {
  try {
    const res = await apiClient.post("/api/nhadautu/order/cancel", {
      maGD,
      mkgd,
    });
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi hủy lệnh",
    };
  }
};
