import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";
const USERNAME = "NDT01";
const PASSWORD = "123";

function getGiaClass(gia, giaTC, giaTran, giaSan) {
  if (gia == null) return "";
  if (gia === giaTC) return "gia-tc";
  if (gia === giaTran) return "gia-tran";
  if (gia === giaSan) return "gia-san";
  if (gia > giaTC) return "gia-tang";
  if (gia < giaTC) return "gia-giam";
  return "gia-khongdoi";
}

function formatNumber(val) {
  if (typeof val === "number") return val.toLocaleString("vi-VN");
  if (typeof val === "string" && !isNaN(Number(val)))
    return Number(val).toLocaleString("vi-VN");
  return val ?? "";
}

const PriceBoard = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const prevDataRef = useRef({});

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.emit("auth", { username: USERNAME, password: PASSWORD });
    socket.on("bangGiaUpdate", (newData) => {
      setData((old) => {
        prevDataRef.current = {};
        newData.forEach((item) => {
          prevDataRef.current[item.MaCP] = { ...item };
        });
        return newData;
      });
    });
    socket.on("error", (err) => {
      setError(err.message);
    });
    setTimeout(() => {
      socket.emit("requestPriceBoard");
    }, 1000);
    return () => socket.disconnect();
  }, []);

  // Lưu trữ giá trị trước đó để so sánh flash
  const prevData = useRef({});
  useEffect(() => {
    if (data.length > 0) {
      const map = {};
      data.forEach((item) => {
        map[item.MaCP] = { ...item };
      });
      prevData.current = map;
    }
  }, [data]);

  return (
    <div className="mt-8">
      <style>{`
        .gia-tran { color: #d946ef; }
        .gia-san { color: #06b6d4; }
        .gia-tc { color: #facc15; }
        .gia-tang { color: #22c55e; }
        .gia-giam { color: #ef4444; }
        .gia-khongdoi { color: #64748b; }
        .buy-flash { animation: flashBuy 0.7s cubic-bezier(.4,0,.2,1); }
        .sell-flash { animation: flashSell 0.7s cubic-bezier(.4,0,.2,1); }
        @keyframes flashBuy { 0% { background-color: #bbf7d0; } 50% { background-color: #4ade80; } 100% { background-color: transparent; } }
        @keyframes flashSell { 0% { background-color: #fecaca; } 50% { background-color: #f87171; } 100% { background-color: transparent; } }
        .sticky-head th { position: sticky; top: 0; z-index: 1; background: #f1f5f9; }
        @media (max-width: 768px) { .priceboard-table th, .priceboard-table td { padding: 6px !important; font-size: 12px !important; } }
      `}</style>
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        Bảng Giá Trực Tuyến
      </h2>
      {error && <div className="text-red-500 mb-2">Lỗi: {error}</div>}
      <div className="overflow-x-auto">
        <table className="priceboard-table w-full border rounded-lg text-base bg-white dark:bg-[#23272b]">
          <thead className="sticky-head text-gray-900 dark:text-white">
            <tr>
              <th className="px-4 py-3">Mã CP</th>
              <th className="px-4 py-3" title="Giá trần">
                Trần
              </th>
              <th className="px-4 py-3" title="Giá sàn">
                Sàn
              </th>
              <th className="px-4 py-3" title="Giá tham chiếu">
                TC
              </th>
              <th className="px-4 py-3">Giá Mua 1</th>
              <th className="px-4 py-3">KL Mua 1</th>
              <th className="px-4 py-3">Giá Mua 2</th>
              <th className="px-4 py-3">KL Mua 2</th>
              <th className="px-4 py-3">Giá Mua 3</th>
              <th className="px-4 py-3">KL Mua 3</th>
              <th className="px-4 py-3">Giá Bán 1</th>
              <th className="px-4 py-3">KL Bán 1</th>
              <th className="px-4 py-3">Giá Bán 2</th>
              <th className="px-4 py-3">KL Bán 2</th>
              <th className="px-4 py-3">Giá Bán 3</th>
              <th className="px-4 py-3">KL Bán 3</th>
              <th className="px-4 py-3">Giá Khớp</th>
              <th className="px-4 py-3">KL Khớp</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const prev = prevData.current[item.MaCP];
              const giaMua1Changed = prev && prev.GiaMua1 !== item.GiaMua1;
              const soLuongMua1Changed =
                prev && prev.SoLuongMua1 !== item.SoLuongMua1;
              const giaBan1Changed = prev && prev.GiaBan1 !== item.GiaBan1;
              const soLuongBan1Changed =
                prev && prev.SoLuongBan1 !== item.SoLuongBan1;
              return (
                <tr
                  key={item.MaCP}
                  data-ma-cp={item.MaCP}
                  className="hover:bg-slate-100 dark:hover:bg-[#23272b] transition-colors text-base leading-relaxed"
                >
                  <td className="font-semibold px-4 py-2">{item.MaCP}</td>
                  <td className="gia-tran px-4 py-2">
                    {formatNumber(item.GiaTran)}
                  </td>
                  <td className="gia-san px-4 py-2">
                    {formatNumber(item.GiaSan)}
                  </td>
                  <td className="gia-tc px-4 py-2">
                    {formatNumber(item.GiaTC)}
                  </td>
                  <td
                    className={`${getGiaClass(
                      item.GiaMua1,
                      item.GiaTC,
                      item.GiaTran,
                      item.GiaSan
                    )} ${giaMua1Changed ? " buy-flash" : ""} px-4 py-2`}
                  >
                    {formatNumber(item.GiaMua1)}
                  </td>
                  <td
                    className={`${
                      soLuongMua1Changed ? "buy-flash" : ""
                    } px-4 py-2`}
                  >
                    {formatNumber(item.SoLuongMua1)}
                  </td>
                  <td
                    className={`${getGiaClass(
                      item.GiaMua2,
                      item.GiaTC,
                      item.GiaTran,
                      item.GiaSan
                    )} px-4 py-2`}
                  >
                    {formatNumber(item.GiaMua2)}
                  </td>
                  <td className="px-4 py-2">
                    {formatNumber(item.SoLuongMua2)}
                  </td>
                  <td
                    className={`${getGiaClass(
                      item.GiaMua3,
                      item.GiaTC,
                      item.GiaTran,
                      item.GiaSan
                    )} px-4 py-2`}
                  >
                    {formatNumber(item.GiaMua3)}
                  </td>
                  <td className="px-4 py-2">
                    {formatNumber(item.SoLuongMua3)}
                  </td>
                  <td
                    className={`${getGiaClass(
                      item.GiaBan1,
                      item.GiaTC,
                      item.GiaTran,
                      item.GiaSan
                    )} ${giaBan1Changed ? " sell-flash" : ""} px-4 py-2`}
                  >
                    {formatNumber(item.GiaBan1)}
                  </td>
                  <td
                    className={`${
                      soLuongBan1Changed ? "sell-flash" : ""
                    } px-4 py-2`}
                  >
                    {formatNumber(item.SoLuongBan1)}
                  </td>
                  <td
                    className={`${getGiaClass(
                      item.GiaBan2,
                      item.GiaTC,
                      item.GiaTran,
                      item.GiaSan
                    )} px-4 py-2`}
                  >
                    {formatNumber(item.GiaBan2)}
                  </td>
                  <td className="px-4 py-2">
                    {formatNumber(item.SoLuongBan2)}
                  </td>
                  <td
                    className={`${getGiaClass(
                      item.GiaBan3,
                      item.GiaTC,
                      item.GiaTran,
                      item.GiaSan
                    )} px-4 py-2`}
                  >
                    {formatNumber(item.GiaBan3)}
                  </td>
                  <td className="px-4 py-2">
                    {formatNumber(item.SoLuongBan3)}
                  </td>
                  <td
                    className={`${getGiaClass(
                      item.GiaKhop,
                      item.GiaTC,
                      item.GiaTran,
                      item.GiaSan
                    )} px-4 py-2`}
                  >
                    {formatNumber(item.GiaKhop)}
                  </td>
                  <td className="px-4 py-2">
                    {formatNumber(item.SoLuongKhop)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceBoard;
