import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import "../../styles/AdminManageBusList.css";

export default function ManagerBusList() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialRows = useMemo(
    () => [
      { id: 1, name: "Xe khách 01", plate: "51A-12345", desc: "Giường nằm 40 chỗ", capacity: 40, companyId: 10, createdAt: "2025-10-01", updatedAt: "2025-10-20" },
      { id: 2, name: "Xe ký 01", plate: "51B-67890", desc: "Ghế ngồi 45 chỗ", capacity: 45, companyId: 11, createdAt: "2025-09-22", updatedAt: "2025-10-19" },
      { id: 3, name: "Xe khách 02", plate: "51C-11111", desc: "Ghế ngồi 35 chỗ", capacity: 35, companyId: 10, createdAt: "2025-09-15", updatedAt: "2025-10-18" },
    ],
    []
  );

  const [rows, setRows] = useState(initialRows);
  const [form, setForm] = useState({ name: "", plate: "", desc: "", capacity: "", companyId: "" });
  const [errors, setErrors] = useState({});

  function openAdd() {
    setIsEdit(false);
    setEditingId(null);
    setForm({ name: "", plate: "", desc: "", capacity: "", companyId: "" });
    setErrors({});
    setShowModal(true);
  }

  function openEdit(r) {
    setIsEdit(true);
    setEditingId(r.id);
    setForm({ name: r.name, plate: r.plate, desc: r.desc, capacity: r.capacity, companyId: r.companyId });
    setErrors({});
    setShowModal(true);
  }

  function removeRow(r) {
    if (window.confirm(`Xóa xe "${r.name}" (${r.plate})?`)) setRows(rows.filter((x) => x.id !== r.id));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập tên xe";
    if (!form.plate.trim()) e.plate = "Vui lòng nhập biển số";
    if (form.capacity === "" || Number(form.capacity) <= 0) e.capacity = "Sức chứa > 0";
    if (form.companyId === "") e.companyId = "Nhập company ID";
    return e;
  }

  function submit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    const now = new Date().toISOString().slice(0, 10);
    if (isEdit && editingId != null) {
      setRows(rows.map((r) => (r.id === editingId ? { ...r, ...form, capacity: Number(form.capacity), companyId: Number(form.companyId), updatedAt: now } : r)));
      setShowModal(false);
      return;
    }
    const nextId = Math.max(0, ...rows.map((r) => r.id)) + 1;
    setRows([{ id: nextId, ...form, capacity: Number(form.capacity), companyId: Number(form.companyId), createdAt: now, updatedAt: now }, ...rows]);
    setShowModal(false);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows.filter((r) => {
      const matches = !q ||
        r.id.toString().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.plate.toLowerCase().includes(q) ||
        r.companyId.toString().includes(q);
      return matches;
    });
    list = [...list].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      const av = a[sortBy];
      const bv = b[sortBy];
      return av > bv ? dir : av < bv ? -dir : 0;
    });
    return list;
  }, [rows, query, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageSafe = Math.min(page, totalPages);
  const start = (pageSafe - 1) * perPage;
  const end = start + perPage;
  const paged = filtered.slice(start, end);

  function toggleSort(key) {
    if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(key); setSortDir("asc"); }
  }

  function sortLabel(key, label) {
    return (
      <span style={{cursor:'pointer'}} onClick={() => toggleSort(key)}>{label}</span>
    );
  }

  return (
    <div className="manage-buslist">
      <div className="head">
        <div className="title">Quản lý xe</div>
        <div className="sub">Quản lý thông tin các xe buýt trong hệ thống</div>
      </div>

      <div className="toolbar">
        <div className="search">
          <SearchIcon className="search-icon" fontSize="small" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Tìm kiếm theo ID, tên xe, biển số, company ID..." />
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <AddIcon fontSize="small" />
          <span>Thêm xe</span>
        </button>
      </div>

      <div className="table-wrap">
        <table className="buslist-table">
          <thead>
            <tr>
              <th>{sortLabel("id", "ID")}</th>
              <th>{sortLabel("name", "Tên xe")}</th>
              <th>{sortLabel("plate", "Biển số")}</th>
              <th>Mô tả</th>
              <th>{sortLabel("capacity", "Sức chứa")}</th>
              <th>{sortLabel("companyId", "Company ID")}</th>
              <th>{sortLabel("createdAt", "Ngày tạo")}</th>
              <th>{sortLabel("updatedAt", "Cập nhật")}</th>
              <th style={{ width: 120 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td className="mono">{r.plate}</td>
                <td>{r.desc}</td>
                <td>{r.capacity}</td>
                <td>{r.companyId}</td>
                <td>{r.createdAt}</td>
                <td>{r.updatedAt}</td>
                <td>
                  <div className="row-actions">
                    <button className="btn-ghost" onClick={() => openEdit(r)}><EditIcon fontSize="inherit" /><span>Sửa</span></button>
                    <button className="btn-danger" onClick={() => removeRow(r)}><DeleteIcon fontSize="inherit" /><span>Xóa</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty">Hiển thị 1 - 0 trong tổng số 0 xe</div>}
        {filtered.length > 0 && (
          <div className="table-footer">
            <div className="info">Hiển thị {start + 1} - {Math.min(end, filtered.length)} trong tổng số {filtered.length} xe</div>
            <div className="pager">
              <button className="btn-page" disabled={pageSafe <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>&lt;</button>
              <div className="page-text">Trang {pageSafe} / {totalPages}</div>
              <button className="btn-page" disabled={pageSafe >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>&gt;</button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">{isEdit ? "Sửa xe" : "Thêm xe"}</div>
            <div className="modal-sub">{isEdit ? "Cập nhật thông tin xe" : "Nhập thông tin xe vào hệ thống"}</div>
            <div className="form-grid">
              <label>
                <span>Tên xe</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="VD: Xe khách 01" />
                {errors.name && <div className="field-error">{errors.name}</div>}
              </label>
              <label>
                <span>Biển số</span>
                <input value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} placeholder="VD: 51A-12345" />
                {errors.plate && <div className="field-error">{errors.plate}</div>}
              </label>
              <label>
                <span>Mô tả</span>
                <input value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="VD: Ghế ngồi 45 chỗ" />
              </label>
              <label>
                <span>Sức chứa</span>
                <input type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
                {errors.capacity && <div className="field-error">{errors.capacity}</div>}
              </label>
              <label>
                <span>Company ID</span>
                <input value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })} placeholder="VD: 10" />
                {errors.companyId && <div className="field-error">{errors.companyId}</div>}
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

