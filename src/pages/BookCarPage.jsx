import { useMemo, useState } from "react";
import "../shared/styles/BookCarPage.css";
import hotlineImg from "../assets/hotline-bookcar.jpg";
import SidebarFilters from "../shared/components/BookCar/SidebarFilters";
import TripList from "../shared/components/BookCar/TripList";

export default function BookCarPage() {
  const operatorList = useMemo(
    () => [
      "Anh Huy (Hải Phòng)",
      "Anh Huy Đất Cảng",
      "Anh Huy Travel",
      "Bằng Phấn",
      "Cát Bà Express",
      "Cát Bà Go Easy Limousine",
    ],
    []
  );

  const [popular, setPopular] = useState({ discount: false, vip: false });
  const [selectedOps, setSelectedOps] = useState(() => Object.fromEntries(operatorList.map((n) => [n, false])));
  const [search, setSearch] = useState("");

  const anyChecked = Object.values(selectedOps).some(Boolean) || popular.discount || popular.vip;
  const selectedCount =
    (popular.discount ? 1 : 0) + (popular.vip ? 1 : 0) + Object.values(selectedOps).filter(Boolean).length;
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState("images");
  const [showFilters, setShowFilters] = useState(true);

  const handleTogglePopular = (key) => (e) => setPopular((s) => ({ ...s, [key]: e.target.checked }));
  const handleToggleOperator = (name) => (e) => setSelectedOps((s) => ({ ...s, [name]: e.target.checked }));
  const clearSelections = () => {
    setPopular({ discount: false, vip: false });
    setSelectedOps(Object.fromEntries(operatorList.map((n) => [n, false])));
  };

  const filteredOperators = operatorList.filter((n) => n.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bookcar">
      <div className="bookcar__container">
        <SidebarFilters
          showFilters={showFilters}
          onToggleCollapse={() => setShowFilters((s) => !s)}
          popular={popular}
          onTogglePopular={handleTogglePopular}
          selectedOps={selectedOps}
          onToggleOperator={handleToggleOperator}
          search={search}
          onSearchChange={(v) => setSearch(v)}
          filteredOperators={filteredOperators}
          onClear={clearSelections}
          anyChecked={anyChecked}
          selectedCount={selectedCount}
        />

        <main className="results">
          <TripList
            trips={trips}
            expandedId={expandedId}
            activeTab={activeTab}
            onToggleTrip={(id) => {
              if (expandedId === id) setExpandedId(null);
              else {
                setExpandedId(id);
                setActiveTab("images");
              }
            }}
            onTabChange={(tab) => setActiveTab(tab)}
          />

          <div className="banner">
            <img src={hotlineImg} alt="Đặt vé ngay hotline" />
          </div>
        </main>
      </div>
    </div>
  );
}

const trips = [
  {
    id: 1,
    name: "Vip Phương Huy Luxury",
    rating: 4.8,
    reviews: 21,
    depart: "21:00",
    arrive: "22:30",
    price: 220000,
    seatsLeft: 10,
    from: "Hà Nội",
    to: "Hải Phòng",
  },
  {
    id: 2,
    name: "Hoàng Anh Limousine (Hải Phòng)",
    rating: 4.9,
    reviews: 310,
    depart: "21:15",
    arrive: "23:50",
    price: 450000,
    seatsLeft: 5,
    from: "Hà Nội",
    to: "Hải Phòng",
  },
  {
    id: 3,
    name: "Anh Huy Travel",
    rating: 4.3,
    reviews: 230,
    depart: "21:45",
    arrive: "00:25",
    price: 120000,
    seatsLeft: 12,
    from: "Hà Nội",
    to: "Hải Phòng",
  },
  {
    id: 4,
    name: "Vip Phương Huy Luxury",
    rating: 4.7,
    reviews: 18,
    depart: "20:30",
    arrive: "22:00",
    price: 220000,
    seatsLeft: 7,
    from: "Hà Nội",
    to: "Hải Phòng",
  },
  {
    id: 5,
    name: "Hoàng Anh Limousine (Hải Phòng)",
    rating: 4.9,
    reviews: 310,
    depart: "22:00",
    arrive: "00:30",
    price: 450000,
    seatsLeft: 3,
    from: "Hà Nội",
    to: "Hải Phòng",
  },
  {
    id: 6,
    name: "Anh Huy Travel",
    rating: 4.2,
    reviews: 200,
    depart: "19:45",
    arrive: "22:15",
    price: 120000,
    seatsLeft: 14,
    from: "Hà Nội",
    to: "Hải Phòng",
  },
];
