import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Avatar, Skeleton, Tag, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../hooks/useAuth";
import { useTheme } from "../../../context/themeContext";
import { getStaffById } from "../../../apis/staff.api";

const { Text, Title } = Typography;

const roleConfig = {
  staff: { label: "Nhân viên", color: "#0ea5e9" },
  admin: { label: "Quản trị viên", color: "#6366f1" },
};

function ProfilePage() {
  const { t } = useTheme();
  const { user } = useAuth();

  const { data: staff, isLoading } = useQuery({
    queryKey: ["staff", user?.id],
    queryFn: () => getStaffById(user.id),
    enabled: !!user?.id,
  });

  const cardStyle = {
    background: t.surface2 ?? "#fff",
    border: `1px solid ${t.border ?? "#e2e8f0"}`,
    borderRadius: 12,
    padding: "24px",
  };

  const roleInfo = roleConfig[staff?.role] ?? roleConfig.staff;

  const infoItems = [
    {
      icon: <MailOutlined />,
      label: "Email",
      value: staff?.email,
    },
    {
      icon: <PhoneOutlined />,
      label: "Số điện thoại",
      value: staff?.phone,
    },
    {
      icon: <IdcardOutlined />,
      label: "Tên đăng nhập",
      value: staff?.username,
    },
    {
      icon: <CheckCircleOutlined />,
      label: "Trạng thái",
      value: staff?.is_active ? (
        <Tag color="green">Đang làm việc</Tag>
      ) : (
        <Tag color="red">Đã nghỉ việc</Tag>
      ),
    },
    {
      icon: <CalendarOutlined />,
      label: "Ngày tạo tài khoản",
      value: staff?.created_at
        ? new Date(staff.created_at).toLocaleDateString("vi-VN")
        : "—",
    },
    {
      icon: <ClockCircleOutlined />,
      label: "Cập nhật lần cuối",
      value: staff?.updated_at
        ? new Date(staff.updated_at).toLocaleDateString("vi-VN")
        : "—",
    },
  ];

  return (
    <div
      style={{
        background: t.surface ?? "#f8fafc",
        minHeight: "100vh",
        padding: "2rem",
        color: t.text ?? "#1e293b",
      }}
    >
      {/* Page title */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, margin: 0, color: t.text }}>
          Thông tin tài khoản
        </h2>
        <Text type="secondary" style={{ fontSize: 14 }}>
          Xem thông tin cá nhân của bạn
        </Text>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: 20,
          alignItems: "start",
        }}
      >
        {/* Left — Avatar + tên */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...cardStyle, textAlign: "center" }}>
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <Skeleton.Avatar active size={96} />
                <Skeleton
                  active
                  title={{ width: 120 }}
                  paragraph={{ rows: 1, width: 80 }}
                />
              </div>
            ) : (
              <>
                <Avatar
                  size={96}
                  icon={<UserOutlined />}
                  style={{
                    background: roleInfo.color,
                    fontSize: 40,
                    margin: "8px auto 16px",
                    display: "block",
                  }}
                />
                <Title
                  level={4}
                  style={{ margin: "0 0 6px", color: t.text ?? "#1e293b" }}
                >
                  {staff?.full_name}
                </Title>
                <Tag color={roleInfo.color} style={{ marginBottom: 8 }}>
                  {roleInfo.label}
                </Tag>
                <br />
                <Text type="secondary" style={{ fontSize: 13 }}>
                  @{staff?.username} · #{staff?.id?.slice(0, 8).toUpperCase()}
                </Text>
              </>
            )}
          </div>
        </div>

        {/* Right — Thông tin chi tiết */}
        <div style={cardStyle}>
          <Text
            strong
            style={{
              fontSize: 16,
              color: t.text ?? "#1e293b",
              display: "block",
              marginBottom: 20,
            }}
          >
            Thông tin cá nhân
          </Text>

          {isLoading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px 32px",
              }}
            >
              {infoItems.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "12px 16px",
                    background: t.surface ?? "#f8fafc",
                    borderRadius: 8,
                  }}
                >
                  <span
                    style={{
                      color: roleInfo.color,
                      marginTop: 3,
                      fontSize: 16,
                    }}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: 12,
                        display: "block",
                        marginBottom: 2,
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
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
