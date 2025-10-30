import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
// From .../components/admin/ManageBus to .../shared/styles
import "../../styles/AdminManageBus.css";

export default function ManageBus() {
  const [query, setQuery] = useState("");
  const initialRows = useMemo(() => [], []);
  const [rows, setRows] = useState(initialRows);
  const [showAdd, setShowAdd] = useState(false); // modal visible
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", type: "", plate: "", brand: "", color: "", status: "active" });
  const [errors, setErrors] = useState({});

  const filtered = rows.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      r.name.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q) ||
      r.plate.toLowerCase().includes(q) ||
      r.brand.toLowerCase().includes(q)
    );
  });

  function openAdd() {
    setForm({ name: "", type: "", plate: "", brand: "", color: "", status: "active" });
    setErrors({});
    setIsEdit(false);
    setEditingId(null);
    setShowAdd(true);
  }

  function openEdit(row) {
    setForm({ name: row.name, type: row.type, plate: row.plate, brand: row.brand, color: row.color, status: row.status });
    setErrors({});
    setIsEdit(true);
    setEditingId(row.id);
    setShowAdd(true);
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập tên xe";
    if (!form.type.trim()) e.type = "Vui lòng nhập loại xe";
    if (!form.plate.trim()) e.plate = "Vui lòng nhập biển số";
    return e;
  }

  function submitAdd() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    if (isEdit && editingId != null) {
      setRows(rows.map(r => (r.id === editingId ? { ...r, ...form } : r)));
      setShowAdd(false);
      return;
    }
    const nextId = Math.max(0, ...rows.map(r => r.id)) + 1;
    setRows([...rows, { id: nextId, ...form }]);
    setShowAdd(false);
  }

  function removeRow(row) {
    if (window.confirm(`Xóa xe "${row.name}" (${row.plate})?`)) {
      setRows(rows.filter(r => r.id !== row.id));
    }
  }

  return (
    <div className="manage-bus">
      <div className="toolbar">
        <div className="search">
          <SearchIcon className="search-icon" fontSize="small" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên, biển số, hãng xe..."
          />
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <AddIcon fontSize="small" />
          <span>Thêm xe mới</span>
        </button>
      </div>

      <div className="table-wrap">
        <table className="bus-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên xe</th>
              <th>Loại xe</th>
              <th>Biển số</th>
              <th>Hãng xe</th>
              <th>Màu sắc</th>
              <th>Trạng thái</th>
              <th style={{ width: 120 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, idx) => (
              <tr key={r.id}>
                <td>{idx + 1}</td>
                <td>{r.name}</td>
                <td>{r.type}</td>
                <td>{r.plate}</td>
                <td>{r.brand}</td>
                <td>{r.color}</td>
                <td>
                  <span className={`status-badge ${r.status === "active" ? "is-active" : "is-maintenance"}`}>
                    {r.status === "active" ? "Hoạt động" : "Bảo trì"}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <button className="btn-ghost" onClick={() => openEdit(r)}>
                      <EditIcon fontSize="inherit" />
                      <span>Sửa</span>
                    </button>
                    <button className="btn-danger" onClick={() => removeRow(r)}>
                      <DeleteIcon fontSize="inherit" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">{isEdit ? "Sửa xe" : "Thêm xe mới"}</div>
            <div className="modal-sub">{isEdit ? "Cập nhật thông tin xe" : "Nhập thông tin xe mới vào hệ thống"}</div>
            <div className="form-grid">
              <label>
                <span>Tên xe</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Xe tải 01"
                />
                {errors.name && <div className="field-error">{errors.name}</div>}
              </label>
              <label>
                <span>Loại xe</span>
                <input
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  placeholder="VD: Xe tải, Xe khách"
                />
                {errors.type && <div className="field-error">{errors.type}</div>}
              </label>
              <label>
                <span>Biển số xe</span>
                <input
                  value={form.plate}
                  onChange={(e) => setForm({ ...form, plate: e.target.value })}
                  placeholder="VD: 51A-12345"
                />
                {errors.plate && <div className="field-error">{errors.plate}</div>}
              </label>
              <label>
                <span>Hãng xe</span>
                <input
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  placeholder="VD: Hyundai, Thaco"
                />
              </label>
              <label>
                <span>Màu sắc</span>
                <input
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  placeholder="VD: Trắng, Xanh"
                />
              </label>
              <label>
                <span>Trạng thái</span>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Hoạt động</option>
                  <option value="maintenance">Bảo trì</option>
                </select>
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowAdd(false)}>Hủy</button>
              <button className="btn-primary" onClick={submitAdd}>{isEdit ? "Lưu" : "Thêm mới"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
