import { Typography, Tag } from "antd";
import {
  ArrowLeftOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  EditOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  IdcardOutlined,
  TeamOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../../context/themeContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ActionStaff from "./ActionStaff";

const { Text, Title } = Typography;

const MOCK_STAFF_DETAIL = {
  id: 1,
  name: "Nguyễn Văn A",
  email: "nguyenvana@gmail.com",
  password: "123456",
  phone: "0123456789",
  image: "https://i.pravatar.cc/150?img=1",
  role: "Phục vụ", // Bếp trưởng | Phụ bếp | Phục vụ | Thu ngân | Quản lý
  department: "Sảnh chính", // Bếp | Sảnh chính | Quầy bar | Lễ tân
  shift: "Ca sáng", // Ca sáng | Ca chiều | Ca tối | Ca đêm
  salary: 8000000,
  startDate: "2022-06-01",
  address: "45 Nguyễn Huệ, Quận 1, TP.HCM",
  status: "active", // active | inactive | on_leave
  totalWorkDays: 312,
  lastCheckIn: "2024-12-20 08:05",
  cccd: "079202012345",
  note: "Nhân viên chăm chỉ, đúng giờ, được khách hàng đánh giá cao.",
  workHistory: [
    { month: "Tháng 12/2024", workDays: 24, lateCount: 0, bonus: 500000 },
    { month: "Tháng 11/2024", workDays: 26, lateCount: 1, bonus: 300000 },
    { month: "Tháng 10/2024", workDays: 25, lateCount: 0, bonus: 500000 },
    { month: "Tháng 9/2024", workDays: 22, lateCount: 2, bonus: 0 },
    { month: "Tháng 8/2024", workDays: 27, lateCount: 0, bonus: 500000 },
  ],
};

const statusConfig = {
  active: { color: "green", label: "Đang làm việc" },
  inactive: { color: "red", label: "Đã nghỉ việc" },
  on_leave: { color: "orange", label: "Đang nghỉ phép" },
};

const roleColor = {
  "Quản lý": "#6366f1",
  "Bếp trưởng": "#ef4444",
  "Phụ bếp": "#f97316",
  "Phục vụ": "#0ea5e9",
  "Thu ngân": "#10b981",
};

function DetailStaff() {
  const { t } = useTheme();
  const status = statusConfig[MOCK_STAFF_DETAIL.status] || statusConfig.active;
  const accentColor = roleColor[MOCK_STAFF_DETAIL.role] ?? "#6366f1";
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(null);

  const cardStyle = {
    background: t.surface2 ?? "#fff",
    border: `1px solid ${t.border ?? "#e2e8f0"}`,
    borderRadius: 12,
    padding: "20px 24px",
  };

  const totalBonus = MOCK_STAFF_DETAIL.workHistory.reduce(
    (s, r) => s + r.bonus,
    0,
  );

  return (
    <div
      style={{
        background: t.surface ?? "#f8fafc",
        minHeight: "100vh",
        padding: "2rem",
        color: t.text ?? "#1e293b",
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            style={{
              background: t.surface2 ?? "#fff",
              border: `1px solid ${t.border ?? "#e2e8f0"}`,
              borderRadius: 8,
              padding: "8px 12px",
              cursor: "pointer",
              color: t.text ?? "#1e293b",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
            }}
            className="hover:opacity-80 transition"
          >
            <ArrowLeftOutlined /> Quay lại
          </button>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 600,
                color: t.text ?? "#1e293b",
                lineHeight: 1.2,
              }}
            >
              Chi Tiết Nhân Viên
            </h2>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Thông tin và lịch sử làm việc
            </Text>
          </div>
        </div>
        <button
          onClick={() => setShowEdit(MOCK_STAFF_DETAIL)}
          className="bg-amber-500 hover:bg-amber-600 transition text-white px-5 py-2 rounded-md flex items-center gap-2"
          style={{ fontSize: 14 }}
        >
          <EditOutlined /> Chỉnh sửa
        </button>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...cardStyle, textAlign: "center" }}>
            <div
              style={{
                position: "relative",
                display: "inline-block",
                marginBottom: 12,
              }}
            >
              <img
                src={MOCK_STAFF_DETAIL.image}
                alt={MOCK_STAFF_DETAIL.name}
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `3px solid ${accentColor}`,
                }}
              />
            </div>
            <Title
              level={4}
              style={{ margin: "0 0 6px", color: t.text ?? "#1e293b" }}
            >
              {MOCK_STAFF_DETAIL.name}
            </Title>
            <div style={{ marginBottom: 8 }}>
              <Tag color={accentColor} style={{ color: "#fff" }}>
                {MOCK_STAFF_DETAIL.role}
              </Tag>
              <Tag color={status.color}>{status.label}</Tag>
            </div>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {MOCK_STAFF_DETAIL.department} · #
              {MOCK_STAFF_DETAIL.id.toString().padStart(4, "0")}
            </Text>
          </div>

          <div style={cardStyle}>
            <Text
              strong
              style={{
                color: t.text ?? "#1e293b",
                fontSize: 14,
                display: "block",
                marginBottom: 14,
              }}
            >
              Thông tin cá nhân
            </Text>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                {
                  icon: <MailOutlined />,
                  label: "Email",
                  value: MOCK_STAFF_DETAIL.email,
                },
                {
                  icon: <PhoneOutlined />,
                  label: "Điện thoại",
                  value: MOCK_STAFF_DETAIL.phone,
                },
                {
                  icon: <IdcardOutlined />,
                  label: "CCCD",
                  value: MOCK_STAFF_DETAIL.cccd,
                },
                {
                  icon: <EnvironmentOutlined />,
                  label: "Địa chỉ",
                  value: MOCK_STAFF_DETAIL.address,
                },
                {
                  icon: <CalendarOutlined />,
                  label: "Ngày vào làm",
                  value: new Date(
                    MOCK_STAFF_DETAIL.startDate,
                  ).toLocaleDateString("vi-VN"),
                },
                {
                  icon: <ClockCircleOutlined />,
                  label: "Ca làm việc",
                  value: MOCK_STAFF_DETAIL.shift,
                },
                {
                  icon: <CheckCircleOutlined />,
                  label: "Check-in cuối",
                  value: MOCK_STAFF_DETAIL.lastCheckIn,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                >
                  <span
                    style={{ color: accentColor, marginTop: 2, minWidth: 16 }}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: 11,
                        display: "block",
                        lineHeight: 1.2,
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text style={{ color: t.text ?? "#1e293b", fontSize: 13 }}>
                      {item.value}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <Text
              strong
              style={{
                color: t.text ?? "#1e293b",
                fontSize: 14,
                display: "block",
                marginBottom: 8,
              }}
            >
              Ghi chú
            </Text>
            <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.6 }}>
              {MOCK_STAFF_DETAIL.note || "Chưa có ghi chú."}
            </Text>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 14,
            }}
          >
            {[
              {
                icon: (
                  <DollarOutlined style={{ fontSize: 22, color: "#16a34a" }} />
                ),
                label: "Lương cơ bản",
                value: MOCK_STAFF_DETAIL.salary.toLocaleString("vi-VN") + "đ",
                bg: "#dcfce7",
              },
              {
                icon: (
                  <TeamOutlined style={{ fontSize: 22, color: "#0ea5e9" }} />
                ),
                label: "Ngày công tổng",
                value: `${MOCK_STAFF_DETAIL.totalWorkDays} ngày`,
                bg: "#e0f2fe",
              },
              {
                icon: (
                  <DollarOutlined style={{ fontSize: 22, color: "#f59e0b" }} />
                ),
                label: "Thưởng 5 tháng",
                value: totalBonus.toLocaleString("vi-VN") + "đ",
                bg: "#fef9c3",
              },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  ...cardStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    background: stat.bg,
                    borderRadius: 10,
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {stat.icon}
                </div>
                <div>
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block" }}
                  >
                    {stat.label}
                  </Text>
                  <Text
                    strong
                    style={{ fontSize: 15, color: t.text ?? "#1e293b" }}
                  >
                    {stat.value}
                  </Text>
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...cardStyle, flex: 1 }}>
            <div className="flex items-center justify-between mb-4">
              <Text strong style={{ color: t.text ?? "#1e293b", fontSize: 15 }}>
                Lịch sử chấm công
              </Text>
              <Tag color="blue">
                {MOCK_STAFF_DETAIL.workHistory.length} tháng gần nhất
              </Tag>
            </div>
            <table className="w-full border-collapse" style={{ fontSize: 13 }}>
              <thead>
                <tr
                  style={{
                    background: t.surface ?? "#f8fafc",
                    borderBottom: `1px solid ${t.border ?? "#e2e8f0"}`,
                  }}
                >
                  {["Tháng", "Ngày công", "Đi trễ", "Thưởng", "Đánh giá"].map(
                    (h) => (
                      <th
                        key={h}
                        className="p-2 text-start"
                        style={{ color: t.text ?? "#1e293b", fontWeight: 600 }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {MOCK_STAFF_DETAIL.workHistory.map((row, i) => {
                  const rating =
                    row.lateCount === 0 && row.workDays >= 25
                      ? { label: "Xuất sắc", color: "green" }
                      : row.lateCount <= 1
                        ? { label: "Tốt", color: "blue" }
                        : { label: "Cần cải thiện", color: "orange" };
                  return (
                    <tr
                      key={i}
                      style={{
                        borderBottom: `1px solid ${t.border ?? "#e2e8f0"}`,
                        color: t.text ?? "#1e293b",
                      }}
                    >
                      <td className="p-2">
                        <Text strong style={{ color: accentColor }}>
                          {row.month}
                        </Text>
                      </td>
                      <td className="p-2">{row.workDays} ngày</td>
                      <td className="p-2">
                        <Tag color={row.lateCount === 0 ? "green" : "red"}>
                          {row.lateCount} lần
                        </Tag>
                      </td>
                      <td className="p-2">
                        <Text
                          strong
                          style={{
                            color: row.bonus > 0 ? "#16a34a" : "#94a3b8",
                          }}
                        >
                          {row.bonus > 0
                            ? "+" + row.bonus.toLocaleString("vi-VN") + "đ"
                            : "—"}
                        </Text>
                      </td>
                      <td className="p-2">
                        <Tag color={rating.color}>{rating.label}</Tag>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ActionStaff
        open={!!showEdit}
        action={"edit"}
        data={showEdit}
        onClose={() => setShowEdit(null)}
      />
    </div>
  );
}

export default DetailStaff;
