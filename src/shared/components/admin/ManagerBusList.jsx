import { useCallback, useEffect, useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import "../../styles/AdminManageBusList.css";
import {
  fetchBuses,
  createBus,
  updateBus,
  deleteBus,
} from "../../../services/Bus/BusAdminApi";

const mapBusResponse = (payload) => {
  if (!payload) return null;
  const source = payload.data ?? payload;
  const company = source.company ?? source.bus_company ?? source.company_id;
  return {
    id: source.id,
    name: source.name ?? "",
    plate: source.license_plate ?? source.plate ?? "",
    desc: source.descriptions ?? source.description ?? "",
    capacity: source.capacity ?? 0,
    companyId:
      (typeof company === "object" ? company?.id : company) ??
      source.companyId ??
      "",
    companyName:
      (typeof company === "object" ? company?.name : source.company_name) ?? "",
    createdAt: source.created_at ?? source.createdAt ?? "",
    updatedAt: source.updated_at ?? source.updatedAt ?? "",
    raw: source,
  };
};

export default function ManagerBusList() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    plate: "",
    desc: "",
    capacity: "",
    companyId: "",
  });
  const [errors, setErrors] = useState({});

  const loadBuses = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const response = await fetchBuses();
      const list = Array.isArray(response)
        ? response
        : response?.data ?? response?.items ?? [];
      setRows(list.map(mapBusResponse).filter(Boolean));
    } catch (err) {
      console.error("Lỗi tải danh sách xe:", err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Không thể tải danh sách xe.";
      setFetchError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBuses();
  }, [loadBuses]);

  function openAdd() {
    setIsEdit(false);
    setEditingId(null);
    setForm({ name: "", plate: "", desc: "", capacity: "", companyId: "" });
    setErrors({});
    setShowModal(true);
  }

  function openEdit(r) {
    setIsEdit(true);
    setEditingId(r.id);
    setForm({
      name: r.name || "",
      plate: r.plate || "",
      desc: r.desc || "",
      capacity: r.capacity?.toString() ?? "",
      companyId:
        r.companyId === undefined || r.companyId === null
          ? ""
          : String(r.companyId),
    });
    setErrors({});
    setShowModal(true);
  }

  async function removeRow(r) {
    if (!window.confirm(`Xóa xe "${r.name}" (${r.plate})?`)) return;
    try {
      await deleteBus(r.id);
      setRows((prev) => prev.filter((x) => x.id !== r.id));
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Không thể xóa xe.";
      alert(message);
    }
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập tên xe";
    if (!form.plate.trim()) e.plate = "Vui lòng nhập biển số";
    if (form.capacity === "" || Number(form.capacity) <= 0) e.capacity = "Sức chứa > 0";
    if (form.companyId) {
      const companyValue = Number(form.companyId);
      if (Number.isNaN(companyValue) || companyValue <= 0) {
        e.companyId = "Company ID phải là số dương";
      }
    }
    return e;
  }

  async function submit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    const payload = {
      name: form.name.trim(),
      capacity: Number(form.capacity),
      license_plate: form.plate.trim(),
      descriptions: form.desc.trim() || undefined,
      company: form.companyId ? Number(form.companyId) : undefined,
    };
    setIsSubmitting(true);
    try {
      if (isEdit && editingId != null) {
        const response = await updateBus(editingId, payload);
        const updated = mapBusResponse(response?.data ?? response);
        if (updated) {
          setRows((prev) =>
            prev.map((r) => (r.id === editingId ? updated : r))
          );
        } else {
          await loadBuses();
        }
      } else {
        const response = await createBus(payload);
        const created = mapBusResponse(response?.data ?? response);
        setRows((prev) => (created ? [created, ...prev] : prev));
      }
      setShowModal(false);
      setForm({ name: "", plate: "", desc: "", capacity: "", companyId: "" });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Không thể lưu xe.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows.filter((r) => {
      const idText = (r.id ?? "").toString();
      const name = r.name?.toLowerCase() ?? "";
      const plate = r.plate?.toLowerCase() ?? "";
      const companyId = (r.companyId ?? "").toString();
      const matches =
        !q ||
        idText.includes(q) ||
        name.includes(q) ||
        plate.includes(q) ||
        companyId.includes(q);
      return matches;
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
    else { setSortBy(key); setSortDir("asc"); }
  }

  function sortLabel(key, label) {
    return (
      <span style={{cursor:'pointer'}} onClick={() => toggleSort(key)}>{label}</span>
    );
  }

  return (
    <div className="manage-buslist">
      <div className="head">
        <div className="title">Quản lý xe</div>
        <div className="sub">Quản lý thông tin các xe buýt trong hệ thống</div>
      </div>

      <div className="toolbar">
        <div className="search">
          <SearchIcon className="search-icon" fontSize="small" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Tìm kiếm theo ID, tên xe, biển số, company ID..." />
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <AddIcon fontSize="small" />
          <span>Thêm xe</span>
        </button>
      </div>

      <div className="table-wrap">
        <table className="buslist-table">
          <thead>
            <tr>
              <th>{sortLabel("id", "ID")}</th>
              <th>{sortLabel("name", "Tên xe")}</th>
              <th>{sortLabel("plate", "Biển số")}</th>
              <th>Mô tả</th>
              <th>{sortLabel("capacity", "Sức chứa")}</th>
              <th>{sortLabel("companyId", "Company ID")}</th>
              <th>{sortLabel("createdAt", "Ngày tạo")}</th>
              <th>{sortLabel("updatedAt", "Cập nhật")}</th>
              <th style={{ width: 120 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="9" className="loading-cell">
                  Đang tải dữ liệu xe...
                </td>
              </tr>
            )}
            {!loading && fetchError && (
              <tr>
                <td colSpan="9" className="error-cell">
                  {fetchError}
                </td>
              </tr>
            )}
            {!loading && !fetchError && paged.length === 0 && (
              <tr>
                <td colSpan="9" className="empty">
                  Không có xe phù hợp.
                </td>
              </tr>
            )}
            {!loading &&
              !fetchError &&
              paged.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.name}</td>
                  <td className="mono">{r.plate}</td>
                  <td>{r.desc}</td>
                  <td>{r.capacity}</td>
                  <td>{r.companyId || "—"}</td>
                  <td>{r.createdAt || "—"}</td>
                  <td>{r.updatedAt || "—"}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="btn-ghost"
                        onClick={() => openEdit(r)}
                      >
                        <EditIcon fontSize="inherit" />
                        <span>Sửa</span>
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => removeRow(r)}
                      >
                        <DeleteIcon fontSize="inherit" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {filtered.length === 0 && !loading && !fetchError && (
          <div className="empty">Không có dữ liệu xe.</div>
        )}
        {filtered.length > 0 && !loading && !fetchError && (
          <div className="table-footer">
            <div className="info">Hiển thị {start + 1} - {Math.min(end, filtered.length)} trong tổng số {filtered.length} xe</div>
            <div className="pager">
              <button className="btn-page" disabled={pageSafe <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>&lt;</button>
              <div className="page-text">Trang {pageSafe} / {totalPages}</div>
              <button className="btn-page" disabled={pageSafe >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>&gt;</button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="modal-backdrop"
          onClick={() => !isSubmitting && setShowModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">{isEdit ? "Sửa xe" : "Thêm xe"}</div>
            <div className="modal-sub">{isEdit ? "Cập nhật thông tin xe" : "Nhập thông tin xe vào hệ thống"}</div>
            <div className="form-grid">
              <label>
                <span>Tên xe</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="VD: Xe khách 01" />
                {errors.name && <div className="field-error">{errors.name}</div>}
              </label>
              <label>
                <span>Biển số</span>
                <input value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} placeholder="VD: 51A-12345" />
                {errors.plate && <div className="field-error">{errors.plate}</div>}
              </label>
              <label>
                <span>Mô tả</span>
                <input value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="VD: Ghế ngồi 45 chỗ" />
              </label>
              <label>
                <span>Sức chứa</span>
                <input type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
                {errors.capacity && <div className="field-error">{errors.capacity}</div>}
              </label>
              <label>
                <span>Company ID</span>
                <input value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })} placeholder="VD: 10" />
                {errors.companyId && <div className="field-error">{errors.companyId}</div>}
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowModal(false)} disabled={isSubmitting}>Hủy</button>
              <button className="btn-primary" onClick={submit} disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : (isEdit ? "Lưu" : "Thêm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

