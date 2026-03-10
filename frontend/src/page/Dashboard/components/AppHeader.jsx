import { Header } from "antd/es/layout/layout";
import { useTheme } from "../../../context/themeContext";
import { Avatar, Badge, Button, Dropdown, Select, Space } from "antd";
import ThemeSwitcher from "./ThemeSwitcher";
import {
  BellOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";

function AppHeader({ currentTheme, onThemeChange }) {
  const { t } = useTheme();

  const items = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Thông tin tài khoản",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      localStorage.removeItem("user");
      window.location.href = "/dashboard/login";
    }
  };

  return (
    <Header
      style={{
        background: t.headerBg,
        borderBottom: `1px solid ${t.border}`,
        padding: "0 28px",
        height: 60,
        display: "flex",
        alignItems: "center",
        lineHeight: "normal",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 5,
        transition: "background .3s",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: t.text,
            lineHeight: 1,
          }}
        >
          Dashboard
        </div>
        <div style={{ fontSize: 12, color: t.textMuted, marginTop: 1 }}>
          Thứ Năm, 19 tháng 2, 2026
        </div>
      </div>
      <Space size={12} align="center">
        <ThemeSwitcher currentTheme={currentTheme} onChange={onThemeChange} />
        <Select
          defaultValue="30"
          size="middle"
          style={{ width: 140 }}
          options={[
            { value: "7", label: "7 ngày qua" },
            { value: "30", label: "30 ngày qua" },
            { value: "90", label: "90 ngày qua" },
            { value: "365", label: "Năm nay" },
          ]}
        />
        <Badge dot color="red" offset={[-4, 4]}>
          <Button icon={<BellOutlined />} />
        </Badge>
        {/* <div className="cursor-pointer relative">
          <Avatar
            size={36}
            src="https://hoiquancaothu.com/images/skins/lien-quan/zuka-gau-nhoi-bong.jpg?q=1?v=2.0.0.1"
            alt="avatar admin"
          />
          <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full">
            <div className="text-xs text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              Đăng xuất
            </div>
          </div>
        </div> */}
        <Dropdown
          menu={{ items, onClick: handleMenuClick }}
          placement="bottomRight"
          trigger={["click"]}
          arrow
        >
          <div className="cursor-pointer relative">
            <Avatar
              size={36}
              src="https://hoiquancaothu.com/images/skins/lien-quan/zuka-gau-nhoi-bong.jpg"
              alt="avatar admin"
            />
            {/* Dot online */}
            <span
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 10,
                height: 10,
                background: "#22c55e",
                borderRadius: "50%",
                border: "2px solid #fff",
              }}
            />
          </div>
        </Dropdown>
      </Space>
    </Header>
  );
}

export default AppHeader;
