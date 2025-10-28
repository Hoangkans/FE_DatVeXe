import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import "../../styles/AdminManageUser.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function ManagerUser() {
  const [query, setQuery] = useState("");
  // No status filter control; show all
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialRows = useMemo(
    () => [
      { id: 1, firstName: "An", lastName: "Nguyen", email: "an.nguyen@example.com", phone: "0901234567", status: "active", createdAt: "2024-06-01", updatedAt: "2024-06-21" },
      { id: 2, firstName: "Binh", lastName: "Tran", email: "binh.tran@example.com", phone: "0902222333", status: "blocked", createdAt: "2024-05-12", updatedAt: "2024-07-02" },
      { id: 3, firstName: "Chi", lastName: "Le", email: "chi.le@example.com", phone: "0918888999", status: "active", createdAt: "2024-07-18", updatedAt: "2024-07-20" },
    ],
    []
  );

  const [rows, setRows] = useState(initialRows);

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", status: "active" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  function openAdd() {
    setIsEdit(false);
    setEditingId(null);
    setForm({ firstName: "", lastName: "", email: "", phone: "", password: "", status: "active" });
    setErrors({});
    setShowModal(true);
  }

  function openEdit(r) {
    setIsEdit(true);
    setEditingId(r.id);
    setForm({ firstName: r.firstName, lastName: r.lastName, email: r.email, phone: r.phone, password: "", status: r.status });
    setErrors({});
    setShowModal(true);
  }

  function removeRow(r) {
    if (window.confirm(`Xóa người dùng "${r.lastName} ${r.firstName}"?`)) setRows(rows.filter((x) => x.id !== r.id));
  }

  function validate() {
    const e = {};
    if (!form.lastName.trim()) e.lastName = "Vui lòng nhập họ";
    if (!form.firstName.trim()) e.firstName = "Vui lòng nhập tên";
    if (!form.email.trim()) e.email = "Vui lòng nhập email";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email không hợp lệ";
    if (!form.phone.trim()) e.phone = "Vui lòng nhập số điện thoại";
    if (!isEdit && !form.password.trim()) e.password = "Vui lòng nhập mật khẩu";
    return e;
  }

  function submit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    const now = new Date().toISOString().slice(0, 10);
    if (isEdit && editingId != null) {
      setRows(rows.map((r) => (r.id === editingId ? { ...r, ...form, updatedAt: now } : r)));
      setShowModal(false);
      return;
    }
    const nextId = Math.max(0, ...rows.map((r) => r.id)) + 1;
    // Do not persist password into list
    const rest = { ...form };
    delete rest.password;
    setRows([...rows, { id: nextId, ...rest, createdAt: now, updatedAt: now }]);
    setShowModal(false);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows.filter((r) => {
      const matchesQuery = !q ||
        r.id.toString().includes(q) ||
        r.firstName.toLowerCase().includes(q) ||
        r.lastName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q);
      return matchesQuery;
    });
    list = [...list].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      const av = a[sortBy];
      const bv = b[sortBy];
      if (av === bv) return 0;
      return av > bv ? dir : -dir;
    });
    return list;
  }, [rows, query, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageSafe = Math.min(page, totalPages);
  const start = (pageSafe - 1) * perPage;
  const end = start + perPage;
  const paged = filtered.slice(start, end);

  function movePage(delta) {
    setPage((p) => Math.max(1, Math.min(totalPages, p + delta)));
  }

  function toggleSort(key) {
    if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(key);
      setSortDir("asc");
    }
  }

  function sortLabel(key, label) {
    return (
      <span style={{cursor:'pointer'}} onClick={() => toggleSort(key)}>
        {label}
      </span>
    );
  }

  return (
    <div className="manage-user">
      <div className="head">
        <div className="title">Quản lý người dùng</div>
        <div className="sub">Quản lý thông tin tài khoản người dùng trong hệ thống</div>
      </div>

      <div className="toolbar">
        <div className="search">
          <SearchIcon className="search-icon" fontSize="small" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Tìm kiếm theo ID, tên, email, số điện thoại..." />
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <AddIcon fontSize="small" />
          <span>Thêm người dùng</span>
        </button>
      </div>

      <div className="table-wrap">
        <table className="user-table">
          <thead>
            <tr>
              <th>{sortLabel("id", "ID")}</th>
              <th>{sortLabel("lastName", "Họ")}</th>
              <th>{sortLabel("firstName", "Tên")}</th>
              <th>{sortLabel("email", "Email")}</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>{sortLabel("createdAt", "Ngày tạo")}</th>
              <th>{sortLabel("updatedAt", "Cập nhật")}</th>
              <th style={{ width: 120 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.lastName}</td>
                <td>{r.firstName}</td>
                <td className="mono">{r.email}</td>
                <td className="mono">{r.phone}</td>
                <td>
                  <span className={`status-badge ${r.status === "active" ? "is-active" : "is-blocked"}`}>
                    {r.status === "active" ? "Hoạt động" : "Bị khóa"}
                  </span>
                </td>
                <td>{r.createdAt}</td>
                <td>{r.updatedAt}</td>
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
        {filtered.length === 0 && (
          <div className="empty">Hiển thị 1 - 0 trong tổng số 0 người dùng</div>
        )}
        {filtered.length > 0 && (
          <div className="table-footer">
            <div className="info">Hiển thị {start + 1} - {Math.min(end, filtered.length)} trong tổng số {filtered.length} người dùng</div>
            <div className="pager">
              <button className="btn-page" disabled={pageSafe <= 1} onClick={() => movePage(-1)}>&lt;</button>
              <div className="page-text">Trang {pageSafe} / {totalPages}</div>
              <button className="btn-page" disabled={pageSafe >= totalPages} onClick={() => movePage(1)}>&gt;</button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">{isEdit ? "Sửa người dùng" : "Thêm người dùng mới"}</div>
            <div className="modal-sub">{isEdit ? "Cập nhật thông tin người dùng" : "Nhập thông tin người dùng vào hệ thống"}</div>
            <div className="form-grid">
              <label>
                <span>Họ <em className="req">*</em></span>
                <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Nhập họ" />
                {errors.lastName ? <div className="field-error">{errors.lastName}</div> : <div className="field-hint">Họ người dùng không được để trống</div>}
              </label>
              <label>
                <span>Tên <em className="req">*</em></span>
                <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Nhập tên" />
                {errors.firstName ? <div className="field-error">{errors.firstName}</div> : <div className="field-hint">Tên người dùng không được để trống</div>}
              </label>
              <label>
                <span>Email <em className="req">*</em></span>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="example@email.com" />
                {errors.email ? <div className="field-error">{errors.email}</div> : <div className="field-hint">Địa chỉ email không được để trống</div>}
              </label>
              {!isEdit && (
                <label>
                  <span>Mật khẩu <em className="req">*</em></span>
                  <div className="input-with-icon">
                    <input
                      type={showPass ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Nhập mật khẩu"
                    />
                    <button type="button" className="toggle-eye" onClick={() => setShowPass((v) => !v)}>
                      {showPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </button>
                  </div>
                  {errors.password ? <div className="field-error">{errors.password}</div> : <div className="field-hint">Mật khẩu không được để trống</div>}
                </label>
              )}
              <label>
                <span>Số điện thoại</span>
                <input
                  value={form.phone}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 11);
                    setForm({ ...form, phone: onlyDigits });
                  }}
                  placeholder="0901234567"
                />
                {errors.phone ? <div className="field-error">{errors.phone}</div> : <div className="field-hint">Tối đa 11 ký tự</div>}
              </label>
              <label>
                <span>Trạng thái <em className="req">*</em></span>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">ACTIVE (Hoạt động)</option>
                  <option value="blocked">BLOCKED (Bị khóa)</option>
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
