import { Home, ClipboardList, User, PiggyBank, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../api/services/authService";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };
  return (
    <nav className="flex items-center justify-between bg-blue-600 px-6 py-3 text-white">
      <div className="font-bold text-xl flex items-center gap-2">
        <Home className="w-6 h-6" /> Nhà Đầu Tư
      </div>
      <div className="flex gap-6 items-center">
        <NavLink
          to="/nhadautu"
          className={({ isActive }) =>
            isActive
              ? "font-semibold underline flex items-center gap-1"
              : "flex items-center gap-1"
          }
        >
          <Home className="w-5 h-5" /> Trang chủ
        </NavLink>
        <NavLink
          to="/nhadautu/order"
          className={({ isActive }) =>
            isActive
              ? "font-semibold underline flex items-center gap-1"
              : "flex items-center gap-1"
          }
        >
          <ClipboardList className="w-5 h-5" /> Đặt lệnh
        </NavLink>
        <NavLink
          to="/nhadautu/account"
          className={({ isActive }) =>
            isActive
              ? "font-semibold underline flex items-center gap-1"
              : "flex items-center gap-1"
          }
        >
          <PiggyBank className="w-5 h-5" /> Tài khoản ngân hàng
        </NavLink>
        <NavLink
          to="/nhadautu/info"
          className={({ isActive }) =>
            isActive
              ? "font-semibold underline flex items-center gap-1"
              : "flex items-center gap-1"
          }
        >
          <User className="w-5 h-5" /> Thông tin
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
