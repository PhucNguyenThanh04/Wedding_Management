import { useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../../../config/axiosInstance";

function LoginAndRegister() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let res;
      if (isLogin) {
        res = await axiosInstance.post("/auth/login", {
          email: values.email,
          password: values.password,
        });
      } else {
        res = await axiosInstance.post("/customer", {
          full_name: values.full_name,
          phone: values.phone,
          email: values.email,
          address: values.address ?? "",
          note: values.note ?? "",
        });
      }

      if (res.status) {
        toast.success(
          isLogin ? "Đăng nhập thành công!" : "Đăng ký thành công!",
        );
        if (isLogin) {
          navigate("/");
        } else {
          form.resetFields();
          setIsLogin(true);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    form.resetFields();
    setIsLogin((prev) => !prev);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          maxWidth: isLogin ? 420 : 480,
          borderRadius: 8,
          padding: "40px 32px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: "#1f2937",
              margin: 0,
            }}
          >
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </h2>
          <p style={{ color: "#6b7280", marginTop: 8, fontSize: "16px" }}>
            {isLogin ? "Chào mừng bạn quay lại" : "Tạo tài khoản để tiếp tục"}
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          {!isLogin && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <Form.Item
                name="full_name"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Nguyễn Văn A"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  {
                    pattern: /^[0-9]{9,11}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="0901234567"
                  size="large"
                />
              </Form.Item>
            </div>
          )}

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="example@email.com"
              size="large"
              autoComplete="email"
            />
          </Form.Item>

          {isLogin && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu"
                size="large"
                autoComplete="current-password"
              />
            </Form.Item>
          )}

          {!isLogin && (
            <Form.Item name="address" label="Địa chỉ">
              <Input
                prefix={<HomeOutlined />}
                placeholder="123 Đường ABC, Quận 1, TP.HCM"
                size="large"
              />
            </Form.Item>
          )}

          {!isLogin && (
            <Form.Item
              name="terms"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, val) =>
                    val
                      ? Promise.resolve()
                      : Promise.reject(new Error("Vui lòng đồng ý điều khoản")),
                },
              ]}
            >
              <Checkbox>
                Tôi đồng ý với{" "}
                <a href="#" style={{ color: "#3b82f6" }}>
                  điều khoản sử dụng
                </a>
              </Checkbox>
            </Form.Item>
          )}

          {isLogin && (
            <div style={{ textAlign: "right", marginBottom: 16 }}>
              <a href="#" style={{ color: "#3b82f6", fontSize: "15px" }}>
                Quên mật khẩu?
              </a>
            </div>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
              style={{
                height: 50,
                fontSize: "17px",
                fontWeight: 500,
              }}
            >
              {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
            </Button>
          </Form.Item>
        </Form>

        <div
          style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: "15px",
            color: "#6b7280",
          }}
        >
          {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <span
            onClick={switchMode}
            style={{
              color: "#3b82f6",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {isLogin ? "Đăng ký ngay" : "Đăng nhập ngay"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginAndRegister;
