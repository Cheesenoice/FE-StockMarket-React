import { useEffect, useState } from "react";
import {
  getStocks,
  addStock,
  updateStock,
  deleteStock,
  undoStockAction,
  redoStockAction,
} from "../../api/services/nhanvienService";

const Modal = ({ open, onClose, onSubmit, form, setForm, editMode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md min-w-[320px] relative">
        <h3 className="text-lg font-bold mb-4">
          {editMode ? "Sửa cổ phiếu" : "Thêm cổ phiếu"}
        </h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            name="MaCP"
            value={form.MaCP}
            onChange={(e) => setForm((f) => ({ ...f, MaCP: e.target.value }))}
            placeholder="Mã CP"
            className="border px-2 py-1 rounded"
            disabled={editMode}
            required
          />
          <input
            name="TenCty"
            value={form.TenCty}
            onChange={(e) => setForm((f) => ({ ...f, TenCty: e.target.value }))}
            placeholder="Tên công ty"
            className="border px-2 py-1 rounded"
            required
          />
          <input
            name="DiaChi"
            value={form.DiaChi}
            onChange={(e) => setForm((f) => ({ ...f, DiaChi: e.target.value }))}
            placeholder="Địa chỉ"
            className="border px-2 py-1 rounded"
            required
          />
          <input
            name="SoLuongPH"
            value={form.SoLuongPH}
            onChange={(e) =>
              setForm((f) => ({ ...f, SoLuongPH: e.target.value }))
            }
            placeholder="Số lượng phát hành"
            type="number"
            min="0"
            className="border px-2 py-1 rounded"
            required
          />
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              {editMode ? "Lưu" : "Thêm"}
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-3 py-1 rounded"
              onClick={onClose}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StockManagement = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    MaCP: "",
    TenCty: "",
    DiaChi: "",
    SoLuongPH: "",
  });
  const [editMaCP, setEditMaCP] = useState(null);
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    const res = await getStocks();
    if (res.success) setStocks(res.data);
    else setError(res.message);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setForm({ MaCP: "", TenCty: "", DiaChi: "", SoLuongPH: "" });
    setEditMaCP(null);
    setEditMode(false);
    setModalOpen(true);
  };

  const openEditModal = (stock) => {
    setForm({
      MaCP: stock.MaCP,
      TenCty: stock.TenCty,
      DiaChi: stock.DiaChi,
      SoLuongPH: stock.SoLuongPH,
    });
    setEditMaCP(stock.MaCP);
    setEditMode(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditMaCP(null);
    setEditMode(false);
    setForm({ MaCP: "", TenCty: "", DiaChi: "", SoLuongPH: "" });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (editMode && editMaCP) {
      // Sửa
      const res = await updateStock(editMaCP, {
        TenCty: form.TenCty,
        DiaChi: form.DiaChi,
        SoLuongPH: Number(form.SoLuongPH),
      });
      if (res.success) {
        setMessage("Sửa thành công!");
        closeModal();
        fetchData();
      } else setMessage(res.message);
    } else {
      // Thêm
      const res = await addStock({
        MaCP: form.MaCP,
        TenCty: form.TenCty,
        DiaChi: form.DiaChi,
        SoLuongPH: Number(form.SoLuongPH),
      });
      if (res.success) {
        setMessage("Thêm thành công!");
        closeModal();
        fetchData();
      } else setMessage(res.message);
    }
  };

  const handleDelete = async (maCP) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    const res = await deleteStock(maCP);
    if (res.success) {
      setMessage("Xóa thành công!");
      fetchData();
    } else setMessage(res.message);
  };

  const handleUndo = async () => {
    const res = await undoStockAction();
    if (res.success) {
      setMessage("Hoàn tác thành công!");
      fetchData();
    } else setMessage(res.message);
  };

  const handleRedo = async () => {
    const res = await redoStockAction();
    if (res.success) {
      setMessage("Làm lại thành công!");
      fetchData();
    } else setMessage(res.message);
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Quản lý cổ phiếu</h2>
      <div className="mb-4">
        <button
          onClick={openAddModal}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Thêm cổ phiếu
        </button>
      </div>
      <div className="mb-2 flex gap-2">
        <button
          onClick={handleUndo}
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Undo
        </button>
        <button
          onClick={handleRedo}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Redo
        </button>
      </div>
      {message && <div className="mb-2 text-blue-600">{message}</div>}
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Mã CP</th>
            <th className="border px-4 py-2">Tên công ty</th>
            <th className="border px-4 py-2">Địa chỉ</th>
            <th className="border px-4 py-2">Số lượng phát hành</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.MaCP}>
              <td className="border px-4 py-2">{stock.MaCP}</td>
              <td className="border px-4 py-2">{stock.TenCty}</td>
              <td className="border px-4 py-2">{stock.DiaChi}</td>
              <td className="border px-4 py-2">
                {stock.SoLuongPH.toLocaleString()}
              </td>
              <td className="border px-4 py-2 flex gap-2">
                <button
                  className="bg-blue-400 text-white px-2 py-1 rounded"
                  onClick={() => openEditModal(stock)}
                >
                  Sửa
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(stock.MaCP)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        form={form}
        setForm={setForm}
        editMode={editMode}
      />
    </div>
  );
};

export default StockManagement;
