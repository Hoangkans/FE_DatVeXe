import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import "../../styles/AdminManagePaymentProvider.css";

export default function ManagerPaymentProvider() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialRows = useMemo(() => [], []);

  const [rows, setRows] = useState(initialRows);

  const [form, setForm] = useState({ name: "", type: "wallet", api: "" });
  const [errors, setErrors] = useState({});

  function openAdd() {
    setIsEdit(false);
    setEditingId(null);
    setForm({ name: "", type: "wallet", api: "" });
    setErrors({});
    setShowModal(true);
  }

  function openEdit(r) {
    setIsEdit(true);
    setEditingId(r.id);
    setForm({ name: r.name, type: r.type, api: r.api });
    setErrors({});
    setShowModal(true);
  }

  function removeRow(r) {
    if (window.confirm(`Xóa nhà cung cấp #${r.id}?`))
      setRows(rows.filter((x) => x.id !== r.id));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập tên nhà cung cấp";
    if (form.name && form.name.length > 80) e.name = "Tên tối đa 80 ký tự";
    if (!form.api.trim()) e.api = "Vui lòng nhập API endpoint";
    if (form.api && form.api.length > 255) e.api = "API endpoint tối đa 255 ký tự";
    if (!form.type) e.type = "Chọn loại thanh toán";
    return e;
  }

  function submit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    const now = new Date();
    const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    if (isEdit && editingId != null) {
      setRows(rows.map((r) => (r.id === editingId ? { ...r, name: form.name, type: form.type, api: form.api, updatedAt: ts } : r)));
      setShowModal(false);
      return;
    }
    const nextId = Math.max(0, ...rows.map((r) => r.id)) + 1;
    setRows([{ id: nextId, name: form.name, type: form.type, api: form.api, createdAt: ts, updatedAt: ts }, ...rows]);
    setShowModal(false);
  }

  function typeBadge(type) {
    const map = {
      card: { label: "Thẻ tín dụng", cls: "type-card" },
      wallet: { label: "Ví điện tử", cls: "type-wallet" },
      bankqr: { label: "Chuyển khoản/Mã QR", cls: "type-bankqr" },
    };
    const t = map[type] || { label: type, cls: "" };
    return <span className={`type-badge ${t.cls}`}>{t.label}</span>;
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows.filter((r) => {
      const matches = !q ||
        r.id?.toString().includes(q) ||
        (r.name || "").toLowerCase().includes(q) ||
        (r.type || "").toLowerCase().includes(q) ||
        (r.api || "").toLowerCase().includes(q);
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
      <span style={{ cursor: 'pointer' }} onClick={() => toggleSort(key)}>{label}</span>
    );
  }

  return (
    <div className="manage-payment-provider">
      <div className="head">
        <div className="title">Quản lý nhà cung cấp thanh toán</div>
        <div className="sub">Quản lý các nhà cung cấp dịch vụ thanh toán trong hệ thống</div>
      </div>

      <div className="toolbar">
        <div className="search">
          <SearchIcon className="search-icon" fontSize="small" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Tìm kiếm theo ID, tên, loại, API endpoint..." />
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <AddIcon fontSize="small" />
          <span>Thêm nhà cung cấp</span>
        </button>
      </div>

      <div className="table-wrap">
        <table className="provider-table">
          <thead>
            <tr>
              <th>{sortLabel("id", "ID")}</th>
              <th>{sortLabel("name", "Tên nhà cung cấp")}</th>
              <th>{sortLabel("type", "Loại thanh toán")}</th>
              <th>{sortLabel("api", "API Endpoint")}</th>
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
                <td>{typeBadge(r.type)}</td>
                <td className="mono">{r.api}</td>
                <td className="nowrap">{r.createdAt}</td>
                <td className="nowrap">{r.updatedAt}</td>
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
        {filtered.length === 0 && (
          <div className="empty">Hiển thị 1 - 0 trong tổng số 0 nhà cung cấp</div>
        )}
        {filtered.length > 0 && (
          <div className="table-footer">
            <div className="info">Hiển thị {start + 1} - {Math.min(end, filtered.length)} trong tổng số {filtered.length} nhà cung cấp</div>
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
            <div className="modal-header">{isEdit ? "Sửa nhà cung cấp" : "Thêm nhà cung cấp mới"}</div>
            <div className="modal-sub">{isEdit ? "Cập nhật thông tin nhà cung cấp thanh toán" : "Nhập thông tin nhà cung cấp thanh toán"}</div>
            <div className="form-grid">
              <label>
                <span>Tên nhà cung cấp *</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="VD: VNPay" />
                {errors.name ? <div className="field-error">{errors.name}</div> : <div className="field-hint">Tối đa 80 ký tự.</div>}
              </label>
              <label>
                <span>Loại thanh toán *</span>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="card">Thẻ tín dụng</option>
                  <option value="wallet">Ví điện tử</option>
                  <option value="bankqr">Chuyển khoản/Mã QR</option>
                </select>
                {errors.type ? <div className="field-error">{errors.type}</div> : <div className="field-hint">Chọn loại dịch vụ thanh toán.</div>}
              </label>
              <label style={{ gridColumn: '1 / span 2' }}>
                <span>API Endpoint *</span>
                <input value={form.api} onChange={(e) => setForm({ ...form, api: e.target.value })} placeholder="https://api.example.com/v1" />
                {errors.api ? <div className="field-error">{errors.api}</div> : <div className="field-hint">Đường dẫn đầy đủ đến API. Tối đa 255 ký tự.</div>}
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn-primary" onClick={submit}>{isEdit ? "Lưu" : "Thêm mới"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
