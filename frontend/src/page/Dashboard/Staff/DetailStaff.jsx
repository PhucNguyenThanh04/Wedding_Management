import { Typography, Tag, Skeleton } from "antd";
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
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import ActionStaff from "./ActionStaff";
import { useQuery } from "@tanstack/react-query";
import { getStaffById } from "../../../apis/staff.api";

const { Text, Title } = Typography;

const statusConfig = {
  true: { color: "green", label: "Đang làm việc" },
  false: { color: "red", label: "Đã nghỉ việc" },
};

const roleConfig = {
  staff: { label: "Nhân viên", color: "#0ea5e9" },
  admin: { label: "Quản trị viên", color: "#6366f1" },
};

function DetailStaff() {
  const { t } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [showEdit, setShowEdit] = useState(null);

  const {
    data: staff,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["staff", id],
    queryFn: () => getStaffById(id),
    enabled: !!id,
  });
  console.log(staff);

  const cardStyle = {
    background: t.surface2 ?? "#fff",
    border: `1px solid ${t.border ?? "#e2e8f0"}`,
    borderRadius: 12,
    padding: "20px 24px",
  };

  if (isLoading) {
    return (
      <div
        style={{
          background: t.surface ?? "#f8fafc",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <div
          style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={cardStyle}>
              <div className="flex flex-col items-center gap-3">
                <Skeleton.Avatar active size={88} />
                <Skeleton
                  active
                  title={{ width: 120 }}
                  paragraph={{ rows: 1, width: 80 }}
                />
              </div>
            </div>
            <div style={cardStyle}>
              <Skeleton active paragraph={{ rows: 7 }} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
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

  if (isError || !staff) {
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
            Không tìm thấy thông tin nhân viên.
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

  const status = statusConfig[staff.is_active] ?? statusConfig[true];
  const roleInfo = roleConfig[staff.role] ?? roleConfig.staff;
  const accentColor = roleInfo.color;

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
              fontSize: 16,
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
            <Text type="secondary" style={{ fontSize: 14 }}>
              Thông tin và lịch sử làm việc
            </Text>
          </div>
        </div>
        <button
          onClick={() => setShowEdit(staff)}
          className="bg-amber-500 hover:bg-amber-600 transition text-white px-5 py-2 rounded-md flex items-center gap-2"
          style={{ fontSize: 16 }}
        >
          <EditOutlined /> Chỉnh sửa
        </button>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...cardStyle, textAlign: "center" }}>
            <img
              src={staff.image ?? "https://i.pravatar.cc/150?img=1"}
              alt={staff.full_name}
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                objectFit: "cover",
                border: `3px solid ${accentColor}`,
                marginBottom: 12,
              }}
            />
            <Title
              level={4}
              style={{ margin: "0 0 6px", color: t.text ?? "#1e293b" }}
            >
              {staff.full_name}
            </Title>
            <div style={{ marginBottom: 8 }}>
              <Tag color={accentColor} style={{ color: "#fff" }}>
                {roleInfo.label}
              </Tag>
              <Tag color={status.color}>{status.label}</Tag>
            </div>
            <Text type="secondary" style={{ fontSize: 14 }}>
              @{staff.username} · #{staff.id?.slice(0, 8).toUpperCase()}
            </Text>
          </div>

          <div style={cardStyle}>
            <Text
              strong
              style={{
                color: t.text ?? "#1e293b",
                fontSize: 16,
                display: "block",
                marginBottom: 16,
              }}
            >
              Thông tin cá nhân
            </Text>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: <MailOutlined />, label: "Email", value: staff.email },
                {
                  icon: <PhoneOutlined />,
                  label: "Điện thoại",
                  value: staff.phone,
                },
                {
                  icon: <IdcardOutlined />,
                  label: "Tên đăng nhập",
                  value: staff.username,
                },
                {
                  icon: <CalendarOutlined />,
                  label: "Ngày tạo",
                  value: new Date(staff.created_at).toLocaleDateString("vi-VN"),
                },
                {
                  icon: <ClockCircleOutlined />,
                  label: "Cập nhật lần cuối",
                  value: new Date(staff.updated_at).toLocaleDateString("vi-VN"),
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
                        fontSize: 14,
                        display: "block",
                        lineHeight: 1.2,
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text style={{ color: t.text ?? "#1e293b", fontSize: 14 }}>
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
            <Text type="secondary" style={{ fontSize: 14, lineHeight: 1.6 }}>
              {staff.note || "Chưa có ghi chú."}
            </Text>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            {[
              {
                icon: (
                  <IdcardOutlined style={{ fontSize: 22, color: "#6366f1" }} />
                ),
                label: "Vai trò",
                value: roleInfo.label,
                bg: "#ede9fe",
              },
              {
                icon: (
                  <CheckCircleOutlined
                    style={{ fontSize: 22, color: "#0ea5e9" }}
                  />
                ),
                label: "Trạng thái",
                value: status.label,
                bg: "#e0f2fe",
              },
              {
                icon: (
                  <CalendarOutlined
                    style={{ fontSize: 22, color: "#f59e0b" }}
                  />
                ),
                label: "Ngày tham gia",
                value: new Date(staff.created_at).toLocaleDateString("vi-VN"),
                bg: "#fef9c3",
              },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  ...cardStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
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
            <div style={{ ...cardStyle, flex: 1 }}>
              <Text strong style={{ color: t.text ?? "#1e293b", fontSize: 15 }}>
                Lịch sử chấm công
              </Text>
              <div className="flex items-center justify-center h-32">
                <Text type="secondary">Chức năng đang được phát triển.</Text>
              </div>
            </div>
            {!staff.workHistory?.length ? (
              <Text type="secondary">Chưa có dữ liệu chấm công.</Text>
            ) : (
              <table
                className="w-full border-collapse"
                style={{ fontSize: 14 }}
              >
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
                  {staff.workHistory.map((row, i) => {
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
            )}
          </div>
        </div>
      </div>

      <ActionStaff
        open={!!showEdit}
        action="edit"
        data={showEdit}
        onClose={() => setShowEdit(null)}
      />
    </div>
  );
}

export default DetailStaff;
