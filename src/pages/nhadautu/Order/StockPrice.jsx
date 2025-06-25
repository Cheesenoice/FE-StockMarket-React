import { useState, useEffect } from "react";
import { getStocks, getStocksPrice } from "../../../api/services/orderService";

const StockPrice = ({ selectedStock, onStockSelect }) => {
  const [stockList, setStockList] = useState([]);
  const [stockFilter, setStockFilter] = useState("");
  const [stockDropdownOpen, setStockDropdownOpen] = useState(false);
  const [priceInfo, setPriceInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStocks = async () => {
      const res = await getStocks();
      if (res.success) setStockList(res.data);
      else setStockList([]);
    };
    fetchStocks();
  }, []);

  useEffect(() => {
    if (selectedStock) {
      fetchStockPrice(selectedStock);
    }
  }, [selectedStock]);

  const fetchStockPrice = async (maCP) => {
    setLoading(true);
    try {
      const res = await getStocksPrice(maCP);
      if (res.success) {
        setPriceInfo(res.data);
      } else {
        setPriceInfo(null);
      }
    } catch (error) {
      console.error("Error fetching stock price:", error);
      setPriceInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStockSelect = (stock) => {
    onStockSelect(stock.MaCP);
    setStockDropdownOpen(false);
  };

  return (
    <div className="bg-slate-50 dark:bg-[#23272b] rounded-lg shadow p-4 relative">
      <div className="font-semibold mb-2 text-blue-700">Mã cổ phiếu</div>
      <div>
        <input
          type="text"
          placeholder="Tìm mã cổ phiếu..."
          className="w-full border px-3 py-2 rounded mb-2"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value.toUpperCase())}
          onFocus={() => setStockDropdownOpen(true)}
          onBlur={() => setTimeout(() => setStockDropdownOpen(false), 150)}
        />
        <div className="relative">
          {stockDropdownOpen && (
            <div className="absolute z-10 w-full bg-white dark:bg-[#23272b] border rounded shadow max-h-48 overflow-y-auto">
              {stockList.filter((s) => s.MaCP.includes(stockFilter)).length ===
                0 && (
                <div className="px-3 py-2 text-gray-400">
                  Không có mã phù hợp
                </div>
              )}
              {stockList
                .filter((s) => s.MaCP.includes(stockFilter))
                .map((s) => (
                  <div
                    key={s.MaCP}
                    className={`px-3 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-slate-700 ${
                      selectedStock === s.MaCP
                        ? "bg-blue-50 dark:bg-slate-800 font-bold"
                        : ""
                    }`}
                    onMouseDown={() => handleStockSelect(s)}
                  >
                    {s.MaCP}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-500">
        Đang chọn:{" "}
        <span className="font-semibold text-blue-700">{selectedStock}</span>
      </div>

      {/* Price Information */}
      {selectedStock && (
        <div className="mt-3 p-3 bg-white dark:bg-[#181c1f] rounded border">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Thông tin giá
          </div>
          {loading ? (
            <div className="text-sm text-gray-500">Đang tải...</div>
          ) : priceInfo ? (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Giá trần:
                </span>
                <span className="font-semibold text-red-600">
                  {priceInfo["Giá trần"]?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Giá tham chiếu:
                </span>
                <span className="font-semibold text-blue-600">
                  {priceInfo["Giá tham chiếu"]?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Giá sàn:
                </span>
                <span className="font-semibold text-green-600">
                  {priceInfo["Giá sàn"]?.toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Không có thông tin giá</div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockPrice;
