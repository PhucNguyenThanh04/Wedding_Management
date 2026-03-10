import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChampagneGlasses,
  faLocationDot,
  faUsers,
  faCalendarDays,
  faAngleRight,
  faClockRotateLeft,
  faCircleCheck,
  faCircleXmark,
  faHourglassHalf,
  faMagnifyingGlass,
  faFileLines,
  faAngleDown,
  faAngleUp,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";

const ORDERS = [
  {
    id: "WD-2024-001",
    hall: "Sảnh Sapphire",
    hallSubtitle: "Sapphire Hall",
    image:
      "https://dp1.diamondplace.vn/wp-content/uploads/2023/10/sapphire-3-1.webp",
    date: "15/06/2025",
    time: "17:00 – 22:00",
    guests: 450,
    status: "confirmed",
    package: "Gói Hoàng Kim",
    note: "Yêu cầu hoa tươi trang trí thêm ở lối vào",
    createdAt: "02/01/2025",
    total: "185.000.000 ₫",
  },
  {
    id: "WD-2024-002",
    hall: "Sảnh Ruby",
    hallSubtitle: "Ruby Hall",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
    date: "22/08/2025",
    time: "11:00 – 15:00",
    guests: 280,
    status: "pending",
    package: "Gói Bạch Kim",
    note: "",
    createdAt: "10/01/2025",
    total: "98.000.000 ₫",
  },
];

const STATUS_CONFIG = {
  confirmed: {
    label: "Đã xác nhận",
    icon: faCircleCheck,
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  pending: {
    label: "Chờ xác nhận",
    icon: faHourglassHalf,
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  completed: {
    label: "Hoàn thành",
    icon: faClockRotateLeft,
    color: "#6b7280",
    bg: "#f9fafb",
    border: "#e5e7eb",
  },
  cancelled: {
    label: "Đã hủy",
    icon: faCircleXmark,
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
  },
};

const FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "completed", label: "Hoàn thành" },
  { key: "cancelled", label: "Đã hủy" },
];

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const st = STATUS_CONFIG[order.status];

  return (
    <div
      className={`bg-white rounded-3xl overflow-hidden shadow-md transition-all duration-300 ${expanded ? "shadow-xl" : "hover:shadow-lg hover:-translate-y-0.5"}`}
    >
      <div className="flex gap-0">
        <div className="relative w-[22rem] shrink-0 overflow-hidden">
          <img
            src={order.image}
            alt={order.hall}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
        </div>

        <div className="flex-1 p-8 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-[1.25rem] text-gray-400 font-mono tracking-widest">
                  #{order.id}
                </span>
                <span
                  style={{
                    background: st.bg,
                    color: st.color,
                    border: `1px solid ${st.border}`,
                  }}
                  className="flex items-center gap-1.5 text-[1.2rem] font-semibold px-4 py-1 rounded-full"
                >
                  <FontAwesomeIcon icon={st.icon} />
                  {st.label}
                </span>
              </div>

              <p className="text-[1.25rem] tracking-[0.15em] text-[#d0690e] uppercase opacity-70">
                {order.hallSubtitle}
              </p>
              <h3 className="text-[2.2rem] font-bold text-[#3a2a1a]">
                {order.hall}
              </h3>
            </div>

            <div className="text-right">
              <p className="text-[1.25rem] text-gray-400 mb-1">Tổng giá trị</p>
              <p className="text-[2rem] font-bold text-[#d0690e]">
                {order.total}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-[1.35rem] text-gray-500">
              <FontAwesomeIcon
                icon={faCalendarDays}
                className="text-[#d0690e]"
              />
              <span>{order.date}</span>
              <span className="text-gray-300">|</span>
              <span>{order.time}</span>
            </div>
            <div className="flex items-center gap-2 text-[1.35rem] text-gray-500">
              <FontAwesomeIcon icon={faUsers} className="text-[#d0690e]" />
              <span>{order.guests} khách</span>
            </div>
            <div className="flex items-center gap-2 text-[1.35rem] text-gray-500">
              <FontAwesomeIcon
                icon={faChampagneGlasses}
                className="text-[#d0690e]"
              />
              <span>{order.package}</span>
            </div>
            <div className="flex items-center gap-2 text-[1.35rem] text-gray-400">
              <FontAwesomeIcon icon={faClockRotateLeft} />
              <span>Đặt ngày {order.createdAt}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-100">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-[1.35rem] text-gray-500 hover:text-[#d0690e] transition-colors"
            >
              <FontAwesomeIcon icon={faFileLines} />
              <span>{expanded ? "Ẩn chi tiết" : "Xem chi tiết"}</span>
              <FontAwesomeIcon icon={expanded ? faAngleUp : faAngleDown} />
            </button>

            <div className="flex items-center gap-3">
              {order.status === "pending" && (
                <button className="text-[1.35rem] text-red-500 border border-red-200 hover:bg-red-50 px-6 py-2 rounded-xl transition-all duration-200">
                  Hủy đơn
                </button>
              )}
              {(order.status === "pending" || order.status === "confirmed") && (
                <button className="flex items-center gap-2 text-[1.35rem] bg-[#d0690e] text-white px-6 py-2 rounded-xl hover:bg-[#b85a0a] transition-all duration-200 font-semibold">
                  <span>Liên hệ tư vấn</span>
                  <FontAwesomeIcon icon={faAngleRight} />
                </button>
              )}
              {order.status === "completed" && (
                <button className="flex items-center gap-2 text-[1.35rem] border-2 border-[#d0690e] text-[#d0690e] px-6 py-2 rounded-xl hover:bg-orange-50 transition-all duration-200 font-semibold">
                  <span>Đặt lại</span>
                  <FontAwesomeIcon icon={faAngleRight} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 bg-orange-50/40 px-10 py-7">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-[1.2rem] text-gray-400 uppercase tracking-widest mb-1">
                Mã đặt tiệc
              </p>
              <p className="text-[1.5rem] font-bold text-[#3a2a1a] font-mono">
                {order.id}
              </p>
            </div>
            <div>
              <p className="text-[1.2rem] text-gray-400 uppercase tracking-widest mb-1">
                Sảnh tiệc
              </p>
              <div className="flex items-center gap-2 text-[1.5rem] font-semibold text-[#3a2a1a]">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-[#d0690e]"
                />
                {order.hall}
              </div>
            </div>
            <div>
              <p className="text-[1.2rem] text-gray-400 uppercase tracking-widest mb-1">
                Gói dịch vụ
              </p>
              <p className="text-[1.5rem] font-semibold text-[#3a2a1a]">
                {order.package}
              </p>
            </div>
            <div>
              <p className="text-[1.2rem] text-gray-400 uppercase tracking-widest mb-1">
                Ngày tổ chức
              </p>
              <p className="text-[1.5rem] font-semibold text-[#3a2a1a]">
                {order.date} · {order.time}
              </p>
            </div>
            <div>
              <p className="text-[1.2rem] text-gray-400 uppercase tracking-widest mb-1">
                Số lượng khách
              </p>
              <p className="text-[1.5rem] font-semibold text-[#3a2a1a]">
                {order.guests} khách
              </p>
            </div>
            <div>
              <p className="text-[1.2rem] text-gray-400 uppercase tracking-widest mb-1">
                Tổng giá trị
              </p>
              <p className="text-[1.5rem] font-bold text-[#d0690e]">
                {order.total}
              </p>
            </div>
          </div>

          {order.note && (
            <div className="mt-5 pt-5 border-t border-orange-100">
              <p className="text-[1.2rem] text-gray-400 uppercase tracking-widest mb-1">
                Ghi chú
              </p>
              <p className="text-[1.4rem] text-gray-600 italic">
                "{order.note}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OrderPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = ORDERS.filter((o) => {
    const matchStatus = filter === "all" || o.status === filter;
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.hall.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <>
      <Header isBg={true} />

      <div className="px-[20rem] w-full py-[10rem]">
        <h2 className="text-[2.5rem] text-[#d0690e] font-medium uppercase">
          Đơn đặt tiệc của bạn
        </h2>
        <p className="text-[1.4rem] text-gray-500">
          Xem tất cả đơn bạn đã đặt ở nhà hàng chúng tôi.
        </p>
        <div className="flex items-center justify-between pt-[3rem] pb-[2.5rem]">
          <div className="flex items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`text-[1.35rem] px-5 py-2 rounded-xl font-medium transition-all duration-200 ${
                  filter === f.key
                    ? "bg-[#d0690e] text-white shadow-md"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-[#d0690e] hover:text-[#d0690e]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[1.4rem]"
            />
            <input
              type="text"
              placeholder="Tìm theo mã đơn, sảnh..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-6 py-3 text-[1.4rem] rounded-xl border border-gray-200 outline-none focus:border-[#d0690e] transition-colors w-[28rem] bg-white"
            />
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="flex flex-col gap-6">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="text-center py-[8rem]">
            <FontAwesomeIcon
              icon={faChampagneGlasses}
              className="text-[5rem] text-gray-200 mb-6"
            />
            <p className="text-[2rem] text-gray-400 font-semibold">
              Không tìm thấy đơn nào
            </p>
            <p className="text-[1.5rem] text-gray-400 mt-2">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default OrderPage;
