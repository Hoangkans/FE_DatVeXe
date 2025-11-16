import { useCallback, useEffect, useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
  fetchRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
} from "../../../services/Route/RouteAdminApi";
import { fetchStations } from "../../../services/Station/StationAdminApi";
import "../../styles/AdminManageRoute.css";

const createEmptyForm = () => ({
  departure_station: "",
  arrival_station: "",
  price: "",
  duration: "",
  distance: "",
});

const toRouteList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const mapRouteResponse = (route) => {
  if (!route) return null;
  const source = route.data ?? route;
  const departure = source.departure_station ?? source.departureStation;
  const arrival = source.arrival_station ?? source.arrivalStation;
  return {
    id: source.id,
    departure_station: departure?.id ?? source.departure_station_id ?? "",
    arrival_station: arrival?.id ?? source.arrival_station_id ?? "",
    departure_name: departure?.name ?? source.departure_station_name ?? "",
    arrival_name: arrival?.name ?? source.arrival_station_name ?? "",
    price: Number(source.price ?? 0),
    duration: Number(source.duration ?? 0),
    distance: Number(source.distance ?? 0),
    createdAt: source.created_at ?? source.createdAt ?? "",
    updatedAt: source.updated_at ?? source.updatedAt ?? "",
  };
};

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
  if (!value && value !== 0) return "--";
  try {
    return CURRENCY_FORMATTER.format(Number(value));
  } catch (err) {
    return value;
  }
};

const formatDuration = (minutes) => {
  const total = Number(minutes || 0);
  if (!total) return "--";
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  if (!hours) return `${mins} phút`;
  if (!mins) return `${hours} giờ`;
  return `${hours} giờ ${mins} phút`;
};

export default function ManageRoute() {
  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(() => createEmptyForm());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stationOptions = useMemo(() => {
    const list = Array.isArray(stations) ? stations : [];
    return list
      .map((item) => ({
        id: item.id,
        name: item.name ?? item.location ?? `Station #${item.id}`,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "vi"));
  }, [stations]);

  const stationNameById = useCallback(
    (id) =>
      stationOptions.find((option) => String(option.id) === String(id))?.name ?? `#${id}`,
    [stationOptions]
  );

  const filteredRoutes = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return routes;
    return routes.filter((route) => {
      const departure = route.departure_name?.toLowerCase() ?? "";
      const arrival = route.arrival_name?.toLowerCase() ?? "";
      const text = `${route.id}`;
      return departure.includes(term) || arrival.includes(term) || text.includes(term);
    });
  }, [routes, query]);

  const loadRoutes = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const response = await fetchRoutes();
      const list = toRouteList(response).map(mapRouteResponse).filter(Boolean);
      setRoutes(list);
    } catch (err) {
      console.error("Lỗi khi tải tuyến đường:", err);
      setFetchError(err?.response?.data?.message || "Không thể tải danh sách tuyến đường.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStations = useCallback(async () => {
    try {
      const response = await fetchStations();
      setStations(toRouteList(response));
    } catch (err) {
      console.error("Lỗi khi tải bến xe:", err);
    }
  }, []);

  useEffect(() => {
    loadRoutes();
    loadStations();
  }, [loadRoutes, loadStations]);

  const openAdd = () => {
    setForm(createEmptyForm());
    setErrors({});
    setIsEdit(false);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (route) => {
    setForm({
      departure_station: route.departure_station?.toString() ?? "",
      arrival_station: route.arrival_station?.toString() ?? "",
      price: route.price?.toString() ?? "",
      duration: route.duration?.toString() ?? "",
      distance: route.distance?.toString() ?? "",
    });
    setErrors({});
    setIsEdit(true);
    setEditingId(route.id);
    setShowModal(true);
  };

  const validate = () => {
    const next = {};
    if (!form.departure_station?.trim()) next.departure_station = "Chọn bến khởi hành";
    if (!form.arrival_station?.trim()) next.arrival_station = "Chọn bến đến";
    if (
      form.departure_station &&
      form.arrival_station &&
      form.departure_station === form.arrival_station
    ) {
      next.arrival_station = "Bến đi và bến đến không được trùng";
    }
    if (!form.price?.trim()) next.price = "Nhập giá vé";
    else if (Number(form.price) < 0) next.price = "Giá vé phải >= 0";
    if (!form.duration?.trim()) next.duration = "Nhập thời gian";
    else if (Number(form.duration) <= 0) next.duration = "Thời gian phải > 0";
    if (!form.distance?.trim()) next.distance = "Nhập quãng đường";
    else if (Number(form.distance) <= 0) next.distance = "Quãng đường phải > 0";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        departure_station: Number(form.departure_station),
        arrival_station: Number(form.arrival_station),
        price: Number(form.price),
        duration: Number(form.duration),
        distance: Number(form.distance),
      };
      if (isEdit && editingId) {
        await updateRoute(editingId, payload);
      } else {
        await createRoute(payload);
      }
      setShowModal(false);
      setForm(createEmptyForm());
      await loadRoutes();
    } catch (err) {
      console.error("Không thể lưu tuyến đường:", err);
      const message = err?.response?.data?.message;
      if (typeof message === "string") {
        setErrors((prev) => ({ ...prev, general: message }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (routeId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tuyến đường này?")) return;
    try {
      await deleteRoute(routeId);
      await loadRoutes();
    } catch (err) {
      console.error("Không thể xóa tuyến đường:", err);
      alert(err?.response?.data?.message || "Xóa tuyến đường thất bại.");
    }
  };

  return (
    <div className="manage-route">
      <div className="head">
        <div className="title">Tuyến đường</div>
        <div className="sub">Quản lý bến đi, bến đến, giá vé và quãng đường.</div>
      </div>

      <div className="toolbar">
        <div className="search">
          <SearchIcon className="search-icon" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên bến hoặc mã tuyến"
          />
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <AddIcon /> Thêm tuyến đường
        </button>
      </div>

      <div className="table-wrap">
        {fetchError && <div className="error-text">{fetchError}</div>}
        {loading ? (
          <div className="empty">Đang tải dữ liệu...</div>
        ) : filteredRoutes.length === 0 ? (
          <div className="empty">Chưa có tuyến đường nào.</div>
        ) : (
          <table className="route-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Bến khởi hành</th>
                <th>Bến đến</th>
                <th>Giá vé</th>
                <th>Thời gian</th>
                <th>Quãng đường</th>
                <th>Tạo lúc</th>
                <th>Cập nhật</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.map((route) => (
                <tr key={route.id}>
                  <td>{route.id}</td>
                  <td>
                    <div className="cell-strong">
                      {route.departure_name || stationNameById(route.departure_station)}
                    </div>
                    <div className="muted">#{route.departure_station}</div>
                  </td>
                  <td>
                    <div className="cell-strong">
                      {route.arrival_name || stationNameById(route.arrival_station)}
                    </div>
                    <div className="muted">#{route.arrival_station}</div>
                  </td>
                  <td>{formatCurrency(route.price)}</td>
                  <td>{formatDuration(route.duration)}</td>
                  <td>{route.distance ? `${route.distance} km` : "--"}</td>
                  <td>{formatDateTime(route.createdAt)}</td>
                  <td>{formatDateTime(route.updatedAt)}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn-ghost" onClick={() => openEdit(route)}>
                        <EditIcon fontSize="small" /> Sửa
                      </button>
                      <button className="btn-danger" onClick={() => handleDelete(route.id)}>
                        <DeleteIcon fontSize="small" /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => !isSubmitting && setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              {isEdit ? "Sửa tuyến đường" : "Thêm tuyến đường"}
            </div>
            <div className="modal-sub">
              {isEdit ? "Cập nhật thông tin tuyến đường" : "Nhập tuyến đường mới"}
            </div>
            {errors.general && <div className="error-text">{errors.general}</div>}

            <div className="form-grid">
              <label>
                <span>Bến khởi hành</span>
                <select
                  value={form.departure_station}
                  onChange={(e) => setForm({ ...form, departure_station: e.target.value })}
                  disabled={isSubmitting}
                >
                  <option value="">-- Chọn bến --</option>
                  {stationOptions.map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.name}
                    </option>
                  ))}
                </select>
                {errors.departure_station && (
                  <div className="field-error">{errors.departure_station}</div>
                )}
              </label>

              <label>
                <span>Bến đến</span>
                <select
                  value={form.arrival_station}
                  onChange={(e) => setForm({ ...form, arrival_station: e.target.value })}
                  disabled={isSubmitting}
                >
                  <option value="">-- Chọn bến --</option>
                  {stationOptions.map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.name}
                    </option>
                  ))}
                </select>
                {errors.arrival_station && (
                  <div className="field-error">{errors.arrival_station}</div>
                )}
              </label>

              <label>
                <span>Giá vé (VNĐ)</span>
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  disabled={isSubmitting}
                />
                {errors.price && <div className="field-error">{errors.price}</div>}
              </label>

              <label>
                <span>Thời gian (phút)</span>
                <input
                  type="number"
                  min={1}
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  disabled={isSubmitting}
                />
                {errors.duration && <div className="field-error">{errors.duration}</div>}
              </label>

              <label>
                <span>Quãng đường (km)</span>
                <input
                  type="number"
                  min={1}
                  value={form.distance}
                  onChange={(e) => setForm({ ...form, distance: e.target.value })}
                  disabled={isSubmitting}
                />
                {errors.distance && <div className="field-error">{errors.distance}</div>}
              </label>
            </div>

            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowModal(false)} disabled={isSubmitting}>
                Hủy
              </button>
              <button className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : isEdit ? "Lưu" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
