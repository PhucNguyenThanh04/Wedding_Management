import { Tooltip } from "antd";
import { useTheme } from "../../../context/themeContext";
import { THEMES } from "./Theme";

function ThemeSwitcher({ currentTheme, onChange }) {
  const { t } = useTheme();

  const handleChangeTheme = (key) => {
    localStorage.setItem("theme", key);
    onChange(key);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {Object.values(THEMES).map((th) => (
        <Tooltip key={th.key} title={th.label}>
          <button
            onClick={() => handleChangeTheme(th.key)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              cursor: "pointer",
              border:
                currentTheme === th.key
                  ? `2px solid ${t.accent}`
                  : `1px solid ${t.border}`,
              background: th.surface,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              transition: "all .15s",
              boxShadow:
                currentTheme === th.key ? `0 0 0 2px ${t.accent}44` : "none",
            }}
          >
            {th.key === "dark" && "🌙"}
            {th.key === "light" && "☀️"}
            {th.key === "violet" && "💜"}
            {th.key === "emerald" && "💚"}
          </button>
        </Tooltip>
      ))}
    </div>
  );
}

export default ThemeSwitcher;
