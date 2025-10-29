import api from "../config/axios/axiosCongif";

// Search trips by route and date. Returns an array of trips.
export async function searchTrips({ from, to, date } = {}) {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;
  if (date) params.date = date;
  const res = await api.get("/trips", { params });
  // Be tolerant to either { data: [...] } or flat [...]
  return res?.data?.data ?? res?.data ?? [];
}

export default {
  searchTrips,
};

