import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import "../../styles/AdminManageBanner.css";

export default function ManagerBanner() {
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
      // Sample data; replace with API data
      // { id: 1, image: "/banner1.jpg", url: "https://example.com/1", position: "homepage-top", createdAt: "2025-10-25", updatedAt: "2025-10-27" },
    ],
    []
  );

  const [rows, setRows] = useState(initialRows);
  // Form chỉ gồm 2 trường theo thiết kế: url banner và vị trí hiển thị
  const [form, setForm] = useState({ url: "", position: "" });
  const [errors, setErrors] = useState({});

  function openAdd() {
    setIsEdit(false);
    setEditingId(null);
    setForm({ url: "", position: "" });
    setErrors({});
    setShowModal(true);
  }

  function openEdit(r) {
    setIsEdit(true);
    setEditingId(r.id);
    setForm({ url: r.url || "", position: r.position || "" });
    setErrors({});
    setShowModal(true);
  }

  function removeRow(r) {
    if (window.confirm(`Xóa banner #${r.id}?`)) setRows(rows.filter((x) => x.id !== r.id));
  }

  function validate() {
    const e = {};
    if (!form.url.trim()) e.url = "Vui lòng nhập URL banner";
    if (form.url && form.url.length > 255) e.url = "URL tối đa 255 ký tự";
    if (!form.position.trim()) e.position = "Vui lòng nhập vị trí hiển thị";
    if (form.position && form.position.length > 100) e.position = "Vị trí tối đa 100 ký tự";
    return e;
  }

  function submit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    const now = new Date().toISOString().slice(0, 10);
    if (isEdit && editingId != null) {
      setRows(rows.map((r) => (r.id === editingId ? { ...r, url: form.url, image: form.url, position: form.position, updatedAt: now } : r)));
      setShowModal(false);
      return;
    }
    const nextId = Math.max(0, ...rows.map((r) => r.id)) + 1;
    setRows([{ id: nextId, url: form.url, image: form.url, position: form.position, createdAt: now, updatedAt: now }, ...rows]);
    setShowModal(false);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows.filter((r) => {
      const matches = !q ||
        r.id?.toString().includes(q) ||
        (r.image || "").toLowerCase().includes(q) ||
        (r.url || "").toLowerCase().includes(q) ||
        (r.position || "").toLowerCase().includes(q);
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
    <div className="manage-banner">
      <div className="head">
        <div className="title">Quản lý Banner</div>
        <div className="sub">Quản lý các banner quảng cáo hiển thị trên website</div>
      </div>

      <div className="toolbar">
        <div className="search">
          <SearchIcon className="search-icon" fontSize="small" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Tìm kiếm theo ID, URL, vị trí..." />
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <AddIcon fontSize="small" />
          <span>Thêm banner</span>
        </button>
      </div>

      <div className="table-wrap">
        <table className="banner-table">
          <thead>
            <tr>
              <th>{sortLabel("id", "ID")}</th>
              <th>Hình ảnh</th>
              <th>{sortLabel("url", "Banner URL")}</th>
              <th>{sortLabel("position", "Vị trí hiển thị")}</th>
              <th style={{ width: 120 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>
                  {r.image || r.url ? (
                    <img src={r.image || r.url} alt="banner" className="banner-thumb" />
                  ) : (
                    <span className="muted">(không có ảnh)</span>
                  )}
                </td>
                <td className="mono">{r.url}</td>
                <td>{r.position}</td>
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
          <div className="empty">Hiển thị 1 - 0 trong tổng số 0 banner</div>
        )}
        {filtered.length > 0 && (
          <div className="table-footer">
            <div className="info">Hiển thị {start + 1} - {Math.min(end, filtered.length)} trong tổng số {filtered.length} banner</div>
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
            <div className="modal-header">{isEdit ? "Sửa banner" : "Thêm banner mới"}</div>
            <div className="modal-sub">{isEdit ? "Cập nhật thông tin banner" : "Nhập thông tin banner hiển thị"}</div>
            <div className="form-grid">
              <label>
                <span>URL Banner *</span>
                <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://example.com/banner.jpg" />
                {errors.url ? <div className="field-error">{errors.url}</div> : <div className="field-hint">Đường dẫn đầy đủ đến ảnh banner (có thể upload lên cloud). Tối đa 255 ký tự.</div>}
              </label>
              <label>
                <span>Vị trí hiển thị *</span>
                <input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="VD: Trang chủ - Banner chính" />
                {errors.position ? <div className="field-error">{errors.position}</div> : <div className="field-hint">Mô tả vị trí banner sẽ được hiển thị. Tối đa 100 ký tự.</div>}
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
