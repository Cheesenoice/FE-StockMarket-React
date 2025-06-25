import { useState, useEffect } from "react";
import {
  getEmployees,
  getInvestors,
  deleteEmployee,
  deleteInvestor,
  addNhaDauTu,
  updateNhaDauTu,
  deleteNhaDauTu,
  addNhanVien,
  updateNhanVien,
  deleteNhanVien,
  undoUserAction,
  redoUserAction,
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [addForm, setAddForm] = useState({
    MaNV: "",
    HoTen: "",
    NgaySinh: "",
    DiaChi: "",
    Phone: "",
    CMND: "",
    GioiTinh: "Nam",
    Email: "",
    MKGD: "", // chỉ cho nhà đầu tư
  });
  const [editForm, setEditForm] = useState({
    MaNV: "",
    MaNDT: "",
    HoTen: "",
    NgaySinh: "",
    DiaChi: "",
    Phone: "",
    CMND: "",
    GioiTinh: "Nam",
    Email: "",
    MKGD: "", // chỉ cho nhà đầu tư
  });
  const [message, setMessage] = useState("");

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
          ? await deleteNhanVien(id)
          : await deleteNhaDauTu(id);

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

  const handleAdd = async () => {
    setLoading(true);
    setError("");
    let result;
    if (activeTab === "nhanvien") {
      const { MKGD, ...nhanvienData } = addForm;
      result = await addNhanVien(nhanvienData);
    } else {
      result = await addNhaDauTu(addForm);
    }
    setLoading(false);
    if (result.success) {
      setShowAddModal(false);
      setAddForm({
        MaNV: "",
        HoTen: "",
        NgaySinh: "",
        DiaChi: "",
        Phone: "",
        CMND: "",
        GioiTinh: "Nam",
        Email: "",
        MKGD: "",
      });
      fetchData();
      alert("Thêm thành công!");
    } else {
      setError(result.message || "Có lỗi xảy ra khi thêm mới");
    }
  };

  const handleEditClick = (item) => {
    if (activeTab === "nhanvien") {
      setEditForm({
        MaNV: item.MaNV,
        HoTen: item.HoTen,
        NgaySinh: item.NgaySinh,
        DiaChi: item.DiaChi,
        Phone: item.Phone,
        CMND: item.CMND,
        GioiTinh: item.GioiTinh,
        Email: item.Email,
        MKGD: "",
        MaNDT: "",
      });
    } else {
      setEditForm({
        MaNDT: item.MaNDT,
        HoTen: item.HoTen,
        NgaySinh: item.NgaySinh,
        DiaChi: item.DiaChi,
        Phone: item.Phone,
        CMND: item.CMND,
        GioiTinh: item.GioiTinh,
        Email: item.Email,
        MKGD: item.MKGD || "",
        MaNV: "",
      });
    }
    setShowEditModal(true);
  };

  const handleEdit = async () => {
    setLoading(true);
    setError("");
    let result;
    if (activeTab === "nhanvien") {
      result = await updateNhanVien(editForm);
    } else {
      result = await updateNhaDauTu(editForm);
    }
    setLoading(false);
    if (result.success) {
      setShowEditModal(false);
      fetchData();
      alert("Cập nhật thành công!");
    } else {
      setError(result.message || "Có lỗi xảy ra khi cập nhật");
    }
  };

  const handleUndo = async () => {
    setLoading(true);
    setMessage("");
    const res = await undoUserAction();
    setLoading(false);
    if (res.success) {
      setMessage("Hoàn tác thành công!");
      fetchData();
    } else {
      setMessage(res.message);
    }
  };

  const handleRedo = async () => {
    setLoading(true);
    setMessage("");
    const res = await redoUserAction();
    setLoading(false);
    if (res.success) {
      setMessage("Làm lại thành công!");
      fetchData();
    } else {
      setMessage(res.message);
    }
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
                    onClick={() => handleEditClick(employee)}
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
                    onClick={() => handleEditClick(investor)}
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

      {/* Add + Undo/Redo Buttons */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {activeTab === "nhanvien"
            ? `${employees.length} nhân viên`
            : `${investors.length} nhà đầu tư`}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleUndo}
            className="bg-yellow-500 text-white px-3 py-1 rounded"
            disabled={loading}
          >
            Undo
          </button>
          <button
            onClick={handleRedo}
            className="bg-green-500 text-white px-3 py-1 rounded"
            disabled={loading}
          >
            Redo
          </button>
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
            Thêm {activeTab === "nhanvien" ? "nhân viên" : "nhà đầu tư"}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && <div className="mb-2 text-blue-600">{message}</div>}

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

      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">
              Thêm {activeTab === "nhanvien" ? "Nhân viên" : "Nhà đầu tư"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {activeTab === "nhanvien" ? "Mã NV" : "Mã NĐT"}
                </label>
                <input
                  type="text"
                  className="input"
                  value={
                    activeTab === "nhanvien" ? addForm.MaNV : addForm.MaNDT
                  }
                  onChange={(e) =>
                    setAddForm((f) => ({
                      ...f,
                      [activeTab === "nhanvien" ? "MaNV" : "MaNDT"]:
                        e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Họ tên</label>
                <input
                  type="text"
                  className="input"
                  value={addForm.HoTen}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, HoTen: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  className="input"
                  value={addForm.NgaySinh}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, NgaySinh: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  className="input"
                  value={addForm.DiaChi}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, DiaChi: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  className="input"
                  value={addForm.Phone}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, Phone: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CMND</label>
                <input
                  type="text"
                  className="input"
                  value={addForm.CMND}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, CMND: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Giới tính
                </label>
                <select
                  className="input"
                  value={addForm.GioiTinh}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, GioiTinh: e.target.value }))
                  }
                >
                  <option value="Nam">Nam</option>
                  <option value="Nu">Nữ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="input"
                  value={addForm.Email}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, Email: e.target.value }))
                  }
                />
              </div>
              {activeTab === "nhadautu" && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mật khẩu GD
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={addForm.MKGD}
                    onChange={(e) =>
                      setAddForm((f) => ({ ...f, MKGD: e.target.value }))
                    }
                  />
                </div>
              )}
            </div>
            {error && (
              <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowAddModal(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleAdd}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">
              Sửa {activeTab === "nhanvien" ? "Nhân viên" : "Nhà đầu tư"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {activeTab === "nhanvien" ? "Mã NV" : "Mã NĐT"}
                </label>
                <input
                  type="text"
                  className="input"
                  value={
                    activeTab === "nhanvien" ? editForm.MaNV : editForm.MaNDT
                  }
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Họ tên</label>
                <input
                  type="text"
                  className="input"
                  value={editForm.HoTen}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, HoTen: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  className="input"
                  value={editForm.NgaySinh}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, NgaySinh: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  className="input"
                  value={editForm.DiaChi}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, DiaChi: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  className="input"
                  value={editForm.Phone}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, Phone: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CMND</label>
                <input
                  type="text"
                  className="input"
                  value={editForm.CMND}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, CMND: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Giới tính
                </label>
                <select
                  className="input"
                  value={editForm.GioiTinh}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, GioiTinh: e.target.value }))
                  }
                >
                  <option value="Nam">Nam</option>
                  <option value="Nu">Nữ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="input"
                  value={editForm.Email}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, Email: e.target.value }))
                  }
                />
              </div>
              {activeTab === "nhadautu" && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mật khẩu GD
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={editForm.MKGD}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, MKGD: e.target.value }))
                    }
                  />
                </div>
              )}
            </div>
            {error && (
              <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowEditModal(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleEdit}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
