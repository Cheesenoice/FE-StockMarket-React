import { useEffect, useState } from "react";
import { getAccounts } from "../../../api/services/accountService";

const OrderModal = ({ open, onClose, onSelect }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedTK, setSelectedTK] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setSelectedTK("");
      setError("");
      setLoading(true);
      getAccounts().then((res) => {
        if (res.success) setAccounts(res.data);
        else setAccounts([]);
        setLoading(false);
      });
    }
  }, [open]);

  const handleDone = () => {
    if (!selectedTK) {
      setError("Vui lòng chọn tài khoản!");
      return;
    }
    setError("");
    onSelect(selectedTK);
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
        <h2 className="text-lg font-bold mb-4">Chọn tài khoản giao dịch</h2>
        {loading ? (
          <div>Đang tải...</div>
        ) : accounts.length === 0 ? (
          <div className="text-gray-500">Không có tài khoản</div>
        ) : (
          <div className="flex flex-col gap-2 mb-4 max-h-60 overflow-y-auto">
            {accounts.map((acc) => (
              <label
                key={acc.MaTK}
                className="flex items-center gap-2 cursor-pointer border rounded px-3 py-2 hover:bg-blue-50"
              >
                <input
                  type="radio"
                  name="maTK"
                  value={acc.MaTK}
                  checked={selectedTK === acc.MaTK}
                  onChange={() => setSelectedTK(acc.MaTK)}
                  className="accent-blue-600"
                />
                <span className="font-semibold text-blue-700">{acc.MaTK}</span>
                <span className="text-gray-500">({acc.MaNDT})</span>
              </label>
            ))}
          </div>
        )}
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold mt-2"
          onClick={handleDone}
          disabled={loading}
        >
          Xong
        </button>
      </div>
    </div>
  );
};

export default OrderModal;
