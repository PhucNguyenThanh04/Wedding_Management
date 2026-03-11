import { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/axiosInstance";

function LoginAdmin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("password", values.password);
      const res = await axiosInstance.post("/auth/login", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200) {
        localStorage.setItem("access_token", res.data.access_token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      message.success(error.message || "Lỗi server! Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#f5f6fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="relative"
    >
      <div className="absolute top-6 right-6 p-8 bg-white rounded-lg shadow-md text-gray-600">
        <div>username: admin</div>
        <div>pass: admin123</div>
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "40px 36px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 48,
              height: 48,
              background: "#3b5bdb",
              borderRadius: 12,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              marginBottom: 16,
            }}
          >
            💍
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 600,
              color: "#1a1a2e",
            }}
          >
            WeddingKPVT
          </h2>
          <p style={{ margin: "6px 0 0", color: "#8c8c8c", fontSize: 14 }}>
            Đăng nhập vào hệ thống quản trị
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: "Vui lòng nhập username" },
              { type: "username", message: "Username không hợp lệ" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#bbb" }} />}
              placeholder="admin@wedding.vn"
              size="large"
              style={{ borderRadius: 8, height: 45 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bbb" }} />}
              placeholder="Nhập mật khẩu"
              size="large"
              style={{ borderRadius: 8, height: 45 }}
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Form.Item
              name="remember"
              valuePropName="checked"
              style={{ margin: 0 }}
            >
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <a href="#" style={{ color: "#3b5bdb", fontSize: 13 }}>
              Quên mật khẩu?
            </a>
          </div>

          <Form.Item style={{ margin: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
              style={{
                borderRadius: 8,
                height: 46,
                fontWeight: 500,
                background: "#3b5bdb",
                border: "none",
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default LoginAdmin;
