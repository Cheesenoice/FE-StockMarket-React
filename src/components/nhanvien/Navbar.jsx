import { Home, Users, LogOut, ChartColumnStacked } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../api/services/authService";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };
  return (
    <nav className="flex items-center justify-between bg-green-600 px-6 py-3 text-white">
      <div className="font-bold text-xl flex items-center gap-2">
        <Home className="w-6 h-6" /> Nhân Viên
      </div>
      <div className="flex gap-6 items-center">
        <NavLink
          to="/nhanvien"
          className={({ isActive }) =>
            isActive
              ? "font-semibold underline flex items-center gap-1"
              : "flex items-center gap-1"
          }
        >
          <Home className="w-5 h-5" /> Trang chủ
        </NavLink>
        <NavLink
          to="/nhanvien/users"
          className={({ isActive }) =>
            isActive
              ? "font-semibold underline flex items-center gap-1"
              : "flex items-center gap-1"
          }
        >
          <Users className="w-5 h-5" /> Quản lý tài khoản
        </NavLink>
        <NavLink
          to="/nhanvien/username"
          className={({ isActive }) =>
            isActive
              ? "font-semibold underline flex items-center gap-1"
              : "flex items-center gap-1"
          }
        >
          <Users className="w-5 h-5" /> Tạo Username
        </NavLink>
        <NavLink
          to="/nhanvien/stocks"
          className={({ isActive }) =>
            isActive
              ? "font-semibold underline flex items-center gap-1"
              : "flex items-center gap-1"
          }
        >
          <ChartColumnStacked className="w-5 h-5" /> Quản lí cổ phiếu
        </NavLink>
        <NavLink
          to="/nhanvien/order"
          className={({ isActive }) =>
            isActive
              ? "font-semibold underline flex items-center gap-1"
              : "flex items-center gap-1"
          }
        >
          <ChartColumnStacked className="w-5 h-5" /> Sao kê lệnh
        </NavLink>
        <NavLink
          to="/nhanvien/execorder"
          className={({ isActive }) =>
            isActive
              ? "font-semibold underline flex items-center gap-1"
              : "flex items-center gap-1"
          }
        >
          <ChartColumnStacked className="w-5 h-5" /> Quét lệnh
        </NavLink>
        <NavLink
          to="/nhanvien/backup"
          className={({ isActive }) =>
            isActive
              ? "font-semibold underline flex items-center gap-1"
              : "flex items-center gap-1"
          }
        >
          <ChartColumnStacked className="w-5 h-5" /> Backup & Restore
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 hover:text-red-300"
        >
          <LogOut className="w-5 h-5" /> Đăng xuất
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
