import { forwardRef } from "react";

const formatCurrency = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) return "—";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
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

const InvoicePrint = forwardRef(({ booking }, ref) => {
  if (!booking) return null;

  return (
    <div
      ref={ref}
      style={{
        fontFamily: "Arial",
        padding: "40px",
        color: "#000",
        fontSize: "14px",
      }}
    >
      {/* Header */}
      <h2
        style={{ textAlign: "center", fontSize: "22px", marginBottom: "4px" }}
      >
        HÓA ĐƠN TIỆC
      </h2>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "24px" }}>
        Ngày in: {new Date().toLocaleDateString("vi-VN")}
      </p>

      <hr style={{ marginBottom: "20px" }} />

      {/* Thông tin đơn */}
      <h3 style={{ marginBottom: "10px" }}>Thông tin đặt tiệc</h3>
      <table
        style={{
          width: "100%",
          marginBottom: "20px",
          borderCollapse: "collapse",
        }}
      >
        <tbody>
          <tr>
            <td style={infoLabelStyle}>Mã đơn:</td>
            <td style={infoValueStyle}>#{booking.id}</td>
            <td style={infoLabelStyle}>Mã khách hàng:</td>
            <td style={infoValueStyle}>{booking.customer_id}</td>
          </tr>
          <tr>
            <td style={infoLabelStyle}>Ngày tiệc:</td>
            <td style={infoValueStyle}>{booking.event_date}</td>
            <td style={infoLabelStyle}>Giờ tiệc:</td>
            <td style={infoValueStyle}>{booking.event_time?.slice(0, 5)}</td>
          </tr>
          <tr>
            <td style={infoLabelStyle}>Ca tiệc:</td>
            <td style={infoValueStyle}>
              {SHIFT_LABEL[booking.event_shift] ?? booking.event_shift}
            </td>
            <td style={infoLabelStyle}>Loại tiệc:</td>
            <td style={infoValueStyle}>
              {EVENT_TYPE_LABEL[booking.event_type] ?? booking.event_type}
            </td>
          </tr>
          <tr>
            <td style={infoLabelStyle}>Sảnh:</td>
            <td style={infoValueStyle}>{booking.hall_id}</td>
            <td style={infoLabelStyle}>Số bàn:</td>
            <td style={infoValueStyle}>{booking.so_ban} bàn</td>
          </tr>
          {booking.notes && (
            <tr>
              <td style={infoLabelStyle}>Ghi chú:</td>
              <td style={{ ...infoValueStyle, color: "#555" }} colSpan={3}>
                {booking.notes}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Danh sách menu */}
      <h3 style={{ marginBottom: "10px" }}>Danh sách menu</h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr style={{ background: "#f3f4f6" }}>
            <th style={thStyle}>STT</th>
            <th style={thStyle}>Tên menu</th>
            <th style={thStyle}>Số bàn</th>
            <th style={thStyle}>Giá/bàn</th>
            <th style={thStyle}>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {booking.order_menus?.map((m, i) => {
            const total = parseFloat(m.price_snapshot) * m.quantity;
            return (
              <tr key={m.id}>
                <td style={{ ...tdStyle, textAlign: "center" }}>{i + 1}</td>
                <td style={tdStyle}>{m.menu?.name ?? `Menu #${m.menu_id}`}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  {m.quantity}
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {formatCurrency(m.price_snapshot)}
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {formatCurrency(total)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Tổng tiền */}
      <div style={{ width: "320px", marginLeft: "auto" }}>
        <SummaryRow
          label="Tiền bàn:"
          value={formatCurrency(booking.table_total)}
        />
        <SummaryRow
          label="Tiền menu:"
          value={formatCurrency(booking.menu_total)}
        />
        <SummaryRow
          label="Món thêm:"
          value={formatCurrency(booking.extra_dishes_total)}
        />
        <SummaryRow
          label="Phí dịch vụ:"
          value={formatCurrency(booking.service_fee)}
        />
        <SummaryRow
          label="Giảm giá:"
          value={`- ${formatCurrency(booking.discount_amount)}`}
        />
        <SummaryRow
          label={`Thuế (${parseFloat(booking.tax_rate ?? 0)}%):`}
          value={formatCurrency(booking.tax_amount)}
        />
        <hr style={{ margin: "8px 0" }} />
        <SummaryRow
          label="TỔNG CỘNG:"
          value={formatCurrency(booking.total_amount)}
          bold
        />
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "48px",
          display: "flex",
          justifyContent: "space-between",
          textAlign: "center",
        }}
      >
        <div>
          <p style={{ fontWeight: "bold" }}>Khách hàng</p>
          <p style={{ color: "#aaa", fontSize: "12px" }}>
            (Ký và ghi rõ họ tên)
          </p>
          <div style={{ marginTop: "60px" }}></div>
        </div>
        <div>
          <p style={{ fontWeight: "bold" }}>Nhân viên lập hóa đơn</p>
          <p style={{ color: "#aaa", fontSize: "12px" }}>
            (Ký và ghi rõ họ tên)
          </p>
          <div style={{ marginTop: "60px" }}></div>
        </div>
      </div>
    </div>
  );
});

// Sub-component dòng tổng tiền
const SummaryRow = ({ label, value, bold }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "4px 0",
      fontWeight: bold ? "bold" : "normal",
      fontSize: bold ? "16px" : "14px",
    }}
  >
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

// Styles
const thStyle = { border: "1px solid #ddd", padding: "8px", textAlign: "left" };
const tdStyle = { border: "1px solid #ddd", padding: "8px" };
const infoLabelStyle = {
  padding: "5px 8px",
  color: "#666",
  width: "120px",
  fontWeight: "bold",
};
const infoValueStyle = { padding: "5px 8px", width: "180px" };

export default InvoicePrint;
