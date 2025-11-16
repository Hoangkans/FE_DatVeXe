import { useCallback, useEffect, useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
  createSeat,
  deleteSeat,
  fetchSeatsByBus,
  updateSeat,
} from "../../../services/Seat/SeatAdminApi";
import { fetchBuses } from "../../../services/Bus/BusAdminApi";
import "../../styles/AdminManageSeat.css";

const seatTypes = [
  { value: "STANDARD", label: "Standard" },
  { value: "VIP", label: "VIP" },
  { value: "LUXURY", label: "Luxury" },
];

const seatStatuses = [
  { value: "AVAILABLE", label: "Còn trống" },
  { value: "BOOKED", label: "Đã đặt" },
];

const createEmptyForm = (busId = "") => ({
  bus_id: busId || "",
  seat_number: "",
  seat_type: seatTypes[0].value,
  price_for_seat_type: "",
  status: seatStatuses[0].value,
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
});

const CURRENCY_FORMATTER = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const formatDateTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return DATE_TIME_FORMATTER.format(date);
};

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "--";
  try {
    return CURRENCY_FORMATTER.format(Number(value));
  } catch (err) {
    return value;
  }
};

const mapSeatResponse = (seat) => {
  if (!seat) return null;
  const source = seat.data ?? seat;
  const bus = source.bus ?? source.bus_id ?? source.busId;
  return {
    id: source.id,
    bus_id: bus?.id ?? source.bus_id ?? "",
    bus_name:
      bus?.name ??
      source.bus_name ??
      (bus ? `Xe #${bus?.id}` : source.busId ? `Xe #${source.busId}` : ""),
    bus_plate: bus?.license_plate ?? bus?.plate ?? source.bus_plate ?? "",
    seat_number: source.seat_number ?? "",
    seat_type: source.seat_type ?? "",
    status: source.status ?? "AVAILABLE",
    price_for_seat_type: Number(source.price_for_seat_type ?? 0),
    createdAt: source.created_at ?? source.createdAt ?? "",
    updatedAt: source.updated_at ?? source.updatedAt ?? "",
    raw: source,
  };
};

const mapBusOption = (bus) => {
  if (!bus) return null;
  const source = bus.data ?? bus;
  return {
    id: source.id,
    name: source.name ?? `Xe #${source.id}`,
    plate: source.license_plate ?? source.plate ?? source.licensePlate ?? "",
  };
};

const seatTypeLabel = (value) =>
  seatTypes.find((t) => t.value === value)?.label || value;

const seatStatusLabel = (value) =>
  seatStatuses.find((t) => t.value === value)?.label || value;

export default function ManageSeat() {
  const [buses, setBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState("");
  const [seats, setSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [loadingBuses, setLoadingBuses] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [busError, setBusError] = useState("");
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(() => createEmptyForm());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadBuses = useCallback(async () => {
    setLoadingBuses(true);
    setBusError("");
    try {
      const response = await fetchBuses();
      const list = Array.isArray(response)
        ? response
        : response?.data ?? response?.items ?? [];
      const mapped = list.map(mapBusOption).filter(Boolean);
      mapped.sort((a, b) => a.name.localeCompare(b.name, "vi"));
      setBuses(mapped);
      if (!selectedBusId && mapped.length) {
        setSelectedBusId(String(mapped[0].id));
      }
    } catch (err) {
      console.error("Lỗi tải danh sách xe:", err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Không thể tải danh sách xe.";
      setBusError(message);
    } finally {
      setLoadingBuses(false);
    }
  }, [selectedBusId]);

  const loadSeats = useCallback(async (busId) => {
    if (!busId) {
      setSeats([]);
      return;
    }
    setLoadingSeats(true);
    setFetchError("");
    try {
      const response = await fetchSeatsByBus(busId);
      const list = Array.isArray(response)
        ? response
        : response?.data ?? response?.items ?? [];
      const mapped = list.map(mapSeatResponse).filter(Boolean);
      mapped.sort((a, b) => a.seat_number.localeCompare(b.seat_number, "vi"));
      setSeats(mapped);
    } catch (err) {
      console.error("Lỗi tải danh sách ghế:", err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Không thể tải danh sách ghế.";
      setFetchError(message);
    } finally {
      setLoadingSeats(false);
    }
  }, []);

  useEffect(() => {
    loadBuses();
  }, [loadBuses]);

  useEffect(() => {
    if (!selectedBusId) {
      setSeats([]);
      return;
    }
    loadSeats(selectedBusId);
  }, [selectedBusId, loadSeats]);

  const filteredSeats = useMemo(() => {
    const term = query.trim().toLowerCase();
    return seats.filter((seat) => {
      const matchesQuery =
        !term ||
        seat.seat_number?.toLowerCase().includes(term) ||
        seatTypeLabel(seat.seat_type).toLowerCase().includes(term) ||
        seatStatusLabel(seat.status).toLowerCase().includes(term);
      const matchesType =
        filterType === "all" || seat.seat_type === filterType;
      const matchesStatus =
        filterStatus === "all" || seat.status === filterStatus;
      return matchesQuery && matchesType && matchesStatus;
    });
  }, [seats, query, filterType, filterStatus]);

  function openAdd() {
    setIsEdit(false);
    setEditingId(null);
    setForm(createEmptyForm(selectedBusId));
    setErrors({});
    setShowModal(true);
  }

  function openEdit(row) {
    setIsEdit(true);
    setEditingId(row.id);
    setForm({
      bus_id: row.bus_id ? String(row.bus_id) : selectedBusId,
      seat_number: row.seat_number || "",
      seat_type: row.seat_type || seatTypes[0].value,
      price_for_seat_type:
        row.price_for_seat_type === undefined || row.price_for_seat_type === null
          ? ""
          : String(row.price_for_seat_type),
      status: row.status || seatStatuses[0].value,
    });
    setErrors({});
    setShowModal(true);
  }

  async function removeRow(row) {
    if (!window.confirm(`Xóa ghế "${row.seat_number}"?`)) return;
    try {
      await deleteSeat(row.id);
      setSeats((prev) => prev.filter((s) => s.id !== row.id));
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Không thể xóa ghế.";
      alert(message);
    }
  }

  function validate() {
    const e = {};
    if (!form.bus_id) e.bus_id = "Vui lòng chọn xe";
    if (!form.seat_number.trim()) e.seat_number = "Vui lòng nhập số ghế";
    if (!form.seat_type) e.seat_type = "Vui lòng chọn loại ghế";
    if (form.price_for_seat_type === "") {
      e.price_for_seat_type = "Nhập giá cộng thêm (có thể là 0)";
    } else if (Number.isNaN(Number(form.price_for_seat_type))) {
      e.price_for_seat_type = "Giá cộng thêm phải là số";
    } else if (Number(form.price_for_seat_type) < 0) {
      e.price_for_seat_type = "Giá cộng thêm không âm";
    }
    if (!form.status) e.status = "Chọn trạng thái";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const payload = {
      bus_id: Number(form.bus_id),
      seat_number: form.seat_number.trim(),
      seat_type: form.seat_type,
      price_for_seat_type: Number(form.price_for_seat_type || 0),
      status: form.status,
    };

    setIsSubmitting(true);
    try {
      if (isEdit && editingId != null) {
        const response = await updateSeat(editingId, payload);
        const updated = mapSeatResponse(response);
        setSeats((prev) =>
          prev
            .map((s) => (s.id === editingId ? updated ?? s : s))
            .filter(Boolean)
        );
      } else {
        const response = await createSeat(payload);
        const created = mapSeatResponse(response);
        if (created) {
          setSeats((prev) =>
            [...prev, created].sort((a, b) =>
              a.seat_number.localeCompare(b.seat_number, "vi")
            )
          );
        }
      }
      setSelectedBusId(String(payload.bus_id));
      setShowModal(false);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Không thể lưu ghế.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedBusLabel = useMemo(() => {
    const found = buses.find((b) => String(b.id) === String(selectedBusId));
    if (!found) return "";
    if (found.plate) return `${found.name} (${found.plate})`;
    return found.name;
  }, [buses, selectedBusId]);

  return (
    <div className="manage-seat">
      <div className="head">
        <div className="title">Quản lý ghế ngồi</div>
        <div className="sub">
          Xem, thêm, chỉnh sửa và xóa ghế theo từng xe.
        </div>
      </div>

      <div className="toolbar">
        <div className="search">
          <SearchIcon className="search-icon" fontSize="small" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo số ghế, loại ghế, trạng thái..."
          />
        </div>

        <select
          className="filter"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Tất cả loại ghế</option>
          {seatTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <select
          className="filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          {seatStatuses.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <select
          className="bus-selector"
          value={selectedBusId}
          onChange={(e) => setSelectedBusId(e.target.value)}
          disabled={loadingBuses}
        >
          <option value="">Chọn xe</option>
          {buses.map((bus) => (
            <option key={bus.id} value={bus.id}>
              {bus.plate ? `${bus.name} (${bus.plate})` : bus.name}
            </option>
          ))}
        </select>

        <button className="btn-primary" onClick={openAdd} disabled={!buses.length}>
          <AddIcon fontSize="small" />
          <span>Thêm ghế</span>
        </button>
      </div>

      {busError && <div className="error-text">{busError}</div>}

      <div className="table-wrap">
        <div className="table-head">
          <div>
            <div className="muted">Xe đang xem</div>
            <div className="cell-strong">{selectedBusLabel || "--"}</div>
          </div>
          <div className="muted">
            {loadingSeats
              ? "Đang tải ghế..."
              : `${filteredSeats.length} / ${seats.length} ghế`}
          </div>
        </div>
        <table className="seat-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Số ghế</th>
              <th>Loại ghế</th>
              <th>Trạng thái</th>
              <th>Giá cộng thêm</th>
              <th>Ngày tạo</th>
              <th>Cập nhật</th>
              <th style={{ width: 120 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loadingSeats && (
              <tr>
                <td colSpan="8" className="muted">
                  Đang tải danh sách ghế...
                </td>
              </tr>
            )}
            {!loadingSeats && fetchError && (
              <tr>
                <td colSpan="8" className="error-text">
                  {fetchError}
                </td>
              </tr>
            )}
            {!loadingSeats && !fetchError && filteredSeats.length === 0 && (
              <tr>
                <td colSpan="8" className="muted">
                  Chưa có ghế nào cho xe này.
                </td>
              </tr>
            )}
            {!loadingSeats &&
              !fetchError &&
              filteredSeats.map((seat, idx) => (
                <tr key={seat.id}>
                  <td>{idx + 1}</td>
                  <td className="cell-strong">{seat.seat_number}</td>
                  <td>{seatTypeLabel(seat.seat_type)}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        seat.status === "AVAILABLE" ? "is-available" : "is-booked"
                      }`}
                    >
                      {seatStatusLabel(seat.status)}
                    </span>
                  </td>
                  <td>{formatCurrency(seat.price_for_seat_type)}</td>
                  <td>{formatDateTime(seat.createdAt)}</td>
                  <td>{formatDateTime(seat.updatedAt)}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn-ghost" onClick={() => openEdit(seat)}>
                        <EditIcon fontSize="inherit" />
                        <span>Sửa</span>
                      </button>
                      <button className="btn-danger" onClick={() => removeRow(seat)}>
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

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">{isEdit ? "Cập nhật ghế" : "Thêm ghế mới"}</div>
            <div className="modal-sub">
              {isEdit
                ? "Chỉnh sửa thông tin ghế"
                : "Nhập thông tin ghế cho xe được chọn"}
            </div>

            <div className="form-grid">
              <label>
                <span>Xe</span>
                <select
                  value={form.bus_id}
                  onChange={(e) => setForm({ ...form, bus_id: e.target.value })}
                >
                  <option value="">Chọn xe</option>
                  {buses.map((bus) => (
                    <option key={bus.id} value={bus.id}>
                      {bus.plate ? `${bus.name} (${bus.plate})` : bus.name}
                    </option>
                  ))}
                </select>
                {errors.bus_id && <div className="field-error">{errors.bus_id}</div>}
              </label>

              <label>
                <span>Số ghế</span>
                <input
                  value={form.seat_number}
                  onChange={(e) =>
                    setForm({ ...form, seat_number: e.target.value.toUpperCase() })
                  }
                  placeholder="VD: A1, B2..."
                />
                {errors.seat_number && (
                  <div className="field-error">{errors.seat_number}</div>
                )}
              </label>

              <label>
                <span>Loại ghế</span>
                <select
                  value={form.seat_type}
                  onChange={(e) => setForm({ ...form, seat_type: e.target.value })}
                >
                  {seatTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {errors.seat_type && <div className="field-error">{errors.seat_type}</div>}
              </label>

              <label>
                <span>Giá cộng thêm</span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={form.price_for_seat_type}
                  onChange={(e) =>
                    setForm({ ...form, price_for_seat_type: e.target.value })
                  }
                  placeholder="VD: 50000"
                />
                {errors.price_for_seat_type && (
                  <div className="field-error">{errors.price_for_seat_type}</div>
                )}
              </label>

              <label>
                <span>Trạng thái</span>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {seatStatuses.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {errors.status && <div className="field-error">{errors.status}</div>}
              </label>
            </div>

            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>
                Hủy
              </button>
              <button className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
