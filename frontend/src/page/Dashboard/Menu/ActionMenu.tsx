import { Modal, Form, Input, InputNumber, Select, Upload } from "antd";
import { useState } from "react";
import { MenuItem } from "../../../types/menu.type";

const { Option } = Select;
const { TextArea } = Input;

const MENU_CATEGORIES = [
  "Khai vị",
  "Món chính",
  "Tráng miệng",
  "Đồ uống",
  "Buffet",
];

interface ActionMenuProps {
  open: boolean;
  editingMenu: MenuItem | null;
  form: ReturnType<typeof Form.useForm>[0];
  onOk: () => void;
  onCancel: () => void;
}

function ActionMenu({
  open,
  editingMenu,
  form,
  onOk,
  onCancel,
}: ActionMenuProps) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const handleCancel = () => {
    setImagePreviewUrl(null);
    onCancel();
  };

  return (
    <Modal
      title={editingMenu ? "Sửa món ăn" : "Thêm món ăn mới"}
      open={open}
      onOk={onOk}
      onCancel={handleCancel}
      okText={editingMenu ? "Lưu thay đổi" : "Thêm món"}
      cancelText="Huỷ"
      width={560}
      centered
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        style={{
          marginTop: 16,
          maxHeight: "70vh",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
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
            label="Tên món ăn"
            rules={[{ required: true, message: "Nhập tên món" }]}
          >
            <Input
              placeholder="VD: Gà hấp muối"
              style={{ height: 45, width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: "Chọn danh mục" }]}
          >
            <Select placeholder="Chọn danh mục" style={{ height: 45 }}>
              {MENU_CATEGORIES.map((c) => (
                <Option key={c} value={c}>
                  {c}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="price"
            label="Đơn giá (VNĐ)"
            rules={[{ required: true, message: "Nhập đơn giá" }]}
          >
            <InputNumber
              min={0}
              step={5000}
              style={{ width: "100%", height: 45 }}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v!.replace(/,/g, "") as any}
              placeholder="85000"
            />
          </Form.Item>
          <Form.Item
            name="unit"
            label="Đơn vị"
            rules={[{ required: true, message: "Nhập đơn vị" }]}
          >
            <Select placeholder="Chọn đơn vị" style={{ height: 45 }}>
              {["đĩa", "tô", "phần", "con", "nồi", "ly", "ấm", "suất"].map(
                (u) => (
                  <Option key={u} value={u}>
                    {u}
                  </Option>
                ),
              )}
            </Select>
          </Form.Item>
        </div>

        <Form.Item name="description" label="Mô tả">
          <TextArea rows={2} placeholder="Mô tả ngắn về món ăn..." />
        </Form.Item>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 16px",
          }}
        >
          <Form.Item name="status" label="Trạng thái">
            <Select style={{ height: 45 }}>
              <Option value="active">Đang bán</Option>
              <Option value="inactive">Tạm ngưng</Option>
            </Select>
          </Form.Item>
          <Form.Item name="popular" label="Đánh dấu">
            <Select allowClear placeholder="Không" style={{ height: 45 }}>
              <Option value={true}>🔥 Món hot</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="image"
          label="Hình ảnh"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Vui lòng chọn hình ảnh!" }]}
        >
          <Upload
            accept="image/*"
            maxCount={1}
            beforeUpload={() => false}
            onChange={(info) => {
              const file = info.fileList?.[0]?.originFileObj;
              if (file) setImagePreviewUrl(URL.createObjectURL(file));
            }}
            style={{ width: "100%" }}
          >
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                style={{
                  width: "100%",
                  height: "20rem",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            ) : (
              <div
                className="w-full h-[20rem] border border-dashed border-gray-400 rounded-xl flex items-center justify-center"
                style={{ cursor: "pointer" }}
              >
                Chọn hình ảnh
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ActionMenu;
