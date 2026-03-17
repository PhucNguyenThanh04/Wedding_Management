import { useState, useMemo } from "react";
import { Modal, Input, Button, Badge, Typography, Empty } from "antd";
import { CheckOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";

const { Text } = Typography;

const DISH_TYPE_LABEL = {
  appetizer: "Khai vị",
  main_course: "Món chính",
  dessert: "Tráng miệng",
  drink: "Đồ uống",
};

const DISH_TYPES = ["all", "appetizer", "main_course", "dessert", "drink"];

export default function DishSelectorModal({
  open,
  dishes,
  value = [],
  onChange,
  onCancel,
}) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [localSelected, setLocalSelected] = useState({});

  const handleAfterOpen = (isOpen) => {
    if (isOpen) {
      const map = {};
      value.forEach((d) => {
        map[d.id] = { ...d };
      });
      setLocalSelected(map);
      setSearch("");
      setActiveTab("all");
    }
  };

  const grouped = useMemo(() => {
    const q = search.toLowerCase();
    const types =
      activeTab === "all"
        ? ["appetizer", "main_course", "dessert", "drink"]
        : [activeTab];

    const result = {};
    types.forEach((type) => {
      const items = dishes.filter(
        (d) => d.dish_type === type && (!q || d.name.toLowerCase().includes(q)),
      );
      if (items.length) result[type] = items;
    });
    return result;
  }, [dishes, search, activeTab]);

  const toggleDish = (dish) => {
    setLocalSelected((prev) => {
      const next = { ...prev };
      if (next[dish.id]) {
        delete next[dish.id];
      } else {
        next[dish.id] = { id: dish.id, quantity: 1 };
      }
      return next;
    });
  };

  const setQty = (id, delta) => {
    setLocalSelected((prev) => {
      if (!prev[id]) return prev;
      const newQty = prev[id].quantity + delta;
      if (newQty < 1) return prev;
      return { ...prev, [id]: { ...prev[id], quantity: newQty } };
    });
  };

  const handleConfirm = () => {
    onChange?.(Object.values(localSelected));
    onCancel();
  };

  const formatPrice = (price) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const selectedCount = Object.keys(localSelected).length;

  return (
    <Modal
      title="Chọn món ăn cho combo"
      open={open}
      onCancel={onCancel}
      width={680}
      centered
      destroyOnHidden
      afterOpenChange={handleAfterOpen}
      footer={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text type="secondary" style={{ fontSize: 13 }}>
            Đã chọn:{" "}
            <Text strong style={{ color: "#185FA5" }}>
              {selectedCount}
            </Text>{" "}
            món
          </Text>
          <div style={{ display: "flex", gap: 8 }}>
            <Button onClick={onCancel}>Huỷ</Button>
            <Button type="primary" onClick={handleConfirm}>
              Xác nhận
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <Input.Search
          placeholder="Tìm tên món..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
          allowClear
        />
      </div>

      <div
        style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}
      >
        {DISH_TYPES.map((type) => (
          <Button
            key={type}
            size="middle"
            type={activeTab === type ? "primary" : "default"}
            onClick={() => setActiveTab(type)}
            style={{ borderRadius: 16 }}
          >
            {type === "all" ? "Tất cả" : DISH_TYPE_LABEL[type]}
          </Button>
        ))}
      </div>

      <div
        style={{
          maxHeight: 400,
          minHeight: 400,
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        {Object.keys(grouped).length === 0 ? (
          <Empty
            description="Không tìm thấy món phù hợp"
            style={{ padding: "32px 0" }}
          />
        ) : (
          Object.entries(grouped).map(([type, items]) => (
            <div key={type} style={{ marginBottom: 16 }}>
              <Text
                type="secondary"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                {DISH_TYPE_LABEL[type]}
              </Text>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 8,
                }}
              >
                {items.map((dish) => {
                  const isSelected = !!localSelected[dish.id];
                  return (
                    <div
                      key={dish.id}
                      onClick={() => toggleDish(dish)}
                      style={{
                        border: isSelected
                          ? "1.5px solid #185FA5"
                          : "0.5px solid #d9d9d9",
                        borderRadius: 8,
                        padding: "10px 12px",
                        cursor: "pointer",
                        background: isSelected ? "#E6F1FB" : "#fff",
                        transition: "border-color .15s",
                        userSelect: "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: 500,
                            color: isSelected ? "#185FA5" : undefined,
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {dish.name}
                        </Text>
                        {isSelected && (
                          <div
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              background: "#185FA5",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <CheckOutlined
                              style={{ fontSize: 9, color: "#fff" }}
                            />
                          </div>
                        )}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: 4,
                        }}
                      >
                        <Text type="secondary" style={{ fontSize: 14 }}>
                          {DISH_TYPE_LABEL[dish.dish_type] ?? dish.dish_type}
                        </Text>
                        <Text
                          type="secondary"
                          style={{
                            fontSize: 12,
                            fontWeight: 500,
                            color: "red",
                          }}
                        >
                          {formatPrice(dish.price)}
                        </Text>
                      </div>

                      {isSelected && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderTop: "0.5px solid #d0e0f5",
                            marginTop: 8,
                            paddingTop: 8,
                          }}
                        >
                          <Text type="secondary" style={{ fontSize: 14 }}>
                            Số lượng
                          </Text>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <Button
                              size="small"
                              icon={<MinusOutlined />}
                              onClick={() => setQty(dish.id, -1)}
                              style={{ width: 24, minWidth: 24, padding: 0 }}
                            />
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: 500,
                                minWidth: 18,
                                textAlign: "center",
                              }}
                            >
                              {localSelected[dish.id]?.quantity ?? 1}
                            </Text>
                            <Button
                              size="small"
                              icon={<PlusOutlined />}
                              onClick={() => setQty(dish.id, 1)}
                              style={{ width: 24, minWidth: 24, padding: 0 }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
