import { useEffect, useState } from "react";
import {
  getAccounts,
  getAccountDetail,
} from "../../api/services/accountService";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
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
  }, []);

  const handleViewDetail = async (maTK) => {
    setSelected(maTK);
    setDetailLoading(true);
    const res = await getAccountDetail(maTK);
    if (res.success) setDetail(res.data);
    else setDetail(null);
    setDetailLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Danh sách tài khoản</h2>
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
                <td className="border px-2 py-1 text-center">
                  <button
                    className="text-blue-600 hover:underline flex items-center gap-1 mx-auto"
                    onClick={() =>
                      navigate(`/nhadautu/account/detail/${acc.MaTK}`)
                    }
                  >
                    <Eye className="w-4 h-4" /> Xem chi tiết
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
    </div>
  );
};

export default Account;
