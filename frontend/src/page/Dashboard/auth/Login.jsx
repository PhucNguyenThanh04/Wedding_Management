import { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function LoginAdmin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    if (values.email === "admin@wedding.vn" && values.password === "admin123") {
      localStorage.setItem("admin", JSON.stringify({ email: values.email }));
      navigate("/dashboard");
      message.success("Đăng nhập thành công!");
    } else {
      message.error("Email hoặc mật khẩu không đúng.");
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
        <div>email: admin@wedding.vn</div>
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
        {/* Logo */}
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
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
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
