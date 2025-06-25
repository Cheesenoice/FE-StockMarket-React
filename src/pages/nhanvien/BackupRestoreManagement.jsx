import { useEffect, useState } from "react";
import {
  getDatabases,
  getBackupHistory,
  getLogFiles,
  createBackupDevice,
  backupDatabase,
  backupLog,
  restoreDatabase,
  restoreDatabaseByTime,
} from "../../api/services/nhanvienService";

const BackupRestoreManagement = () => {
  const [databases, setDatabases] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState("");
  const [backupHistory, setBackupHistory] = useState([]);
  const [logFiles, setLogFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deviceCreated, setDeviceCreated] = useState(false);
  const [overwriteBackup, setOverwriteBackup] = useState(false);
  const [deleteOldBackups, setDeleteOldBackups] = useState(false);
  const [backupNote, setBackupNote] = useState("");
  const [restoreByTime, setRestoreByTime] = useState(false);
  const [restoreDateTime, setRestoreDateTime] = useState("");
  const [selectedBackupPosition, setSelectedBackupPosition] = useState("");

  const fetchDatabases = async () => {
    setLoading(true);
    setError("");
    const res = await getDatabases();
    if (res.success) {
      setDatabases(res.data);
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  const fetchBackupHistory = async (databaseName) => {
    if (!databaseName) return;
    const res = await getBackupHistory(databaseName);
    if (res.success) {
      setBackupHistory(res.data);
    } else {
      setMessage(res.message);
    }
  };

  const fetchLogFiles = async (databaseName, fromTime, toTime) => {
    if (!databaseName || !fromTime || !toTime) return;
    const res = await getLogFiles(databaseName, fromTime, toTime);
    if (res.success) {
      setLogFiles(res.data);
    } else {
      setMessage(res.message);
    }
  };

  useEffect(() => {
    fetchDatabases();
  }, []);

  useEffect(() => {
    if (selectedDatabase) {
      fetchBackupHistory(selectedDatabase);
      setDeviceCreated(false);
      setSelectedBackupPosition("");
      setLogFiles([]);
      setBackupNote("");
      setOverwriteBackup(false);
      setDeleteOldBackups(false);
    }
  }, [selectedDatabase]);

  useEffect(() => {
    if (restoreByTime && selectedDatabase && restoreDateTime) {
      const fromTime = new Date(restoreDateTime);
      fromTime.setHours(fromTime.getHours() - 1); // Fetch logs from 1 hour before
      const toTime = new Date(restoreDateTime);
      fetchLogFiles(
        selectedDatabase,
        fromTime.toISOString(),
        toTime.toISOString()
      );
    } else {
      setLogFiles([]);
    }
  }, [restoreByTime, restoreDateTime, selectedDatabase]);

  const handleCreateDevice = async () => {
    if (!selectedDatabase) {
      setMessage("Vui lòng chọn database trước!");
      return;
    }
    setMessage("");
    const res = await createBackupDevice(selectedDatabase);
    if (res.success) {
      setMessage(res.message);
      setDeviceCreated(true);
    } else {
      setMessage(res.message);
    }
  };

  const handleBackupDatabase = async () => {
    if (!selectedDatabase) {
      setMessage("Vui lòng chọn database trước!");
      return;
    }
    setMessage("");
    const res = await backupDatabase(
      selectedDatabase,
      overwriteBackup,
      backupNote || `Backup tại ${new Date().toLocaleString("vi-VN")}`,
      deleteOldBackups
    );
    if (res.success) {
      setMessage(res.message);
      fetchBackupHistory(selectedDatabase);
      setBackupNote("");
    } else {
      setMessage(res.message);
    }
  };

  const handleBackupLog = async () => {
    if (!selectedDatabase) {
      setMessage("Vui lòng chọn database trước!");
      return;
    }
    setMessage("");
    const res = await backupLog(selectedDatabase);
    if (res.success) {
      setMessage(res.message);
      fetchBackupHistory(selectedDatabase);
    } else {
      setMessage(res.message);
    }
  };

  const handleRestore = async () => {
    if (!selectedDatabase || !selectedBackupPosition) {
      setMessage("Vui lòng chọn database và bản backup!");
      return;
    }
    setMessage("");

    let res;
    if (restoreByTime && restoreDateTime) {
      const logFilePaths = logFiles.map((log) => log.physical_device_name);
      res = await restoreDatabaseByTime(
        selectedDatabase,
        Number(selectedBackupPosition),
        restoreDateTime,
        logFilePaths
      );
    } else {
      res = await restoreDatabase(
        selectedDatabase,
        Number(selectedBackupPosition)
      );
    }

    if (res.success) {
      setMessage(res.message);
      fetchBackupHistory(selectedDatabase);
    } else {
      setMessage(res.message);
    }
  };

  if (loading) return <div className="p-4">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Quản lý Backup & Restore Database
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Database List */}
        <div className="lg:col-span-1">
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Danh sách Databases
            </h3>
            <div className="space-y-2 max-h-[70vh] overflow-y-auto">
              {databases.map((db) => (
                <button
                  key={db}
                  onClick={() => setSelectedDatabase(db)}
                  className={`w-full text-left p-3 rounded border transition-colors ${
                    selectedDatabase === db
                      ? "bg-blue-100 border-blue-300 text-blue-700"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {db}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Functions and History */}
        <div className="lg:col-span-2">
          {selectedDatabase ? (
            <>
              {/* Backup/Restore Functions */}
              <div className="bg-white p-5 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Database: {selectedDatabase}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-4">
                    <button
                      onClick={handleCreateDevice}
                      disabled={deviceCreated}
                      className={`w-full p-3 rounded font-medium transition-colors ${
                        deviceCreated
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {deviceCreated ? "Đã tạo device" : "Tạo device sao lưu"}
                    </button>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="overwriteBackup"
                          checked={overwriteBackup}
                          onChange={(e) => setOverwriteBackup(e.target.checked)}
                          className="rounded text-blue-500"
                        />
                        <label
                          htmlFor="overwriteBackup"
                          className="text-gray-600"
                        >
                          Ghi đè bản sao lưu
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="deleteOldBackups"
                          checked={deleteOldBackups}
                          onChange={(e) =>
                            setDeleteOldBackups(e.target.checked)
                          }
                          className="rounded text-blue-500"
                        />
                        <label
                          htmlFor="deleteOldBackups"
                          className="text-gray-600"
                        >
                          Xóa các bản sao lưu cũ
                        </label>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={backupNote}
                      onChange={(e) => setBackupNote(e.target.value)}
                      placeholder="Ghi chú cho bản sao lưu"
                      className="w-full p-3 border rounded text-gray-600 focus:ring-2 focus:ring-blue-300"
                    />

                    <button
                      onClick={handleBackupDatabase}
                      disabled={!deviceCreated}
                      className={`w-full p-3 rounded font-medium transition-colors ${
                        !deviceCreated
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      Sao lưu
                    </button>

                    <button
                      onClick={handleBackupLog}
                      disabled={!deviceCreated}
                      className={`w-full p-3 rounded font-medium transition-colors ${
                        !deviceCreated
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-purple-500 text-white hover:bg-purple-600"
                      }`}
                    >
                      Backup Log
                    </button>
                  </div>

                  <div className="space-y-4">
                    <select
                      value={selectedBackupPosition}
                      onChange={(e) =>
                        setSelectedBackupPosition(e.target.value)
                      }
                      className="w-full p-3 border rounded text-gray-600 focus:ring-2 focus:ring-blue-300"
                    >
                      <option value="">Chọn bản backup</option>
                      {backupHistory.map((backup) => (
                        <option key={backup.position} value={backup.position}>
                          {backup.position} - {backup.name} ({backup.type})
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="restoreByTime"
                        checked={restoreByTime}
                        onChange={(e) => setRestoreByTime(e.target.checked)}
                        className="rounded text-blue-500"
                      />
                      <label htmlFor="restoreByTime" className="text-gray-600">
                        Phục hồi theo thời gian
                      </label>
                    </div>

                    {restoreByTime && (
                      <input
                        type="datetime-local"
                        value={restoreDateTime}
                        onChange={(e) => setRestoreDateTime(e.target.value)}
                        className="w-full p-3 border rounded text-gray-600 focus:ring-2 focus:ring-blue-300"
                        required
                      />
                    )}

                    <button
                      onClick={handleRestore}
                      disabled={
                        !selectedBackupPosition ||
                        (restoreByTime && !restoreDateTime)
                      }
                      className={`w-full p-3 rounded font-medium transition-colors ${
                        !selectedBackupPosition ||
                        (restoreByTime && !restoreDateTime)
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      Phục hồi
                    </button>
                  </div>
                </div>

                {message && (
                  <div
                    className={`p-3 rounded ${
                      message.includes("thành công") || message.includes("Đã")
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {message}
                  </div>
                )}
              </div>

              {/* Backup History Table */}
              <div className="bg-white p-5 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Lịch sử Backup
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600">
                        <th className="border px-4 py-2">Vị trí</th>
                        <th className="border px-4 py-2">Tên</th>
                        <th className="border px-4 py-2">Ngày bắt đầu</th>
                        <th className="border px-4 py-2">Ngày hoàn thành</th>
                        <th className="border px-4 py-2">Loại</th>
                        <th className="border px-4 py-2">Kích thước (bytes)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {backupHistory.map((backup) => (
                        <tr key={backup.position} className="hover:bg-gray-50">
                          <td className="border px-4 py-2">
                            {backup.position}
                          </td>
                          <td className="border px-4 py-2">{backup.name}</td>
                          <td className="border px-4 py-2">
                            {new Date(backup.backup_start_date).toLocaleString(
                              "vi-VN"
                            )}
                          </td>
                          <td className="border px-4 py-2">
                            {new Date(backup.backup_finish_date).toLocaleString(
                              "vi-VN"
                            )}
                          </td>
                          <td className="border px-4 py-2">
                            {backup.type === "D" ? "Database" : "Log"}
                          </td>
                          <td className="border px-4 py-2">
                            {backup.backup_size}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Log Files Table (Visible when restoreByTime is checked) */}
              {restoreByTime && logFiles.length > 0 && (
                <div className="bg-white p-5 rounded-lg shadow-md mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">
                    Danh sách Log Files
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600">
                          <th className="border px-4 py-2">Vị trí</th>
                          <th className="border px-4 py-2">Ngày bắt đầu</th>
                          <th className="border px-4 py-2">Ngày hoàn thành</th>
                          <th className="border px-4 py-2">Đường dẫn</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logFiles.map((log, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border px-4 py-2">{log.position}</td>
                            <td className="border px-4 py-2">
                              {new Date(log.backup_start_date).toLocaleString(
                                "vi-VN"
                              )}
                            </td>
                            <td className="border px-4 py-2">
                              {new Date(log.backup_finish_date).toLocaleString(
                                "vi-VN"
                              )}
                            </td>
                            <td className="border px-4 py-2">
                              {log.physical_device_name}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
              Vui lòng chọn database từ danh sách bên trái để bắt đầu
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackupRestoreManagement;
