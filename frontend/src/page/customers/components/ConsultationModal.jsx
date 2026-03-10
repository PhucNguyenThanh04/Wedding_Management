import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Input, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";

const { Option } = Select;

function ConsultationModal({ onClose }) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    form.validateFields().then((values) => {
      console.log(values);
    });
    setIsLoading(true);
    try {
      // Gợi api
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Đặt lịch tư vấn thành công!");
      form.resetFields();
      onClose();
      return;
    } catch (error) {
      console.log(error);
      toast.error("Lỗi server! Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center z-[9999] bg-[#54545450]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative w-[95%] md:w-[60rem] h-auto rounded-xl bg-white p-10"
      >
        <button
          className="absolute top-6 right-6 cursor-pointer"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
        <h3 className="text-[2.5rem] font-medium">Đặt lịch tư vấn miễn phí</h3>
        <Form
          form={form}
          onFinish={handleSend}
          layout="vertical"
          style={{
            marginTop: 16,
            maxHeight: "70vh",
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Form.Item
              name="fullName"
              label="Họ và tên"
              style={{ textAlign: "start" }}
              rules={[{ required: true, message: "Nhập họ tên" }]}
            >
              <Input
                style={{ height: 45, width: "100%" }}
                placeholder="Nhập họ và tên..."
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              style={{ textAlign: "start" }}
              rules={[{ required: true, message: "Nhập số điện thoại" }]}
            >
              <Input
                style={{ height: 45, width: "100%" }}
                placeholder="Nhập sđt..."
              />
            </Form.Item>

            <Form.Item
              name="eventDate"
              label="Ngày dự kiến tổ chức"
              style={{ textAlign: "start" }}
              rules={[
                { required: true, message: "Chọn ngày dự kiến tổ chức!" },
              ]}
            >
              <Input
                type="date"
                style={{ height: 45, width: "100%" }}
                placeholder="Chọn ngày dự kiến..."
              />
            </Form.Item>

            <Form.Item
              name="guestCount"
              label="Số lượng khách dự kiến"
              style={{ textAlign: "start" }}
              rules={[
                { required: true, message: "Nhập số lượng khách dự kiến!" },
              ]}
            >
              <InputNumber
                style={{ height: 45, width: "100%" }}
                placeholder="Nhập số lượng khách..."
              />
            </Form.Item>
          </div>
          <Form.Item name="note" label="Ghi chú">
            <TextArea rows={3} style={{ width: "100%" }} />
          </Form.Item>
          <div className="flex items-center justify-end gap-2.5">
            <Button
              size="large"
              className=""
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              disabled={isLoading}
            >
              {isLoading ? "Đang gửi..." : "Gửi"}
            </Button>
          </div>
        </Form>
      </motion.div>
    </div>
  );
}

export default ConsultationModal;
