import { Card, Table, Tag } from "antd";
import { useTheme } from "../../../context/themeContext";
import { useQuery } from "@tanstack/react-query";
import { getStaffPerformance } from "../../../apis/revenue.api";

function formatVND(num) {
  const n = Number(num);
  return (isNaN(n) ? 0 : n).toLocaleString("vi-VN") + "đ";
}

function StaffPerformance() {
  const { t } = useTheme();

  const { data: apiData, isLoading } = useQuery({
    queryKey: ["staff-performance"],
    queryFn: getStaffPerformance,
  });

  const items = apiData?.data?.items ?? [];

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_, __, i) => (
        <span style={{ color: t.textMuted, fontSize: 13 }}>{i + 1}</span>
      ),
    },
    {
      title: "Nhân viên",
      dataIndex: "staff_name",
      key: "staff_name",
      render: (name) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#4f8ef7,#22d3a5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              flexShrink: 0,
            }}
          >
            {(name ?? "?")[0].toUpperCase()}
          </div>
          <span style={{ fontWeight: 500, color: t.text, fontSize: 14 }}>
            {name}
          </span>
        </div>
      ),
    },
    {
      title: "Số đơn xử lý",
      dataIndex: "total_orders_created",
      key: "total_orders_created",
      align: "center",
      sorter: (a, b) => a.total_orders_created - b.total_orders_created,
      render: (val) => (
        <Tag
          style={{
            background: "rgba(79,142,247,0.1)",
            color: "#4f8ef7",
            border: "none",
            fontWeight: 600,
            fontSize: 13,
            padding: "2px 10px",
            borderRadius: 6,
          }}
        >
          {val} đơn
        </Tag>
      ),
    },
    {
      title: "Doanh thu mang lại",
      dataIndex: "total_revenue",
      key: "total_revenue",
      align: "right",
      sorter: (a, b) => Number(a.total_revenue) - Number(b.total_revenue),
      render: (val) => (
        <span style={{ color: "#22d3a5", fontWeight: 600, fontSize: 14 }}>
          {formatVND(val)}
        </span>
      ),
    },
  ];

  return (
    <Card
      style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        transition: "background .3s",
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>
          Hiệu suất nhân viên
        </div>
        <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>
          Số đơn xử lý và doanh thu từng nhân viên
        </div>
      </div>

      <Table
        rowKey="staff_id"
        columns={columns}
        dataSource={items}
        loading={isLoading}
        pagination={{ pageSize: 5, size: "small" }}
        size="middle"
        style={{ color: t.text }}
      />
    </Card>
  );
}

export default StaffPerformance;
