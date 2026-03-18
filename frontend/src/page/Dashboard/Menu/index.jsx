import {
  Button,
  Typography,
  Tag,
  Popconfirm,
  Badge,
  Card,
  Tooltip,
  Skeleton,
  Input,
  Space,
} from "antd";
import { useTheme } from "../../../context/themeContext";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ActionMenu from "./ActionMenu";
import DishSelectorModal from "./DishselectorModal";
import axiosInstance from "../../../config/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const formatVND = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v,
  );

const getMenus = async () => {
  const res = await axiosInstance.get("/menus");
  return res.data;
};

const createMenu = async (data) => {
  const res = await axiosInstance.post("/menus/", data);
  return res.data;
};

const updateMenu = async ({ id, data }) => {
  const res = await axiosInstance.put(`/menus/${id}`, data);
  return res.data;
};

const deleteMenu = async (id) => {
  const res = await axiosInstance.delete(`/menus/${id}`);
  return res.data;
};

const toggleMenuActive = async (id) => {
  const res = await axiosInstance.patch(`/menus/${id}/is_active`);
  return res.data;
};

function Menu() {
  const themeCtx = (() => {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useTheme();
    } catch {
      return null;
    }
  })();
  const navigate = useNavigate();
  const t = themeCtx?.t ?? { surface: "#f8fafc", text: "#1e293b" };
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);

  const { data: menus = [], isLoading } = useQuery({
    queryKey: ["menus"],
    queryFn: getMenus,
  });

  const createMenuMutation = useMutation({
    mutationFn: createMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      toast.success("Tạo combo thành công!");
      setMenuModalOpen(false);
      setEditingMenu(null);
    },
    onError: (e) => toast.error(e.response?.data?.detail || "Lỗi server!"),
  });

  const updateMenuMutation = useMutation({
    mutationFn: updateMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      toast.success("Cập nhật thành công!");
      setMenuModalOpen(false);
      setEditingMenu(null);
    },
    onError: (e) => toast.error(e.response?.data?.detail || "Lỗi server!"),
  });

  const deleteMenuMutation = useMutation({
    mutationFn: deleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      toast.success("Đã xóa combo!");
    },
    onError: (e) => toast.error(e.response?.data?.detail || "Lỗi server!"),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: toggleMenuActive,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menus"] }),
    onError: (e) => toast.error(e.response?.data?.detail || "Lỗi server!"),
  });

  const filteredMenus = useMemo(
    () =>
      menus.filter((m) => m.name?.toLowerCase().includes(search.toLowerCase())),
    [menus, search],
  );

  const handleMenuSave = (values) => {
    if (editingMenu) {
      updateMenuMutation.mutate({ id: editingMenu.id, data: values });
    } else {
      createMenuMutation.mutate(values);
    }
  };

  const activeCount = menus.filter((m) => m.is_active).length;

  const MenuGridCard = ({ item }) => (
    <Card
      hoverable
      style={{ borderRadius: 12, overflow: "hidden" }}
      onClick={() => navigate(`/dashboard/menu/${item.id}`)}
      cover={
        item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            style={{ height: 160, objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              height: 160,
              background: "linear-gradient(135deg,#fef3c7,#fde68a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
            }}
          >
            🍽️
          </div>
        )
      }
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div
          style={{ fontWeight: 700, fontSize: 15, color: t.text ?? "#1e293b" }}
        >
          {item.name}
        </div>
        <Badge status={item.is_active ? "success" : "default"} />
      </div>

      <Space size={4} style={{ marginBottom: 8 }}>
        <Tag style={{ margin: 0 }}>{item.category}</Tag>
        <Tag color="blue" style={{ margin: 0 }}>
          {item.min_guests}+ khách
        </Tag>
      </Space>

      <div
        style={{
          color: "#22c55e",
          fontWeight: 600,
          fontSize: 14,
          marginBottom: 6,
        }}
      >
        {formatVND(item.price)}/khách
      </div>

      {item.dishes?.length > 0 && (
        <Text
          type="secondary"
          style={{ fontSize: 12, display: "block", marginBottom: 6 }}
        >
          {item.dishes.length} món · {item.dishes.map((d) => d.name).join(", ")}
        </Text>
      )}

      <Text
        type="secondary"
        style={{ fontSize: 12, display: "block", marginBottom: 12 }}
      >
        {item.description || "Không có mô tả"}
      </Text>

      <div style={{ display: "flex", gap: 8 }}>
        <Tooltip title={item.is_active ? "Tắt" : "Bật"}>
          <Button
            size="small"
            block
            onClick={() => toggleActiveMutation.mutate(item.id)}
            loading={toggleActiveMutation.isPending}
          >
            {item.is_active ? "Tắt" : "Bật"}
          </Button>
        </Tooltip>

        <Tooltip title="Sửa">
          <Button
            size="small"
            icon={<EditOutlined />}
            block
            onClick={() => {
              setEditingMenu(item);
              setMenuModalOpen(true);
            }}
          />
        </Tooltip>

        <Popconfirm
          title="Xóa combo này?"
          onConfirm={() => deleteMenuMutation.mutate(item.id)}
          okText="Xóa"
          cancelText="Huỷ"
        >
          <Tooltip title="Xóa">
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              block
              loading={deleteMenuMutation.isPending}
            />
          </Tooltip>
        </Popconfirm>
      </div>
    </Card>
  );

  return (
    <div
      style={{
        background: t.surface ?? "#f8fafc",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
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
            Quản Lý Combo
          </h2>
          <Text type="secondary">Quản lý toàn bộ combo của nhà hàng</Text>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingMenu(null);
            setMenuModalOpen(true);
          }}
          style={{ borderRadius: 8, fontWeight: 600 }}
        >
          Thêm combo
        </Button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          { title: "Tổng combo", value: menus.length, color: "#3b82f6" },
          { title: "Đang bán", value: activeCount, color: "#22c55e" },
          {
            title: "Tạm ngưng",
            value: menus.length - activeCount,
            color: "#f59e0b",
          },
        ].map((s) => (
          <Card
            size="small"
            key={s.title}
            style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
          >
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>
              {s.title}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>
              {s.value}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <Input
          placeholder="Tìm combo..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 280, borderRadius: 8, height: 45 }}
          allowClear
        />
      </div>

      {isLoading ? (
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} style={{ borderRadius: 12 }}>
              <Skeleton.Image
                active
                style={{ width: "20rem", height: 160, marginBottom: 12 }}
              />
              <Skeleton active paragraph={{ rows: 3 }} />
            </Card>
          ))}
        </div>
      ) : filteredMenus.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}
        >
          <AppstoreOutlined style={{ fontSize: 48, marginBottom: 12 }} />
          <div>Không có combo nào</div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {filteredMenus.map((item) => (
            <MenuGridCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <ActionMenu
        open={menuModalOpen}
        editingMenu={editingMenu}
        onSave={handleMenuSave}
        onCancel={() => {
          setMenuModalOpen(false);
          setEditingMenu(null);
        }}
        isLoading={createMenuMutation.isPending || updateMenuMutation.isPending}
      />
    </div>
  );
}

export default Menu;
