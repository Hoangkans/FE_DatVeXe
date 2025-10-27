import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import "../../styles/AdminManageSchedule.css";

export default function ManagerSchedule() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("departAt");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const initialRows = useMemo(
    () => [
      { id: 6, routeId: 106, busId: 6, routeName: "Đà Nẵng - Hội An", busName: "Xe ký 03", plate: "51F-44444", departAt: "2025-10-28T09:00:00", arriveAt: "2025-10-28T11:00:00", seatsEmpty: 12, seatsTotal: 30, status: "available" },
      { id: 4, routeId: 104, busId: 4, routeName: "Hà Nội - Ninh Bình", busName: "Xe ký 02", plate: "51D-22222", departAt: "2025-10-28T09:00:00", arriveAt: "2025-10-28T11:30:00", seatsEmpty: 15, seatsTotal: 40, status: "available" },
      { id: 2, routeId: 102, busId: 2, routeName: "Hà Nội - Hải Phòng", busName: "Xe ký 01", plate: "51B-67890", departAt: "2025-10-28T08:00:00", arriveAt: "2025-10-28T10:00:00", seatsEmpty: 0, seatsTotal: 45, status: "full" },
      { id: 1, routeId: 101, busId: 1, routeName: "Sài Gòn - Đà Lạt", busName: "Xe khách 01", plate: "51A-12345", departAt: "2025-10-28T06:00:00", arriveAt: "2025-10-28T10:30:00", seatsEmpty: 25, seatsTotal: 40, status: "available" },
      { id: 3, routeId: 103, busId: 3, routeName: "Sài Gòn - Vũng Tàu", busName: "Xe khách 02", plate: "51C-11111", departAt: "2025-10-27T14:30:00", arriveAt: "2025-10-27T16:30:00", seatsEmpty: 35, seatsTotal: 35, status: "available" },
      { id: 5, routeId: 105, busId: 5, routeName: "Sài Gòn - Phan Thiết", busName: "Xe khách 03", plate: "51E-33333", departAt: "2025-10-26T07:00:00", arriveAt: "2025-10-26T11:00:00", seatsEmpty: 0, seatsTotal: 45, status: "canceled" },
    ],
    []
  );

  const [rows, setRows] = useState(initialRows);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    routeId: "",
    busId: "",
    routeName: "",
    busName: "",
    plate: "",
    departAt: "",
    arriveAt: "",
    seatsEmpty: "",
    seatsTotal: "",
    status: "available",
  });
  const [errors, setErrors] = useState({});

  function openAdd() {
    setIsEdit(false);
    setEditingId(null);
    setForm({ routeId: "", busId: "", routeName: "", busName: "", plate: "", departAt: "", arriveAt: "", seatsEmpty: "", seatsTotal: "", status: "available" });
    setErrors({});
    setShowModal(true);
  }

  function openEdit(r) {
    setIsEdit(true);
    setEditingId(r.id);
    setForm({ routeId: r.routeId, busId: r.busId, routeName: r.routeName, busName: r.busName, plate: r.plate, departAt: r.departAt, arriveAt: r.arriveAt, seatsEmpty: r.seatsEmpty, seatsTotal: r.seatsTotal, status: r.status });
    setErrors({});
    setShowModal(true);
  }

  function removeRow(r) {
    if (window.confirm(`Xóa lịch trình #${r.id}?`)) setRows(rows.filter((x) => x.id !== r.id));
  }

  function validate() {
    const e = {};
    if (!String(form.routeId).trim()) e.routeId = "Nhập route ID";
    if (!String(form.busId).trim()) e.busId = "Nhập bus ID";
    if (!form.routeName.trim()) e.routeName = "Nhập tên tuyến";
    if (!form.busName.trim()) e.busName = "Nhập tên xe";
    if (!form.departAt) e.departAt = "Chọn thời gian khởi hành";
    if (!form.arriveAt) e.arriveAt = "Chọn thời gian đến nơi";
    if (form.seatsTotal === "" || Number(form.seatsTotal) <= 0) e.seatsTotal = "Tổng chỗ > 0";
    if (form.seatsEmpty === "" || Number(form.seatsEmpty) < 0) e.seatsEmpty = "Chỗ trống >= 0";
    return e;
  }

  function submit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    if (isEdit && editingId != null) {
      setRows(rows.map((r) => (r.id === editingId ? { id: r.id, ...form, seatsEmpty: Number(form.seatsEmpty), seatsTotal: Number(form.seatsTotal) } : r)));
      setShowModal(false);
      return;
    }
    const nextId = Math.max(0, ...rows.map((r) => r.id)) + 1;
    setRows([{ id: nextId, ...form, seatsEmpty: Number(form.seatsEmpty), seatsTotal: Number(form.seatsTotal) }, ...rows]);
    setShowModal(false);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows.filter((r) => {
      const matches = !q ||
        r.id.toString().includes(q) ||
        r.routeId.toString().includes(q) ||
        r.busId.toString().includes(q) ||
        r.routeName.toLowerCase().includes(q) ||
        r.busName.toLowerCase().includes(q) ||
        r.plate.toLowerCase().includes(q);
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
  const percent = (empty, total) => (total ? Math.round((empty / total) * 100) : 0);

  function sortLabel(key, label) {
    return (
      <span style={{cursor:'pointer'}} onClick={() => toggleSort(key)}>{label}</span>
    );
  }

  return (
    <div className="manage-schedule">
      <div className="head">
        <div className="title">Quản lý lịch trình xe</div>
        <div className="sub">Quản lý và theo dõi các lịch trình chuyến đi</div>
      </div>

      <div className="toolbar">
        <div className="search">
          <SearchIcon className="search-icon" fontSize="small" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Tìm kiếm theo ID, route ID, bus ID, tên tuyến, xe..." />
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <AddIcon fontSize="small" />
          <span>Thêm lịch trình</span>
        </button>
      </div>

      <div className="table-wrap">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>{sortLabel("id", "ID")}</th>
              <th>{sortLabel("routeId", "Route ID")}</th>
              <th>{sortLabel("busId", "Bus ID")}</th>
              <th>Tuyến xe</th>
              <th>Xe / Biển số</th>
              <th>{sortLabel("departAt", "Khởi hành")}</th>
              <th>{sortLabel("arriveAt", "Đến nơi")}</th>
              <th>{sortLabel("seatsEmpty", "Chỗ trống")}</th>
              <th>{sortLabel("seatsTotal", "Tổng chỗ")}</th>
              <th>Trạng thái</th>
              <th style={{ width: 100 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.routeId}</td>
                <td>{r.busId}</td>
                <td>{r.routeName}</td>
                <td>
                  <div>{r.busName}</div>
                  <div className="muted">{r.plate}</div>
                </td>
                <td>
                  <div>{datePart(r.departAt)}</div>
                  <div className="muted">{timePart(r.departAt)}</div>
                </td>
                <td>
                  <div>{datePart(r.arriveAt)}</div>
                  <div className="muted">{timePart(r.arriveAt)}</div>
                </td>
                <td>
                  <div>{r.seatsEmpty} <span className="muted">({percent(r.seatsEmpty, r.seatsTotal)}%)</span></div>
                </td>
                <td>{r.seatsTotal}</td>
                <td>
                  <span className={`status-badge ${r.status === "available" ? "is-available" : r.status === "full" ? "is-full" : "is-canceled"}`}>
                    {r.status === "available" ? "Còn chỗ" : r.status === "full" ? "Hết chỗ" : "Đã hủy"}
                  </span>
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
        {filtered.length === 0 && <div className="empty">Hiển thị 1 - 0 trong tổng số 0 lịch trình</div>}
        {filtered.length > 0 && (
          <div className="table-footer">
            <div className="info">Hiển thị {start + 1} - {Math.min(end, filtered.length)} trong tổng số {filtered.length} lịch trình</div>
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
            <div className="modal-header">{isEdit ? "Sửa lịch trình" : "Thêm lịch trình"}</div>
            <div className="modal-sub">{isEdit ? "Cập nhật thông tin lịch trình" : "Nhập thông tin lịch trình vào hệ thống"}</div>

            <div className="form-grid">
              <label>
                <span>Route ID</span>
                <input value={form.routeId} onChange={(e) => setForm({ ...form, routeId: e.target.value })} placeholder="VD: 101" />
                {errors.routeId && <div className="field-error">{errors.routeId}</div>}
              </label>
              <label>
                <span>Bus ID</span>
                <input value={form.busId} onChange={(e) => setForm({ ...form, busId: e.target.value })} placeholder="VD: 1" />
                {errors.busId && <div className="field-error">{errors.busId}</div>}
              </label>
              <label>
                <span>Tuyến xe</span>
                <input value={form.routeName} onChange={(e) => setForm({ ...form, routeName: e.target.value })} placeholder="VD: Sài Gòn - Đà Lạt" />
                {errors.routeName && <div className="field-error">{errors.routeName}</div>}
              </label>
              <label>
                <span>Tên xe</span>
                <input value={form.busName} onChange={(e) => setForm({ ...form, busName: e.target.value })} placeholder="VD: Xe khách 01" />
                {errors.busName && <div className="field-error">{errors.busName}</div>}
              </label>
              <label>
                <span>Biển số</span>
                <input value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} placeholder="VD: 51A-12345" />
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
                <span>Chỗ trống</span>
                <input type="number" min="0" value={form.seatsEmpty} onChange={(e) => setForm({ ...form, seatsEmpty: e.target.value })} />
                {errors.seatsEmpty && <div className="field-error">{errors.seatsEmpty}</div>}
              </label>
              <label>
                <span>Tổng chỗ</span>
                <input type="number" min="1" value={form.seatsTotal} onChange={(e) => setForm({ ...form, seatsTotal: e.target.value })} />
                {errors.seatsTotal && <div className="field-error">{errors.seatsTotal}</div>}
              </label>
              <label>
                <span>Trạng thái</span>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="available">Còn chỗ</option>
                  <option value="full">Hết chỗ</option>
                  <option value="canceled">Đã hủy</option>
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

