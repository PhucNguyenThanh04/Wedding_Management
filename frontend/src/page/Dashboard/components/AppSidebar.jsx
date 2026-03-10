import Sider from "antd/es/layout/Sider";
import { useTheme } from "../../../context/themeContext";
import { Avatar, Menu } from "antd";
import {
  DashboardOutlined,
  BarChartOutlined,
  UserOutlined,
  SettingOutlined,
  CalendarOutlined,
  ForkOutlined,
  HomeOutlined,
  DollarOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const NAV_ITEMS = [
  { key: "/", icon: <DashboardOutlined />, label: "Dashboard" },

  { type: "divider" },

  { key: "schedule", icon: <CalendarOutlined />, label: "Lịch tiệc" },
  { key: "halls", icon: <HomeOutlined />, label: "Sảnh" },

  { type: "divider" },

  { key: "menu", icon: <ForkOutlined />, label: "Thực đơn & Gói tiệc" },
  { key: "customers", icon: <UserOutlined />, label: "Khách hàng" },
  { key: "staffs", icon: <TeamOutlined />, label: "Nhân sự" },

  // { type: "divider" },

  // { key: "finance", icon: <DollarOutlined />, label: "Thu chi & Công nợ" },
  // { key: "reports", icon: <BarChartOutlined />, label: "Báo cáo" },

  // { type: "divider" },

  // { key: "settings", icon: <SettingOutlined />, label: "Cài đặt" },
];

function AppSidebar({ activeKey, onSelect }) {
  const { t } = useTheme();
  return (
    <Sider
      width={240}
      style={{
        position: "fixed",
        height: "100vh",
        zIndex: 10,
        background: t.sidebarBg,
        borderRight: `1px solid ${t.border}`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "background .3s",
      }}
    >
      <div
        style={{
          padding: "20px 24px 20px",
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg,#4f8ef7,#7c5cfc)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: "#fff",
            }}
          >
            ⬡
          </div>
          <span
            style={{
              fontFamily: "'Space Mono',monospace",
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: -0.5,
              color: t.text,
            }}
          >
            Wedding<span style={{ color: t.accent }}>KPVT</span>
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          onSelect={({ key }) => onSelect(key)}
          items={NAV_ITEMS}
          className="dash-menu"
        />
      </div>

      <div style={{ padding: "12px", borderTop: `1px solid ${t.border}` }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 8,
            cursor: "pointer",
            transition: "background .15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = t.menuHover)}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <Avatar
            size={32}
            style={{
              background: "linear-gradient(135deg,#7c5cfc,#4f8ef7)",
              fontWeight: 700,
              fontSize: 13,
              flexShrink: 0,
            }}
          >
            TA
          </Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: t.text,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Trung Kiên
            </div>
            <div style={{ fontSize: 11, color: t.textMuted }}>Admin</div>
          </div>
          <span style={{ color: t.textMuted, fontSize: 16 }}>⋯</span>
        </div>
      </div>
    </Sider>
  );
}

export default AppSidebar;
