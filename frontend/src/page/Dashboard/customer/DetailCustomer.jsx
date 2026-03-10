import { Typography, Tag, Divider, Statistic, Timeline, Avatar } from "antd";
import {
  ArrowLeftOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  ShoppingOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  EditOutlined,
  TrophyOutlined,
  RiseOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../../context/themeContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ActionCustomer from "./ActionCustomer";

const { Text, Title } = Typography;

const MOCK_DETAIL = {
  id: 1,
  name: "Nguyễn Văn A",
  email: "trungkien@gmail.com",
  password: "123456",
  phone: "0123456789",
  image: "https://i.pravatar.cc/150?img=1",
  totalSpent: 5000000,
  joinDate: "2023-01-15",
  address: "123 Lê Lợi, Quận 1, TP.HCM",
  status: "active",
  totalOrders: 24,
  lastVisit: "2024-12-20",
  note: "Khách hàng thân thiết, thường đặt bàn vào cuối tuần.",
  orders: [
    {
      id: "HD001",
      date: "2024-12-20",
      amount: 450000,
      status: "completed",
      items: "Bò lúc lắc, Cơm chiên dương châu",
    },
    {
      id: "HD002",
      date: "2024-12-10",
      amount: 320000,
      status: "completed",
      items: "Gà nướng mật ong, Canh chua",
    },
    {
      id: "HD003",
      date: "2024-11-28",
      amount: 780000,
      status: "completed",
      items: "Lẩu thái, Hải sản hấp",
    },
    {
      id: "HD004",
      date: "2024-11-15",
      amount: 210000,
      status: "completed",
      items: "Phở bò, Chả giò",
    },
    {
      id: "HD005",
      date: "2024-10-30",
      amount: 560000,
      status: "completed",
      items: "Tôm hùm, Rau xào",
    },
  ],
};

const statusConfig = {
  active: { color: "green", label: "Đang hoạt động" },
  inactive: { color: "red", label: "Ngừng hoạt động" },
  vip: { color: "gold", label: "VIP" },
};

const rankConfig = (totalSpent) => {
  if (totalSpent >= 10000000) return { label: "Kim cương", color: "#0ea5e9" };
  if (totalSpent >= 5000000) return { label: "Vàng", color: "#f59e0b" };
  if (totalSpent >= 2000000) return { label: "Bạc", color: "#94a3b8" };
  return { label: "Đồng", color: "#b45309" };
};

function DetailCustomer() {
  const { t } = useTheme();
  const navigate = useNavigate();
  const rank = rankConfig(MOCK_DETAIL.totalSpent);
  const status = statusConfig[MOCK_DETAIL.status] || statusConfig.active;
  const [showEdit, setShowEdit] = useState(null);
  console.log(showEdit);

  const cardStyle = {
    border: `1px solid ${t.border ?? "#e2e8f0"}`,
    borderRadius: 12,
    padding: "20px 24px",
  };

  return (
    <div
      style={{
        background: t.surface ?? "#f8fafc",
        minHeight: "100vh",
        padding: "2rem",
        color: t.text ?? "#1e293b",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
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
              Chi Tiết Khách Hàng
            </h2>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Xem thông tin và lịch sử giao dịch
            </Text>
          </div>
        </div>
        <button
          onClick={() => setShowEdit(MOCK_DETAIL)}
          className="bg-amber-500 hover:bg-amber-600 transition text-white px-5 py-2 rounded-md flex items-center gap-2"
          style={{ fontSize: 14 }}
        >
          <EditOutlined /> Chỉnh sửa
        </button>
      </div>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: t.surface2 ?? "#fff",
          border: `1px solid ${t.border ?? "#e2e8f0"}`,
          borderRadius: 8,
          padding: "5px 12px",
          cursor: "pointer",
          color: t.text ?? "#1e293b",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 16,
        }}
        className="hover:opacity-80 transition"
      >
        <ArrowLeftOutlined /> Quay lại
      </button>

      <div
        className="grid grid-cols-1 gap-5 mt-6"
        style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}
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
                src={MOCK_DETAIL.image}
                alt={MOCK_DETAIL.name}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `3px solid ${rank.color}`,
                }}
              />
            </div>
            <Title
              level={4}
              style={{ margin: "0 0 4px", color: t.text ?? "#1e293b" }}
            >
              {MOCK_DETAIL.name}
            </Title>
            <div style={{ marginBottom: 10 }}>
              <Tag color={status.color}>{status.label}</Tag>
              <Tag color={rank.color} style={{ marginLeft: 4 }}>
                Hạng {rank.label}
              </Tag>
            </div>
            <Text type="secondary" style={{ fontSize: 16 }}>
              #{MOCK_DETAIL.id.toString().padStart(4, "0")}
            </Text>
          </div>

          <div style={cardStyle}>
            <Text
              strong
              style={{
                color: t.text ?? "#1e293b",
                fontSize: 16,
                display: "block",
                marginBottom: 14,
              }}
            >
              Thông tin liên hệ
            </Text>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                {
                  icon: <MailOutlined />,
                  label: "Email",
                  value: MOCK_DETAIL.email,
                },
                {
                  icon: <PhoneOutlined />,
                  label: "Điện thoại",
                  value: MOCK_DETAIL.phone,
                },
                {
                  icon: <EnvironmentOutlined />,
                  label: "Địa chỉ",
                  value: MOCK_DETAIL.address,
                },
                {
                  icon: <CalendarOutlined />,
                  label: "Ngày tham gia",
                  value: new Date(MOCK_DETAIL.joinDate).toLocaleDateString(
                    "vi-VN",
                  ),
                },
                {
                  icon: <ClockCircleOutlined />,
                  label: "Lần cuối ghé",
                  value: new Date(MOCK_DETAIL.lastVisit).toLocaleDateString(
                    "vi-VN",
                  ),
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                >
                  <span
                    style={{ color: "#6366f1", marginTop: 2, minWidth: 16 }}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: 14,
                        display: "block",
                        lineHeight: 1.2,
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text style={{ color: t.text ?? "#1e293b", fontSize: 16 }}>
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
                fontSize: 16,
                display: "block",
                marginBottom: 8,
              }}
            >
              Ghi chú
            </Text>
            <Text type="secondary" style={{ fontSize: 16, lineHeight: 1.6 }}>
              {MOCK_DETAIL.note || "Chưa có ghi chú."}
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
                  <RiseOutlined style={{ fontSize: 22, color: "#6366f1" }} />
                ),
                title: "Tổng chi tiêu",
                value: MOCK_DETAIL.totalSpent.toLocaleString("vi-VN") + "đ",
                bg: "#ede9fe",
              },
              {
                icon: (
                  <ShoppingOutlined
                    style={{ fontSize: 22, color: "#0ea5e9" }}
                  />
                ),
                title: "Số đơn hàng",
                value: MOCK_DETAIL.totalOrders,
                bg: "#e0f2fe",
              },
              {
                icon: (
                  <TrophyOutlined style={{ fontSize: 22, color: rank.color }} />
                ),
                title: "Hạng thành viên",
                value: rank.label,
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
                    style={{ fontSize: 14, display: "block" }}
                  >
                    {stat.title}
                  </Text>
                  <Text
                    strong
                    style={{ fontSize: 16, color: t.text ?? "#1e293b" }}
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
                Lịch sử đơn hàng
              </Text>
              <Tag color="blue">{MOCK_DETAIL.orders.length} đơn</Tag>
            </div>
            <table className="w-full border-collapse " style={{ fontSize: 16 }}>
              <thead>
                <tr
                  style={{
                    borderBottom: `1px solid ${t.border ?? "#e2e8f0"}`,
                  }}
                >
                  {["Mã đơn", "Ngày đặt", "Món", "Giá trị", "Trạng thái"].map(
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
                {MOCK_DETAIL.orders.map((order) => (
                  <tr
                    key={order.id}
                    style={{
                      borderBottom: `1px solid ${t.border ?? "#e2e8f0"}`,
                      color: t.text ?? "#1e293b",
                    }}
                  >
                    <td className="p-2">
                      <Text strong style={{ color: "#6366f1" }}>
                        {order.id}
                      </Text>
                    </td>
                    <td
                      className="p-2 text-secondary"
                      style={{ color: "#64748b" }}
                    >
                      {new Date(order.date).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-2" style={{ maxWidth: 180 }}>
                      <Text
                        ellipsis={{ tooltip: order.items }}
                        style={{
                          color: t.text ?? "#1e293b",
                          display: "block",
                          maxWidth: 180,
                        }}
                      >
                        {order.items}
                      </Text>
                    </td>
                    <td className="p-2">
                      <Text strong style={{ color: "#16a34a" }}>
                        {order.amount.toLocaleString("vi-VN")}đ
                      </Text>
                    </td>
                    <td className="p-2">
                      <Tag color="green">Hoàn thành</Tag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showEdit && (
        <ActionCustomer
          open={showEdit}
          action="edit"
          data={showEdit}
          onClose={() => setShowEdit(null)}
        />
      )}
    </div>
  );
}

export default DetailCustomer;
