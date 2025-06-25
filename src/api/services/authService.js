// src/services/userService.js
import apiClient from "../config/apiClient";

// Hàm đăng nhập
export const loginUser = async ({ tenDangNhap, matKhau }) => {
  try {
    const response = await apiClient.post("/api/auth/login", {
      username: tenDangNhap,
      password: matKhau,
    });

    const data = response.data;

    if (data.success) {
      // Lưu token
      localStorage.setItem("access_token", data.token);

      // Lưu thông tin người dùng (username là MANDT và role)
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: data.info?.MANDT,
          role: data.role,
        })
      );

      return {
        success: true,
        user: { username: data.info?.MANDT, role: data.role },
      };
    } else {
      return { success: false, message: "Sai tài khoản hoặc mật khẩu." };
    }
  } catch (error) {
    const message =
      error.response?.data?.message || "Đã xảy ra lỗi không xác định.";
    return { success: false, message };
  }
};

// Hàm logout
export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
};
