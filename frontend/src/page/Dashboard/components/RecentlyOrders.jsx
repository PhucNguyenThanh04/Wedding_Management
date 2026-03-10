import { Card, Table, Tag } from "antd";
import { useTheme } from "../../../context/themeContext";

const ORDERS = [
  {
    key: 1,
    id: "#DH-10294",
    customer: "Nguyễn Văn A",
    value: "₫2,400,000",
    statusKey: "active",
  },
  {
    key: 2,
    id: "#DH-10293",
    customer: "Trần Thị B",
    value: "₫870,000",
    statusKey: "pending",
  },
  {
    key: 3,
    id: "#DH-10292",
    customer: "Lê Minh C",
    value: "₫5,120,000",
    statusKey: "active",
  },
  {
    key: 4,
    id: "#DH-10291",
    customer: "Phạm Thị D",
    value: "₫390,000",
    statusKey: "inactive",
  },
  {
    key: 5,
    id: "#DH-10290",
    customer: "Hoàng Văn E",
    value: "₫1,650,000",
    statusKey: "pending",
  },
];

const ORDER_COLUMNS = [
  {
    title: "Mã đơn",
    dataIndex: "id",
    key: "id",
    render: (v) => <span style={{ fontSize: 14 }}>{v}</span>,
  },
  {
    title: "Khách hàng",
    dataIndex: "customer",
    key: "customer",
    render: (v) => <span style={{ fontSize: 14 }}>{v}</span>,
  },
  {
    title: "Giá trị",
    dataIndex: "value",
    key: "value",
    render: (v) => <span style={{ fontSize: 14 }}>{v}</span>,
  },
  {
    title: "Trạng thái",
    dataIndex: "statusKey",
    key: "status",
    render: (s) => {
      const map = {
        active: ["success", "Hoàn thành"],
        pending: ["warning", "Đang xử lý"],
        inactive: ["default", "Đã hủy"],
      };
      const [color, text] = map[s];
      return (
        <Tag color={color} style={{ borderRadius: 20, fontSize: 14 }}>
          {text}
        </Tag>
      );
    },
  },
];

function RecentlyOrder() {
  const { t } = useTheme();
  return (
    <Card
      bordered={false}
      style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        transition: "background .3s",
      }}
      bodyStyle={{ padding: 20 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>
            Đơn hàng gần đây
          </div>
          <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>
            Cập nhật vừa xong
          </div>
        </div>
        <a
          href="#"
          style={{
            fontSize: 16,
            color: t.accent,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Xem tất cả →
        </a>
      </div>
      <Table
        dataSource={ORDERS}
        columns={ORDER_COLUMNS}
        pagination={false}
        size="small"
        style={{ background: "transparent" }}
      />
    </Card>
  );
}

export default RecentlyOrder;
