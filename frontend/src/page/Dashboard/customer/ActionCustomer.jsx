import { Form, Input, Modal } from "antd";
import { useEffect } from "react";
import axiosInstance from "../../../config/axiosInstance";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

function ActionCustomer({ open, action, data, onClose }) {
  const [formCustomer] = Form.useForm();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (action === "edit" && data) {
      formCustomer.setFieldsValue({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        note: data.note,
      });
    } else {
      formCustomer.resetFields();
    }
  }, [action, data, formCustomer]);

  const handleFinish = async (values) => {
    const payload = {
      full_name: values.full_name,
      phone: values.phone,
      email: values.email,
      address: values.address,
      note: values.note,
    };
    try {
      let res;
      if (action === "edit") {
        res = await axiosInstance.put(`/customer/${data.id}`, payload);
      } else {
        res = await axiosInstance.post("/customer", payload);
      }

      if (res.status === 201 || res.status === 200) {
        toast.success(
          action === "edit"
            ? "Cập nhật thông tin thành công!"
            : "Tạo khách hàng thành công!",
        );
        await queryClient.invalidateQueries(["customers"]);
        onClose();
      }
    } catch (error) {
      toast.error(error.message || "Lỗi server! Vui lòng thử lại!");
    }
  };

  return (
    <Modal
      title={action === "edit" ? "Sửa khách hàng" : "Thêm khách hàng mới"}
      open={open}
      cancelText="Huỷ"
      footer={null}
      width={560}
      centered
      destroyOnHidden
      onCancel={onClose}
    >
      <Form
        form={formCustomer}
        onFinish={handleFinish}
        layout="vertical"
        style={{
          marginTop: 16,
          maxHeight: "70vh",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        <Form.Item
          label="Họ tên"
          name="full_name"
          rules={[
            { required: true, message: "Vui lòng nhập họ tên!" },
            { min: 3, message: "Tên phải có ít nhất 3 ký tự!" },
          ]}
        >
          <Input placeholder="Nhập họ tên khách hàng" style={{ height: 45 }} />
        </Form.Item>

        <div className="flex items-center gap-6 w-full">
          <Form.Item
            label="Email"
            name="email"
            style={{ width: "100%" }}
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không đúng định dạng!" },
            ]}
          >
            <Input
              placeholder="Nhập email khách hàng"
              style={{ height: 45, width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            style={{ width: "100%" }}
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Số điện thoại phải có 10 chữ số!",
              },
            ]}
          >
            <Input
              placeholder="Nhập số điện thoại"
              style={{ height: 45, width: "100%" }}
            />
          </Form.Item>
        </div>

        <Form.Item label="Địa chỉ" name="address">
          <Input placeholder="Nhập địa chỉ khách hàng" style={{ height: 45 }} />
        </Form.Item>

        <Form.Item label="Ghi chú" name="note">
          <Input.TextArea
            placeholder="Nhập ghi chú về khách hàng"
            rows={3}
            style={{ resize: "none" }}
          />
        </Form.Item>

        <div className="flex items-center justify-end mt-6">
          <button
            className="px-8 py-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors mr-2"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-8 py-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {action === "edit" ? "Lưu thay đổi" : "Thêm khách hàng"}
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default ActionCustomer;
