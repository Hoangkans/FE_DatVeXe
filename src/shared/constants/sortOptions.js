const SORTS = {
  departureTime: [
    { id: "earliest", label: "Sớm nhất", type: "sort" },
    { id: "latest", label: "Muộn nhất", type: "sort" },
    { id: "slot-00-06", label: "00:00 - 06:00", type: "filter", from: "00:00", to: "06:00" },
    { id: "slot-06-12", label: "06:00 - 12:00", type: "filter", from: "06:00", to: "12:00" },
    { id: "slot-12-18", label: "12:00 - 18:00", type: "filter", from: "12:00", to: "18:00" },
    { id: "slot-18-24", label: "18:00 - 24:00", type: "filter", from: "18:00", to: "24:00" },
  ],
  price: [
    { id: "low-high", label: "Thấp đến cao", type: "sort" },
    { id: "high-low", label: "Cao đến thấp", type: "sort" },
    { id: "lt-100k", label: "Dưới 100.000đ", type: "filter", min: 0, max: 100000 },
    { id: "100-200k", label: "100.000đ - 200.000đ", type: "filter", min: 100000, max: 200000 },
    { id: "200-400k", label: "200.000đ - 400.000đ", type: "filter", min: 200000, max: 400000 },
    { id: "gt-400k", label: "Trên 400.000đ", type: "filter", min: 400000 },
  ],
};

export default SORTS;

