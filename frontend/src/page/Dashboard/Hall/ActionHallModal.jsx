import {
  PlusOutlined,
  EditOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ActionHallModal({ open, onClose, action, dataUpdate }) {
  const isEdit = action === "edit" && dataUpdate;
  const [hallForm] = Form.useForm();
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  useEffect(() => {
    if (!open) hallForm.resetFields();
  }, [open, hallForm]);

  useEffect(() => {
    if (action === "edit" && dataUpdate) {
      console.log("hello");

      hallForm.setFieldsValue({
        area: dataUpdate.area,
        capacity: dataUpdate.capacity,
        floor: dataUpdate.floor,
        name: dataUpdate.name,
        description: dataUpdate.description,
        status: dataUpdate.status,
        tables: dataUpdate.status,
      });

      if (dataUpdate.image) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setImagePreviewUrl(dataUpdate.image);
      }
    }
  }, [action, dataUpdate, hallForm]);

  const handleSubmit = async (value) => {
    console.log(value);
    try {
      const formData = new FormData();
      formData.append("area", value.area);
      formData.append("capacity", value.capacity);
      formData.append("floor", value.floor);
      formData.append("name", value.name);
      formData.append("description", value.description);
      formData.append("status", value.status);
      formData.append("tables", value.tables);

      if (value.image?.[0]?.originFileObj) {
        formData.append("image", value.image[0].originFileObj);
      }

      //   const res = await axiosInstance.post("/api/v1/hall");
      //   if (res.response.status === 204) {
      //     toast.success("Tạo sảnh thành công!");
      //   }
      toast.success("Tạo sảnh thành công!");
    } catch (error) {
      console.log(error);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  return (
    <Modal
      title={
        <Space>{isEdit ? "Chỉnh sửa sảnh tiệc" : "Thêm sảnh tiệc mới"}</Space>
      }
      open={open}
      onCancel={onClose}
      okText={isEdit ? "Cập nhật" : "Thêm sảnh"}
      cancelText="Hủy"
      width={560}
      centered
      okButtonProps={{
        icon: isEdit ? <EditOutlined /> : <PlusOutlined />,
      }}
      footer={null}
    >
      <Divider style={{ margin: "12px 0 20px 0" }} />
      <div
        className="max-h-[55rem] overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <Form form={hallForm} size="middle" layout="vertical">
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên sảnh"
                rules={[{ required: true, message: "Vui lòng nhập tên sảnh" }]}
              >
                <Input placeholder="VD: Sảnh Hoa Hồng" style={{ height: 40 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="floor"
                label="Tầng / Vị trí"
                rules={[{ required: true, message: "Vui lòng chọn vị trí!" }]}
              >
                <Input placeholder="VD: Tầng 1" style={{ height: 40 }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item
                name="capacity"
                label="Sức chứa (khách)"
                rules={[
                  { required: true, message: "Vui lòng nhập sức chứa (khách)" },
                ]}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%", height: 40 }}
                  placeholder="300"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tables"
                label="Số bàn"
                rules={[{ required: true, message: "Vui lòng chọn số bàn!" }]}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%", height: 40 }}
                  placeholder="30"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item name="area" label="Diện tích (m²)">
                <InputNumber
                  min={1}
                  style={{ width: "100%", height: 40 }}
                  placeholder="500"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái!" },
                ]}
              >
                <Select
                  style={{ height: 40 }}
                  options={[
                    {
                      value: "active",
                      label: (
                        <Tag color="green" icon={<CheckCircleOutlined />}>
                          Hoạt động
                        </Tag>
                      ),
                    },
                    {
                      value: "inactive",
                      label: (
                        <Tag color="red" icon={<CloseCircleOutlined />}>
                          Ngừng hoạt động
                        </Tag>
                      ),
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} placeholder="Mô tả thêm về sảnh..." />
          </Form.Item>

          <Form.Item
            name={"image"}
            label="Hình ảnh"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            style={{ cursor: "pointer" }}
            rules={[{ required: true, message: "Vui lòng chọn hỉnh ảnh!" }]}
          >
            <Upload
              accept="image/*"
              maxCount={1}
              beforeUpload={() => false}
              onChange={(info) => {
                const file = info.fileList?.[0]?.originFileObj;
                if (file) {
                  setImagePreviewUrl(URL.createObjectURL(file));
                }
              }}
              style={{ width: "100%" }}
            >
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  style={{ width: "100%", height: "20rem", objectFit: "cover" }}
                />
              ) : (
                <div className="w-full h-[20rem] border border-dashed border-gray-400 rounded-xl flex items-center justify-center">
                  Chọn hình ảnh
                </div>
              )}
            </Upload>
          </Form.Item>

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 20,
            }}
          >
            <Button
              size="middle"
              onClick={onClose}
              style={{ padding: "0 20px" }}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              style={{ padding: "0 20px" }}
              onClick={() => {
                hallForm.validateFields().then((value) => {
                  handleSubmit(value);
                });
              }}
            >
              {action === "create" ? "Tạo đặt tiệc" : "Lưu thay đổi"}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

export default ActionHallModal;
