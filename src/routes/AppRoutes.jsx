import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import ProtectedRoute from "../components/Common/ProtectedRoute";
import NhaDauTuHome from "../pages/nhadautu/Home";
import NhanVienHome from "../pages/nhanvien/Home";
import BankAccount from "../pages/nhadautu/BankAccount";
import Order from "../pages/nhadautu/Order/Order";
import Dashboard from "../pages/nhadautu/Dashboard";
import Dashboard2 from "../pages/nhanvien/Dashboard";
import AccountDetail from "../pages/nhadautu/AccountDetail";
import UserManagement from "../pages/nhanvien/UserManagement";
import CreateUsername from "../pages/nhanvien/CreateUsername";
import StockManagement from "../pages/nhanvien/StockManagement";
import BackupRestoreManagement from "../pages/nhanvien/BackupRestoreManagement";
import OrderManagement from "../pages/nhanvien/OrderManagement";
import AtoAtcManagement from "../pages/nhanvien/AtoAtcManagement";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedRoute allowedRoles={["nhadautu"]} />}>
      <Route path="/nhadautu" element={<NhaDauTuHome />}>
        <Route index element={<Dashboard />} />
        <Route path="order" element={<Order />} />
        <Route path="account" element={<BankAccount />} />
        <Route path="account/detail/:maTK" element={<AccountDetail />} />
      </Route>
    </Route>
    <Route element={<ProtectedRoute allowedRoles={["nhanvien"]} />}>
      <Route path="/nhanvien" element={<NhanVienHome />}>
        <Route index element={<Dashboard2 />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="username" element={<CreateUsername />} />
        <Route path="stocks" element={<StockManagement />} />
        <Route path="backup" element={<BackupRestoreManagement />} />
        <Route path="order" element={<OrderManagement />} />
        <Route path="execorder" element={<AtoAtcManagement />} />
      </Route>
    </Route>
    <Route path="*" element={<Login />} />
  </Routes>
);

export default AppRoutes;
