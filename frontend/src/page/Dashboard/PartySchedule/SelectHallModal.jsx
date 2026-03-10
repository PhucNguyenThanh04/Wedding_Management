import { Modal, Card, Button, Row, Col, Tag, Space } from "antd";
import {
  CheckOutlined,
  TeamOutlined,
  DollarOutlined,
  EyeFilled,
  CloseOutlined,
} from "@ant-design/icons";
import { useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const HALL_MOCKS = [
  {
    id: 1,
    name: "Sảnh Hoa Sen",
    tables: 30,
    capacity: 100,

    price: 5000000,
    description: "Sảnh nhỏ, ấm cúng, phù hợp tiệc gia đình",
    image:
      "https://luxurypalace.vn/wp-content/uploads/2024/10/241105-Luxury-Palace-068-1-1024x575.jpg",
    status: "active",
  },
  {
    id: 2,
    name: "Sảnh Hồng Ngọc",
    tables: 50,
    capacity: 100,

    price: 8000000,
    description: "Thiết kế sang trọng, phù hợp tiệc trung bình",
    image:
      "https://asiana-plaza.com/wp-content/uploads/2021/03/trang-tri-sanh-tiec-cuoi-dep-3.jpg",
    status: "active",
  },
  {
    id: 3,
    name: "Sảnh Kim Cương",
    tables: 80,
    capacity: 100,

    price: 12000000,
    description: "Sảnh lớn, trần cao, sân khấu rộng",
    image:
      "https://asiana-plaza.com/wp-content/uploads/2021/03/sanh-cuoi-dep-nhat-1.jpg",
    status: "active",
  },
  {
    id: 4,
    name: "Sảnh Hoàng Gia",
    tables: 120,
    capacity: 100,

    price: 18000000,
    description: "Phong cách châu Âu, dành cho tiệc cao cấp",
    image:
      "https://mgs-storage.sgp1.digitaloceanspaces.com/gala/2024/01/sanh-tiec-autumn-to-chuc-tiec-tan-nien-tai-trung-tam-to-chuc-hoi-nghi-tphcm-gala-center.jpeg",
    status: "active",
  },
  {
    id: 5,
    name: "Sảnh Sapphire",
    tables: 200,
    capacity: 100,

    price: 25000000,
    description: "Sảnh VIP, màn hình LED, âm thanh ánh sáng chuẩn show",
    image:
      "https://asiana-plaza.com/wp-content/uploads/2021/03/trang-tri-sanh-cuoi-dep-va-sang-trong-1.jpg",
    status: "active",
  },
];

function SelectHallModal({
  openHallModal,
  onClose,
  selectedHall,
  setSelectHall,
}) {
  const [showImage, setShowImage] = useState(null);

  const handleSelect = (hall) => {
    setSelectHall(hall);
    onClose();
  };

  return (
    <Modal
      title="Chọn sảnh tổ chức"
      open={openHallModal}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnHidden
      width={1000}
      bodyStyle={{
        padding: "16px 24px",
        maxHeight: "80vh",
        overflowY: "auto",
        scrollbarWidth: "none",
      }}
    >
      <Row gutter={[16, 16]}>
        {HALL_MOCKS.map((hall) => (
          <Col xs={24} sm={12} key={hall.id}>
            <Card
              hoverable
              cover={
                <div
                  className="w-full h-[22rem] relative group"
                  onClick={() => setShowImage(hall.image)}
                >
                  <img
                    alt={hall.name}
                    src={hall.image}
                    style={{
                      objectFit: "cover",
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    }}
                    className="w-full h-full"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x160?text=" + hall.name;
                    }}
                  />
                  <div className="opacity-0 group-hover:opacity-[1] flex absolute inset-0 w-full h-full bg-gray-500/40 items-center justify-center transition-discrete duration-300">
                    <Space align="center">
                      <EyeFilled style={{ color: "white", fontSize: 22 }} />
                      <span
                        style={{
                          fontSize: 22,
                          fontWeight: 600,
                          color: "white",
                        }}
                        className="block mb-2.5"
                      >
                        Xem ảnh
                      </span>
                    </Space>
                  </div>
                </div>
              }
              style={{
                height: "100%",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              bodyStyle={{ padding: 16 }}
            >
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                    {hall.name}
                  </h3>
                  <Tag color="blue" style={{ marginTop: 8 }}>
                    <TeamOutlined /> Sức chứa: {hall.table} người
                  </Tag>
                </div>

                <div
                  style={{ color: "#595959", fontSize: 14, lineHeight: 1.5 }}
                >
                  {hall.description}
                </div>

                <Space align="center">
                  <DollarOutlined style={{ color: "#faad14", fontSize: 18 }} />
                  <span
                    style={{ fontSize: 17, fontWeight: 600, color: "#d48806" }}
                  >
                    {hall.price.toLocaleString("vi-VN")} ₫
                  </span>
                </Space>
                {selectedHall && (
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    block
                    size="small"
                    onClick={() => handleSelect(hall)}
                    style={{
                      marginTop: 8,
                      background:
                        selectedHall.id === hall.id ? "#00b000" : "#2424ff",
                    }}
                    className="hover:opacity-[.9]"
                  >
                    {selectedHall.id === hall.id ? "Đã chọn" : "Chọn sảnh này"}
                  </Button>
                )}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: "center", marginTop: 24, color: "#8c8c8c" }}>
        Ảnh chỉ mang tính minh họa – bạn có thể xem thực tế khi đến khảo sát
        sảnh nhé!
      </div>

      {showImage && (
        <div className="fixed inset-0 z-[2000] bg-black/70 flex items-center justify-center">
          <div className="relative w-[90vw] h-[90vh]">
            <button
              onClick={() => setShowImage(null)}
              className="absolute top-0 right-0 z-10 
                   text-white flex items-center justify-center 
                   cursor-pointer"
            >
              <CloseOutlined style={{ fontSize: 22 }} />
            </button>

            <img
              src={showImage}
              alt="preview"
              className="w-full h-full object-contain block"
            />
          </div>
        </div>
      )}
    </Modal>
  );
}

export default SelectHallModal;
