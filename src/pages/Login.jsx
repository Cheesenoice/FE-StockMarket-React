import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/services/authService";

const Login = () => {
  const [tenDangNhap, setTenDangNhap] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await loginUser({ tenDangNhap, matKhau });
    if (result.success) {
      if (result.user.role === "NhanVien") {
        navigate("/nhanvien");
      } else if (result.user.role === "NhaDauTu") {
        navigate("/nhadautu");
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Tên đăng nhập</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={tenDangNhap}
            onChange={(e) => setTenDangNhap(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Mật khẩu</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded"
            value={matKhau}
            onChange={(e) => setMatKhau(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default Login;
