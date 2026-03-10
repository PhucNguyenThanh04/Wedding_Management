import { useState } from "react";
import { Layout, ConfigProvider, theme as antTheme } from "antd";

import AppHeader from "./components/AppHeader";
import { ThemeCtx } from "../../context/themeContext";
import { THEMES } from "./components/Theme";
import AppSidebar from "./components/AppSidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Content } = Layout;

function Dashboard() {
  const [themeKey, setThemeKey] = useState(() => {
    const theme = localStorage.getItem("theme");
    return theme ? theme : "light";
  });
  const location = useLocation();
  const activeKey = location.pathname.split("/").pop();
  const navigate = useNavigate();
  const handleSelect = (key) => {
    navigate(`/dashboard/${key}`);
  };

  const t = THEMES[themeKey];
  const isLight = t.key === "light";

  const antdToken = {
    colorPrimary: t.accent,
    colorBgBase: t.surface,
    colorTextBase: t.text,
    borderRadius: 8,
    colorBorder: t.border,
    colorBgContainer: t.surface,
    colorBgElevated: t.surface2,
    colorFillAlter: t.surface2,
    colorSplit: t.border,
    colorText: t.text,
    colorTextSecondary: t.textDim,
    colorTextTertiary: t.textMuted,
    colorBorderSecondary: t.border,
  };

  return (
    <ThemeCtx.Provider value={{ t, themeKey }}>
      <ConfigProvider
        theme={{
          algorithm: isLight
            ? antTheme.defaultAlgorithm
            : antTheme.darkAlgorithm,
          token: antdToken,
        }}
      >
        <Layout
          style={{
            minHeight: "100vh",
            background: t.bg,
            transition: "background .3s, color .3s",
          }}
        >
          <AppSidebar activeKey={activeKey} onSelect={handleSelect} />

          <Layout
            style={{
              marginLeft: 240,
              background: t.bg,
              transition: "background .3s",
            }}
          >
            <AppHeader currentTheme={themeKey} onThemeChange={setThemeKey} />

            <Content style={{ padding: "20px 20px" }}>
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </ThemeCtx.Provider>
  );
}

export default Dashboard;
