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
  Modal,
  Form,
  InputNumber,
  Switch,
  Select,
} from "antd";
import { useTheme } from "../../../context/themeContext";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../config/axiosInstance";
import { toast } from "react-toastify";
import DetailDishModal from "./DetailDishModal";

const { Text } = Typography;

const getDishes = async () => {
  const res = await axiosInstance.get("/dishes");
  return res.data;
};

const createDish = async (data) => {
  const res = await axiosInstance.post("/dishes", data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

const updateDish = async ({ id, data }) => {
  const res = await axiosInstance.put(`/dishes/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

const deleteDish = async (id) => {
  const res = await axiosInstance.delete(`/dishes/${id}`);
  return res.data;
};

const toggleDishAvailability = async (id) => {
  const res = await axiosInstance.patch(`/dishes/${id}/availability`);
  return res.data;
};

const formatVND = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v,
  );

function DishFormModal({ open, editingDish, onSave, onCancel, isLoading }) {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        name: values.name,
        description: values.description,
        dish_type: values.dish_type,
        price: Number(values.price),
        is_available: values.is_available,
        image_url: values.image_url,
      };
      onSave(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const afterOpenChange = (vis) => {
    if (vis && editingDish) {
      form.setFieldsValue({
        name: editingDish.name,
        description: editingDish.description,
        price: editingDish.price,
        dish_type: editingDish.dish_type,
        is_available: editingDish.is_available ?? true,
        image_url: editingDish.image_url,
      });
    } else if (vis) {
      form.resetFields();
    }
  };

  return (
    <Modal
      open={open}
      title={
        <span style={{ fontWeight: 700, fontSize: 17 }}>
          {editingDish ? "✏️ Cập nhật món ăn" : "➕ Thêm món ăn mới"}
        </span>
      }
      onOk={handleOk}
      onCancel={onCancel}
      afterOpenChange={afterOpenChange}
      okText={editingDish ? "Cập nhật" : "Tạo mới"}
      cancelText="Huỷ"
      confirmLoading={isLoading}
      width={520}
      styles={{ body: { paddingTop: 16 } }}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        style={{ height: 500, overflow: "auto", scrollbarWidth: "none" }}
      >
        <Form.Item
          name="name"
          label="Tên món ăn"
          rules={[{ required: true, message: "Nhập tên món!" }]}
        >
          <Input
            placeholder="VD: Gà nướng mật ong"
            style={{ borderRadius: 8, height: 40 }}
          />
        </Form.Item>

        <Form.Item
          name="dish_type"
          label="Loại món"
          rules={[{ required: true, message: "Chọn loại món!" }]}
        >
          <Select
            placeholder="Chọn loại món"
            options={[
              { value: "appetizer", label: "Khai vị" },
              { value: "main_course", label: "Món chính" },
              { value: "dessert", label: "Tráng miệng" },
              { value: "drink", label: "Đồ uống" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="price"
          label="Giá (VND)"
          rules={[{ required: true, message: "Nhập giá!" }]}
        >
          <InputNumber
            min={0}
            step={1000}
            style={{ width: "100%", borderRadius: 8, height: 40 }}
            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(v) => v?.replace(/,/g, "")}
            placeholder="VD: 150000"
          />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea
            rows={3}
            placeholder="Mô tả ngắn về món ăn..."
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Form.Item
          name="is_available"
          label="Trạng thái"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch checkedChildren="Đang bán" unCheckedChildren="Tạm ngưng" />
        </Form.Item>

        <Form.Item
          name="image_url"
          label="Link hình ảnh"
          rules={[{ required: true, message: "Nhập link ảnh!" }]}
        >
          <Input placeholder="https://example.com/dish.jpg" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

function Dish() {
  const [detailDish, setDetailDish] = useState(null);
  const themeCtx = (() => {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useTheme();
    } catch {
      return null;
    }
  })();
  const t = themeCtx?.t ?? { surface: "#f8fafc", text: "#1e293b" };
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [dishModalOpen, setDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);

  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
  });

  const createDishMutation = useMutation({
    mutationFn: createDish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      toast.success("Tạo món ăn thành công!");
      setDishModalOpen(false);
      setEditingDish(null);
    },
    onError: (e) => toast.error(e.response?.data?.detail || "Lỗi server!"),
  });

  const updateDishMutation = useMutation({
    mutationFn: updateDish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      toast.success("Cập nhật thành công!");
      setDishModalOpen(false);
      setEditingDish(null);
    },
    onError: (e) => toast.error(e.response?.data?.detail || "Lỗi server!"),
  });

  const deleteDishMutation = useMutation({
    mutationFn: deleteDish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      toast.success("Đã xóa món ăn!");
    },
    onError: (e) => toast.error(e.response?.data?.detail || "Lỗi server!"),
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: toggleDishAvailability,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dishes"] }),
    onError: (e) => toast.error(e.response?.data?.detail || "Lỗi server!"),
  });

  const filteredDishes = useMemo(
    () =>
      dishes.filter((d) =>
        d.name?.toLowerCase().includes(search.toLowerCase()),
      ),
    [dishes, search],
  );

  const availableCount = dishes.filter((d) => d.is_available).length;

  const handleDishSave = (formData) => {
    if (editingDish) {
      updateDishMutation.mutate({ id: editingDish.id, data: formData });
    } else {
      createDishMutation.mutate(formData);
    }
  };

  const DishGridCard = ({ item }) => (
    <Card
      hoverable
      style={{ borderRadius: 12, overflow: "hidden" }}
      size="small"
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
              background: "linear-gradient(135deg,#fce7f3,#fbcfe8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
            }}
          >
            🍜
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
        <Badge status={item.is_available ? "success" : "default"} />
      </div>

      <Space size={4} style={{ marginBottom: 8 }}>
        {item.category && <Tag style={{ margin: 0 }}>{item.category}</Tag>}
        <Tag
          color={item.is_available ? "green" : "default"}
          style={{ margin: 0 }}
        >
          {item.is_available ? "Đang bán" : "Tạm ngưng"}
        </Tag>
      </Space>

      <div
        style={{
          color: "red",
          fontWeight: 600,
          fontSize: 14,
          marginBottom: 6,
        }}
      >
        {formatVND(item.price)}
      </div>

      <Text
        type="secondary"
        style={{ fontSize: 12, display: "block", marginBottom: 12 }}
        ellipsis={{ tooltip: item.description }}
      >
        {item.description || "Không có mô tả"}
      </Text>

      <div style={{ display: "flex", gap: 8 }}>
        <Button size="small" block onClick={() => setDetailDish(item)}>
          Xem
        </Button>
        <Tooltip title={item.is_available ? "Tạm ngưng" : "Mở bán"}>
          <Button
            size="small"
            block
            onClick={() => toggleAvailabilityMutation.mutate(item.id)}
            loading={toggleAvailabilityMutation.isPending}
          >
            {item.is_available ? "Tắt" : "Bật"}
          </Button>
        </Tooltip>
        <Tooltip title="Sửa">
          <Button
            size="small"
            icon={<EditOutlined />}
            block
            onClick={() => {
              setEditingDish(item);
              setDishModalOpen(true);
            }}
          />
        </Tooltip>
        <Popconfirm
          title="Xóa món ăn này?"
          onConfirm={() => deleteDishMutation.mutate(item.id)}
          okText="Xóa"
          cancelText="Huỷ"
        >
          <Tooltip title="Xóa">
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              block
              loading={deleteDishMutation.isPending}
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
            Quản Lý Món Ăn
          </h2>
          <Text type="secondary">Quản lý toàn bộ món ăn của nhà hàng</Text>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingDish(null);
            setDishModalOpen(true);
          }}
          style={{ borderRadius: 8, fontWeight: 600 }}
        >
          Thêm món ăn
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
          { title: "Tổng món", value: dishes.length, color: "#3b82f6" },
          { title: "Đang bán", value: availableCount, color: "#22c55e" },
          {
            title: "Tạm ngưng",
            value: dishes.length - availableCount,
            color: "#f59e0b",
          },
        ].map((s) => (
          <Card
            key={s.title}
            size="small"
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
          placeholder="Tìm món ăn..."
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
      ) : filteredDishes.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}
        >
          <InboxOutlined style={{ fontSize: 48, marginBottom: 12 }} />
          <div>Không có món ăn nào</div>
        </div>
      ) : (
        <div className="grid grid-cols-5">
          {filteredDishes.map((item) => (
            <DishGridCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <DishFormModal
        open={dishModalOpen}
        editingDish={editingDish}
        onSave={handleDishSave}
        onCancel={() => {
          setDishModalOpen(false);
          setEditingDish(null);
        }}
        isLoading={createDishMutation.isPending || updateDishMutation.isPending}
      />

      <DetailDishModal
        open={!!detailDish}
        dish={detailDish}
        onCancel={() => setDetailDish(null)}
      />
    </div>
  );
}

export default Dish;
