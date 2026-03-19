import {
  Badge,
  Button,
  Card,
  Empty,
  Image,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  EditOutlined,
  PlusOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useTheme } from "../../../context/themeContext";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/axiosInstance";
import { useState } from "react";
import DishSelectorModal from "./DishselectorModal";
import ActionMenu from "./ActionMenu";
import dayjs from "dayjs";

const { Text, Title } = Typography;

const CATEGORY_LABELS = {
  wedding: "Tiệc cưới",
  birthday: "Sinh nhật",
  corporate: "Hội nghị",
  anniversary: "Kỷ niệm",
  other: "Khác",
};

const DISH_TYPE_LABEL = {
  appetizer: "Khai vị",
  main_course: "Món chính",
  dessert: "Tráng miệng",
  drink: "Đồ uống",
};

const formatVND = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v,
  );

const getMenuDetail = async (id) => {
  const res = await axiosInstance.get(`/menus/${id}`);
  return res.data;
};

const getDishes = async () => {
  const res = await axiosInstance.get("/dishes");
  return res.data;
};

const updateMenu = async ({ id, data }) => {
  const res = await axiosInstance.put(`/menus/${id}`, data);
  return res.data;
};

const toggleMenuActive = async (id) => {
  const res = await axiosInstance.patch(`/menus/${id}/is_active`);
  return res.data;
};

const addDishesToMenu = async ({ menuId, dish_ids }) => {
  const res = await axiosInstance.post(`/menus/${menuId}/dishes`, { dish_ids });
  return res.data;
};

function MenuDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const themeCtx = (() => {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useTheme();
    } catch {
      return null;
    }
  })();
  const t = themeCtx?.t ?? {
    surface: "#f8fafc",
    text: "#1e293b",
    border: "#e2e8f0",
    textMuted: "#94a3b8",
  };

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [dishModalOpen, setDishModalOpen] = useState(false);

  const { data: menu, isLoading } = useQuery({
    queryKey: ["menu", id],
    queryFn: () => getMenuDetail(id),
    enabled: !!id,
  });

  const { data: allDishes = [] } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
  });

  const updateMenuMutation = useMutation({
    mutationFn: updateMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu", id] });
      toast.success("Cập nhật combo thành công!");
      setEditModalOpen(false);
    },
    onError: (e) => toast.error(e.response?.data?.detail || "Lỗi server!"),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: toggleMenuActive,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menu", id] }),
    onError: (e) => toast.error(e.response?.data?.detail || "Lỗi server!"),
  });

  const addDishesMutation = useMutation({
    mutationFn: addDishesToMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu", id] });
      toast.success("Cập nhật món ăn thành công!");
      setDishModalOpen(false);
    },
    onError: (e) => toast.error(e.response?.data?.detail || "Lỗi server!"),
  });

  if (isLoading) {
    return (
      <div style={{ padding: "2rem" }}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (!menu) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <Empty description="Không tìm thấy combo" />
        <Button onClick={() => navigate(-1)} style={{ marginTop: 16 }}>
          Quay lại
        </Button>
      </div>
    );
  }

  const groupedDishes = (menu.dishes ?? []).reduce((acc, dish) => {
    const type = dish.dish_type ?? "other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(dish);
    return acc;
  }, {});

  return (
    <div style={{ background: t.surface, minHeight: "100vh", padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ borderRadius: 8 }}
        />
        <div style={{ flex: 1 }}>
          <Title level={4} style={{ margin: 0, color: t.text }}>
            Chi tiết combo
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            #{menu.id} · Tạo lúc{" "}
            {dayjs(menu.created_at).format("DD/MM/YYYY HH:mm")}
          </Text>
        </div>
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => setEditModalOpen(true)}
            style={{ borderRadius: 8 }}
          >
            Chỉnh sửa
          </Button>
          <Button
            type={menu.is_active ? "default" : "primary"}
            onClick={() => toggleActiveMutation.mutate(menu.id)}
            loading={toggleActiveMutation.isPending}
            style={{ borderRadius: 8 }}
          >
            {menu.is_active ? "Tắt combo" : "Bật combo"}
          </Button>
        </Space>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "340px 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card
            style={{
              borderRadius: 12,
              overflow: "hidden",
              border: `1px solid ${t.border}`,
              background: t.surface,
            }}
          >
            {menu.image_url ? (
              <Image
                src={menu.image_url}
                alt={menu.name}
                style={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
                preview={{ mask: "Xem ảnh" }}
              />
            ) : (
              <div
                style={{
                  height: 220,
                  background: "linear-gradient(135deg,#fef3c7,#fde68a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 64,
                  borderRadius: 8,
                }}
              >
                🍽️
              </div>
            )}

            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Title level={4} style={{ margin: 0, color: t.text }}>
                  {menu.name}
                </Title>
                <Badge
                  status={menu.is_active ? "success" : "default"}
                  text={menu.is_active ? "Đang bán" : "Tạm ngưng"}
                />
              </div>

              <Space size={6} style={{ marginBottom: 12 }}>
                <Tag color="blue">
                  {CATEGORY_LABELS[menu.category] ?? menu.category}
                </Tag>
              </Space>

              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#22c55e",
                  marginBottom: 12,
                }}
              >
                {formatVND(menu.price)}/khách
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <TeamOutlined style={{ color: t.textMuted }} />
                  <Text style={{ color: t.text }}>
                    Tối thiểu <strong>{menu.min_guests}</strong> khách
                  </Text>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CalendarOutlined style={{ color: t.textMuted }} />
                  <Text style={{ color: t.text }}>
                    Cập nhật {dayjs(menu.updated_at).format("DD/MM/YYYY HH:mm")}
                  </Text>
                </div>
              </div>

              {menu.description && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "10px 12px",
                    background:
                      t.key === "light" ? "#f8fafc" : "rgba(255,255,255,0.05)",
                    borderRadius: 8,
                    fontSize: 13,
                    color: t.textMuted,
                    lineHeight: 1.6,
                  }}
                >
                  {menu.description}
                </div>
              )}
            </div>
          </Card>
        </div>

        <Card
          style={{
            borderRadius: 12,
            border: `1px solid ${t.border}`,
            background: t.surface,
          }}
          title={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: t.text, fontWeight: 600 }}>
                Món ăn trong combo
                <Tag color="blue" style={{ marginLeft: 8 }}>
                  {menu.dishes?.length ?? 0} món
                </Tag>
              </span>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="middle"
                onClick={() => setDishModalOpen(true)}
                style={{ borderRadius: 6 }}
              >
                Quản lý món
              </Button>
            </div>
          }
        >
          {menu.dishes?.length === 0 ? (
            <Empty
              description="Chưa có món ăn nào"
              style={{ padding: "40px 0" }}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setDishModalOpen(true)}
              >
                Thêm món ăn
              </Button>
            </Empty>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {Object.entries(groupedDishes).map(([type, dishes]) => (
                <div key={type}>
                  <Text
                    type="secondary"
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      display: "block",
                      marginBottom: 10,
                    }}
                  >
                    {DISH_TYPE_LABEL[type] ?? type}
                  </Text>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: 10,
                    }}
                  >
                    {dishes.map((dish) => (
                      <div
                        key={dish.id}
                        style={{
                          border: `1px solid ${t.border}`,
                          borderRadius: 10,
                          padding: "10px 12px",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          background:
                            t.key === "light"
                              ? "#fff"
                              : "rgba(255,255,255,0.03)",
                        }}
                      >
                        {dish.image_url ? (
                          <img
                            src={dish.image_url}
                            alt={dish.name}
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 8,
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 8,
                              background:
                                "linear-gradient(135deg,#fef3c7,#fde68a)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 20,
                              flexShrink: 0,
                            }}
                          >
                            🍴
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Text
                            style={{
                              fontWeight: 600,
                              fontSize: 13,
                              color: t.text,
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {dish.name}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#22c55e",
                              fontWeight: 500,
                            }}
                          >
                            {formatVND(dish.price)}
                          </Text>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <ActionMenu
        open={editModalOpen}
        editingMenu={menu}
        onSave={(values) =>
          updateMenuMutation.mutate({ id: menu.id, data: values })
        }
        onCancel={() => setEditModalOpen(false)}
        isLoading={updateMenuMutation.isPending}
      />

      <DishSelectorModal
        open={dishModalOpen}
        dishes={allDishes}
        value={menu.dishes?.map((d) => ({ id: d.id, quantity: 1 })) ?? []}
        onChange={(selected) =>
          addDishesMutation.mutate({
            menuId: menu.id,
            dish_ids: selected.map((d) => d.id),
          })
        }
        onCancel={() => setDishModalOpen(false)}
        isLoading={addDishesMutation.isPending}
        hideQuantity
      />
    </div>
  );
}

export default MenuDetailPage;
