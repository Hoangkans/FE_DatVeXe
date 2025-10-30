import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import "../../styles/AdminManageStation.css";

export default function ManageStation() {
  const [query, setQuery] = useState("");
  const initialRows = useMemo(() => [], []);

  const [rows, setRows] = useState(initialRows);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", city: "", address: "", type: "Liên tỉnh", capacity: 100, status: "active" });
  const [errors, setErrors] = useState({});

  const filtered = rows.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      r.name.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q)
    );
  });

  function openAdd() {
    setIsEdit(false);
    setEditingId(null);
    setForm({ name: "", city: "", address: "", type: "Liên tỉnh", capacity: 100, status: "active" });
    setErrors({});
    setShowModal(true);
  }

  function openEdit(r) {
    setIsEdit(true);
    setEditingId(r.id);
    setForm({ name: r.name, city: r.city, address: r.address, type: r.type, capacity: r.capacity.total, status: r.status });
    setErrors({});
    setShowModal(true);
  }

  function removeRow(r) {
    if (window.confirm(`Xóa bến xe "${r.name}"?`)) setRows(rows.filter((x) => x.id !== r.id));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập tên bến xe";
    if (!form.address.trim()) e.address = "Vui lòng nhập địa chỉ";
    if (!form.city.trim()) e.city = "Vui lòng nhập tỉnh/thành";
    if (!form.capacity || Number(form.capacity) <= 0) e.capacity = "Sức chứa phải > 0";
    return e;
  }

  function submit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    if (isEdit && editingId != null) {
      setRows(
        rows.map((r) =>
          r.id === editingId ? { ...r, name: form.name, city: form.city, address: form.address, type: form.type, capacity: { used: 0, total: Number(form.capacity) }, status: form.status } : r
        )
      );
      setShowModal(false);
      return;
    }
    const nextId = Math.max(0, ...rows.map((r) => r.id)) + 1;
    setRows([
      ...rows,
      { id: nextId, name: form.name, city: form.city, address: form.address, type: form.type, capacity: { used: 0, total: Number(form.capacity) }, status: form.status },
    ]);
    setShowModal(false);
  }

  // Stats card removed

  return (
    <div className="manage-station">
      <div className="head">
        <div className="title">Quản lý bến xe</div>
        <div className="sub">Quản lý thông tin các bến xe trong hệ thống</div>
      </div>

      <div className="toolbar">
        <div className="search">
          <SearchIcon className="search-icon" fontSize="small" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm kiếm bến xe theo tên, địa chỉ, tỉnh thành..." />
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <AddIcon fontSize="small" />
          <span>Thêm bến xe</span>
        </button>
      </div>

      <div className="table-wrap">
        <table className="station-table">
          <thead>
            <tr>
              <th>Tên bến xe</th>
              <th>Địa chỉ</th>
              <th>Loại bến</th>
              <th>Sức chứa</th>
              <th>Trạng thái</th>
              <th style={{ width: 120 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const percent = r.capacity.total ? Math.round((r.capacity.used / r.capacity.total) * 100) : 0;
              return (
                <tr key={r.id}>
                  <td>
                    <div className="station-name">{r.name}</div>
                    <div className="station-city">{r.city}</div>
                  </td>
                  <td>
                    <div>{r.address}</div>
                  </td>
                  <td>{r.type}</td>
                  <td>
                    <div>{r.capacity.used} / {r.capacity.total}</div>
                    <div className="progress"><span style={{ width: `${percent}%` }} /></div>
                    <div className="muted">{percent}% đã sử dụng</div>
                  </td>
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
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Stats section removed per request */}

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">{isEdit ? "Sửa bến xe" : "Thêm bến xe"}</div>
            <div className="modal-sub">{isEdit ? "Cập nhật thông tin bến xe" : "Nhập thông tin bến xe vào hệ thống"}</div>
            <div className="form-grid">
              <label>
                <span>Tên bến xe</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="VD: Bến xe ABC" />
                {errors.name && <div className="field-error">{errors.name}</div>}
              </label>
              <label>
                <span>Tỉnh/Thành</span>
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="VD: TP. Hồ Chí Minh" />
                {errors.city && <div className="field-error">{errors.city}</div>}
              </label>
              <label>
                <span>Địa chỉ</span>
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Số nhà, đường, phường, quận" />
                {errors.address && <div className="field-error">{errors.address}</div>}
              </label>
              <label>
                <span>Loại bến</span>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option>Liên tỉnh</option>
                  <option>Nội thành</option>
                </select>
              </label>
              <label>
                <span>Sức chứa (tổng)</span>
                <input type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
                {errors.capacity && <div className="field-error">{errors.capacity}</div>}
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
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn-primary" onClick={submit}>{isEdit ? "Lưu" : "Thêm"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
