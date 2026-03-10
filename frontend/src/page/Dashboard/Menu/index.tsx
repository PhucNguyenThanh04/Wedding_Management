import {
  Button,
  Space,
  Typography,
  Tag,
  Form,
  Input,
  Select,
  Table,
  Popconfirm,
  Badge,
  Card,
  Divider,
  Tooltip,
} from "antd";
import { useTheme } from "../../../context/themeContext";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  FireOutlined,
  GiftOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useState, useMemo } from "react";
import { MenuItem } from "../../../types/menu.type";
import ActionMenu from "./ActionMenu";
import ActionModalPackage from "./ActionModalPackage";

const { Text } = Typography;
const { Option } = Select;

interface Package {
  id: string;
  name: string;
  price: number;
  minGuests: number;
  maxGuests: number;
  description: string;
  menuItems: string[];
  status: "active" | "inactive";
  highlight?: string;
}

const MENU_CATEGORIES = [
  "Khai vị",
  "Món chính",
  "Tráng miệng",
  "Đồ uống",
  "Buffet",
];

const initialMenuItems: MenuItem[] = [
  {
    id: "m1",
    name: "Gỏi cuốn tôm thịt",
    category: "Khai vị",
    price: 85000,
    unit: "đĩa",
    description: "Gỏi cuốn tươi ngon với tôm và thịt heo.",
    status: "active",
    popular: true,
  },
  {
    id: "m2",
    name: "Súp bào ngư vi cá",
    category: "Khai vị",
    price: 220000,
    unit: "tô",
    description: "Súp cao cấp thích hợp tiệc sang trọng.",
    status: "active",
  },
  {
    id: "m3",
    name: "Cơm chiên dương châu",
    category: "Món chính",
    price: 95000,
    unit: "phần",
    description: "Cơm chiên truyền thống kiểu Dương Châu.",
    status: "active",
    popular: true,
  },
  {
    id: "m4",
    name: "Gà hấp muối Huế",
    category: "Món chính",
    price: 180000,
    unit: "con",
    description: "Gà hấp muối đặc trưng Huế.",
    status: "active",
  },
  {
    id: "m5",
    name: "Lẩu hải sản",
    category: "Món chính",
    price: 350000,
    unit: "nồi",
    description: "Lẩu hải sản thập cẩm.",
    status: "active",
  },
  {
    id: "m6",
    name: "Bánh flan caramel",
    category: "Tráng miệng",
    price: 45000,
    unit: "phần",
    description: "Bánh flan mềm mịn, caramel đậm vị.",
    status: "active",
  },
  {
    id: "m7",
    name: "Nước cam ép",
    category: "Đồ uống",
    price: 35000,
    unit: "ly",
    description: "Cam tươi ép nguyên chất.",
    status: "active",
  },
  {
    id: "m8",
    name: "Trà hoa cúc mật ong",
    category: "Đồ uống",
    price: 30000,
    unit: "ấm",
    description: "Trà hoa cúc dịu ngọt.",
    status: "inactive",
  },
];

const initialPackages: Package[] = [
  {
    id: "p1",
    name: "Gói Bạc",
    price: 350000,
    minGuests: 50,
    maxGuests: 150,
    description: "Gói cơ bản phù hợp tiệc sinh nhật, họp mặt gia đình nhỏ.",
    menuItems: ["m1", "m3", "m6", "m7"],
    status: "active",
  },
  {
    id: "p2",
    name: "Gói Vàng",
    price: 550000,
    minGuests: 100,
    maxGuests: 300,
    description: "Gói trung cấp lý tưởng cho tiệc cưới, hội nghị công ty.",
    menuItems: ["m1", "m2", "m3", "m4", "m6", "m7"],
    status: "active",
    highlight: "Phổ biến",
  },
  {
    id: "p3",
    name: "Gói Bạch Kim",
    price: 850000,
    minGuests: 150,
    maxGuests: 500,
    description: "Gói cao cấp với đầy đủ món sang trọng, phù hợp sự kiện VIP.",
    menuItems: ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8"],
    status: "active",
    highlight: "VIP",
  },
];

const formatVND = (v: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v,
  );

const statusColor: Record<string, string> = {
  active: "success",
  inactive: "default",
};
const statusLabel: Record<string, string> = {
  active: "Đang bán",
  inactive: "Tạm ngưng",
};

function Menu() {
  const themeCtx = (() => {
    try {
      return useTheme();
    } catch {
      return null;
    }
  })();
  const t = themeCtx?.t ?? {
    surface: "#f8fafc",
    text: "#1e293b",
    primary: "#3b82f6",
  };

  const [tab, setTab] = useState<"menu" | "package">("menu");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [menuForm] = Form.useForm();

  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [pkgModalOpen, setPkgModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<Package | null>(null);
  const [pkgForm] = Form.useForm();

  const filteredMenuItems = useMemo(
    () =>
      menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) &&
          (!categoryFilter || item.category === categoryFilter),
      ),
    [menuItems, search, categoryFilter],
  );

  const filteredPackages = useMemo(
    () =>
      packages.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [packages, search],
  );

  const openMenuModal = (item?: MenuItem) => {
    setEditingMenu(item ?? null);
    menuForm.setFieldsValue(item ? { ...item } : { status: "active" });
    setMenuModalOpen(true);
  };

  const handleMenuSave = () => {
    menuForm.validateFields().then((values) => {
      if (editingMenu) {
        setMenuItems((prev) =>
          prev.map((m) => (m.id === editingMenu.id ? { ...m, ...values } : m)),
        );
      } else {
        setMenuItems((prev) => [...prev, { ...values, id: `m${Date.now()}` }]);
      }
      setMenuModalOpen(false);
      menuForm.resetFields();
    });
  };

  const handleMenuCancel = () => {
    setMenuModalOpen(false);
    menuForm.resetFields();
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
  };

  const openPkgModal = (pkg?: Package) => {
    setEditingPkg(pkg ?? null);
    pkgForm.setFieldsValue(
      pkg ? { ...pkg } : { status: "active", minGuests: 50, maxGuests: 200 },
    );
    setPkgModalOpen(true);
  };

  const handlePkgSave = () => {
    pkgForm.validateFields().then((values) => {
      if (editingPkg) {
        setPackages((prev) =>
          prev.map((p) => (p.id === editingPkg.id ? { ...p, ...values } : p)),
        );
      } else {
        setPackages((prev) => [...prev, { ...values, id: `p${Date.now()}` }]);
      }
      setPkgModalOpen(false);
      pkgForm.resetFields();
    });
  };

  const handlePkgCancel = () => {
    setPkgModalOpen(false);
    pkgForm.resetFields();
  };

  const deletePkg = (id: string) =>
    setPackages((prev) => prev.filter((p) => p.id !== id));

  const activeMenuCount = menuItems.filter((m) => m.status === "active").length;
  const activePkgCount = packages.filter((p) => p.status === "active").length;
  const avgPkgPrice = packages.length
    ? Math.round(packages.reduce((s, p) => s + p.price, 0) / packages.length)
    : 0;

  const menuColumns = [
    {
      title: "Tên món",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: MenuItem) => (
        <Space>
          <span style={{ fontWeight: 600 }}>{name}</span>
          {record.popular && (
            <Tag color="orange" icon={<FireOutlined />}>
              Hot
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (v: string) => <Tag>{v}</Tag>,
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (v: number, r: MenuItem) => (
        <span style={{ color: "#22c55e", fontWeight: 600 }}>
          {formatVND(v)}/{r.unit}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (v: string) => (
        <Badge status={statusColor[v] as any} text={statusLabel[v]} />
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 220,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 110,
      render: (_: any, record: MenuItem) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => openMenuModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa món ăn này?"
            onConfirm={() => deleteMenuItem(record.id)}
            okText="Xóa"
            cancelText="Huỷ"
          >
            <Tooltip title="Xóa">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const pkgColumns = [
    {
      title: "Tên gói",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Package) => (
        <Space>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{name}</span>
          {record.highlight && (
            <Tag color={record.highlight === "VIP" ? "gold" : "blue"}>
              {record.highlight}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Giá / khách",
      dataIndex: "price",
      key: "price",
      render: (v: number) => (
        <span style={{ color: "#f59e0b", fontWeight: 700, fontSize: 15 }}>
          {formatVND(v)}
        </span>
      ),
    },
    {
      title: "Số khách",
      key: "guests",
      render: (_: any, r: Package) => `${r.minGuests} – ${r.maxGuests} khách`,
    },
    {
      title: "Món bao gồm",
      key: "menuItems",
      render: (_: any, r: Package) => (
        <Space size={4} wrap>
          {r.menuItems.slice(0, 4).map((id) => {
            const m = menuItems.find((x) => x.id === id);
            return m ? <Tag key={id}>{m.name}</Tag> : null;
          })}
          {r.menuItems.length > 4 && <Tag>+{r.menuItems.length - 4}</Tag>}
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (v: string) => (
        <Badge status={statusColor[v] as any} text={statusLabel[v]} />
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 110,
      render: (_: any, record: Package) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => openPkgModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa gói tiệc này?"
            onConfirm={() => deletePkg(record.id)}
            okText="Xóa"
            cancelText="Huỷ"
          >
            <Tooltip title="Xóa">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const MenuGridCard = ({ item }: { item: MenuItem }) => (
    <Card
      hoverable
      size="small"
      style={{ borderRadius: 12, overflow: "hidden", position: "relative" }}
      bodyStyle={{ padding: "12px 14px" }}
      cover={
        <div
          style={{
            height: 110,
            background: "linear-gradient(135deg,#fef3c7,#fde68a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
          }}
        >
          🍽️
        </div>
      }
      actions={[
        <EditOutlined key="edit" onClick={() => openMenuModal(item)} />,
        <Popconfirm
          key="del"
          title="Xóa món này?"
          onConfirm={() => deleteMenuItem(item.id)}
          okText="Xóa"
          cancelText="Huỷ"
        >
          <DeleteOutlined style={{ color: "#ef4444" }} />
        </Popconfirm>,
      ]}
    >
      {item.popular && (
        <Tag
          color="orange"
          icon={<FireOutlined />}
          style={{ position: "absolute", top: 8, right: 8 }}
        >
          Hot
        </Tag>
      )}
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
        {item.name}
      </div>
      <Space size={4} style={{ marginBottom: 6 }}>
        <Tag style={{ margin: 0 }}>{item.category}</Tag>
        <Badge status={statusColor[item.status] as any} />
      </Space>
      <div style={{ color: "#22c55e", fontWeight: 700 }}>
        {formatVND(item.price)}/{item.unit}
      </div>
      <Text type="secondary" style={{ fontSize: 12 }}>
        {item.description}
      </Text>
    </Card>
  );

  const PackageCard = ({ pkg }: { pkg: Package }) => {
    const gradients: Record<string, string> = {
      "Gói Bạc": "linear-gradient(135deg,#e2e8f0,#94a3b8)",
      "Gói Vàng": "linear-gradient(135deg,#fef9c3,#fbbf24)",
      "Gói Bạch Kim": "linear-gradient(135deg,#e0e7ff,#818cf8)",
    };
    const grad =
      gradients[pkg.name] ?? "linear-gradient(135deg,#f0fdf4,#86efac)";
    return (
      <Card
        hoverable
        style={{
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid #e2e8f0",
        }}
        bodyStyle={{ padding: 20 }}
        cover={<div style={{ height: 8, background: grad }} />}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 8,
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: 17 }}>{pkg.name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {pkg.minGuests}–{pkg.maxGuests} khách
            </Text>
          </div>
          {pkg.highlight && (
            <Tag color={pkg.highlight === "VIP" ? "gold" : "blue"}>
              {pkg.highlight}
            </Tag>
          )}
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#f59e0b",
            marginBottom: 8,
          }}
        >
          {formatVND(pkg.price)}
          <span style={{ fontSize: 13, fontWeight: 400, color: "#94a3b8" }}>
            /khách
          </span>
        </div>
        <Text
          type="secondary"
          style={{ fontSize: 12, display: "block", marginBottom: 12 }}
        >
          {pkg.description}
        </Text>
        <Divider style={{ margin: "8px 0" }} />
        <div style={{ marginBottom: 10 }}>
          <Text strong style={{ fontSize: 12 }}>
            Món bao gồm:
          </Text>
          <Space size={4} wrap style={{ marginTop: 4 }}>
            {pkg.menuItems.map((id) => {
              const m = menuItems.find((x) => x.id === id);
              return m ? (
                <Tag key={id} style={{ fontSize: 11 }}>
                  {m.name}
                </Tag>
              ) : null;
            })}
          </Space>
        </div>
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openPkgModal(pkg)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa gói này?"
            onConfirm={() => deletePkg(pkg.id)}
            okText="Xóa"
            cancelText="Huỷ"
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      </Card>
    );
  };

  return (
    <div
      style={{
        background: t.surface ?? "#f8fafc",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
              Quản Lý Thực Đơn & Gói Tiệc
            </h2>
            <Text type="secondary">
              Quản lý toàn bộ thực đơn và gói tiệc của nhà hàng
            </Text>
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => (tab === "menu" ? openMenuModal() : openPkgModal())}
          style={{ borderRadius: 8, fontWeight: 600 }}
        >
          {tab === "menu" ? "Thêm món ăn" : "Thêm gói tiệc"}
        </Button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          {
            title: "Tổng món ăn",
            value: menuItems.length,
            icon: <AppstoreOutlined />,
            color: "#3b82f6",
          },
          {
            title: "Đang bán",
            value: activeMenuCount,
            icon: <FireOutlined />,
            color: "#22c55e",
          },
          {
            title: "Gói tiệc",
            value: activePkgCount,
            icon: <GiftOutlined />,
            color: "#f59e0b",
          },
          {
            title: "Giá TB / gói",
            value: formatVND(avgPkgPrice),
            icon: <DollarOutlined />,
            color: "#8b5cf6",
            isString: true,
          },
        ].map((s) => (
          <Card
            key={s.title}
            style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
            bodyStyle={{ padding: "16px 20px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: s.color + "20",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: s.color,
                  fontSize: 18,
                }}
              >
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{s.title}</div>
                <div
                  style={{
                    fontSize: (s as any).isString ? 15 : 22,
                    fontWeight: 700,
                    color: s.color,
                    lineHeight: 1.2,
                  }}
                >
                  {s.value}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Space>
          {(["menu", "package"] as const).map((key) => (
            <Button
              key={key}
              type={tab === key ? "primary" : "default"}
              icon={key === "menu" ? <AppstoreOutlined /> : <GiftOutlined />}
              onClick={() => {
                setTab(key);
                setSearch("");
                setCategoryFilter(null);
              }}
              style={{ borderRadius: 8, fontWeight: 600 }}
            >
              {key === "menu"
                ? `Thực đơn (${menuItems.length})`
                : `Gói tiệc (${packages.length})`}
            </Button>
          ))}
        </Space>
      </div>

      {/* Filters */}
      <Space className="pb-4">
        <Input
          placeholder={tab === "menu" ? "Tìm món ăn..." : "Tìm gói tiệc..."}
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 200, borderRadius: 8 }}
          allowClear
        />
        {tab === "menu" && (
          <Select
            placeholder="Danh mục"
            allowClear
            value={categoryFilter}
            onChange={(v) => setCategoryFilter(v ?? null)}
            style={{ width: 140 }}
          >
            {MENU_CATEGORIES.map((c) => (
              <Option key={c} value={c}>
                {c}
              </Option>
            ))}
          </Select>
        )}
        <Button.Group>
          <Button
            icon={<UnorderedListOutlined />}
            type={viewMode === "table" ? "primary" : "default"}
            onClick={() => setViewMode("table")}
          />
          <Button
            icon={<AppstoreOutlined />}
            type={viewMode === "grid" ? "primary" : "default"}
            onClick={() => setViewMode("grid")}
          />
        </Button.Group>
      </Space>

      {/* Content */}
      {tab === "menu" &&
        (viewMode === "table" ? (
          <Table
            dataSource={filteredMenuItems}
            columns={menuColumns}
            rowKey="id"
            pagination={{ pageSize: 8, showSizeChanger: false }}
            style={{ background: "#fff", borderRadius: 12 }}
            locale={{ emptyText: "Không có món ăn nào" }}
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))",
              gap: 16,
            }}
          >
            {filteredMenuItems.map((item) => (
              <MenuGridCard key={item.id} item={item} />
            ))}
          </div>
        ))}

      {tab === "package" &&
        (viewMode === "table" ? (
          <Table
            dataSource={filteredPackages}
            columns={pkgColumns}
            rowKey="id"
            pagination={{ pageSize: 6, showSizeChanger: false }}
            style={{ background: "#fff", borderRadius: 12 }}
            locale={{ emptyText: "Không có gói tiệc nào" }}
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
              gap: 20,
            }}
          >
            {filteredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ))}

      <ActionMenu
        open={menuModalOpen}
        editingMenu={editingMenu}
        form={menuForm}
        onOk={handleMenuSave}
        onCancel={handleMenuCancel}
      />

      <ActionModalPackage
        open={pkgModalOpen}
        editingPkg={editingPkg}
        form={pkgForm}
        menuItems={menuItems}
        onOk={handlePkgSave}
        onCancel={handlePkgCancel}
      />
    </div>
  );
}

export default Menu;
