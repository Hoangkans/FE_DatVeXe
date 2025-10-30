import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import "../../styles/AdminManageTicket.css";
import formatMoney from "../../utils/ticket/money";

export default function ManagerTicket() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("departAt");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const initialRows = useMemo(() => [], []);

  const [rows, setRows] = useState(initialRows);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    scheduleId: "",
    seatId: "",
    customer: "",
    route: "",
    departAt: "",
    arriveAt: "",
    seatType: "STANDARD",
    price: "",
    status: "booked",
    bookedAt: "",
  });
  const [errors, setErrors] = useState({});

  function openAdd() {
    setIsEdit(false);
    setEditingId(null);
    setForm({ scheduleId: "", seatId: "", customer: "", route: "", departAt: "", arriveAt: "", seatType: "STANDARD", price: "", status: "booked", bookedAt: "" });
    setErrors({});
    setShowModal(true);
  }

  function openEdit(r) {
    setIsEdit(true);
    setEditingId(r.id);
    setForm({ scheduleId: r.scheduleId, seatId: r.seatId, customer: r.customer, route: r.route, departAt: r.departAt, arriveAt: r.arriveAt, seatType: r.seatType, price: r.price, status: r.status, bookedAt: r.bookedAt });
    setErrors({});
    setShowModal(true);
  }

  function removeRow(r) {
    if (window.confirm(`Xóa vé #${r.id}?`)) setRows(rows.filter((x) => x.id !== r.id));
  }

  function validate() {
    const e = {};
    if (!String(form.scheduleId).trim()) e.scheduleId = "Nhập schedule ID";
    if (!String(form.seatId).trim()) e.seatId = "Nhập seat ID";
    if (!form.customer.trim()) e.customer = "Nhập tên khách";
    if (!form.route.trim()) e.route = "Nhập tuyến";
    if (!form.departAt) e.departAt = "Chọn thời gian khởi hành";
    if (!form.arriveAt) e.arriveAt = "Chọn thời gian đến nơi";
    if (!form.price || Number(form.price) <= 0) e.price = "Giá vé > 0";
    if (!form.bookedAt) e.bookedAt = "Chọn ngày đặt";
    return e;
  }

  function submit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    if (isEdit && editingId != null) {
      setRows(rows.map((r) => (r.id === editingId ? { id: r.id, ...form, price: Number(form.price) } : r)));
      setShowModal(false);
      return;
    }
    const nextId = Math.max(0, ...rows.map((r) => r.id)) + 1;
    setRows([{ id: nextId, ...form, price: Number(form.price) }, ...rows]);
    setShowModal(false);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows.filter((r) => {
      const matches = !q ||
        r.id.toString().includes(q) ||
        r.scheduleId.toString().includes(q) ||
        r.seatId.toString().includes(q) ||
        r.customer.toLowerCase().includes(q) ||
        r.route.toLowerCase().includes(q);
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

  const datePart = (iso) => new Date(iso).toLocaleDateString("vi-VN");
  const timePart = (iso) => new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  function sortLabel(key, label) {
    return (
      <span style={{cursor:'pointer'}} onClick={() => toggleSort(key)}>{label}</span>
    );
  }

  return (
    <div className="manage-ticket">
      <div className="head">
        <div className="title">Quản lý vé xe</div>
        <div className="sub">Quản lý thông tin đặt vé và theo dõi doanh thu</div>
      </div>

      <div className="toolbar">
        <div className="search">
          <SearchIcon className="search-icon" fontSize="small" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Tìm kiếm theo ID, schedule ID, seat ID, khách hàng..." />
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <AddIcon fontSize="small" />
          <span>Thêm vé mới</span>
        </button>
      </div>

      <div className="table-wrap">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>{sortLabel("id", "ID")}</th>
              <th>{sortLabel("scheduleId", "Schedule ID")}</th>
              <th>{sortLabel("seatId", "Seat ID")}</th>
              <th>Khách hàng</th>
              <th>Tuyến</th>
              <th>{sortLabel("departAt", "Khởi hành")}</th>
              <th>{sortLabel("arriveAt", "Đến nơi")}</th>
              <th>Loại ghế</th>
              <th>{sortLabel("price", "Giá vé")}</th>
              <th>Trạng thái</th>
              <th>{sortLabel("bookedAt", "Ngày đặt")}</th>
              <th style={{ width: 100 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.scheduleId}</td>
                <td>{r.seatId}</td>
                <td className="customer">{r.customer}</td>
                <td>{r.route}</td>
                <td>
                  <div>{datePart(r.departAt)}</div>
                  <div className="muted">{timePart(r.departAt)}</div>
                </td>
                <td>
                  <div>{datePart(r.arriveAt)}</div>
                  <div className="muted">{timePart(r.arriveAt)}</div>
                </td>
                <td>
                  <span className={`seat-badge type-${r.seatType.toLowerCase()}`}>{r.seatType}</span>
                </td>
                <td className="mono">{formatMoney(r.price)} đ</td>
                <td>
                  <span className={`status-badge ${r.status === "booked" ? "is-booked" : "is-canceled"}`}>
                    {r.status === "booked" ? "Đã đặt" : "Đã hủy"}
                  </span>
                </td>
                <td>
                  <div>{datePart(r.bookedAt)}</div>
                  <div className="muted">{timePart(r.bookedAt)}</div>
                </td>
                <td>
                  <div className="row-actions">
                    <button className="btn-ghost" onClick={() => openEdit(r)}><EditIcon fontSize="inherit" /></button>
                    <button className="btn-danger" onClick={() => removeRow(r)}><DeleteIcon fontSize="inherit" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty">Hiển thị 1 - 0 trong tổng số 0 vé</div>}
        {filtered.length > 0 && (
          <div className="table-footer">
            <div className="info">Hiển thị {start + 1} - {Math.min(end, filtered.length)} trong tổng số {filtered.length} vé</div>
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
            <div className="modal-header">{isEdit ? "Sửa vé" : "Thêm vé mới"}</div>
            <div className="modal-sub">{isEdit ? "Cập nhật thông tin vé" : "Nhập thông tin vé vào hệ thống"}</div>

            <div className="form-grid">
              <label>
                <span>Schedule ID</span>
                <input value={form.scheduleId} onChange={(e) => setForm({ ...form, scheduleId: e.target.value })} placeholder="VD: 1" />
                {errors.scheduleId && <div className="field-error">{errors.scheduleId}</div>}
              </label>
              <label>
                <span>Seat ID</span>
                <input value={form.seatId} onChange={(e) => setForm({ ...form, seatId: e.target.value })} placeholder="VD: 12" />
                {errors.seatId && <div className="field-error">{errors.seatId}</div>}
              </label>
              <label>
                <span>Khách hàng</span>
                <input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} placeholder="VD: Nguyễn Văn A" />
                {errors.customer && <div className="field-error">{errors.customer}</div>}
              </label>
              <label>
                <span>Tuyến</span>
                <input value={form.route} onChange={(e) => setForm({ ...form, route: e.target.value })} placeholder="VD: Sài Gòn - Đà Lạt" />
                {errors.route && <div className="field-error">{errors.route}</div>}
              </label>
              <label>
                <span>Khởi hành</span>
                <input type="datetime-local" value={form.departAt} onChange={(e) => setForm({ ...form, departAt: e.target.value })} />
                {errors.departAt && <div className="field-error">{errors.departAt}</div>}
              </label>
              <label>
                <span>Đến nơi</span>
                <input type="datetime-local" value={form.arriveAt} onChange={(e) => setForm({ ...form, arriveAt: e.target.value })} />
                {errors.arriveAt && <div className="field-error">{errors.arriveAt}</div>}
              </label>
              <label>
                <span>Loại ghế</span>
                <select value={form.seatType} onChange={(e) => setForm({ ...form, seatType: e.target.value })}>
                  <option value="STANDARD">STANDARD</option>
                  <option value="VIP">VIP</option>
                  <option value="LUXURY">LUXURY</option>
                </select>
              </label>
              <label>
                <span>Giá vé</span>
                <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                {errors.price && <div className="field-error">{errors.price}</div>}
              </label>
              <label>
                <span>Trạng thái</span>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="booked">Đã đặt</option>
                  <option value="canceled">Đã hủy</option>
                </select>
              </label>
              <label>
                <span>Ngày đặt</span>
                <input type="datetime-local" value={form.bookedAt} onChange={(e) => setForm({ ...form, bookedAt: e.target.value })} />
                {errors.bookedAt && <div className="field-error">{errors.bookedAt}</div>}
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

