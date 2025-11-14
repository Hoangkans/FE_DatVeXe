import { useCallback, useEffect, useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
  fetchStations,
  createStation,
  updateStation,
  deleteStation,
} from "../../../services/Station/StationAdminApi";
import "../../styles/AdminManageStation.css";

const createEmptyForm = () => ({
  name: "",
  location: "",
  image: "",
  wallpaper: "",
  descriptions: "",
});

const toStationList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
});

const formatDateTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return DATE_TIME_FORMATTER.format(date);
};

const truncate = (value, max = 120) => {
  if (!value) return "--";
  if (value.length <= max) return value;
  return `${value.slice(0, max)}…`;
};

const isValidUrl = (value) => {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return Boolean(parsed.href);
  } catch (err) {
    return false;
  }
};

const mapStationResponse = (station) => {
  if (!station) return null;
  const source = station.data ?? station;
  return {
    id: source.id,
    name: source.name ?? "",
    location: source.location ?? "",
    image: source.image ?? source.image_url ?? "",
    wallpaper: source.wallpaper ?? source.wallpaper_url ?? source.cover ?? "",
    descriptions: source.descriptions ?? source.description ?? "",
    createdAt: source.created_at ?? source.createdAt ?? "",
    updatedAt: source.updated_at ?? source.updatedAt ?? "",
    raw: source,
  };
};

export default function ManageStation() {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(() => createEmptyForm());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const CLOUD_NAME =
    import.meta.env.VITE_CLOUD_NAME?.trim() || "dmcfssn9h";
  const UPLOAD_PRESET =
    import.meta.env.VITE_CLOUD_UPLOAD_PRESET?.trim() || "ml_default";
  const [uploading, setUploading] = useState({ image: false, wallpaper: false });
  const canUploadImages = Boolean(CLOUD_NAME && UPLOAD_PRESET);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const name = r.name?.toLowerCase() ?? "";
      const location = r.location?.toLowerCase() ?? "";
      const descriptions = r.descriptions?.toLowerCase() ?? "";
      return (
        name.includes(q) ||
        location.includes(q) ||
        descriptions.includes(q)
      );
    });
  }, [rows, query]);

  const loadStations = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const response = await fetchStations();
      const list = toStationList(response);
      setRows(list.map(mapStationResponse).filter(Boolean));
    } catch (err) {
      console.error("Lỗi khi lấy danh sách bến xe:", err);
      const message =
        err?.response?.data?.message || "Không thể tải danh sách bến xe.";
      setFetchError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStations();
  }, [loadStations]);

  function openAdd() {
    setIsEdit(false);
    setEditingId(null);
    setForm(createEmptyForm());
    setErrors({});
    setShowModal(true);
  }

  function openEdit(r) {
    setIsEdit(true);
    setEditingId(r.id);
    setForm({
      name: r.name ?? "",
      location: r.location ?? "",
      image: r.image ?? "",
      wallpaper: r.wallpaper ?? "",
      descriptions: r.descriptions ?? "",
    });
    setErrors({});
    setShowModal(true);
  }

  async function removeRow(r) {
    if (!window.confirm(`Xóa bến xe "${r.name}"?`)) return;
    try {
      await deleteStation(r.id);
      setRows((prev) => prev.filter((x) => x.id !== r.id));
    } catch (err) {
      console.error("Lỗi xóa bến xe:", err);
      alert(err?.response?.data?.message || "Không thể xóa bến xe.");
    }
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập tên bến xe";
    if (!form.location.trim())
      e.location = "Vui lòng nhập vị trí bến xe";
    if (!form.image.trim()) {
      e.image = "Vui lòng chọn ảnh đại diện cho bến xe";
    } else if (!isValidUrl(form.image)) {
      e.image = "Đường dẫn hình ảnh không hợp lệ";
    }
    if (!form.wallpaper.trim()) {
      e.wallpaper = "Vui lòng chọn ảnh nền cho bến xe";
    } else if (!isValidUrl(form.wallpaper)) {
      e.wallpaper = "Đường dẫn ảnh nền không hợp lệ";
    }
    return e;
  }

  async function submit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    const payload = {
      name: form.name.trim(),
      location: form.location.trim(),
      image: form.image.trim() || undefined,
      wallpaper: form.wallpaper.trim() || undefined,
      descriptions: form.descriptions.trim(),
    };
    setIsSubmitting(true);
    try {
      if (isEdit && editingId != null) {
        const response = await updateStation(editingId, payload);
        const updated = mapStationResponse(response?.data ?? response);
        if (updated) {
          setRows((prev) =>
            prev.map((r) => (r.id === editingId ? updated : r))
          );
        } else {
          await loadStations();
        }
      } else {
        const response = await createStation(payload);
        const created = mapStationResponse(response?.data ?? response);
        setRows((prev) => (created ? [created, ...prev] : prev));
      }
      setShowModal(false);
      setForm(createEmptyForm());
    } catch (err) {
      console.error("Lỗi lưu bến xe:", err);
      alert(err?.response?.data?.message || "Không thể lưu bến xe.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleFileSelect(event, field) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!canUploadImages) {
      alert("Chưa cấu hình thông tin Cloudinary để tải ảnh.");
      event.target.value = "";
      return;
    }

    setUploading((prev) => ({ ...prev, [field]: true }));
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Không thể tải ảnh. Vui lòng thử lại.");
      }

      const data = await response.json();
      const imageUrl = data.secure_url || data.url;
      if (!imageUrl) {
        throw new Error("Cloudinary không trả về URL ảnh.");
      }

      setForm((prev) => ({ ...prev, [field]: imageUrl }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      alert(error?.message || "Không thể tải ảnh lên Cloudinary.");
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
      event.target.value = "";
    }
  }

  // Stats card removed

  return (
    <div className="manage-station">
      <div className="head">
        <div className="title">Quản lý bến xe</div>
        <div className="sub">Quản lý thông tin các bến xe trong hệ thống</div>
      </div>

      <div className="toolbar">
        <div className="search">
          <SearchIcon className="search-icon" fontSize="small" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm bến xe theo tên, vị trí, mô tả..."
          />
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <AddIcon fontSize="small" />
          <span>Thêm bến xe</span>
        </button>
      </div>

      <div className="table-wrap">
        <table className="station-table">
          <thead>
            <tr>
              <th>Thông tin bến xe</th>
              <th>Hình ảnh</th>
              <th>Mô tả</th>
              <th>Cập nhật</th>
              <th style={{ width: 140 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  Đang tải dữ liệu bến xe...
                </td>
              </tr>
            )}
            {!loading && fetchError && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "#d33" }}>
                  {fetchError}
                </td>
              </tr>
            )}
            {!loading && !fetchError && filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  Không có bến xe nào phù hợp.
                </td>
              </tr>
            )}
            {!loading &&
              !fetchError &&
              filtered.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="station-name">{r.name}</div>
                    <div className="station-city">
                      {r.location || "Chưa cập nhật vị trí"}
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div className="muted">Ảnh đại diện</div>
                        {r.image ? (
                          <img
                            src={r.image}
                            alt={`Ảnh ${r.name}`}
                            style={{
                              width: 80,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: 4,
                            }}
                          />
                        ) : (
                          <div className="muted">Chưa có</div>
                        )}
                      </div>
                      <div>
                        <div className="muted">Ảnh nền</div>
                        {r.wallpaper ? (
                          <img
                            src={r.wallpaper}
                            alt={`Ảnh nền ${r.name}`}
                            style={{
                              width: 80,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: 4,
                            }}
                          />
                        ) : (
                          <div className="muted">Chưa có</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="station-description">
                      {truncate(r.descriptions)}
                    </div>
                  </td>
                  <td>
                    <div className="muted">
                      Cập nhật: {formatDateTime(r.updatedAt)}
                    </div>
                    <div className="muted">
                      Tạo: {formatDateTime(r.createdAt)}
                    </div>
                  </td>
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
      </div>

      {/* Stats section removed per request */}

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              {isEdit ? "Sửa bến xe" : "Thêm bến xe"}
            </div>
            <div className="modal-sub">
              {isEdit
                ? "Cập nhật thông tin bến xe"
                : "Nhập thông tin bến xe vào hệ thống"}
            </div>
            <div className="form-section">
              <div className="form-section-title">Thông tin chung</div>
              <div className="form-grid two-columns">
                <label>
                  <span>Tên bến xe</span>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="VD: Bến xe ABC"
                  />
                  {errors.name && (
                    <div className="field-error">{errors.name}</div>
                  )}
                </label>
                <label>
                  <span>Vị trí</span>
                  <input
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    placeholder="Số nhà, đường, phường, quận, tỉnh..."
                  />
                  {errors.location && (
                    <div className="field-error">{errors.location}</div>
                  )}
                </label>
                <label className="full-width">
                  <span>Mô tả</span>
                  <textarea
                    rows={4}
                    value={form.descriptions}
                    onChange={(e) =>
                      setForm({ ...form, descriptions: e.target.value })
                    }
                    placeholder="Giới thiệu bến xe, tiện ích, dịch vụ..."
                  ></textarea>
                </label>
              </div>
            </div>
            <div className="form-section">
              <div className="form-section-title">Hình ảnh</div>
              <div className="image-grid">
                <div className="image-field">
                  <label>
                    <span>Ảnh đại diện</span>
                    <div className="file-input-row">
                      <input
                        type="file"
                        accept="image/*"
                        disabled={!canUploadImages || uploading.image}
                        onChange={(e) => handleFileSelect(e, "image")}
                      />
                      {uploading.image && (
                        <span className="uploading-text">Đang tải ảnh...</span>
                      )}
                    </div>
                    {!uploading.image && form.image && (
                      <div className="field-hint url-preview">{form.image}</div>
                    )}
                    {!canUploadImages && (
                      <div className="field-hint">
                        Cloudinary chưa được cấu hình, vui lòng nhập URL thủ
                        công.
                      </div>
                    )}
                    {errors.image && (
                      <div className="field-error">{errors.image}</div>
                    )}
                  </label>
                </div>
                <div className="image-field">
                  <label>
                    <span>Ảnh nền</span>
                    <div className="file-input-row">
                      <input
                        type="file"
                        accept="image/*"
                        disabled={!canUploadImages || uploading.wallpaper}
                        onChange={(e) => handleFileSelect(e, "wallpaper")}
                      />
                      {uploading.wallpaper && (
                        <span className="uploading-text">
                          Đang tải ảnh nền...
                        </span>
                      )}
                    </div>
                    {!uploading.wallpaper && form.wallpaper && (
                      <div className="field-hint url-preview">
                        {form.wallpaper}
                      </div>
                    )}
                    {!canUploadImages && (
                      <div className="field-hint">
                        Cloudinary chưa được cấu hình, vui lòng nhập URL thủ
                        công.
                      </div>
                    )}
                    {errors.wallpaper && (
                      <div className="field-error">{errors.wallpaper}</div>
                    )}
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn-primary" onClick={submit} disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : isEdit ? "Lưu" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
