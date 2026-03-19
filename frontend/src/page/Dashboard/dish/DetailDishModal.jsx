import { Modal, Tag, Typography, Divider } from "antd";

const { Text, Title } = Typography;

const formatVND = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v,
  );

const DISH_TYPE_LABEL = {
  appetizer: "Khai vị",
  main_course: "Món chính",
  dessert: "Tráng miệng",
  drink: "Đồ uống",
};

function DetailDishModal({ open, dish, onCancel }) {
  if (!dish) return null;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={480}
      centered
      title={
        <span style={{ fontWeight: 700, fontSize: 16 }}>Chi tiết món ăn</span>
      }
    >
      {dish.image_url ? (
        <img
          src={dish.image_url}
          alt={dish.name}
          style={{
            width: "100%",
            height: 220,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: 220,
            borderRadius: 8,
            background: "#f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 56,
          }}
        >
          🍜
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          {dish.name}
        </Title>

        <div
          style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}
        >
          {dish.dish_type && (
            <Tag>{DISH_TYPE_LABEL[dish.dish_type] ?? dish.dish_type}</Tag>
          )}
          <Tag color={dish.is_available ? "green" : "default"}>
            {dish.is_available ? "Đang bán" : "Tạm ngưng"}
          </Tag>
        </div>

        <Divider style={{ margin: "12px 0" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text type="secondary">Giá</Text>
            <Text strong style={{ color: "#16a34a" }}>
              {formatVND(dish.price)}
            </Text>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text type="secondary">Mã món</Text>
            <Text>{dish.id}</Text>
          </div>
        </div>

        {dish.description && (
          <>
            <Divider style={{ margin: "12px 0" }} />
            <Text type="secondary" style={{ fontSize: 13 }}>
              Mô tả
            </Text>
            <div style={{ marginTop: 4, fontSize: 14, lineHeight: 1.6 }}>
              {dish.description}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

export default DetailDishModal;
