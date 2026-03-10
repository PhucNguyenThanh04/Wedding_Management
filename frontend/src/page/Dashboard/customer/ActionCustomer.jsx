import { Form, Input, Modal } from "antd";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

function ActionCustomer({ open, action, data, onClose }) {
  const [formCustomer] = Form.useForm();

  useEffect(() => {
    if (action === "edit" && data) {
      formCustomer.setFieldsValue({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        password: data.password,
      });
    } else {
      formCustomer.resetFields();
    }
  }, [action, data, formCustomer]);

  const handleFinish = () => {
    formCustomer.validateFields().then((values) => {
      console.log(values);
    });
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
          name="name"
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
            label="Password"
            name="password"
            style={{ width: "100%" }}
            rules={[
              { required: true, message: "Vui lòng nhập password!" },
              { type: "password", message: "password không đúng định dạng!" },
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu khách hàng"
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
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^[0-9]{10}$/,
              message: "Số điện thoại phải có 10 chữ số!",
            },
          ]}
        >
          <Input
            placeholder="Nhập số điện thoại khách hàng"
            style={{ height: 45 }}
          />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address">
          <Input placeholder="Nhập địa chỉ khách hàng" style={{ height: 45 }} />
        </Form.Item>

        <div className="flex items-center justify-end mt-6 ">
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
