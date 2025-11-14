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
  updateScheduleSeats,
} from "../../../services/Road/Schedulesadmin";

const STATUS_TO_API = {
  available: "AVAILABLE",
  full: "FULL",
  canceled: "CANCELLED",
};

const toUiStatus = (value) => {
  const normalized = (value || "").toString().toLowerCase();
  if (normalized === "full") return "full";
  if (normalized === "cancelled" || normalized === "canceled") return "canceled";
  return "available";
};

const toApiStatus = (value) => STATUS_TO_API[value] || "AVAILABLE";

const toText = (value) => {
  if (value === undefined || value === null) return "";
  return String(value);
};

const formatDatetimeLocal = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const mapScheduleResponse = (payload) => {
  if (!payload) return null;
  const source = payload.data ?? payload;
  const route = source.route ?? source.route_info;
  const bus = source.bus ?? source.bus_info;

  const routeId =
    source.route_id ??
    source.routeId ??
    route?.id ??
    source.route_name ??
    "";
  const busId =
    source.bus_id ??
    source.busId ??
    bus?.id ??
    source.bus_identifier ??
    "";
  const routeName = toText(
    route?.name ?? source.route_name ?? (routeId ? `Tuyến #${routeId}` : "")
  );
  const busName = toText(bus?.name ?? source.bus_name ?? "");
  const plate = toText(
    bus?.license_plate ??
      source.plate ??
      source.license_plate ??
      source.bus_plate ??
      ""
  );
  const departAt = source.departure_time ?? source.departAt ?? "";
  const arriveAt = source.arrival_time ?? source.arriveAt ?? "";
  const seatsEmpty = Number(source.available_seat ?? source.seatsEmpty ?? 0);
  const seatsTotal = Number(source.total_seats ?? source.seatsTotal ?? 0);

  return {
    id: source.id,
    routeId,
    busId,
    routeName,
    busName,
    plate,
    departAt,
    arriveAt,
    seatsEmpty,
    seatsTotal,
    status: toUiStatus(source.status),
    raw: source,
  };
};

const createEmptyForm = () => ({
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

const safeDatePart = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("vi-VN");
};

const safeTimePart = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
};

const percent = (empty, total) => {
  if (!total) return 0;
  return Math.round((Number(empty) / Number(total)) * 100);
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
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
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
      setRows(list.map(mapScheduleResponse).filter(Boolean));
    } catch (err) {
      console.error("Lỗi tải danh sách lịch trình:", err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Không thể tải danh sách lịch trình.";
      setFetchError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  function openAdd() {
    setIsEdit(false);
    setEditingId(null);
    setForm(createEmptyForm());
    setErrors({});
    setIsFetchingDetail(false);
    setShowModal(true);
  }

  async function openEdit(r) {
    setIsEdit(true);
    setEditingId(r.id);
    setErrors({});
    setForm({
      routeId: r.routeId?.toString() ?? "",
      busId: r.busId?.toString() ?? "",
      routeName: r.routeName ?? "",
      busName: r.busName ?? "",
      plate: r.plate ?? "",
      departAt: r.departAt ?? "",
      arriveAt: r.arriveAt ?? "",
      seatsEmpty:
        r.seatsEmpty === undefined || r.seatsEmpty === null
          ? ""
          : r.seatsEmpty.toString(),
      seatsTotal:
        r.seatsTotal === undefined || r.seatsTotal === null
          ? ""
          : r.seatsTotal.toString(),
      status: r.status ?? "available",
    });
    setShowModal(true);
    setIsFetchingDetail(true);
    try {
      const response = await fetchScheduleDetail(r.id);
      const detail = mapScheduleResponse(response?.data ?? response);
      if (detail) {
        setForm({
          routeId: detail.routeId?.toString() ?? "",
          busId: detail.busId?.toString() ?? "",
          routeName: detail.routeName ?? "",
          busName: detail.busName ?? "",
          plate: detail.plate ?? "",
          departAt: detail.departAt ?? "",
          arriveAt: detail.arriveAt ?? "",
          seatsEmpty:
            detail.seatsEmpty === undefined || detail.seatsEmpty === null
              ? ""
              : detail.seatsEmpty.toString(),
          seatsTotal:
            detail.seatsTotal === undefined || detail.seatsTotal === null
              ? ""
              : detail.seatsTotal.toString(),
          status: detail.status ?? "available",
        });
      }
    } catch (err) {
      console.error("Không thể tải chi tiết lịch trình:", err);
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Không thể tải chi tiết lịch trình."
      );
    } finally {
      setIsFetchingDetail(false);
    }
  }

  async function removeRow(r) {
    if (!window.confirm(`Xóa lịch trình #${r.id}?`)) return;
    try {
      await deleteSchedule(r.id);
      await loadSchedules();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Không thể xóa lịch trình.";
      alert(message);
    }
  }

  function validate() {
    const e = {};
    if (!String(form.routeId).trim()) e.routeId = "Nhập route ID";
    if (!String(form.busId).trim()) e.busId = "Nhập bus ID";
    if (form.seatsTotal === "" || Number(form.seatsTotal) <= 0)
      e.seatsTotal = "Tổng chỗ > 0";
    return e;
  }

  const handleDateChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value ? new Date(value).toISOString() : "",
    }));
  };

  async function submit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const payload = {
      route_id: Number(form.routeId),
      bus_id: Number(form.busId),
      total_seats: Number(form.seatsTotal),
      status: toApiStatus(form.status),
    };

    setIsSubmitting(true);
    try {
      if (isEdit && editingId != null) {
        const currentRow = rows.find((r) => r.id === editingId);
        const currentTotal = Number(form.seatsTotal);
        const prevTotal = currentRow?.seatsTotal;
        const shouldUseSeatPatch =
          typeof prevTotal === "number" &&
          !Number.isNaN(prevTotal) &&
          prevTotal !== currentTotal;

        const updatePayload = {
          route_id: payload.route_id,
          bus_id: payload.bus_id,
          status: payload.status,
        };

        if (!shouldUseSeatPatch) {
          updatePayload.total_seats = payload.total_seats;
        }

        if (form.departAt) {
          updatePayload.departure_time = form.departAt;
        }
        if (form.arriveAt) {
          updatePayload.arrival_time = form.arriveAt;
        }

        await updateSchedule(editingId, updatePayload);

        if (shouldUseSeatPatch) {
          await updateScheduleSeats(editingId, payload.total_seats);
        }
      } else {
        await createSchedule(payload);
      }

      await loadSchedules();
      setShowModal(false);
      setForm(createEmptyForm());
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Không thể lưu lịch trình.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows.filter((r) => {
      const idText = (r.id ?? "").toString();
      const routeId = (r.routeId ?? "").toString();
      const busId = (r.busId ?? "").toString();
      const routeName = r.routeName?.toLowerCase() ?? "";
      const busName = r.busName?.toLowerCase() ?? "";
      const plate = r.plate?.toLowerCase() ?? "";
      return (
        !q ||
        idText.includes(q) ||
        routeId.includes(q) ||
        busId.includes(q) ||
        routeName.includes(q) ||
        busName.includes(q) ||
        plate.includes(q)
      );
    });
    list = [...list].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      const av = a[sortBy] ?? "";
      const bv = b[sortBy] ?? "";
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
    else {
      setSortBy(key);
      setSortDir("asc");
    }
  }

  function sortLabel(key, label) {
    return (
      <span style={{ cursor: "pointer" }} onClick={() => toggleSort(key)}>
        {label}
      </span>
    );
  }

  return (
    <div className="manage-schedule">
      <div className="head">
        <div className="title">Quản lý lịch trình</div>
        <div className="sub">Quản lý thông tin lịch trình xe</div>
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
            placeholder="Tìm kiếm theo ID, tuyến, xe, biển số..."
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
              <th>{sortLabel("routeId", "Route ID")}</th>
              <th>{sortLabel("busId", "Bus ID")}</th>
              <th>{sortLabel("routeName", "Tuyến xe")}</th>
              <th>{sortLabel("busName", "Xe")}</th>
              <th>{sortLabel("departAt", "Khởi hành")}</th>
              <th>{sortLabel("arriveAt", "Đến nơi")}</th>
              <th>{sortLabel("seatsEmpty", "Chỗ trống")}</th>
              <th>{sortLabel("seatsTotal", "Tổng chỗ")}</th>
              <th>Trạng thái</th>
              <th style={{ width: 100 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="11" className="loading-cell">
                  Đang tải dữ liệu lịch trình...
                </td>
              </tr>
            )}
            {!loading && fetchError && (
              <tr>
                <td colSpan="11" className="error-cell">
                  {fetchError}
                </td>
              </tr>
            )}
            {!loading && !fetchError && paged.length === 0 && (
              <tr>
                <td colSpan="11" className="empty">
                  Không có lịch trình nào phù hợp.
                </td>
              </tr>
            )}
            {!loading &&
              !fetchError &&
              paged.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.routeId || "—"}</td>
                  <td>{r.busId || "—"}</td>
                  <td>{r.routeName || "—"}</td>
                  <td>
                    <div>{r.busName || "—"}</div>
                    <div className="muted">{r.plate || ""}</div>
                  </td>
                  <td>
                    <div>{safeDatePart(r.departAt)}</div>
                    <div className="muted">{safeTimePart(r.departAt)}</div>
                  </td>
                  <td>
                    <div>{safeDatePart(r.arriveAt)}</div>
                    <div className="muted">{safeTimePart(r.arriveAt)}</div>
                  </td>
                  <td>
                    <div>
                      {r.seatsEmpty ?? 0}{" "}
                      <span className="muted">
                        ({percent(r.seatsEmpty, r.seatsTotal)}%)
                      </span>
                    </div>
                  </td>
                  <td>{r.seatsTotal ?? 0}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        r.status === "available"
                          ? "is-available"
                          : r.status === "full"
                          ? "is-full"
                          : "is-canceled"
                      }`}
                    >
                      {r.status === "available"
                        ? "Còn chỗ"
                        : r.status === "full"
                        ? "Hết chỗ"
                        : "Đã hủy"}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="btn-ghost" onClick={() => openEdit(r)}>
                        <EditIcon fontSize="inherit" />
                      </button>
                      <button className="btn-danger" onClick={() => removeRow(r)}>
                        <DeleteIcon fontSize="inherit" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {filtered.length === 0 && !loading && !fetchError && (
          <div className="empty">Không có dữ liệu lịch trình.</div>
        )}
        {filtered.length > 0 && !loading && !fetchError && (
          <div className="table-footer">
            <div className="info">
              Hiển thị {start + 1} - {Math.min(end, filtered.length)} trong tổng số {filtered.length} lịch trình
            </div>
            <div className="pager">
              <button
                className="btn-page"
                disabled={pageSafe <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                &lt;
              </button>
              <div className="page-text">
                Trang {pageSafe} / {totalPages}
              </div>
              <button
                className="btn-page"
                disabled={pageSafe >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
          onClick={() => !isSubmitting && !isFetchingDetail && setShowModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              {isEdit ? "Sửa lịch trình" : "Thêm lịch trình"}
            </div>
            <div className="modal-sub">
              {isEdit
                ? "Cập nhật thông tin lịch trình"
                : "Nhập thông tin lịch trình vào hệ thống"}
            </div>
            {isFetchingDetail && (
              <div className="modal-loading-hint">
                Đang tải thông tin chi tiết...
              </div>
            )}

            <div className="form-grid">
              <label>
                <span>Route ID</span>
                <input
                  value={form.routeId}
                  onChange={(e) => setForm((prev) => ({ ...prev, routeId: e.target.value }))}
                  placeholder="VD: 101"
                  disabled={isSubmitting || isFetchingDetail}
                />
                {errors.routeId && <div className="field-error">{errors.routeId}</div>}
              </label>
              <label>
                <span>Bus ID</span>
                <input
                  value={form.busId}
                  onChange={(e) => setForm((prev) => ({ ...prev, busId: e.target.value }))}
                  placeholder="VD: 1"
                  disabled={isSubmitting || isFetchingDetail}
                />
                {errors.busId && <div className="field-error">{errors.busId}</div>}
              </label>
              <label>
                <span>Tuyến xe</span>
                <input value={form.routeName} readOnly disabled placeholder="Tự động từ backend" />
              </label>
              <label>
                <span>Tên xe</span>
                <input value={form.busName} readOnly disabled placeholder="Tự động từ backend" />
              </label>
              <label>
                <span>Biển số</span>
                <input value={form.plate} readOnly disabled placeholder="Biển số tự động từ xe" />
              </label>
              <label>
                <span>Khởi hành</span>
                <input
                  type="datetime-local"
                  value={formatDatetimeLocal(form.departAt)}
                  onChange={(e) => handleDateChange("departAt", e.target.value)}
                  disabled={!isEdit || isSubmitting || isFetchingDetail}
                />
                {!isEdit && (
                  <div className="field-hint">Lịch trình mới sẽ tự tạo thời gian khởi hành.</div>
                )}
              </label>
              <label>
                <span>Đến nơi</span>
                <input
                  type="datetime-local"
                  value={formatDatetimeLocal(form.arriveAt)}
                  onChange={(e) => handleDateChange("arriveAt", e.target.value)}
                  disabled={!isEdit || isSubmitting || isFetchingDetail}
                />
                {!isEdit && (
                  <div className="field-hint">Hệ thống tự động tính thời gian đến.</div>
                )}
              </label>
              <label>
                <span>Chỗ trống</span>
                <input type="number" min="0" value={form.seatsEmpty} readOnly disabled />
                <div className="field-hint">Tự động theo vé đã bán.</div>
              </label>
              <label>
                <span>Tổng chỗ</span>
                <input
                  type="number"
                  min="1"
                  value={form.seatsTotal}
                  onChange={(e) => setForm((prev) => ({ ...prev, seatsTotal: e.target.value }))}
                  disabled={isSubmitting || isFetchingDetail}
                />
                {errors.seatsTotal && <div className="field-error">{errors.seatsTotal}</div>}
              </label>
              <label>
                <span>Trạng thái</span>
                <select
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                  disabled={isSubmitting || isFetchingDetail}
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
                disabled={isSubmitting || isFetchingDetail}
              >
                Hủy
              </button>
              <button
                className="btn-primary"
                onClick={submit}
                disabled={isSubmitting || isFetchingDetail}
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
