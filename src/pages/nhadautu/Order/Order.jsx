import { useState, useEffect } from "react";
import { getStocks, placeOrder } from "../../../api/services/orderService";
import OrderModal from "./OrderModal";
import StockPrice from "./StockPrice";

const TABS = [
  { key: "mua", label: "Đặt lệnh Mua" },
  { key: "ban", label: "Đặt lệnh Bán" },
];

const MA_CPS = ["AAA", "BBB", "CCC"]; // Tạm hardcode
const MA_TKS = ["TK01", "TK02"]; // Tạm hardcode
const LOAI_LENHS = ["LO", "ATO", "ATC"];

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

      const orderData = {
        maCP: form.maCP,
        ngay: now,
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

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white dark:bg-[#181c1f] rounded-lg shadow p-6">
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
              <div className="font-semibold mb-2 text-blue-700">Loại lệnh</div>
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
                    isATOorATC ? "Giá sẽ được set tự động" : "Giá hoặc để trống"
                  }
                  disabled={isATOorATC}
                />
                {isATOorATC && (
                  <div className="text-sm text-gray-500 mt-1">
                    Giá sẽ được set tự động khi đặt lệnh {form.loaiLenh}
                  </div>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">Mã tài khoản</label>
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
  );
};

export default Order;
