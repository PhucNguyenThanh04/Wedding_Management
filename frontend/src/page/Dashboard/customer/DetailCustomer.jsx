import { Typography, Tag, Skeleton } from "antd";
import {
  ArrowLeftOutlined,
  MailOutlined,
  PhoneOutlined,
  ShoppingOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  EditOutlined,
  TrophyOutlined,
  RiseOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../../context/themeContext";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import ActionCustomer from "./ActionCustomer";
import { useQuery } from "@tanstack/react-query";
import { getCustomerById, getCustomerOrders } from "../../../apis/customer.api";

const { Text, Title } = Typography;

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
  const { id } = useParams();
  const [showEdit, setShowEdit] = useState(null);

  const {
    data: customer,
    isLoading: isLoadingCustomer,
    isError,
  } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomerById(id),
    enabled: !!id,
  });

  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ["customer-orders", id],
    queryFn: () => getCustomerOrders(id),
    enabled: !!id,
  });

  const cardStyle = {
    border: `1px solid ${t.border ?? "#e2e8f0"}`,
    borderRadius: 12,
    padding: "20px 24px",
  };

  // Loading state
  if (isLoadingCustomer) {
    return (
      <div
        style={{
          background: t.surface ?? "#f8fafc",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: 20,
            marginTop: 24,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ ...cardStyle, textAlign: "center" }}>
              <Skeleton.Avatar active size={90} style={{ marginBottom: 12 }} />
              <Skeleton
                active
                title={{ width: 120 }}
                paragraph={{ rows: 1, width: 80 }}
              />
            </div>
            <div style={cardStyle}>
              <Skeleton active paragraph={{ rows: 5 }} />
            </div>
            <div style={cardStyle}>
              <Skeleton active paragraph={{ rows: 2 }} />
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
              {[1, 2, 3].map((i) => (
                <div key={i} style={cardStyle}>
                  <Skeleton active paragraph={{ rows: 1 }} />
                </div>
              ))}
            </div>
            <div style={cardStyle}>
              <Skeleton active paragraph={{ rows: 6 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !customer) {
    return (
      <div
        style={{
          background: t.surface ?? "#f8fafc",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Text type="danger" style={{ fontSize: 16 }}>
            Không tìm thấy thông tin khách hàng.
          </Text>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const rank = rankConfig(customer.total_spent ?? 0);
  const status = statusConfig[customer.status] ?? statusConfig.active;

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
        <button
          onClick={() => setShowEdit(customer)}
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
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: 20,
          marginTop: 24,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...cardStyle, textAlign: "center" }}>
            <img
              src={customer.image ?? "https://i.pravatar.cc/150?img=1"}
              alt={customer.full_name}
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                objectFit: "cover",
                border: `3px solid ${rank.color}`,
                marginBottom: 12,
              }}
            />
            <Title
              level={4}
              style={{ margin: "0 0 4px", color: t.text ?? "#1e293b" }}
            >
              {customer.full_name}
            </Title>
            <div style={{ marginBottom: 10 }}>
              <Tag color={status.color}>{status.label}</Tag>
              <Tag color={rank.color} style={{ marginLeft: 4 }}>
                Hạng {rank.label}
              </Tag>
            </div>
            <Text type="secondary" style={{ fontSize: 16 }}>
              {/* #{customer.id?.slice(0, 8).toUpperCase()} */}
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
                  value: customer.email,
                },
                {
                  icon: <PhoneOutlined />,
                  label: "Điện thoại",
                  value: customer.phone,
                },
                {
                  icon: <EnvironmentOutlined />,
                  label: "Địa chỉ",
                  value: customer.address,
                },
                {
                  icon: <CalendarOutlined />,
                  label: "Ngày tham gia",
                  value: customer.created_at
                    ? new Date(customer.created_at).toLocaleDateString("vi-VN")
                    : "—",
                },
                {
                  icon: <ClockCircleOutlined />,
                  label: "Cập nhật lần cuối",
                  value: customer.updated_at
                    ? new Date(customer.updated_at).toLocaleDateString("vi-VN")
                    : "—",
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
                      {item.value ?? "—"}
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
              {customer.note || "Chưa có ghi chú."}
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
                value: customer.total_spent
                  ? customer.total_spent.toLocaleString("vi-VN") + "đ"
                  : "—",
                bg: "#ede9fe",
              },
              {
                icon: (
                  <ShoppingOutlined
                    style={{ fontSize: 22, color: "#0ea5e9" }}
                  />
                ),
                title: "Số đơn hàng",
                value: orders.length,
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
              <Tag color="blue">{orders.length} đơn</Tag>
            </div>

            {isLoadingOrders ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : orders.length === 0 ? (
              <Text type="secondary">Chưa có đơn hàng nào.</Text>
            ) : (
              <table
                className="w-full border-collapse"
                style={{ fontSize: 16 }}
              >
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
                          style={{
                            color: t.text ?? "#1e293b",
                            fontWeight: 600,
                          }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: `1px solid ${t.border ?? "#e2e8f0"}`,
                        color: t.text ?? "#1e293b",
                      }}
                    >
                      <td className="p-2">
                        <Text strong style={{ color: "#6366f1" }}>
                          #{order.id?.slice(0, 8).toUpperCase()}
                        </Text>
                      </td>
                      <td className="p-2" style={{ color: "#64748b" }}>
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString(
                              "vi-VN",
                            )
                          : "—"}
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
                          {order.items ?? "—"}
                        </Text>
                      </td>
                      <td className="p-2">
                        <Text strong style={{ color: "#16a34a" }}>
                          {order.total_amount
                            ? order.total_amount.toLocaleString("vi-VN") + "đ"
                            : "—"}
                        </Text>
                      </td>
                      <td className="p-2">
                        <Tag
                          color={
                            order.status === "completed"
                              ? "green"
                              : order.status === "pending"
                                ? "orange"
                                : "red"
                          }
                        >
                          {order.status === "completed"
                            ? "Hoàn thành"
                            : order.status === "pending"
                              ? "Đang xử lý"
                              : "Đã huỷ"}
                        </Tag>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {showEdit && (
        <ActionCustomer
          open={!!showEdit}
          action="edit"
          data={showEdit}
          onClose={() => setShowEdit(null)}
        />
      )}
    </div>
  );
}

export default DetailCustomer;
