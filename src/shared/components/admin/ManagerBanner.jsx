import { useMemo, useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import "../../styles/AdminManageBanner.css";

import { fetchBanner, createBanner, updateBanner, deleteBanner } from "../../../services/banner/adminBanner"; 

export default function ManagerBanner() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt"); 
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [rows, setRows] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null); 

  const [isUploading, setIsUploading] = useState(false);
  const CLOUD_NAME =
    import.meta.env.VITE_CLOUD_NAME?.trim() || "dmcfssn9h";
  const UPLOAD_PRESET =
    import.meta.env.VITE_CLOUD_UPLOAD_PRESET?.trim() || "ml_default";
  
  const [form, setForm] = useState({ url: "", position: "" });
  const [errors, setErrors] = useState({});

  
  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setIsLoading(true);
    setApiError(null); 
    try {
      const responseData = await fetchBanner();

      let bannerList = [];
      if (Array.isArray(responseData)) {
        // Case 1: fetchBanner had an error and returned []
        bannerList = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        // Case 2: Successful fetch, the array is in responseData.data
        bannerList = responseData.data;
      }

      const mappedData = bannerList.map(banner => ({
        id: banner.id,
        url: banner.banner_url, 
        position: banner.position,
        image: banner.banner_url 
      }));
      
      setRows(mappedData);
    } catch (error) {
      
      console.error("Error loading banners:", error);
      setApiError("Lỗi: Không thể tải danh sách banner. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  function openAdd() {
    setIsEdit(false);
    setEditingId(null);
    setForm({ url: "", position: "" });
    setErrors({});
    setApiError(null); 
    setShowModal(true);
  }

  function openEdit(r) {
    setIsEdit(true);
    setEditingId(r.id);
    setForm({ url: r.url || "", position: r.position || "" });
    setErrors({});
    setApiError(null); 
    setShowModal(true);
  }

  async function removeRow(r) {
    if (window.confirm(`Xóa banner #${r.id}?`)) {
      setApiError(null); 
      try {
        await deleteBanner(r.id);
        await loadBanners(); 
      } catch (error) {
        console.error("Error deleting banner:", error);
        setApiError("Lỗi: Không thể xóa banner. Vui lòng thử lại.");
      }
    }
  }

  function validate() {
    const e = {};
    if (!form.url.trim()) e.url = "Vui lòng nhập URL banner";
    if (form.url && form.url.length > 255) e.url = "URL tối đa 255 ký tự";
    if (!form.position.trim()) e.position = "Vui lòng nhập vị trí hiển thị";
    if (form.position && form.position.length > 100) e.position = "Vị trí tối đa 100 ký tự";
    return e;
  }

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setErrors({}); // Clear old errors
    setApiError(null);

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
      
      // IMPORTANT: Update the form state with the new Cloudinary URL
      setForm(prevForm => ({ ...prevForm, url: data.secure_url }));

    } catch (error) {
      console.error("Error uploading image:", error);
      setErrors(prev => ({ ...prev, url: "Lỗi: Không thể tải ảnh lên." }));
    } finally {
      setIsUploading(false);
    }
  };
  
  async function submit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    
    setApiError(null); 

    try {
      if (isEdit && editingId != null) {
        await updateBanner(editingId, {
          banner_url: form.url,
          position: form.position
        });
      } else {
        await createBanner({
          banner_url: form.url,
          position: form.position
        });
      }
      
      await loadBanners(); 
      setShowModal(false);
    } catch (error) {
      console.error("Error saving banner:", error);
      setApiError(isEdit ? "Lỗi: Không thể cập nhật banner." : "Lỗi: Không thể tạo banner.");
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows.filter((r) => {
      const matches = !q ||
        r.id?.toString().includes(q) ||
        (r.image || "").toLowerCase().includes(q) ||
        (r.url || "").toLowerCase().includes(q) ||  
        (r.position || "").toLowerCase().includes(q);
      return matches;
    });
    
    list = [...list].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      const av = a[sortBy];
      const bv = b[sortBy];
      
      if (av == null) return 1;
      if (bv == null) return -1;
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
    <div className="manage-banner">
      <div className="head">
        <div className="title">Quản lý Banner</div>
        <div className="sub">Quản lý các banner quảng cáo hiển thị trên website</div>
      </div>

      
      {apiError && <div className="api-error-message">{apiError}</div>}

      <div className="toolbar">
        <div className="search">
          <SearchIcon className="search-icon" fontSize="small" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Tìm kiếm theo ID, URL, vị trí..." />
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <AddIcon fontSize="small" />
          <span>Thêm banner</span>
        </button>
      </div>

      <div className="table-wrap">
        <table className="banner-table">
          <thead>
            <tr>
              <th>{sortLabel("id", "ID")}</th>
              <th>Hình ảnh</th>
              <th>{sortLabel("url", "Banner URL")}</th>
              <th>{sortLabel("position", "Vị trí hiển thị")}</th>
              <th style={{ width: 120 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="5" className="loading-cell">Đang tải...</td></tr>
            ) : paged.length === 0 ? (
              <tr><td colSpan="5" className="empty-cell">Không tìm thấy banner nào.</td></tr>
            ) : (
              paged.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>
                    {r.image ? (
                      <img src={r.image} alt="banner" className="banner-thumb" />
                    ) : (
                      <span className="muted">(không có ảnh)</span>
                    )}
                  </td>
                  <td className="mono">{r.url}</td>
                  <td>{r.position}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn-ghost" onClick={() => openEdit(r)}><EditIcon fontSize="inherit" /><span>Sửa</span></button>
                      <button className="btn-danger" onClick={() => removeRow(r)}><DeleteIcon fontSize="inherit" /><span>Xóa</span></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!isLoading && filtered.length > 0 && (
          <div className="table-footer">
            <div className="info">Hiển thị {start + 1} - {Math.min(end, filtered.length)} trong tổng số {filtered.length} banner</div>
            <div className="pager">
              <button className="btn-page" disabled={pageSafe <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>&lt;</button>
              <div className="page-text">Trang {pageSafe} / {totalPages}</div>
              <button className="btn-page" disabled={pageSafe >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>&gt;</button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => !isUploading && setShowModal(false)}> {/* Don't close while uploading */}
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">{isEdit ? "Sửa banner" : "Thêm banner mới"}</div>
            <div className="modal-sub">{isEdit ? "Cập nhật thông tin banner" : "Nhập thông tin banner hiển thị"}</div>
            <div className="form-grid">
              
              <label>
                <span>Ảnh Banner *</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileSelect} 
                  disabled={isUploading} 
                />
                
                {/* Show uploading status */}
                {isUploading && <div className="field-hint">Đang tải lên...</div>}
                
                {/* Show preview and URL text after upload/if editing */}
                {form.url && !isUploading && (
                  <div style={{ marginTop: '10px' }}>
                    <img 
                      src={form.url} 
                      alt="Banner preview" 
                      style={{ 
                        width: '100%', 
                        maxHeight: '150px', 
                        objectFit: 'contain', 
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }} 
                    />
                    <input 
                      type="text" 
                      value={form.url} 
                      readOnly 
                      disabled
                      style={{ backgroundColor: '#f4f4f4', marginTop: '5px', color: '#333' }} 
                      placeholder="Cloudinary URL"
                    />
                  </div>
                )}
                
                {/* Show validation error */}
                {errors.url ? <div className="field-error">{errors.url}</div> : <div className="field-hint">Chọn 1 ảnh để tải lên.</div>}
              </label>
              
              {/* --- THIS IS THE POSITION FIELD --- */}
              <label>
                <span>Vị trí hiển thị</span>
                <input 
                  value={form.position} 
                  onChange={(e) => setForm({ ...form, position: e.target.value })} 
                  placeholder="VD: Trang chủ - Banner chính" 
                  disabled={isUploading}
                />
                {errors.position ? <div className="field-error">{errors.position}</div> : <div className="field-hint">Mô tả vị trí banner sẽ được hiển thị. Tối đa 100 ký tự.</div>}
              </label>
            </div>
            
            {apiError && <div className="api-error-message modal-error">{apiError}</div>}
            
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowModal(false)} disabled={isUploading}>Hủy</button>
              <button className="btn-primary" onClick={submit} disabled={isUploading}>
                {isUploading ? "Đang xử lý..." : (isEdit ? "Lưu" : "Thêm mới")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
