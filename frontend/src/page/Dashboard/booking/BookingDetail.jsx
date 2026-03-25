import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "../../../context/themeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendar,
  faUser,
  faUtensils,
  faFileAlt,
  faMoneyBill,
  faAdd,
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { getBookingById } from "../../../apis/booking.api";
import { Button } from "antd";

const STATUS_CONFIG = {
  booking_pending: {
    label: "Chờ xác nhận",
    class: "bg-yellow-100 text-yellow-700",
  },
  confirmed: { label: "Đã xác nhận", class: "bg-blue-100 text-blue-700" },
  in_progress: {
    label: "Đang diễn ra",
    class: "bg-purple-100 text-purple-700",
  },
  completed: { label: "Hoàn thành", class: "bg-green-100 text-green-700" },
  cancelled: { label: "Đã hủy", class: "bg-red-100 text-red-700" },
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

const formatCurrency = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) return "—";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
};

const formatDateTime = (iso) =>
  iso ? dayjs(iso).format("DD/MM/YYYY HH:mm") : "—";

const Section = ({ icon, title, children, surface }) => (
  <div
    className="rounded-md border border-gray-200 overflow-hidden"
    style={{ background: surface }}
  >
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-gray-50">
      <FontAwesomeIcon icon={icon} className="text-blue-500 text-[1.6rem]" />
      <h3 className="text-[1.6rem] font-semibold text-gray-700">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const InfoRow = ({ label, value, valueClass = "" }) => (
  <div className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
    <span className="text-[1.4rem] text-gray-500 min-w-[16rem]">{label}</span>
    <span
      className={`text-[1.4rem] font-medium text-gray-700 text-right ${valueClass}`}
    >
      {value ?? "—"}
    </span>
  </div>
);

const MoneyRow = ({ label, value, valueClass = "text-gray-700" }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
    <span className="text-[1.4rem] text-gray-500">{label}</span>
    <span className={`text-[1.4rem] font-medium ${valueClass}`}>
      {formatCurrency(value)}
    </span>
  </div>
);

function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTheme();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingById(id),
    enabled: !!id,
  });
  const booking = data?.data;

  if (isLoading) {
    return (
      <div
        className="p-10 rounded-md flex items-center justify-center"
        style={{ background: t.surface, minHeight: "100vh" }}
      >
        <p className="text-gray-500 text-[1.6rem]">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div
        className="p-10 rounded-md flex flex-col items-center justify-center gap-4"
        style={{ background: t.surface, minHeight: "100vh" }}
      >
        <p className="text-red-500 text-[1.6rem]">
          Không tìm thấy đơn đặt tiệc.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[booking.status] ?? {
    label: booking.status,
    class: "bg-gray-100 text-gray-600",
  };

  return (
    <div
      className="p-10 space-y-6"
      style={{ background: t.surface, minHeight: "100vh" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/dashboard/booking`)}
            className="p-3 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-[1.6rem]" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-[2.2rem] font-semibold">
                Chi tiết đơn #{booking.id}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusCfg.class}`}
              >
                {statusCfg.label}
              </span>
            </div>
            <p className="text-gray-500 text-[1.4rem]">
              Tạo lúc {formatDateTime(booking.created_at)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Section
            icon={faCalendar}
            title="Thông tin sự kiện"
            surface={t.surface}
          >
            <div className="grid grid-cols-2 gap-x-10">
              <div>
                <InfoRow
                  label="Ngày tổ chức"
                  value={dayjs(booking.event_date).format("DD/MM/YYYY")}
                />
                <InfoRow
                  label="Ca tiệc"
                  value={
                    SHIFT_LABEL[booking.event_shift] ?? booking.event_shift
                  }
                />
                <InfoRow
                  label="Giờ bắt đầu"
                  value={booking.event_time?.slice(0, 5)}
                />
              </div>
              <div>
                <InfoRow
                  label="Loại sự kiện"
                  value={
                    EVENT_TYPE_LABEL[booking.event_type] ?? booking.event_type
                  }
                />
                <InfoRow label="Số bàn" value={`${booking.so_ban} bàn`} />
                <InfoRow
                  label="Ghi chú"
                  value={booking.notes !== "string" ? booking.notes : "—"}
                />
              </div>
            </div>
          </Section>

          <Section
            icon={faUser}
            title="Thông tin liên quan"
            surface={t.surface}
          >
            <div className="grid grid-cols-2 gap-x-10">
              <div>
                <InfoRow
                  label="Mã khách hàng"
                  value={`#${booking.customer_id}`}
                />
                <InfoRow label="Mã sảnh" value={`#${booking.hall_id}`} />
              </div>
              <div>
                <InfoRow
                  label="Nhân viên tạo đơn"
                  value={booking.created_by_staff_id?.slice(0, 8) + "..."}
                />
                <InfoRow
                  label="Nhân viên phụ trách"
                  value={booking.assigned_staff_id?.slice(0, 8) + "..."}
                />
              </div>
            </div>
          </Section>

          <Section
            icon={faUtensils}
            title={`Menu đã đặt (${booking.order_menus?.length ?? 0})`}
            surface={t.surface}
          >
            {booking.order_menus?.length > 0 ? (
              <div className="space-y-8">
                {booking.order_menus.map((menu, index) => (
                  <div
                    key={menu.id || index}
                    className="border border-gray-200 rounded-xl p-6 bg-white"
                  >
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <h4 className="text-[1.65rem] font-semibold text-gray-900">
                          {menu.menu_name || `Menu #${menu.menu_id}`}
                        </h4>
                        <p className="text-gray-500 text-[1.35rem]">
                          {menu.quantity} bàn ×{" "}
                          {formatCurrency(
                            menu.price_per_table || menu.unit_price,
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[1.5rem] font-bold text-blue-600">
                          {formatCurrency(menu.total_price)}
                        </p>
                        <p className="text-gray-400">Thành tiền</p>
                      </div>
                    </div>

                    {menu.items && menu.items.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-[1.6rem]">
                        {menu.items.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <span className="text-amber-500 mt-1">•</span>
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">
                        Chưa có chi tiết món ăn
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl">
                <p className="text-gray-400 text-[1.5rem] mb-6">
                  Chưa chọn gói menu nào cho đơn đặt tiệc này
                </p>

                <Button
                  type="primary"
                  size="large"
                  icon={<FontAwesomeIcon icon={faUtensils} />}
                  onClick={() =>
                    navigate(`/dashboard/booking/${booking.id}/add-menu`)
                  }
                  className="h-14 px-10 text-[1.4rem]"
                >
                  Chọn gói menu ngay
                </Button>

                <p className="text-gray-500 text-[1.3rem] mt-4">
                  Bạn có thể chọn sau, nhân viên sẽ liên hệ hỗ trợ
                </p>
              </div>
            )}
            <div
              className="w-full h-[10rem] border border-dashed border-gray-400 rounded-xl mt-5 flex items-center justify-center mb-6 cursor-pointer"
              onClick={() =>
                navigate(`/dashboard/booking/${booking.id}/add-menu`)
              }
            >
              <FontAwesomeIcon icon={faAdd} />
              <span>Thêm combo</span>
            </div>
          </Section>
          {/* 
          <Section
            icon={faChair}
            title={`Món ăn thêm (${booking.order_items?.length ?? 0})`}
            surface={t.surface}
          >
            {booking.order_items?.length > 0 ? (
              <table className="w-full text-gray-700 divide-y divide-gray-200">
                <thead>
                  <tr className="text-gray-500 text-[1.3rem]">
                    <th className="pb-3 text-start">Tên món</th>
                    <th className="pb-3 text-center">Số lượng</th>
                    <th className="pb-3 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {booking.order_items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 text-[1.4rem]">
                        {item.dish_name ?? `Món #${item.dish_id}`}
                      </td>
                      <td className="py-3 text-center text-[1.4rem]">
                        {item.quantity}
                      </td>
                      <td className="py-3 text-right text-[1.4rem] text-blue-600 font-medium">
                        {formatCurrency(item.total_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400 text-[1.4rem] text-center py-4">
                Chưa có món ăn thêm nào
              </p>
            )}
          </Section> */}
        </div>

        <div className="col-span-1 space-y-6">
          <Section icon={faMoneyBill} title="Tổng tiền" surface={t.surface}>
            <MoneyRow label="Tiền bàn" value={booking.table_total} />
            <MoneyRow label="Tiền menu" value={booking.menu_total} />
            <MoneyRow label="Món thêm" value={booking.extra_dishes_total} />
            <MoneyRow label="Phí dịch vụ" value={booking.service_fee} />
            <MoneyRow
              label="Giảm giá"
              value={booking.discount_amount}
              valueClass="text-green-600"
            />
            <MoneyRow label="Tạm tính" value={booking.subtotal} />
            <MoneyRow
              label={`Thuế (${parseFloat(booking.tax_rate ?? 0).toFixed(0)}%)`}
              value={booking.tax_amount}
            />
            <div className="flex items-center justify-between pt-3 mt-1 border-t-2 border-gray-300">
              <span className="text-[1.6rem] font-semibold text-gray-700">
                Tổng cộng
              </span>
              <span className="text-[1.8rem] font-bold text-blue-600">
                {formatCurrency(booking.total_amount)}
              </span>
            </div>
          </Section>

          <Section icon={faFileAlt} title="Lịch sử" surface={t.surface}>
            <InfoRow
              label="Tạo lúc"
              value={formatDateTime(booking.created_at)}
            />
            <InfoRow
              label="Cập nhật"
              value={formatDateTime(booking.updated_at)}
            />
            <InfoRow
              label="Xác nhận lúc"
              value={formatDateTime(booking.confirmed_at)}
            />
            <InfoRow
              label="Hoàn thành lúc"
              value={formatDateTime(booking.completed_at)}
            />
            <InfoRow
              label="Sửa lần cuối"
              value={formatDateTime(booking.last_modified_at)}
            />
            {booking.cancellation_reason &&
              booking.cancellation_reason !== "string" && (
                <div className="mt-3 p-3 rounded-md bg-red-50 border border-red-200">
                  <p className="text-[1.3rem] text-red-500 font-medium mb-1">
                    Lý do hủy
                  </p>
                  <p className="text-[1.4rem] text-red-700">
                    {booking.cancellation_reason}
                  </p>
                </div>
              )}
          </Section>
        </div>
      </div>
    </div>
  );
}

export default BookingDetail;
