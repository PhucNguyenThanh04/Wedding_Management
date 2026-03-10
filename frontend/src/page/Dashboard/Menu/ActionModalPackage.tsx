import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { MenuItem } from "../../../types/menu.type";

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

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

interface ActionModalPackageProps {
  open: boolean;
  editingPkg: Package | null;
  form: ReturnType<typeof Form.useForm>[0];
  menuItems: MenuItem[];
  onOk: () => void;
  onCancel: () => void;
}

const formatVND = (v: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v,
  );

function ActionModalPackage({
  open,
  editingPkg,
  form,
  menuItems,
  onOk,
  onCancel,
}: ActionModalPackageProps) {
  return (
    <Modal
      title={editingPkg ? "Sửa gói tiệc" : "Thêm gói tiệc mới"}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText={editingPkg ? "Lưu thay đổi" : "Thêm gói"}
      cancelText="Huỷ"
      width={620}
      centered
      destroyOnHidden
    >
      <div
        className="max-h-[50rem] overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <Form
          form={form}
          size="large"
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 16px",
            }}
          >
            <Form.Item
              name="name"
              label="Tên gói"
              rules={[{ required: true, message: "Nhập tên gói" }]}
            >
              <Input placeholder="VD: Gói Vàng" />
            </Form.Item>
            <Form.Item
              name="price"
              label="Giá / khách (VNĐ)"
              rules={[{ required: true, message: "Nhập đơn giá" }]}
            >
              <InputNumber
                min={0}
                step={50000}
                style={{ width: "100%" }}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(v) => v!.replace(/,/g, "") as any}
              />
            </Form.Item>
            <Form.Item
              name="minGuests"
              label="Số khách tối thiểu"
              rules={[{ required: true, message: "Nhập số khách tối thiểu" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="maxGuests"
              label="Số khách tối đa"
              rules={[{ required: true, message: "Nhập số khách tối đa" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Mô tả gói">
            <TextArea rows={2} placeholder="Mô tả ngắn về gói tiệc..." />
          </Form.Item>

          <Form.Item
            name="menuItems"
            label="Món ăn bao gồm"
            rules={[{ required: true, message: "Chọn ít nhất 1 món" }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn các món trong gói..."
              optionFilterProp="label"
            >
              {menuItems.map((m) => (
                <Option key={m.id} value={m.id} label={m.name}>
                  <Space>
                    <Tag style={{ margin: 0 }}>{m.category}</Tag>
                    {m.name}
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {formatVND(m.price)}
                    </Text>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 16px",
            }}
          >
            <Form.Item name="status" label="Trạng thái">
              <Select>
                <Option value="active">Đang áp dụng</Option>
                <Option value="inactive">Tạm ngưng</Option>
              </Select>
            </Form.Item>
            <Form.Item name="highlight" label="Nhãn nổi bật">
              <Select allowClear placeholder="Không có">
                <Option value="Phổ biến">⭐ Phổ biến</Option>
                <Option value="VIP">👑 VIP</Option>
                <Option value="Mới">🆕 Mới</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

export default ActionModalPackage;
