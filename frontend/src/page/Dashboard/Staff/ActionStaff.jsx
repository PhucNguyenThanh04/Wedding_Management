import { Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/axiosInstance";

function ActionStaff({ open, action, data, onClose }) {
  const [formStaff] = Form.useForm();

  useEffect(() => {
    if (action === "edit" && data) {
      formStaff.setFieldsValue({
        username: data.username,
        email: data.email,
        full_name: data.full_name,
        password: data.password,
        role: data.role,
        phone: data.phone,
      });
    } else {
      formStaff.resetFields();
    }
  }, [action, data, formStaff]);

  const handleFinish = async (values) => {
    try {
      const payload = {
        username: values.username,
        email: values.email,
        full_name: values.full_name,
        password: values.password,
        role: values.role,
        phone: values.phone,
      };
      const res = await axiosInstance.post("/staff", payload);
      if (res.status === 201) {
        toast.success("Tạo nhân viên thành công!");
        onClose();
      }
    } catch (error) {
      toast.error(error.message || "Lỗi server!");
    }
  };

  return (
    <Modal
      title={action === "edit" ? "Sửa nhân viên" : "Thêm nhân viên mới"}
      open={open}
      cancelText="Huỷ"
      footer={null}
      width={560}
      centered
      destroyOnHidden
      onCancel={onClose}
    >
      <Form
        form={formStaff}
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
          label="Tên đăng nhập"
          name="username"
          rules={[
            { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            { min: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự!" },
          ]}
        >
          <Input placeholder="Nhập tên đăng nhập" style={{ height: 45 }} />
        </Form.Item>

        <Form.Item
          label="Họ tên"
          name="full_name"
          rules={[
            { required: true, message: "Vui lòng nhập họ tên!" },
            { min: 3, message: "Tên phải có ít nhất 3 ký tự!" },
          ]}
        >
          <Input placeholder="Nhập họ tên nhân viên" style={{ height: 45 }} />
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
              placeholder="Nhập email nhân viên"
              style={{ height: 45, width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            style={{ width: "100%" }}
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu nhân viên"
              style={{ height: 45, width: "100%" }}
              iconRender={(visible) =>
                visible ? (
                  <FontAwesomeIcon icon={faEyeSlash} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )
              }
            />
          </Form.Item>
        </div>

        <div className="flex items-center gap-6 w-full">
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

          <Form.Item
            label="Vai trò"
            name="role"
            style={{ width: "100%" }}
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
            initialValue="staff"
          >
            <Select style={{ height: 45 }}>
              <Select.Option value="staff">Nhân viên</Select.Option>
              <Select.Option value="admin">Quản trị viên</Select.Option>
            </Select>
          </Form.Item>
        </div>

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
            {action === "edit" ? "Lưu thay đổi" : "Thêm nhân viên"}
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default ActionStaff;
