import { useState, useEffect } from "react";
import {
  getEmployees,
  getInvestors,
  deleteEmployee,
  deleteInvestor,
} from "../../api/services/userService";
import { User, Users, Trash2, Edit, Plus } from "lucide-react";

const TABS = [
  { key: "nhanvien", label: "Quản lý Nhân viên", icon: User },
  { key: "nhadautu", label: "Quản lý Nhà đầu tư", icon: Users },
];

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("nhanvien");
  const [employees, setEmployees] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      if (activeTab === "nhanvien") {
        const result = await getEmployees();
        if (result.success) {
          setEmployees(result.data);
        } else {
          setError(result.message);
        }
      } else {
        const result = await getInvestors();
        if (result.success) {
          setInvestors(result.data);
        } else {
          setError(result.message);
        }
      }
    } catch (error) {
      setError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa ${
          type === "nhanvien" ? "nhân viên" : "nhà đầu tư"
        } này?`
      )
    ) {
      return;
    }

    try {
      const result =
        type === "nhanvien"
          ? await deleteEmployee(id)
          : await deleteInvestor(id);

      if (result.success) {
        // Refresh data after successful deletion
        fetchData();
        alert("Xóa thành công!");
      } else {
        alert(result.message || "Có lỗi xảy ra khi xóa");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi xóa");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatGender = (gender) => {
    return gender === "Nam" ? "Nam" : gender === "Nu" ? "Nữ" : gender;
  };

  const renderEmployeeTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              Mã NV
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              Họ tên
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              Ngày sinh
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              Giới tính
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              Địa chỉ
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              Số điện thoại
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              CMND
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              Email
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr
              key={employee.MaNV}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-semibold">
                {employee.MaNV}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {employee.HoTen}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {formatDate(employee.NgaySinh)}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {formatGender(employee.GioiTinh)}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {employee.DiaChi}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {employee.Phone}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {employee.CMND}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {employee.Email}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                <div className="flex justify-center gap-2">
                  <button
                    className="p-1 text-blue-600 hover:text-blue-800"
                    title="Sửa"
                    onClick={() =>
                      alert("Chức năng sửa sẽ được phát triển sau")
                    }
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Xóa"
                    onClick={() => handleDelete("nhanvien", employee.MaNV)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderInvestorTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              Mã NĐT
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              Họ tên
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              Ngày sinh
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              Giới tính
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              Địa chỉ
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              Số điện thoại
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              CMND
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              Email
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
              Mật khẩu GD
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {investors.map((investor) => (
            <tr
              key={investor.MaNDT}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-semibold">
                {investor.MaNDT}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {investor.HoTen}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {formatDate(investor.NgaySinh)}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {formatGender(investor.GioiTinh)}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {investor.DiaChi}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {investor.Phone}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {investor.CMND}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {investor.Email}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                {investor.MKGD ? "••••••" : ""}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                <div className="flex justify-center gap-2">
                  <button
                    className="p-1 text-blue-600 hover:text-blue-800"
                    title="Sửa"
                    onClick={() =>
                      alert("Chức năng sửa sẽ được phát triển sau")
                    }
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Xóa"
                    onClick={() => handleDelete("nhadautu", investor.MaNDT)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Quản lý Tài khoản
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Quản lý thông tin nhân viên và nhà đầu tư
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-300 dark:border-gray-600 mb-6">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition-colors duration-150 ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Add Button */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {activeTab === "nhanvien"
            ? `${employees.length} nhân viên`
            : `${investors.length} nhà đầu tư`}
        </div>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          onClick={() => alert("Chức năng thêm mới sẽ được phát triển sau")}
        >
          <Plus size={16} />
          Thêm {activeTab === "nhanvien" ? "nhân viên" : "nhà đầu tư"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Đang tải dữ liệu...
          </p>
        </div>
      )}

      {/* Tables */}
      {!loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {activeTab === "nhanvien"
            ? renderEmployeeTable()
            : renderInvestorTable()}
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        (activeTab === "nhanvien" && employees.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User size={48} className="mx-auto mb-4 opacity-50" />
            <p>Chưa có nhân viên nào</p>
          </div>
        ) : activeTab === "nhadautu" && investors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p>Chưa có nhà đầu tư nào</p>
          </div>
        ) : null)}
    </div>
  );
};

export default UserManagement;
