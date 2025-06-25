import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import ProtectedRoute from "../components/Common/ProtectedRoute";
import NhaDauTuHome from "../pages/nhadautu/Home";
import NhanVienHome from "../pages/nhanvien/Home";
import Account from "../pages/nhadautu/Account";
import Order from "../pages/nhadautu/Order/Order";
import Dashboard from "../pages/nhadautu/Dashboard";
import Dashboard2 from "../pages/nhanvien/Dashboard";
import AccountDetail from "../pages/nhadautu/AccountDetail";
import UserManagement from "../pages/nhanvien/UserManagement";
import CreateUsername from "../pages/nhanvien/CreateUsername";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedRoute allowedRoles={["NhaDauTu"]} />}>
      <Route path="/nhadautu" element={<NhaDauTuHome />}>
        <Route index element={<Dashboard />} />
        <Route path="order" element={<Order />} />
        <Route path="account" element={<Account />} />
        <Route path="account/detail/:maTK" element={<AccountDetail />} />
      </Route>
    </Route>
    <Route element={<ProtectedRoute allowedRoles={["NhanVien"]} />}>
      <Route path="/nhanvien" element={<NhanVienHome />}>
        <Route index element={<Dashboard2 />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="username" element={<CreateUsername />} />
      </Route>
    </Route>
    <Route path="*" element={<Login />} />
  </Routes>
);

export default AppRoutes;
