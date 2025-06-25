import { useEffect, useState } from "react";
import {
  getAccounts,
  getAccountDetail,
  getBanks,
  addAccount,
  deleteAccount,
  depositMoney,
  withdrawMoney,
} from "../../api/services/accountService";
import { Eye, Plus, Trash2, X, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BankAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [banks, setBanks] = useState([]);
  const [addForm, setAddForm] = useState({ MaTK: "", MaNH: "" });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState("");
  const [moneyModal, setMoneyModal] = useState({
    open: false,
    type: "",
    maTK: "",
  });
  const [moneyAmount, setMoneyAmount] = useState("");
  const [moneyMkgd, setMoneyMkgd] = useState(["", "", "", "", "", ""]);
  const [moneyLoading, setMoneyLoading] = useState(false);
  const [moneyResult, setMoneyResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      const res = await getAccounts();
      if (res.success) setAccounts(res.data);
      else setError(res.message);
      setLoading(false);
    };
    fetchAccounts();
    // Lấy danh sách ngân hàng
    getBanks().then((res) => {
      if (res.success) setBanks(res.data);
    });
  }, []);

  const handleViewDetail = async (maTK) => {
    setSelected(maTK);
    setDetailLoading(true);
    const res = await getAccountDetail(maTK);
    if (res.success) setDetail(res.data);
    else setDetail(null);
    setDetailLoading(false);
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    const res = await addAccount(addForm.MaTK, addForm.MaNH);
    if (res.success) {
      setShowAdd(false);
      setAddForm({ MaTK: "", MaNH: "" });
      // Reload accounts
      const accRes = await getAccounts();
      if (accRes.success) setAccounts(accRes.data);
    } else {
      setAddError(res.message);
    }
    setAddLoading(false);
  };

  const handleDelete = async (maTK) => {
    setDeleteLoading(maTK);
    const res = await deleteAccount(maTK);
    if (res.success) {
      setAccounts((prev) => prev.filter((a) => a.MaTK !== maTK));
      if (selected === maTK) {
        setSelected(null);
        setDetail(null);
      }
    } else {
      alert(res.message);
    }
    setDeleteLoading("");
  };

  const handleMoneySubmit = async (e) => {
    e.preventDefault();
    setMoneyLoading(true);
    setMoneyResult(null);
    const mkgd = moneyMkgd.join("");
    const soTien = parseInt(moneyAmount);
    let res;
    if (moneyModal.type === "deposit") {
      res = await depositMoney(moneyModal.maTK, soTien, mkgd);
    } else {
      res = await withdrawMoney(moneyModal.maTK, soTien, mkgd);
    }
    setMoneyResult(res);
    setMoneyLoading(false);
    if (res.success) {
      setTimeout(
        () => setMoneyModal({ open: false, type: "", maTK: "" }),
        1200
      );
      // Reload accounts
      const accRes = await getAccounts();
      if (accRes.success) setAccounts(accRes.data);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Danh sách tài khoản</h2>
        <button
          className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowAdd(true)}
        >
          <Plus className="w-4 h-4" /> Thêm ngân hàng
        </button>
      </div>
      {/* Modal thêm tài khoản */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[320px] relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setShowAdd(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-3">
              Thêm tài khoản ngân hàng
            </h3>
            <form onSubmit={handleAddAccount} className="space-y-3">
              <div>
                <label className="block mb-1 font-medium">Mã TK</label>
                <input
                  className="border px-2 py-1 rounded w-full"
                  value={addForm.MaTK}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, MaTK: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Ngân hàng</label>
                <select
                  className="border px-2 py-1 rounded w-full"
                  value={addForm.MaNH}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, MaNH: e.target.value }))
                  }
                  required
                >
                  <option value="">-- Chọn ngân hàng --</option>
                  {banks.map((b) => (
                    <option key={b.MaNH} value={b.MaNH}>
                      {b.TenNH}
                    </option>
                  ))}
                </select>
              </div>
              {addError && (
                <div className="text-red-500 text-sm">{addError}</div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 disabled:opacity-60"
                disabled={addLoading}
              >
                {addLoading ? "Đang thêm..." : "Thêm"}
              </button>
            </form>
          </div>
        </div>
      )}
      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Mã TK</th>
              <th className="border px-2 py-1">Mã NĐT</th>
              <th className="border px-2 py-1">Số tiền</th>
              <th className="border px-2 py-1">Mã NH</th>
              <th className="border px-2 py-1">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.MaTK} className="hover:bg-gray-50">
                <td className="border px-2 py-1">{acc.MaTK}</td>
                <td className="border px-2 py-1">{acc.MaNDT}</td>
                <td className="border px-2 py-1">
                  {acc.SoTien.toLocaleString()}
                </td>
                <td className="border px-2 py-1">{acc.MaNH}</td>
                <td className="border px-2 py-1 text-center flex gap-2 justify-center">
                  <button
                    className="text-blue-600 hover:underline flex items-center gap-1"
                    onClick={() =>
                      navigate(`/nhadautu/account/detail/${acc.MaTK}`)
                    }
                  >
                    <Eye className="w-4 h-4" /> Xem chi tiết
                  </button>
                  <button
                    className="text-green-600 hover:underline flex items-center gap-1"
                    onClick={() => {
                      setMoneyModal({
                        open: true,
                        type: "deposit",
                        maTK: acc.MaTK,
                      });
                      setMoneyAmount("");
                      setMoneyMkgd(["", "", "", "", "", ""]);
                      setMoneyResult(null);
                    }}
                  >
                    <Plus className="w-4 h-4" /> Nạp tiền
                  </button>
                  <button
                    className="text-yellow-600 hover:underline flex items-center gap-1"
                    onClick={() => {
                      setMoneyModal({
                        open: true,
                        type: "withdraw",
                        maTK: acc.MaTK,
                      });
                      setMoneyAmount("");
                      setMoneyMkgd(["", "", "", "", "", ""]);
                      setMoneyResult(null);
                    }}
                  >
                    <Minus className="w-4 h-4" /> Rút tiền
                  </button>
                  <button
                    className={`text-red-600 hover:underline flex items-center gap-1 ${
                      acc.SoTien !== 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => acc.SoTien === 0 && handleDelete(acc.MaTK)}
                    disabled={acc.SoTien !== 0 || deleteLoading === acc.MaTK}
                    title={
                      acc.SoTien !== 0
                        ? "Chỉ xóa được khi số dư = 0"
                        : "Xóa tài khoản"
                    }
                  >
                    {deleteLoading === acc.MaTK ? (
                      <span>Đang xóa...</span>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" /> Xóa
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Chi tiết tài khoản */}
      {selected && (
        <div className="mt-8 p-4 border rounded bg-gray-50">
          {detailLoading ? (
            <div>Đang tải chi tiết...</div>
          ) : detail ? (
            <>
              <h3 className="text-lg font-semibold mb-2">
                Chi tiết tài khoản: {selected}
              </h3>
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
          ) : (
            <div className="text-red-500">
              Không lấy được chi tiết tài khoản.
            </div>
          )}
        </div>
      )}

      {/* Modal nạp/rút tiền */}
      {moneyModal.open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[320px] relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setMoneyModal({ open: false, type: "", maTK: "" })}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-3">
              {moneyModal.type === "deposit" ? "Nạp tiền" : "Rút tiền"} tài
              khoản {moneyModal.maTK}
            </h3>
            <form onSubmit={handleMoneySubmit} className="space-y-3">
              <div>
                <label className="block mb-1 font-medium">Số tiền</label>
                <input
                  className="border px-2 py-1 rounded w-full"
                  type="number"
                  min={1}
                  value={moneyAmount}
                  onChange={(e) => setMoneyAmount(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Mật khẩu giao dịch
                </label>
                <div className="flex gap-2">
                  {moneyMkgd.map((d, idx) => (
                    <input
                      key={idx}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-8 h-10 text-center border rounded text-lg font-bold"
                      value={d}
                      onChange={(e) => {
                        if (!/^[0-9]?$/.test(e.target.value)) return;
                        const arr = [...moneyMkgd];
                        arr[idx] = e.target.value;
                        setMoneyMkgd(arr);
                        if (e.target.value && idx < 5)
                          document
                            .getElementById(`money-otp-${idx + 1}`)
                            ?.focus();
                        if (!e.target.value && idx > 0)
                          document
                            .getElementById(`money-otp-${idx - 1}`)
                            ?.focus();
                      }}
                      id={`money-otp-${idx}`}
                      required
                    />
                  ))}
                </div>
              </div>
              {moneyResult && (
                <div
                  className={`p-2 rounded ${
                    moneyResult.success
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {moneyResult.message}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 disabled:opacity-60"
                disabled={moneyLoading}
              >
                {moneyLoading
                  ? moneyModal.type === "deposit"
                    ? "Đang nạp..."
                    : "Đang rút..."
                  : moneyModal.type === "deposit"
                  ? "Nạp tiền"
                  : "Rút tiền"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankAccount;
