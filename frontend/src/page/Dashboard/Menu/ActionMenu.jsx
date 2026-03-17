import { Modal, Form, Input, InputNumber, Select, Switch } from "antd";
import { useEffect } from "react";

const { TextArea } = Input;

const MENU_CATEGORIES = [
  "wedding",
  "birthday",
  "corporate",
  "anniversary",
  "other",
];
const CATEGORY_LABELS = {
  wedding: "Tiệc cưới",
  birthday: "Sinh nhật",
  corporate: "Hội nghị",
  anniversary: "Kỷ niệm",
  other: "Khác",
};

function ActionMenu({ open, editingMenu, onSave, onCancel, isLoading }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    if (editingMenu) {
      form.setFieldsValue({
        name: editingMenu.name,
        description: editingMenu.description,
        min_guests: editingMenu.min_guests,
        category: editingMenu.category,
        is_active: editingMenu.is_active,
        image_url: editingMenu.image_url,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ is_active: true, min_guests: 1 });
    }
  }, [editingMenu, open, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSave(values);
    });
  };

  return (
    <Modal
      title={editingMenu ? "Sửa combo" : "Thêm combo mới"}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText={editingMenu ? "Lưu thay đổi" : "Thêm combo"}
      cancelText="Huỷ"
      confirmLoading={isLoading}
      width={600}
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
            label="Tên combo"
            rules={[{ required: true, message: "Vui lòng nhập tên combo!" }]}
          >
            <Input
              placeholder="VD: Combo tiệc cưới sang trọng"
              style={{ height: 40 }}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            <Select placeholder="Chọn danh mục" style={{ height: 40 }}>
              {MENU_CATEGORIES.map((c) => (
                <Select.Option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 16px",
          }}
        >
          <Form.Item
            name="min_guests"
            label="Số khách tối thiểu"
            rules={[{ required: true, message: "Vui lòng nhập số khách!" }]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%", height: 40 }}
              placeholder="50"
            />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch checkedChildren="Đang bán" unCheckedChildren="Tạm ngưng" />
          </Form.Item>
        </div>

        <Form.Item name="description" label="Mô tả">
          <TextArea
            rows={2}
            placeholder="Mô tả ngắn về combo..."
            style={{ resize: "none" }}
          />
        </Form.Item>

        <Form.Item name="image_url" label="URL hình ảnh">
          <Input
            placeholder="https://example.com/image.jpg"
            style={{ height: 40 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ActionMenu;
