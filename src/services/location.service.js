import api from "../config/axios/axiosCongif";

// Fetch list of locations (as strings). Returns an array.
export async function getLocations() {
  const res = await api.get("/locations");
  const data = res?.data?.data ?? res?.data ?? [];
  // If API returns objects, map to label/name if present
  if (Array.isArray(data) && data.length && typeof data[0] === "object") {
    return data
      .map((it) => it?.name || it?.label || it?.title)
      .filter(Boolean);
  }
  return data;
}

export default {
  getLocations,
};

