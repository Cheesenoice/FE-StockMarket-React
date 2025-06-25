import { useState, useEffect } from "react";
import {
  User,
  Users,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import {
  getUnregisteredEmployees,
  getUnregisteredInvestors,
  createEmployeeLogin,
  createInvestorLogin,
} from "../../api/services/nhanvienService";

const TABS = [
  {
    key: "nhanvien",
    label: "Quản lý Đăng nhập Nhân viên",
    icon: User,
    role: "NhanVien",
  },
  {
    key: "nhadautu",
    label: "Quản lý Đăng nhập Nhà đầu tư",
    icon: Users,
    role: "NhaDauTu",
  },
];

const CreateUsername = () => {
  const [activeTab, setActiveTab] = useState("nhanvien");
  const [showPassword, setShowPassword] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unregisteredUsers, setUnregisteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    username: "",
    role: "NhanVien",
  });

  // Fetch unregistered users when tab changes
  useEffect(() => {
    fetchUnregisteredUsers();
  }, [activeTab]);

  const fetchUnregisteredUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const result =
        activeTab === "nhanvien"
          ? await getUnregisteredEmployees()
          : await getUnregisteredInvestors();

      if (result.success) {
        setUnregisteredUsers(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Có lỗi xảy ra khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    const selectedTab = TABS.find((tab) => tab.key === tabKey);
    setFormData((prev) => ({
      ...prev,
      role: selectedTab.role,
      username: "", // Reset username when changing tabs
    }));
    setShowDropdown(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserSelect = (user) => {
    const username = activeTab === "nhanvien" ? user.MaNV : user.MaNDT;
    setFormData((prev) => ({
      ...prev,
      username: username,
    }));
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result =
        activeTab === "nhanvien"
          ? await createEmployeeLogin(formData)
          : await createInvestorLogin(formData);

      if (result.success) {
        alert("Tạo tài khoản đăng nhập thành công!");
        handleReset();
        fetchUnregisteredUsers(); // Refresh the list
      } else {
        setError(result.message || "Có lỗi xảy ra khi tạo tài khoản");
      }
    } catch (error) {
      setError("Có lỗi xảy ra khi tạo tài khoản");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    const selectedTab = TABS.find((tab) => tab.key === activeTab);
    setFormData({
      login: "",
      password: "",
      username: "",
      role: selectedTab.role,
    });
    setShowDropdown(false);
  };

  const getSelectedUserName = () => {
    if (!formData.username) return "";
    const user = unregisteredUsers.find(
      (u) => (activeTab === "nhanvien" ? u.MaNV : u.MaNDT) === formData.username
    );
    return user ? user.HoTen : formData.username;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Quản lý Đăng nhập
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Quản lý thông tin đăng nhập cho nhân viên và nhà đầu tư
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
              onClick={() => handleTabChange(tab.key)}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Thêm tài khoản đăng nhập mới
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Đang quản lý cho:{" "}
            <span className="font-semibold text-blue-600">
              {activeTab === "nhanvien" ? "Nhân viên" : "Nhà đầu tư"}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Login */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Login ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="login"
                value={formData.login}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="VD: NV01, NDT01"
                required
              />
            </div>

            {/* Username Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Chọn người dùng <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-left flex items-center justify-between"
                >
                  <span
                    className={
                      formData.username
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500"
                    }
                  >
                    {formData.username
                      ? getSelectedUserName()
                      : "Chọn người dùng..."}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {showDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {loading ? (
                      <div className="px-3 py-2 text-gray-500 text-center">
                        Đang tải...
                      </div>
                    ) : unregisteredUsers.length === 0 ? (
                      <div className="px-3 py-2 text-gray-500 text-center">
                        Không có người dùng nào chưa đăng ký
                      </div>
                    ) : (
                      unregisteredUsers.map((user) => {
                        const username =
                          activeTab === "nhanvien" ? user.MaNV : user.MaNDT;
                        return (
                          <button
                            key={username}
                            type="button"
                            className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 focus:bg-gray-100 dark:focus:bg-gray-600"
                            onClick={() => handleUserSelect(user)}
                          >
                            <div className="font-medium text-gray-900 dark:text-white">
                              {user.HoTen}
                            </div>
                            <div className="text-sm text-gray-500">
                              {username}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
              {formData.username && (
                <p className="text-xs text-gray-500 mt-1">
                  Username sẽ là:{" "}
                  <span className="font-mono">{formData.username}</span>
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Nhập mật khẩu"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">
                Role được tự động điền theo tab đang chọn
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <Plus size={16} />
              {loading ? "Đang xử lý..." : "Thêm tài khoản"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Làm mới
            </button>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      <div className="mt-6 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Dữ liệu sẽ được gửi:
        </h3>
        <pre className="text-xs bg-white dark:bg-gray-800 p-3 rounded border overflow-x-auto">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>

      {/* Placeholder for future table */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-8 text-gray-500">
          <User size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">Danh sách tài khoản</p>
          <p className="text-sm">
            Chức năng hiển thị danh sách sẽ được phát triển sau
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateUsername;
