import { useState } from "react";
import {
  Settings,
  Play,
  Pause,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from "lucide-react";
import { executeATO, executeATC } from "../../api/services/nhanvienService";

const AtoAtcManagement = () => {
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [isLoadingATO, setIsLoadingATO] = useState(false);
  const [isLoadingATC, setIsLoadingATC] = useState(false);
  const [message, setMessage] = useState("");

  const handleStartAto = async () => {
    setIsLoadingATO(true);
    setMessage("");

    try {
      const result = await executeATO();
      if (result.success) {
        setMessage("✅ " + result.message);
      } else {
        setMessage("❌ " + result.message);
      }
    } catch (error) {
      setMessage("❌ Lỗi kết nối server");
    } finally {
      setIsLoadingATO(false);
    }
  };

  const handleStartAtc = async () => {
    setIsLoadingATC(true);
    setMessage("");

    try {
      const result = await executeATC();
      if (result.success) {
        setMessage("✅ " + result.message);
      } else {
        setMessage("❌ " + result.message);
      }
    } catch (error) {
      setMessage("❌ Lỗi kết nối server");
    } finally {
      setIsLoadingATC(false);
    }
  };

  const handleToggleChange = () => {
    setIsToggleOn(!isToggleOn);
    setMessage("🔄 Chế độ tự động: " + (!isToggleOn ? "Bật" : "Tắt"));
    // Add your toggle logic here
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Quản lý ATO/ATC
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center mb-6">
          <Settings className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Cài đặt giao dịch tự động
          </h2>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("✅")
                ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                : message.includes("❌")
                ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                : "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"
            }`}
          >
            <p className="font-medium">{message}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Button 1: Start ATO */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center">
              <Play className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  Khởi động ATO
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Thực hiện khớp lệnh At The Opening cho tất cả mã CP
                </p>
              </div>
            </div>
            <button
              onClick={handleStartAto}
              disabled={isLoadingATO}
              className={`px-6 py-2 font-medium rounded-lg transition-colors duration-200 flex items-center ${
                isLoadingATO
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white`}
            >
              {isLoadingATO ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Bắt đầu
                </>
              )}
            </button>
          </div>

          {/* Button 2: Start ATC */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center">
              <Pause className="w-6 h-6 text-orange-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  Khởi động ATC
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Thực hiện khớp lệnh At The Close cho tất cả mã CP
                </p>
              </div>
            </div>
            <button
              onClick={handleStartAtc}
              disabled={isLoadingATC}
              className={`px-6 py-2 font-medium rounded-lg transition-colors duration-200 flex items-center ${
                isLoadingATC
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              } text-white`}
            >
              {isLoadingATC ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Bắt đầu
                </>
              )}
            </button>
          </div>

          {/* Toggle Button */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center">
              {isToggleOn ? (
                <ToggleRight className="w-6 h-6 text-blue-600 mr-3" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-gray-400 mr-3" />
              )}
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  Chế độ tự động
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isToggleOn ? "Đang bật" : "Đang tắt"} - Tự động thực hiện
                  giao dịch
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleChange}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                isToggleOn ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isToggleOn ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Status Display */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
            Trạng thái hiện tại:
          </h4>
          <div className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
            <p>
              • ATO:{" "}
              <span className="font-medium">
                {isLoadingATO ? "Đang xử lý..." : "Sẵn sàng"}
              </span>
            </p>
            <p>
              • ATC:{" "}
              <span className="font-medium">
                {isLoadingATC ? "Đang xử lý..." : "Sẵn sàng"}
              </span>
            </p>
            <p>
              • Chế độ tự động:{" "}
              <span className="font-medium">{isToggleOn ? "Bật" : "Tắt"}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtoAtcManagement;
