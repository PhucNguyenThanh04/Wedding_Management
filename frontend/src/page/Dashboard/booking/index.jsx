import { faAdd, faPrint } from "@fortawesome/free-solid-svg-icons";
import { useState, useMemo, useRef } from "react";
import { useTheme } from "../../../context/themeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { getAllBooking } from "../../../apis/booking.api";
import ActionBookingModal from "./ActionBookingModal";
import CancelBookingModal from "./Cancelbookingmodal";
import UpdateStatusBookingModal from "./Updatestatusbookingmodal";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import InvoicePrint from "./InvoicePrint";

const STATUS_CONFIG = {
  booking_pending: {
    label: "Chờ xác nhận",
    class: "bg-yellow-100 text-yellow-700",
  },
  confirmed: {
    label: "Đã xác nhận",
    class: "bg-blue-100 text-blue-700",
  },
  in_progress: {
    label: "Đang diễn ra",
    class: "bg-purple-100 text-purple-700",
  },
  completed: {
    label: "Hoàn thành",
    class: "bg-green-100 text-green-700",
  },
  cancelled: {
    label: "Đã hủy",
    class: "bg-red-100 text-red-700",
  },
};

const SHIFT_LABEL = {
  MORNING: "Buổi sáng",
  AFTERNOON: "Buổi trưa",
  EVENING: "Buổi tối",
};

const EVENT_TYPE_LABEL = {
  wedding: "Tiệc cưới",
  birthday: "Sinh nhật",
  conference: "Hội nghị",
  other: "Khác",
};

const CAN_UPDATE_STATUS = ["booking_pending", "confirmed", "in_progress"];
const CAN_CANCEL = ["booking_pending", "confirmed"];

const formatCurrency = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) return "—";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
};

function Booking() {
  const { t } = useTheme();
  const [openAction, setOpenAction] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterShift, setFilterShift] = useState("all");

  const { data: dataBooking, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: getAllBooking,
  });

  const bookings = dataBooking?.data ?? [];

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        !search ||
        String(b.customer_id).includes(search) ||
        String(b.id).includes(search);
      const matchStatus = filterStatus === "all" || b.status === filterStatus;
      const matchShift = filterShift === "all" || b.event_shift === filterShift;
      return matchSearch && matchStatus && matchShift;
    });
  }, [bookings, search, filterStatus, filterShift]);

  const printRef = useRef(null);
  const [printTarget, setPrintTarget] = useState(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Hóa đơn #${printTarget?.id ?? ""}`,
  });

  const openPrint = (booking) => {
    setPrintTarget(booking);
    setTimeout(() => handlePrint(), 0);
  };

  return (
    <div
      className="p-10 rounded-md space-y-6"
      style={{ background: t.surface, minHeight: "100vh" }}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-[2.2rem] font-semibold">Quản lý đặt tiệc</h2>
          <p className="text-gray-500">
            Quản lý toàn bộ các đơn đặt tiệc của nhà hàng.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpenAction(true)}
          className="flex items-center gap-2 justify-center px-8 py-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 rounded-md"
        >
          <FontAwesomeIcon icon={faAdd} />
          <p>Tạo đơn</p>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 h-[4.2rem] w-full rounded-md px-4 outline-none focus:border-blue-400 transition-colors"
          placeholder="Tìm theo mã đơn, khách hàng..."
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 h-[4.2rem] w-full rounded-md px-4 outline-none focus:border-blue-400 transition-colors"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="booking_pending">Chờ xác nhận</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="in_progress">Đang diễn ra</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>

        <select
          value={filterShift}
          onChange={(e) => setFilterShift(e.target.value)}
          className="border border-gray-300 h-[4.2rem] w-full rounded-md px-4 outline-none focus:border-blue-400 transition-colors"
        >
          <option value="all">Tất cả ca tiệc</option>
          <option value="MORNING">Buổi sáng</option>
          <option value="AFTERNOON">Buổi trưa</option>
          <option value="EVENING">Buổi tối</option>
        </select>
      </div>

      <table className="w-full h-auto text-gray-700 divide-y divide-gray-300 border border-gray-300">
        <thead>
          <tr className="text-gray-700 divide-x divide-gray-300 bg-gray-50">
            <th className="p-4 text-start">STT</th>
            <th className="p-4 text-center">Mã đơn</th>
            <th className="p-4 text-center">Mã khách hàng</th>
            <th className="p-4 text-center">Sảnh</th>
            <th className="p-4 text-center">Loại tiệc</th>
            <th className="p-4 text-center">Tổng tiền</th>
            <th className="p-4 text-center">Trạng thái</th>
            <th className="p-4 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {isLoading ? (
            <tr>
              <td colSpan={11} className="text-center py-8 text-gray-500">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : filtered.length > 0 ? (
            filtered.map((booking, index) => {
              const statusCfg = STATUS_CONFIG[booking.status] ?? {
                label: booking.status,
                class: "bg-gray-100 text-gray-600",
              };
              const canUpdate = CAN_UPDATE_STATUS.includes(booking.status);
              const canCancel = CAN_CANCEL.includes(booking.status);
              console.log(booking);

              return (
                <tr
                  key={booking.id}
                  className="text-gray-700 divide-x divide-gray-300 hover:bg-cyan-50 transition-colors"
                >
                  <td className="p-4 text-start">{index + 1}</td>

                  <td className="p-4 text-center font-mono text-[1.4rem] text-gray-500">
                    #{booking.id}
                  </td>

                  <td className="p-4 text-center">{booking.customer_id}</td>

                  <td className="p-4 text-center">{booking.hall_id}</td>

                  <td className="p-4 text-center">
                    {EVENT_TYPE_LABEL[booking.event_type] ?? booking.event_type}
                  </td>

                  <td className="p-4 text-center border-gray-300 text-blue-600">
                    {formatCurrency(booking.total_amount)}
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full  border-gray-300 ${statusCfg.class}`}
                    >
                      {statusCfg.label}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/dashboard/booking-detail/${booking.id}`}
                        className="block px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors"
                      >
                        Chi tiết
                      </Link>
                      {booking.status !== "completed" && (
                        <button
                          onClick={() => canUpdate && setStatusTarget(booking)}
                          disabled={!canUpdate}
                          className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-md transition-colors"
                          title={canUpdate ? "Nhấn để cập nhật trạng thái" : ""}
                        >
                          Cập nhật
                        </button>
                      )}
                      {booking.status === "completed" && (
                        <button
                          onClick={() => openPrint(booking)}
                          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors"
                        >
                          <FontAwesomeIcon icon={faPrint} /> In hóa đơn
                        </button>
                      )}

                      {canCancel && (
                        <button
                          onClick={() => setCancelTarget(booking)}
                          className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md transition-colors"
                        >
                          Hủy đơn
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={11} className="text-center py-8 text-gray-500">
                Không có đơn đặt tiệc nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div style={{ display: "none" }}>
        <InvoicePrint ref={printRef} booking={printTarget} />
      </div>
      {openAction && (
        <ActionBookingModal onClose={() => setOpenAction(false)} />
      )}

      {cancelTarget && (
        <CancelBookingModal
          booking={cancelTarget}
          onClose={() => setCancelTarget(null)}
        />
      )}

      {/* Đổi trạng thái — POST /orders/{id}/confirm | in_process | completed */}
      {statusTarget && (
        <UpdateStatusBookingModal
          booking={statusTarget}
          onClose={() => setStatusTarget(null)}
        />
      )}
    </div>
  );
}

export default Booking;
