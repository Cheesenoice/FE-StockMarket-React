import { useState, useEffect } from "react";
import {
  getStocks,
  placeOrder,
  getPendingOrders,
  cancelPendingOrder,
} from "../../../api/services/orderService";
import OrderModal from "./OrderModal";
import StockPrice from "./StockPrice";

const TABS = [
  { key: "mua", label: "Đặt lệnh Mua" },
  { key: "ban", label: "Đặt lệnh Bán" },
];

const MA_CPS = ["AAA", "BBB", "CCC"]; // Tạm hardcode
const MA_TKS = ["TK01", "TK02"]; // Tạm hardcode
const LOAI_LENHS = ["LO", "ATO", "ATC"];

const RECENT_ORDERS = [
  { maCP: "AAA", loai: "Mua", soLuong: 100, gia: 20000, trangThai: "Chờ" },
  { maCP: "BBB", loai: "Bán", soLuong: 50, gia: 15000, trangThai: "Hết" },
  { maCP: "CCC", loai: "Mua", soLuong: 200, gia: 21000, trangThai: "Hủy" },
];

function getCurrentDateTimeStr() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

const OTPModal = ({ open, onClose, onConfirm }) => {
  const [mkgd, setMkgd] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  useEffect(() => {
    if (open) {
      setMkgd(["", "", "", "", "", ""]);
      setError("");
    }
  }, [open]);
  const handleChange = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const arr = [...mkgd];
    arr[idx] = val;
    setMkgd(arr);
    if (val && idx < 5) document.getElementById(`otp-box-${idx + 1}`)?.focus();
    if (!val && idx > 0) document.getElementById(`otp-box-${idx - 1}`)?.focus();
  };
  const handleConfirm = () => {
    if (mkgd.some((d) => d === "")) {
      setError("Nhập đủ 6 số mật khẩu giao dịch!");
      return;
    }
    setError("");
    onConfirm(mkgd.join(""));
    onClose();
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-[#23272b] rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4">Nhập mật khẩu giao dịch</h2>
        <div className="flex justify-center gap-2 mb-4">
          {mkgd.map((d, idx) => (
            <input
              key={idx}
              id={`otp-box-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-10 h-12 text-center border rounded text-xl font-bold"
              value={d}
              onChange={(e) => handleChange(idx, e.target.value)}
            />
          ))}
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold mt-2"
          onClick={handleConfirm}
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
};

const Order = () => {
  const [tab, setTab] = useState("mua");
  const [form, setForm] = useState({
    maCP: MA_CPS[0],
    loaiGD: "M",
    soLuong: 0,
    gia: "",
    maTK: MA_TKS[0],
    loaiLenh: LOAI_LENHS[0],
    mkgd: "",
  });
  const [now, setNow] = useState(getCurrentDateTimeStr());
  const [stockList, setStockList] = useState([]);
  const [stockFilter, setStockFilter] = useState("");
  const [stockDropdownOpen, setStockDropdownOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingError, setPendingError] = useState("");
  const [cancelMaGD, setCancelMaGD] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelResult, setCancelResult] = useState(null);
  const [atoAtcTime, setAtoAtcTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(getCurrentDateTimeStr());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStocks = async () => {
      const res = await getStocks();
      if (res.success) setStockList(res.data);
      else setStockList([]);
    };
    fetchStocks();
  }, []);

  const fetchPending = async () => {
    setPendingLoading(true);
    setPendingError("");
    try {
      const res = await getPendingOrders();
      if (res.success) setPendingOrders(res.data);
      else setPendingError(res.message);
    } catch (e) {
      setPendingError("Có lỗi khi tải lệnh chờ khớp");
    } finally {
      setPendingLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // Khi đổi tab, reset form phù hợp
  const handleTab = (key) => {
    setTab(key);
    setForm((f) => ({
      ...f,
      loaiGD: key === "mua" ? "M" : "B",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleRadioChange = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (name === "loaiLenh" && value !== "ATO" && value !== "ATC") {
      setAtoAtcTime("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...form, ngay: now };
    console.log("Đặt lệnh:", submitData);
    alert("Đã gửi lệnh (demo):\n" + JSON.stringify(submitData, null, 2));
  };

  const handleSelectTK = (maTK) => {
    setForm((f) => ({ ...f, maTK }));
  };

  const handleOtpConfirm = async (mkgd) => {
    setSubmitting(true);
    setOrderResult(null);

    try {
      // Nếu là ATO hoặc ATC thì set giá = null
      const gia =
        form.loaiLenh === "ATO" || form.loaiLenh === "ATC" ? null : form.gia;

      // Xử lý ngày giờ cho ATO/ATC
      let ngay = now;
      if ((form.loaiLenh === "ATO" || form.loaiLenh === "ATC") && atoAtcTime) {
        // now: yyyy-MM-dd HH:mm:ss
        const datePart = now.split(" ")[0];
        ngay = `${datePart} ${atoAtcTime}:00.000`;
      }

      const orderData = {
        maCP: form.maCP,
        ngay: ngay,
        loaiGD: form.loaiGD,
        soLuong: parseInt(form.soLuong),
        gia: gia,
        maTK: form.maTK,
        loaiLenh: form.loaiLenh,
        mkgd: mkgd,
      };

      console.log("Gửi lệnh:", orderData);

      const result = await placeOrder(orderData);

      if (result.success) {
        setOrderResult({
          type: "success",
          message: "Đặt lệnh thành công!",
          data: result.data,
        });
        // Reset form sau khi đặt lệnh thành công
        setForm({
          maCP: MA_CPS[0],
          loaiGD: form.loaiGD,
          soLuong: 0,
          gia: "",
          maTK: MA_TKS[0],
          loaiLenh: LOAI_LENHS[0],
          mkgd: "",
        });
        // Fetch lại pending orders
        fetchPending();
      } else {
        setOrderResult({
          type: "error",
          message: result.message || "Có lỗi xảy ra khi đặt lệnh",
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setOrderResult({
        type: "error",
        message: "Có lỗi xảy ra khi đặt lệnh",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStockSelect = (maCP) => {
    setForm((f) => ({ ...f, maCP }));
  };

  // Kiểm tra xem có phải ATO/ATC không
  const isATOorATC = form.loaiLenh === "ATO" || form.loaiLenh === "ATC";

  // Hàm hủy lệnh
  const handleCancelOrder = (maGD, mkgd) => {
    setCancelLoading(true);
    setCancelResult(null);
    cancelPendingOrder(maGD, mkgd)
      .then((res) => {
        setCancelResult(res);
        if (res.success) {
          // reload lại danh sách lệnh chờ khớp
          fetchPending();
        }
      })
      .catch(() => {
        setCancelResult({ success: false, message: "Lỗi khi hủy lệnh" });
      })
      .finally(() => setCancelLoading(false));
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white dark:bg-[#181c1f] rounded-lg shadow p-6">
      <div className="flex gap-6 flex-col md:flex-row">
        {/* Bên trái: Card đặt lệnh */}
        <div className="md:w-1/2 w-full">
          <div className="flex gap-2 border-b mb-6">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`px-4 py-2 font-medium border-b-2 transition-colors duration-150 ${
                  tab === t.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => handleTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="mb-4 text-center text-lg font-semibold text-blue-700">
            Đặt lệnh cho ngày {now.split(" ")[0]} lúc {now.split(" ")[1]}
          </div>
          {/* Order Result Message */}
          {orderResult && (
            <div
              className={`mb-4 p-3 rounded-lg ${
                orderResult.type === "success"
                  ? "bg-green-100 border border-green-400 text-green-700"
                  : "bg-red-100 border border-red-400 text-red-700"
              }`}
            >
              <div className="font-semibold">
                {orderResult.type === "success" ? "✅ " : "❌ "}
                {orderResult.message}
              </div>
              {orderResult.data && (
                <div className="text-sm mt-1">
                  Mã lệnh: {orderResult.data.maLenh || "N/A"}
                </div>
              )}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setOtpModalOpen(true);
            }}
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Bên trái: 2 card */}
              <div className="flex flex-col gap-4 md:w-1/3">
                {/* Card mã cổ phiếu - sử dụng component mới */}
                <StockPrice
                  selectedStock={form.maCP}
                  onStockSelect={handleStockSelect}
                />
                {/* Card loại lệnh */}
                <div className="bg-slate-50 dark:bg-[#23272b] rounded-lg shadow p-4">
                  <div className="font-semibold mb-2 text-blue-700">
                    Loại lệnh
                  </div>
                  <div className="flex flex-col gap-2">
                    {LOAI_LENHS.map((l) => (
                      <label
                        key={l}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="loaiLenh"
                          value={l}
                          checked={form.loaiLenh === l}
                          onChange={() => handleRadioChange("loaiLenh", l)}
                          className="accent-blue-600"
                        />
                        <span>{l}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              {/* Bên phải: các input còn lại */}
              <div className="flex-1">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">Số lượng</label>
                    <input
                      type="number"
                      name="soLuong"
                      value={form.soLuong}
                      onChange={handleChange}
                      min={1}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">
                      Giá {isATOorATC && "(ATO/ATC - không cần nhập giá)"}
                    </label>
                    <input
                      type="number"
                      name="gia"
                      value={form.gia}
                      onChange={handleChange}
                      className={`w-full border px-3 py-2 rounded ${
                        isATOorATC
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : ""
                      }`}
                      placeholder={
                        isATOorATC
                          ? "Giá sẽ được set tự động"
                          : "Giá hoặc để trống"
                      }
                      disabled={isATOorATC}
                    />
                    {isATOorATC && (
                      <>
                        <div className="text-sm text-gray-500 mt-1">
                          Giá sẽ được set tự động khi đặt lệnh {form.loaiLenh}
                        </div>
                        <div className="mt-2">
                          <label className="block mb-1 font-medium">
                            Chọn giờ đặt lệnh
                          </label>
                          <input
                            type="time"
                            value={atoAtcTime}
                            onChange={(e) => setAtoAtcTime(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            required={isATOorATC}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">
                      Mã tài khoản
                    </label>
                    <button
                      type="button"
                      onClick={() => setOrderModalOpen(true)}
                      className="w-full border px-3 py-2 rounded bg-slate-50 hover:bg-blue-50 text-left font-semibold text-blue-700"
                    >
                      {form.maTK
                        ? `Đã chọn: ${form.maTK}`
                        : "Chọn tài khoản giao dịch"}
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-2 rounded font-semibold mt-4 ${
                      submitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {submitting ? "Đang xử lý..." : "Đặt lệnh"}
                  </button>
                </div>
              </div>
            </div>
          </form>
          <OrderModal
            open={orderModalOpen}
            onClose={() => setOrderModalOpen(false)}
            onSelect={handleSelectTK}
          />
          <OTPModal
            open={otpModalOpen}
            onClose={() => setOtpModalOpen(false)}
            onConfirm={handleOtpConfirm}
          />
        </div>
        {/* Bên phải: Card table lệnh chờ khớp */}
        <div className="md:w-1/2 w-full">
          <div className="bg-slate-50 dark:bg-[#23272b] rounded-lg shadow p-4 h-full">
            <div className="font-semibold mb-2 text-blue-700">
              Lệnh chờ khớp
            </div>
            {cancelResult && (
              <div
                className={`mb-2 p-2 rounded ${
                  cancelResult.success
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {cancelResult.message}
              </div>
            )}
            {pendingLoading ? (
              <div className="text-gray-500 py-4 text-center">Đang tải...</div>
            ) : pendingError ? (
              <div className="text-red-500 py-4 text-center">
                {pendingError}
              </div>
            ) : pendingOrders.length === 0 ? (
              <div className="text-gray-500 py-4 text-center">
                Không có lệnh chờ khớp
              </div>
            ) : (
              <table className="w-full border text-sm table-auto">
                <thead>
                  <tr>
                    <th className="border px-2 py-1 bg-gray-100">Mã GD</th>
                    <th className="border px-2 py-1 bg-gray-100">Ngày GD</th>
                    <th className="border px-2 py-1 bg-gray-100">Mã CP</th>
                    <th className="border px-2 py-1 bg-gray-100">Loại</th>
                    <th className="border px-2 py-1 bg-gray-100">Loại lệnh</th>
                    <th className="border px-2 py-1 bg-gray-100">Số lượng</th>
                    <th className="border px-2 py-1 bg-gray-100">Giá</th>
                    <th className="border px-2 py-1 bg-gray-100">Mã TK</th>
                    <th className="border px-2 py-1 bg-gray-100">Trạng thái</th>
                    <th className="border px-2 py-1 bg-gray-100">Hủy</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((row) => (
                    <tr key={row.MaGD}>
                      <td className="border px-2 py-1">{row.MaGD}</td>
                      <td className="border px-2 py-1">
                        {row.NgayGD?.slice(0, 10)}
                      </td>
                      <td className="border px-2 py-1">{row.MaCP}</td>
                      <td className="border px-2 py-1">
                        {row.LoaiGD === "M"
                          ? "Mua"
                          : row.LoaiGD === "B"
                          ? "Bán"
                          : row.LoaiGD}
                      </td>
                      <td className="border px-2 py-1">{row.LoaiLenh}</td>
                      <td className="border px-2 py-1 text-right">
                        {row.SoLuong}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {row.Gia !== null ? row.Gia.toLocaleString() : "-"}
                      </td>
                      <td className="border px-2 py-1">{row.MaTK}</td>
                      <td className="border px-2 py-1">{row.TrangThai}</td>
                      <td className="border px-2 py-1 text-center">
                        <button
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                          disabled={cancelLoading}
                          onClick={() => setCancelMaGD(row.MaGD)}
                        >
                          Hủy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {/* Modal nhập MKGD để hủy lệnh */}
            <OTPModal
              open={!!cancelMaGD}
              onClose={() => setCancelMaGD(null)}
              onConfirm={(mkgd) => {
                if (cancelMaGD) handleCancelOrder(cancelMaGD, mkgd);
                setCancelMaGD(null);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
