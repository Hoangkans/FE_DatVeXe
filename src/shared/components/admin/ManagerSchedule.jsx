import { useCallback, useEffect, useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import "../../styles/AdminManageSchedule.css";
import {
  fetchSchedules,
  fetchScheduleDetail,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../../../services/Road/Schedulesadmin";

const STATUS_TO_API = {
  available: "AVAILABLE",
  full: "FULL",
  canceled: "CANCELLED",
};

const STATUS_TEXT = {
  available: "Còn chỗ",
  full: "Hết chỗ",
  canceled: "Đã hủy",
};

const STATUS_BADGE = {
  available: "is-available",
  full: "is-full",
  canceled: "is-canceled",
};

const normalizeStatus = (value) => {
  const normalized = (value || "available").toString().toLowerCase();
  if (normalized === "full") return "full";
  if (normalized === "canceled" || normalized === "cancelled") return "canceled";
  return "available";
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("vi-VN");
};

const formatTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
};

const toText = (value, fallback = "") => {
  if (value === undefined || value === null) return fallback;
  return String(value);
};

const toFormState = (schedule) => ({
  routeId: schedule?.routeId?.toString() ?? "",
  busId: schedule?.busId?.toString() ?? "",
  totalSeats:
    schedule?.seatsTotal === undefined || schedule?.seatsTotal === null
      ? ""
      : schedule.seatsTotal.toString(),
        status: schedule?.status ?? "available",
        departAt: schedule?.departAt ?? "",
        arriveAt: schedule?.arriveAt ?? "",
        routeName: schedule?.routeName ?? "",
        busName: schedule?.busName ?? "",
        plate: schedule?.plate ?? "",
        seatsEmpty:
          schedule?.seatsEmpty === undefined || schedule?.seatsEmpty === null
            ? ""
            : schedule.seatsEmpty.toString(),
      });

const createEmptyForm = () =>
  toFormState({
    routeId: "",
    busId: "",
    seatsTotal: "",
    status: "available",
    routeName: "",
    busName: "",
    plate: "",
    seatsEmpty: "",
    departAt: "",
    arriveAt: "",
  });

const mapSchedule = (payload) => {
  if (!payload) return null;
  const source = payload.data ?? payload;
  const route = source.route ?? source.route_info;
  const bus = source.bus ?? source.bus_info;

  const routeId =
    route?.id ?? source.route_id ?? source.routeId ?? source.route_name ?? "";
  const busId = bus?.id ?? source.bus_id ?? source.busId ?? "";
  const routeNameRaw =
    route?.name ?? source.route_name ?? (routeId ? `Tuyến #${routeId}` : "");
  const busNameRaw = bus?.name ?? source.bus_name ?? "";
  const plateRaw =
    bus?.license_plate ?? source.plate ?? source.license_plate ?? source.bus_plate ?? "";

  return {
    id: source.id,
    routeId,
    routeName: toText(routeNameRaw),
    busId,
    busName: toText(busNameRaw),
    plate: toText(plateRaw),
    departAt: source.departure_time ?? source.departAt ?? "",
    arriveAt: source.arrival_time ?? source.arriveAt ?? "",
    seatsEmpty: Number(source.available_seat ?? source.seatsEmpty ?? 0),
    seatsTotal: Number(source.total_seats ?? source.seatsTotal ?? 0),
    status: normalizeStatus(source.status),
  };
};

export default function ManagerSchedule() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("departAt");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [form, setForm] = useState(createEmptyForm());
  const [errors, setErrors] = useState({});

  const loadSchedules = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const response = await fetchSchedules();
      const list = Array.isArray(response)
        ? response
        : response?.data ?? response?.items ?? [];
      setRows(list.map(mapSchedule).filter(Boolean));
    } catch (err) {
      console.error("Lỗi tải danh sách lịch trình:", err);
      const message =
        err?.response?.data?.message || err?.message || "Không thể tải danh sách lịch trình.";
      setFetchError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const openAdd = () => {
    setIsEdit(false);
    setEditingId(null);
    setForm(createEmptyForm());
    setErrors({});
    setShowModal(true);
  };

  const openEdit = async (row) => {
    setIsEdit(true);
    setEditingId(row.id);
    setErrors({});
    setForm(toFormState(row));
    setShowModal(true);
    setIsDetailLoading(true);
    try {
      const response = await fetchScheduleDetail(row.id);
      const detail = mapSchedule(response?.data ?? response);
      if (detail) setForm(toFormState(detail));
    } catch (err) {
      console.error("Không thể tải chi tiết lịch trình:", err);
      alert(err?.response?.data?.message || err?.message || "Không thể tải chi tiết lịch trình.");
    } finally {
      setIsDetailLoading(false);
    }
  };

  const removeRow = async (row) => {
    if (!window.confirm(`Xóa lịch trình #${row.id}?`)) return;
    try {
      await deleteSchedule(row.id);
      await loadSchedules();
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Không thể xóa lịch trình.");
    }
  };

  const validate = () => {
    const next = {};
    if (!form.routeId.trim()) next.routeId = "Vui lòng nhập Route ID";
    if (!form.busId.trim()) next.busId = "Vui lòng nhập Bus ID";
    if (!form.totalSeats.trim() || Number(form.totalSeats) <= 0)
      next.totalSeats = "Tổng chỗ phải lớn hơn 0";
    return next;
  };

  const handleSubmit = async () => {
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length) return;

    const payload = {
      route_id: Number(form.routeId),
      bus_id: Number(form.busId),
      total_seats: Number(form.totalSeats),
      status: STATUS_TO_API[form.status] || "AVAILABLE",
    };

    setIsSubmitting(true);
    try {
      if (isEdit && editingId != null) {
        await updateSchedule(editingId, payload);
      } else {
        await createSchedule(payload);
      }
      await loadSchedules();
      setShowModal(false);
      setForm(createEmptyForm());
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Không thể lưu lịch trình.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filteredRows = rows.filter((row) => {
      const id = row.id?.toString() ?? "";
      const routeId = row.routeId?.toString() ?? "";
      const busId = row.busId?.toString() ?? "";
      const routeName = row.routeName?.toLowerCase() ?? "";
      const busName = row.busName?.toLowerCase() ?? "";
      const plate = row.plate?.toLowerCase() ?? "";
      if (!q) return true;
      return (
        id.includes(q) ||
        routeId.includes(q) ||
        busId.includes(q) ||
        routeName.includes(q) ||
        busName.includes(q) ||
        plate.includes(q)
      );
    });

    const sorted = [...filteredRows].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      const av = a[sortBy] ?? "";
      const bv = b[sortBy] ?? "";
      if (av > bv) return dir;
      if (av < bv) return -dir;
      return 0;
    });
    return sorted;
  }, [rows, query, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const paged = filtered.slice(start, end);

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const sortLabel = (key, label) => (
    <span className="sortable" onClick={() => toggleSort(key)}>
      {label}
      {sortBy === key ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
    </span>
  );

  return (
    <div className="manage-schedule">
      <div className="head">
        <div className="title">Quản lý lịch trình</div>
        <div className="sub">Theo dõi và cấu hình các chuyến xe</div>
      </div>

      <div className="toolbar">
        <div className="search">
          <SearchIcon className="search-icon" fontSize="small" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo ID, tuyến, xe, biển số..."
          />
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
              <th>{sortLabel("routeId", "Route")}</th>
              <th>{sortLabel("busId", "Bus")}</th>
              <th>Tuyến xe</th>
              <th>Xe</th>
              <th>{sortLabel("departAt", "Khởi hành")}</th>
              <th>{sortLabel("arriveAt", "Đến nơi")}</th>
              <th>{sortLabel("seatsEmpty", "Chỗ trống")}</th>
              <th>{sortLabel("seatsTotal", "Tổng chỗ")}</th>
              <th>Trạng thái</th>
              <th style={{ width: 120 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={11} className="loading-cell">
                  Đang tải dữ liệu...
                </td>
              </tr>
            )}
            {!loading && fetchError && (
              <tr>
                <td colSpan={11} className="error-cell">
                  {fetchError}
                </td>
              </tr>
            )}
            {!loading && !fetchError && paged.length === 0 && (
              <tr>
                <td colSpan={11} className="empty">
                  Không có lịch trình nào.
                </td>
              </tr>
            )}
            {!loading && !fetchError &&
              paged.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.routeId || "—"}</td>
                  <td>{row.busId || "—"}</td>
                  <td>{row.routeName || "—"}</td>
                  <td>
                    <div>{row.busName || "—"}</div>
                    <div className="muted">{row.plate || ""}</div>
                  </td>
                  <td>
                    <div>{formatDate(row.departAt)}</div>
                    <div className="muted">{formatTime(row.departAt)}</div>
                  </td>
                  <td>
                    <div>{formatDate(row.arriveAt)}</div>
                    <div className="muted">{formatTime(row.arriveAt)}</div>
                  </td>
                  <td>
                    {row.seatsEmpty}{" "}
                    <span className="muted">
                      ({row.seatsTotal ? Math.round((row.seatsEmpty / row.seatsTotal) * 100) : 0}%)
                    </span>
                  </td>
                  <td>{row.seatsTotal}</td>
                  <td>
                    <span className={`status-badge ${STATUS_BADGE[row.status]}`}>
                      {STATUS_TEXT[row.status]}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="btn-ghost" onClick={() => openEdit(row)}>
                        <EditIcon fontSize="inherit" />
                      </button>
                      <button className="btn-danger" onClick={() => removeRow(row)}>
                        <DeleteIcon fontSize="inherit" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {filtered.length > 0 && !loading && !fetchError && (
          <div className="table-footer">
            <div className="info">
              Hiển thị {start + 1}-{Math.min(end, filtered.length)} trong tổng số {filtered.length} lịch trình
            </div>
            <div className="pager">
              <button
                className="btn-page"
                disabled={currentPage <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                &lt;
              </button>
              <div className="page-text">
                Trang {currentPage} / {totalPages}
              </div>
              <button
                className="btn-page"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="modal-backdrop"
          onClick={() => !isSubmitting && !isDetailLoading && setShowModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">{isEdit ? "Sửa lịch trình" : "Thêm lịch trình"}</div>
            <div className="modal-sub">
              {isEdit ? "Cập nhật thông tin lịch trình" : "Nhập lịch trình mới"}
            </div>
            {isDetailLoading && <div className="modal-loading-hint">Đang tải chi tiết...</div>}

            <div className="form-grid">
              <label>
                <span>Route ID</span>
                <input
                  value={form.routeId}
                  onChange={(e) => setForm((prev) => ({ ...prev, routeId: e.target.value }))}
                  placeholder="VD: 12"
                  disabled={isSubmitting || isDetailLoading}
                />
                {errors.routeId && <div className="field-error">{errors.routeId}</div>}
              </label>
              <label>
                <span>Bus ID</span>
                <input
                  value={form.busId}
                  onChange={(e) => setForm((prev) => ({ ...prev, busId: e.target.value }))}
                  placeholder="VD: 5"
                  disabled={isSubmitting || isDetailLoading}
                />
                {errors.busId && <div className="field-error">{errors.busId}</div>}
              </label>
              <label>
                <span>Tên tuyến</span>
                <input value={form.routeName} readOnly disabled placeholder="Tự động từ hệ thống" />
              </label>
              <label>
                <span>Tên xe</span>
                <input value={form.busName} readOnly disabled placeholder="Tự động từ hệ thống" />
              </label>
              <label>
                <span>Biển số</span>
                <input value={form.plate} readOnly disabled placeholder="Tự động từ hệ thống" />
              </label>
              <label>
                <span>Khởi hành</span>
                <input value={`${formatDate(form.departAt)} ${formatTime(form.departAt)}`} readOnly disabled />
              </label>
              <label>
                <span>Đến nơi</span>
                <input value={`${formatDate(form.arriveAt)} ${formatTime(form.arriveAt)}`} readOnly disabled />
              </label>
              <label>
                <span>Chỗ trống</span>
                <input value={form.seatsEmpty || "—"} readOnly disabled />
              </label>
              <label>
                <span>Tổng chỗ</span>
                <input
                  type="number"
                  min={1}
                  value={form.totalSeats}
                  onChange={(e) => setForm((prev) => ({ ...prev, totalSeats: e.target.value }))}
                  disabled={isSubmitting || isDetailLoading}
                />
                {errors.totalSeats && <div className="field-error">{errors.totalSeats}</div>}
              </label>
              <label>
                <span>Trạng thái</span>
                <select
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                  disabled={isSubmitting || isDetailLoading}
                >
                  <option value="available">Còn chỗ</option>
                  <option value="full">Hết chỗ</option>
                  <option value="canceled">Đã hủy</option>
                </select>
              </label>
            </div>

            <div className="modal-actions">
              <button
                className="btn-ghost"
                onClick={() => setShowModal(false)}
                disabled={isSubmitting || isDetailLoading}
              >
                Hủy
              </button>
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting || isDetailLoading}
              >
                {isSubmitting ? "Đang lưu..." : isEdit ? "Lưu" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
