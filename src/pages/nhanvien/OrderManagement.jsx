import { useState, useEffect } from "react";
import {
  getOrderList,
  getMatchedOrderList,
  getMoneyHistoryList,
} from "../../api/services/nhanvienService";

const TABS = [
  { key: "lenhdat", label: "Lệnh đặt" },
  { key: "lenhkhop", label: "Lệnh khớp" },
  { key: "lichsutien", label: "Lịch sử tiền" },
];

const initialFilters = {
  MaTK: "",
  MaCP: "",
  from: "",
  to: "",
  LoaiLenh: "",
  TrangThai: "",
};

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState("lenhdat");
  const [filters, setFilters] = useState(initialFilters);
  const [pendingFilters, setPendingFilters] = useState(initialFilters);
  const [rawData, setRawData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFilters(initialFilters);
    setPendingFilters(initialFilters);
    fetchData();
    // eslint-disable-next-line
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    let apiFn;
    if (activeTab === "lenhdat") apiFn = getOrderList;
    else if (activeTab === "lenhkhop") apiFn = getMatchedOrderList;
    else apiFn = getMoneyHistoryList;
    try {
      const result = await apiFn({});
      if (result.success) {
        setRawData(result.data);
        setData(result.data);
      } else setError(result.message);
    } catch (e) {
      setError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handlePendingFilterChange = (e) => {
    const { name, value } = e.target;
    setPendingFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    let filtered = rawData;
    if (pendingFilters.MaTK)
      filtered = filtered.filter((row) =>
        (row.MaTK || "").includes(pendingFilters.MaTK)
      );
    if (pendingFilters.MaCP)
      filtered = filtered.filter((row) =>
        (row.MaCP || "").includes(pendingFilters.MaCP)
      );
    if (pendingFilters.from)
      filtered = filtered.filter(
        (row) =>
          (row.NgayGD || row.NgayGioKhop || "").slice(0, 10) >=
          pendingFilters.from
      );
    if (pendingFilters.to)
      filtered = filtered.filter(
        (row) =>
          (row.NgayGD || row.NgayGioKhop || "").slice(0, 10) <=
          pendingFilters.to
      );
    if (activeTab === "lenhdat" && pendingFilters.LoaiLenh)
      filtered = filtered.filter(
        (row) => row.LoaiLenh === pendingFilters.LoaiLenh
      );
    if (activeTab === "lenhdat" && pendingFilters.TrangThai)
      filtered = filtered.filter(
        (row) => row.TrangThai === pendingFilters.TrangThai
      );
    setData(filtered);
    setFilters(pendingFilters);
  };

  const handleRefresh = () => {
    fetchData();
  };

  // Render bộ lọc
  const renderFilters = () => (
    <div className="flex flex-wrap gap-3 mb-4 items-end">
      <div>
        <label className="block text-xs font-medium mb-1">Tài khoản</label>
        <input
          name="MaTK"
          value={pendingFilters.MaTK}
          onChange={handlePendingFilterChange}
          className="input px-2 py-1 border rounded"
          placeholder="Tài khoản"
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Mã cổ phiếu</label>
        <input
          name="MaCP"
          value={pendingFilters.MaCP}
          onChange={handlePendingFilterChange}
          className="input px-2 py-1 border rounded"
          placeholder="Mã cổ phiếu"
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Từ ngày</label>
        <input
          name="from"
          type="date"
          value={pendingFilters.from}
          onChange={handlePendingFilterChange}
          className="input px-2 py-1 border rounded"
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Đến ngày</label>
        <input
          name="to"
          type="date"
          value={pendingFilters.to}
          onChange={handlePendingFilterChange}
          className="input px-2 py-1 border rounded"
        />
      </div>
      {activeTab === "lenhdat" && (
        <>
          <div>
            <label className="block text-xs font-medium mb-1">Loại lệnh</label>
            <select
              name="LoaiLenh"
              value={pendingFilters.LoaiLenh}
              onChange={handlePendingFilterChange}
              className="input px-2 py-1 border rounded"
            >
              <option value="">Tất cả</option>
              <option value="LO">LO</option>
              <option value="ATO">ATO</option>
              <option value="ATC">ATC</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Trạng thái</label>
            <select
              name="TrangThai"
              value={pendingFilters.TrangThai}
              onChange={handlePendingFilterChange}
              className="input px-2 py-1 border rounded"
            >
              <option value="">Tất cả</option>
              <option value="Het">Hết</option>
              <option value="Chua">Chưa</option>
              <option value="Huy">Hủy</option>
              <option value="Cho">Chờ</option>
            </select>
          </div>
        </>
      )}
      <button
        onClick={applyFilters}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Lọc
      </button>
      <button
        onClick={handleRefresh}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
      >
        Làm mới
      </button>
    </div>
  );

  // Render bảng dữ liệu
  const renderTable = () => {
    if (activeTab === "lenhdat") {
      return (
        <table className="w-full border mt-2 table-auto text-sm">
          <thead>
            <tr>
              <th className="border px-3 py-2 bg-gray-100 text-left">Mã GD</th>
              <th className="border px-3 py-2 bg-gray-100 text-left">
                Ngày GD
              </th>
              <th className="border px-3 py-2 bg-gray-100 text-left">
                Loại GD
              </th>
              <th className="border px-3 py-2 bg-gray-100 text-left">
                Loại lệnh
              </th>
              <th className="border px-3 py-2 bg-gray-100 text-right">
                Số lượng
              </th>
              <th className="border px-3 py-2 bg-gray-100 text-left">Mã CP</th>
              <th className="border px-3 py-2 bg-gray-100 text-right">Giá</th>
              <th className="border px-3 py-2 bg-gray-100 text-left">Mã TK</th>
              <th className="border px-3 py-2 bg-gray-100 text-left">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.MaGD}>
                <td className="border px-3 py-2">{row.MaGD}</td>
                <td className="border px-3 py-2">{row.NgayGD?.slice(0, 10)}</td>
                <td className="border px-3 py-2">{row.LoaiGD}</td>
                <td className="border px-3 py-2">{row.LoaiLenh}</td>
                <td className="border px-3 py-2 text-right">{row.SoLuong}</td>
                <td className="border px-3 py-2">{row.MaCP}</td>
                <td className="border px-3 py-2 text-right">
                  {row.Gia?.toLocaleString()}
                </td>
                <td className="border px-3 py-2">{row.MaTK}</td>
                <td className="border px-3 py-2">{row.TrangThai}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    if (activeTab === "lenhkhop") {
      return (
        <table className="w-full border mt-2 table-auto text-sm">
          <thead>
            <tr>
              <th className="border px-3 py-2 bg-gray-100 text-left">Mã LK</th>
              <th className="border px-3 py-2 bg-gray-100 text-left">Mã GD</th>
              <th className="border px-3 py-2 bg-gray-100 text-left">
                Ngày khớp
              </th>
              <th className="border px-3 py-2 bg-gray-100 text-right">
                Số lượng khớp
              </th>
              <th className="border px-3 py-2 bg-gray-100 text-right">
                Giá khớp
              </th>
              <th className="border px-3 py-2 bg-gray-100 text-left">
                Kiểu khớp
              </th>
              <th className="border px-3 py-2 bg-gray-100 text-left">Mã CP</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={row.MaLK || row.MaGD || idx}>
                <td className="border px-3 py-2">{row.MaLK || "-"}</td>
                <td className="border px-3 py-2">{row.MaGD}</td>
                <td className="border px-3 py-2">
                  {row.NgayGioKhop
                    ? row.NgayGioKhop.slice(0, 10)
                    : row.NgayGD?.slice(0, 10)}
                </td>
                <td className="border px-3 py-2 text-right">
                  {row.SoLuongKhop || row.SoLuong}
                </td>
                <td className="border px-3 py-2 text-right">
                  {row.GiaKhop?.toLocaleString() || row.Gia?.toLocaleString()}
                </td>
                <td className="border px-3 py-2">{row.KieuKhop || "-"}</td>
                <td className="border px-3 py-2">{row.MaCP}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    // lichsutien
    return (
      <table className="w-full border mt-2 table-auto text-sm">
        <thead>
          <tr>
            <th className="border px-3 py-2 bg-gray-100 text-left">Mã LS</th>
            <th className="border px-3 py-2 bg-gray-100 text-left">Mã TK</th>
            <th className="border px-3 py-2 bg-gray-100 text-left">Mã GD</th>
            <th className="border px-3 py-2 bg-gray-100 text-left">Ngày GD</th>
            <th className="border px-3 py-2 bg-gray-100 text-right">
              Số dư trước
            </th>
            <th className="border px-3 py-2 bg-gray-100 text-right">
              Phát sinh
            </th>
            <th className="border px-3 py-2 bg-gray-100 text-left">Lý do</th>
            <th className="border px-3 py-2 bg-gray-100 text-right">
              Số dư sau
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.MaLS}>
              <td className="border px-3 py-2">{row.MaLS}</td>
              <td className="border px-3 py-2">{row.MaTK}</td>
              <td className="border px-3 py-2">{row.MaGD}</td>
              <td className="border px-3 py-2">{row.NgayGD?.slice(0, 10)}</td>
              <td className="border px-3 py-2 text-right">
                {row.SoDuTruoc?.toLocaleString()}
              </td>
              <td className="border px-3 py-2 text-right">
                {row.SoTienPhatSinh?.toLocaleString()}
              </td>
              <td className="border px-3 py-2">{row.LyDo}</td>
              <td className="border px-3 py-2 text-right">
                {row.SoDuSau?.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý Lệnh & Lịch sử tiền</h1>
      <div className="flex gap-2 border-b mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {renderFilters()}
      {error && <div className="p-3 bg-red-100 text-red-700 mb-2">{error}</div>}
      {loading ? (
        <div className="text-center py-8">Đang tải dữ liệu...</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded shadow p-4 overflow-x-auto">
          {renderTable()}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
