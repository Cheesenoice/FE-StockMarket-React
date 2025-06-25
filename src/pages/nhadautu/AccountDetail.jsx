import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getAccountDetail,
  getAccountStatement,
  getAccountMoneyStatement,
  getAccountOrderStatement,
} from "../../api/services/accountService";

const TABS = [
  { key: "info", label: "Thông tin tài khoản" },
  { key: "statement", label: "Sao kê lệnh khớp" },
  { key: "money", label: "Sao kê giao dịch tiền" },
  { key: "order", label: "Sao kê giao dịch lệnh" },
];

function formatDateTime(val) {
  if (
    typeof val === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)
  ) {
    const d = new Date(val);
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }
  return val?.toLocaleString?.() ?? val;
}

const AccountDetail = () => {
  const { maTK } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("info");

  // Sao kê lệnh khớp
  const [tuNgay, setTuNgay] = useState("2024-01-01");
  const [denNgay, setDenNgay] = useState("2025-06-30");
  const [statement, setStatement] = useState([]);
  const [statementLoading, setStatementLoading] = useState(false);
  const [statementError, setStatementError] = useState("");

  // Sao kê giao dịch tiền
  const [tuNgayMoney, setTuNgayMoney] = useState("2024-01-01");
  const [denNgayMoney, setDenNgayMoney] = useState("2025-06-30");
  const [moneyStatement, setMoneyStatement] = useState([]);
  const [moneyLoading, setMoneyLoading] = useState(false);
  const [moneyError, setMoneyError] = useState("");

  // Sao kê giao dịch lệnh
  const [maCP, setMaCP] = useState("");
  const [tuNgayOrder, setTuNgayOrder] = useState("2024-01-01");
  const [denNgayOrder, setDenNgayOrder] = useState("2025-06-30");
  const [orderStatement, setOrderStatement] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const res = await getAccountDetail(maTK);
      if (res.success) setDetail(res.data);
      else setError(res.message);
      setLoading(false);
    };
    fetchDetail();
  }, [maTK]);

  const handleGetStatement = async (e) => {
    e.preventDefault();
    setStatementError("");
    setStatement([]);
    setStatementLoading(true);
    const res = await getAccountStatement(maTK, tuNgay, denNgay);
    if (res.success) setStatement(res.data);
    else setStatementError(res.message);
    setStatementLoading(false);
  };

  const handleGetMoneyStatement = async (e) => {
    e.preventDefault();
    setMoneyError("");
    setMoneyStatement([]);
    setMoneyLoading(true);
    const res = await getAccountMoneyStatement(maTK, tuNgayMoney, denNgayMoney);
    if (res.success) setMoneyStatement(res.data);
    else setMoneyError(res.message);
    setMoneyLoading(false);
  };

  const handleGetOrderStatement = async (e) => {
    e.preventDefault();
    setOrderError("");
    setOrderStatement([]);
    setOrderLoading(true);
    const res = await getAccountOrderStatement(
      maTK,
      maCP,
      tuNgayOrder,
      denNgayOrder
    );
    if (res.success) setOrderStatement(res.data);
    else setOrderError(res.message);
    setOrderLoading(false);
  };

  // Lấy danh sách mã CP từ detail.stocks
  const maCPList = detail?.stocks?.map((s) => s["Mã CP"]) || [];

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Quay lại
      </button>
      <h2 className="text-xl font-bold mb-4">Chi tiết tài khoản: {maTK}</h2>
      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`px-4 py-2 font-medium border-b-2 transition-colors duration-150 ${
              tab === t.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* Tab content */}
      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : detail ? (
        <>
          {tab === "info" && (
            <>
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(detail.accountInfo).map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <span className="font-medium">{k}:</span>{" "}
                    <span>{v.toLocaleString?.() ?? v}</span>
                  </div>
                ))}
              </div>
              <h4 className="font-semibold mb-1">Danh sách cổ phiếu</h4>
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">Mã CP</th>
                    <th className="border px-2 py-1">Số lượng</th>
                    <th className="border px-2 py-1">Giá thị trường</th>
                    <th className="border px-2 py-1">Tổng giá trị</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.stocks.map((stock, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{stock["Mã CP"]}</td>
                      <td className="border px-2 py-1">
                        {stock["Số lượng"].toLocaleString()}
                      </td>
                      <td className="border px-2 py-1">
                        {stock["Giá thị trường"].toLocaleString()}
                      </td>
                      <td className="border px-2 py-1">
                        {stock["Tổng giá trị"].toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {tab === "statement" && (
            <>
              <form
                onSubmit={handleGetStatement}
                className="mb-4 flex flex-wrap gap-4 items-end"
              >
                <div>
                  <label className="block mb-1 font-medium">Từ ngày</label>
                  <input
                    type="date"
                    className="border px-2 py-1 rounded"
                    value={tuNgay}
                    onChange={(e) => setTuNgay(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Đến ngày</label>
                  <input
                    type="date"
                    className="border px-2 py-1 rounded"
                    value={denNgay}
                    onChange={(e) => setDenNgay(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={statementLoading}
                >
                  {statementLoading ? "Đang tải..." : "Xem sao kê"}
                </button>
              </form>
              {statementError && (
                <div className="text-red-500 mb-2">{statementError}</div>
              )}
              {statement.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-1">Sao kê lệnh khớp</h4>
                  <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        {Object.keys(statement[0]).map((col) => (
                          <th key={col} className="border px-2 py-1">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {statement.map((row, idx) => (
                        <tr key={idx}>
                          {Object.values(row).map((val, i) => (
                            <td key={i} className="border px-2 py-1">
                              {formatDateTime(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
          {tab === "money" && (
            <>
              <form
                onSubmit={handleGetMoneyStatement}
                className="mb-4 flex flex-wrap gap-4 items-end"
              >
                <div>
                  <label className="block mb-1 font-medium">Từ ngày</label>
                  <input
                    type="date"
                    className="border px-2 py-1 rounded"
                    value={tuNgayMoney}
                    onChange={(e) => setTuNgayMoney(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Đến ngày</label>
                  <input
                    type="date"
                    className="border px-2 py-1 rounded"
                    value={denNgayMoney}
                    onChange={(e) => setDenNgayMoney(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={moneyLoading}
                >
                  {moneyLoading ? "Đang tải..." : "Xem sao kê"}
                </button>
              </form>
              {moneyError && (
                <div className="text-red-500 mb-2">{moneyError}</div>
              )}
              {moneyStatement.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-1">Sao kê giao dịch tiền</h4>
                  <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        {Object.keys(moneyStatement[0]).map((col) => (
                          <th key={col} className="border px-2 py-1">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {moneyStatement.map((row, idx) => (
                        <tr key={idx}>
                          {Object.values(row).map((val, i) => (
                            <td key={i} className="border px-2 py-1">
                              {formatDateTime(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
          {tab === "order" && (
            <>
              <form
                onSubmit={handleGetOrderStatement}
                className="mb-4 flex flex-wrap gap-4 items-end"
              >
                <div>
                  <label className="block mb-1 font-medium">Mã cổ phiếu</label>
                  <select
                    className="border px-2 py-1 rounded"
                    value={maCP}
                    onChange={(e) => setMaCP(e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    {maCPList.map((cp) => (
                      <option key={cp} value={cp}>
                        {cp}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Từ ngày</label>
                  <input
                    type="date"
                    className="border px-2 py-1 rounded"
                    value={tuNgayOrder}
                    onChange={(e) => setTuNgayOrder(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Đến ngày</label>
                  <input
                    type="date"
                    className="border px-2 py-1 rounded"
                    value={denNgayOrder}
                    onChange={(e) => setDenNgayOrder(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={orderLoading}
                >
                  {orderLoading ? "Đang tải..." : "Xem sao kê"}
                </button>
              </form>
              {orderError && (
                <div className="text-red-500 mb-2">{orderError}</div>
              )}
              {orderStatement.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-1">Sao kê giao dịch lệnh</h4>
                  <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        {Object.keys(orderStatement[0]).map((col) => (
                          <th key={col} className="border px-2 py-1">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orderStatement.map((row, idx) => (
                        <tr key={idx}>
                          {Object.values(row).map((val, i) => (
                            <td key={i} className="border px-2 py-1">
                              {formatDateTime(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </>
      ) : null}
    </div>
  );
};

export default AccountDetail;
