import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../shared/layouts/AdminLayout";
import {
  fetchBusCompanies,
  createBusCompany,
  updateBusCompany,
  deleteBusCompany,
} from "../../services/Bus/BusCompanyAPI";
import "../../shared/styles/AdminManageOperators.css";
import SearchIcon from "@mui/icons-material/Search";
import { use } from "react";

export default function AdminOperators() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Dùng cho lỗi tải dữ liệu chung
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", image: "", description: "" });
  const [formErr, setFormErr] = useState({}); 

  const [isUploading, setIsUploading] = useState(false);
  const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUD_UPLOAD_PRESET;

  async function loadData() {
    setLoading(true);
    try {
      const data = await fetchBusCompanies({ page: 1, limit: 20 });
      const list = Array.isArray(data)
        ? data
        : data?.content ?? data?.data ?? data?.items ?? [];
      setRows(list);
      setError("");
    } catch (e) {
      const serverMsg = e?.response?.data?.message || e?.response?.data?.error;
      setError(serverMsg || e?.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }

  useEffect( () => {
    loadData();
  }, []);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    // SỬA LỖI: Dùng setFormErr để xóa lỗi ảnh (nếu có) thay vì setError
    setFormErr((prev) => ({ ...prev, image: undefined }));
    // setApiError(null); // <-- Đã xóa

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      setForm((prevForm) => ({ ...prevForm, image: data.secure_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      setFormErr((prev) => ({
        ...prev,
        image: "Lỗi: Không thể tải ảnh lên.",
      }));
    } finally {
      setIsUploading(false);
    }
  };


  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const id = (r.id ?? "") + "";
      const name = (r.company_name || r.name || "") + "";
      const desc = (r.descriptions || r.description || "") + "";
      return (
        id.toLowerCase().includes(q) ||
        name.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q)
      );
    });
  }, [rows, query]);

  function openAdd() {
    setIsEdit(false);
    setEditingId(null);
    setForm({ name: "", image: "", description: "" });
    setFormErr({});
    setShowModal(true);
  }

  function openEdit(item) {
    setIsEdit(true);
    setEditingId(item.id);
    setForm({
      name: item.company_name || item.name || "",
      image: item.image || "",
      description: item.descriptions || item.description || "",
    });
    setFormErr({});
    setShowModal(true);
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập tên nhà xe";
    return e;
  }

  async function handleSave() {
    const e = validate();
    setFormErr(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    try {
      const payload = {
        company_name: form.name,
        image: form.image || null,
        descriptions: form.description || null,
      };
      if (isEdit && editingId != null) {
        const res = await updateBusCompany(editingId, payload);
        const updated = res?.data || res || { ...payload, id: editingId }; 
        setRows((prev) =>
          prev.map((r) => (r.id === editingId ? { ...r, ...updated } : r))
        );
      } else {
        await createBusCompany(payload);
        await loadData();
      }
      setShowModal(false);
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message || err?.response?.data?.error;
      setFormErr({ _server: serverMsg || err?.message || "Không thể lưu" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Xóa nhà xe "${item.company_name || item.name}"?`))
      return;
    try {
      await deleteBusCompany(item.id);
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message || err?.response?.data?.error;
      alert(serverMsg || err?.message || "Không thể xóa");
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== item.id));
  }

  return (
    <AdminLayout>
      <div className="manage-operators">
        <div className="head">
          <h1 className="title" style={{ margin: 0 }}>
            Quản lý nhà xe
          </h1>
          <button onClick={openAdd} className="btn-primary">
            + Thêm nhà xe
          </button>
        </div>
        <div className="toolbar">
          <div className="search">
            <SearchIcon className="search-icon" fontSize="small" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo ID, tên, mô tả..."
            />
          </div>
        </div>

        {loading && <div>Đang tải dữ liệu...</div>}
        {error && !loading && (
          <div style={{ color: "#b91c1c", marginBottom: 12 }}>Lỗi: {error}</div>
        )}

        {!loading && !error && (
          <div className="table-wrap">
            <table className="operators-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên nhà xe</th>
                  <th>Hình ảnh</th>
                  <th>Mô tả</th>
                  <th>Ngày tạo</th>
                  <th>Cập nhật</th>
                  <th style={{ width: 140 }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.company_name || r.name}</td>
                    <td>
                      {r.image ? (
                        <img
                          src={r.image}
                          alt={r.company_name || r.name}
                          style={{
                            width: 64,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      ) : (
                        <span style={{ color: "#64748b" }}>—</span>
                      )}
                    </td>
                    <td style={{ maxWidth: 480 }}>
                      <span
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {r.descriptions || r.description || ""}
                      </span>
                    </td>
                    <td>{r.created_at || r.createdAt || ""}</td>
                    <td>{r.updated_at || r.updatedAt || ""}</td>
                    <td>
                      <div className="row-actions">
                        <button onClick={() => openEdit(r)} className="btn-ghost">
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(r)}
                          className="btn-danger"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: 12, color: "#64748b" }}>
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div
            className="modal-backdrop"
            onClick={() => !saving && setShowModal(false)}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                {isEdit ? "Sửa nhà xe" : "Thêm nhà xe"}
              </div>
              <div className="modal-sub">
                {isEdit ? "Cập nhật thông tin nhà xe" : "Nhập thông tin nhà xe"}
              </div>
              {formErr._server && (
                <div
                  style={{ color: "#b91c1c", fontSize: 12, marginBottom: 8 }}
                >
                  {formErr._server}
                </div>
              )}
              <div className="form-grid">
                <label>
                  <span>Tên nhà xe</span>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="VD: Nhà xe ABC"
                  />
                  {formErr.name && (
                    <div className="field-error">{formErr.name}</div>
                  )}
                </label>

                <label>
                  <span>Ảnh nhà xe</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                  />

                  {isUploading && (
                    <div className="field-hint">Đang tải lên...</div>
                  )}

                  {form.image && !isUploading && (
                    <div style={{ marginTop: "10px" }}>
                      <img
                        src={form.image}
                        alt="Banner preview"
                        style={{
                          width: "100%",
                          maxHeight: "150px",
                          objectFit: "contain",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                        }}
                      />
                      <input
                        type="text"
                        value={form.image}
                        readOnly
                        disabled
                        style={{
                          backgroundColor: "#f4f4f4",
                          marginTop: "5px",
                          color: "#333",
                        }}
                        placeholder="Cloudinary URL"
                      />
                    </div>
                  )}

                  {formErr.image ? (
                    <div className="field-error">{formErr.image}</div>
                  ) : (
                    <div className="field-hint">Chọn 1 ảnh để tải lên.</div>
                  )}
                </label>

                <label style={{ gridColumn: "1 / span 2" }}>
                  <span>Mô tả</span>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={3}
                    placeholder="Mô tả ngắn..."
                  />
                </label>
              </div>
              <div className="modal-actions">
                <button
                  onClick={() => !saving && setShowModal(false)}
                  className="btn-ghost"
                  disabled={saving}
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary"
                  disabled={saving || isUploading} 
                >
                  {saving
                    ? "Đang lưu..."
                    : isEdit
                    ? "Lưu"
                    : "Thêm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}