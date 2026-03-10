import { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Input,
  Select,
  Card,
  Statistic,
  Tooltip,
  Space,
  Row,
  Col,
  Typography,
  Badge,
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
  EyeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useTheme } from "../../../context/themeContext";
import ActionHallModal from "./ActionHallModal";
import { HALL_MOCKS } from "../PartySchedule/SelectHallModal";

const { Text } = Typography;

const bookedSlots = [
  { hallId: 1, shiftId: 3, date: "2026-02-24" },
  { hallId: 2, shiftId: 1, date: "2026-02-24" },
  { hallId: 3, shiftId: 3, date: "2026-02-28" },
  { hallId: 1, shiftId: 3, date: "2026-03-03" },
];

const HALL_STATUS = {
  active: {
    label: "Hoạt động",
    color: "success",
    antColor: "green",
    icon: <CheckCircleOutlined />,
  },
  inactive: {
    label: "Ngừng hoạt động",
    color: "error",
    antColor: "red",
    icon: <CloseCircleOutlined />,
  },
};

export default function HallAndShift() {
  const [halls, setHalls] = useState(HALL_MOCKS);
  const [hallModalOpen, setHallModalOpen] = useState({
    open: false,
    action: "create",
  });
  const [editingHall, setEditingHall] = useState(null);
  const [hallSearch, setHallSearch] = useState("");
  const [hallStatusFilter, setHallStatusFilter] = useState(null);

  const { t } = useTheme();

  const filteredHalls = halls.filter((h) => {
    if (hallStatusFilter && h.status !== hallStatusFilter) return false;
    if (hallSearch && !h.name.toLowerCase().includes(hallSearch.toLowerCase()))
      return false;
    return true;
  });

  const todayStr = dayjs().format("YYYY-MM-DD");
  const isHallBusyToday = (hallId) =>
    bookedSlots.some((b) => b.hallId === hallId && b.date === todayStr);

  const hallColumns = [
    {
      title: "Sảnh tiệc",
      key: "hall",
      render: (_, rec) => (
        <Space>
          <div>
            <Text strong style={{ display: "block" }}>
              {rec.name}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Sức chứa",
      key: "capacity",
      render: (_, rec) => (
        <Space orientation="vertical" size={0}>
          <Text>
            <TeamOutlined style={{ color: "#1677ff" }} /> {rec.capacity} khách
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {rec.tables} bàn
          </Text>
        </Space>
      ),
      sorter: (a, b) => a.capacity - b.capacity,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const cfg = HALL_STATUS[status];
        return (
          <Badge
            status={cfg.color}
            text={
              <Tag color={cfg.antColor} icon={cfg.icon}>
                {cfg.label}
              </Tag>
            }
          />
        );
      },
    },
    {
      title: "Hôm nay",
      key: "today",
      render: (_, rec) => {
        const busy = isHallBusyToday(rec.id);
        return busy ? (
          <Tag color="red" icon={<CloseCircleOutlined />}>
            Đang có tiệc
          </Tag>
        ) : (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            Còn trống
          </Tag>
        );
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (note) =>
        note ? (
          <Tooltip title={note}>
            <Text
              type="secondary"
              ellipsis
              style={{ maxWidth: 160, display: "block" }}
            >
              {note}
            </Text>
          </Tooltip>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, rec) => (
        <Space>
          <Tooltip title="Chi tiết">
            <Button
              size="middle"
              icon={<EyeOutlined />}
              // onClick={() => {
              //   setDetailHall(rec);
              //   setHallDetailOpen(true);
              // }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              size="middle"
              type="primary"
              ghost
              icon={<EditOutlined />}
              onClick={() => {
                setHallModalOpen({ open: true, action: "edit" });
                setEditingHall(rec);
              }}
            />
          </Tooltip>

          <Tooltip title="Xóa">
            <Button size="middle" danger icon={<DeleteOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const statsHalls = {
    total: halls.length,
    active: halls.filter((h) => h.status === "active").length,
    inactive: halls.filter((h) => h.status === "inactive").length,
    busyToday: halls.filter((h) => isHallBusyToday(h.id)).length,
  };

  return (
    <div style={{ background: t.surface, minHeight: "100vh", padding: "2rem" }}>
      <div className="flex items-start justify-between">
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 600,
                color: t.text,
                lineHeight: 1,
              }}
            >
              Quản lý Sảnh
            </h2>
            <Text type="secondary">Quản lý toàn bộ sảnh của nhà hàng</Text>
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setHallModalOpen({ open: true, action: "create" })}
          style={{ background: "#1677ff", height: 40 }}
        >
          Thêm sảnh mới
        </Button>
      </div>

      <HallTab
        halls={halls}
        filteredHalls={filteredHalls}
        hallSearch={hallSearch}
        setHallSearch={setHallSearch}
        hallStatusFilter={hallStatusFilter}
        setHallStatusFilter={setHallStatusFilter}
        statsHalls={statsHalls}
        hallColumns={hallColumns}
      />

      <ActionHallModal
        open={hallModalOpen.open}
        onClose={() =>
          setHallModalOpen({
            open: false,
            action: "create",
          })
        }
        action={hallModalOpen.action}
        dataUpdate={editingHall}
      />
    </div>
  );
}

function HallTab({
  filteredHalls,
  hallSearch,
  setHallSearch,
  hallStatusFilter,
  setHallStatusFilter,
  statsHalls,
  hallColumns,
}) {
  const { t } = useTheme();
  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {[
          {
            title: "Tổng sảnh",
            value: statsHalls.total,
            icon: <HomeOutlined />,
            color: "#1677ff",
          },
          {
            title: "Đang hoạt động",
            value: statsHalls.active,
            icon: <CheckCircleOutlined />,
            color: "#52c41a",
          },
          {
            title: "Ngừng hoạt động",
            value: statsHalls.inactive,
            icon: <CloseCircleOutlined />,
            color: "#ff4d4f",
          },
          {
            title: "Có tiệc hôm nay",
            value: statsHalls.busyToday,
            icon: <CalendarOutlined />,
            color: "#fa8c16",
          },
        ].map((s, i) => (
          <Col xs={12} sm={6} key={i}>
            <Card
              style={{
                borderRadius: 12,
                boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Statistic
                  title={
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {s.title}
                    </Text>
                  }
                  value={s.value}
                />
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    background: t.surface,
                    border: `1px solid ${s.color}`,
                    color: s.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  {s.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        style={{
          borderRadius: 12,
          marginBottom: 14,
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={8}>
            <Input
              prefix={<SearchOutlined />}
              style={{ border: "1px solid #ccc", height: 40 }}
              placeholder="Tìm kiếm tên sảnh..."
              value={hallSearch}
              onChange={(e) => setHallSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={8}>
            <Select
              placeholder="Lọc trạng thái"
              allowClear
              width={"100%"}
              style={{ border: "1px solid #ccc", height: 40, width: "200px" }}
              value={hallStatusFilter}
              onChange={setHallStatusFilter}
              options={Object.entries(HALL_STATUS).map(([k, v]) => ({
                value: k,
                label: (
                  <Tag>
                    {v.icon} {v.label}
                  </Tag>
                ),
              }))}
            />
          </Col>
        </Row>
      </Card>

      <Card
        style={{ borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
      >
        <Table
          dataSource={filteredHalls}
          columns={hallColumns}
          rowKey="id"
          pagination={{ pageSize: 5, showTotal: (t) => `Tổng ${t} sảnh` }}
          locale={{
            emptyText: (
              <Empty
                description="Không có sảnh nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          style={{ borderRadius: 12, overflow: "hidden" }}
        />
      </Card>
    </>
  );
}
