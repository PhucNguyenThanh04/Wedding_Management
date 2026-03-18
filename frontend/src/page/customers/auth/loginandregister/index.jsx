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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Outfit:wght@300;400;500&display=swap');

        .lf .ant-form-item-label > label {
          font-family: 'Outfit', sans-serif !important;
          font-size: 1.4rem !important;
          color: #6b4f35 !important;
          font-weight: 500 !important;
          height: auto !important;
        }
        .lf .ant-form-item { margin-bottom: 20px !important; }
        .lf .ant-input-affix-wrapper {
          background: #faf7f4 !important;
          border: 1.5px solid #e0d4c8 !important;
          border-radius: 8px !important;
          height: 52px !important;
          padding: 0 14px !important;
          box-shadow: none !important;
          transition: border-color 0.2s, box-shadow 0.2s !important;
        }
        .lf .ant-input-affix-wrapper:hover { border-color: #b8855a !important; }
        .lf .ant-input-affix-wrapper-focused,
        .lf .ant-input-affix-wrapper:focus-within {
          border-color: #b8855a !important;
          box-shadow: 0 0 0 3px rgba(184,133,90,0.12) !important;
        }
        .lf .ant-input {
          font-family: 'Outfit', sans-serif !important;
          font-size: 1.4rem !important;
          color: #2c1f14 !important;
          background: transparent !important;
        }
        .lf .ant-input::placeholder { color: #c4b5a5 !important; font-size: 1.4rem !important; }
        .lf .ant-input-prefix { color: #c4a882 !important; font-size: 1.4rem !important; margin-right: 10px !important; }
        .lf .ant-input-password-icon svg { color: #c4a882 !important; }
        .lf .ant-input-password-icon:hover svg { color: #b8855a !important; }

        /* Textarea (note) */
        .lf .ant-input:not(.ant-input-affix-wrapper .ant-input) {
          background: #faf7f4 !important;
          border: 1.5px solid #e0d4c8 !important;
          border-radius: 8px !important;
          padding: 10px 14px !important;
          box-shadow: none !important;
          font-family: 'Outfit', sans-serif !important;
          font-size: 1.4rem !important;
          color: #2c1f14 !important;
          resize: none !important;
        }
        .lf textarea.ant-input:hover { border-color: #b8855a !important; }
        .lf textarea.ant-input:focus {
          border-color: #b8855a !important;
          box-shadow: 0 0 0 3px rgba(184,133,90,0.12) !important;
        }

        .lf .ant-checkbox-wrapper {
          font-family: 'Outfit', sans-serif !important;
          font-size: 1.4rem !important;
          color: #8a6e56 !important;
        }
        .lf .ant-checkbox-inner {
          width: 18px !important; height: 18px !important;
          border-radius: 4px !important; border-color: #d0bfb0 !important;
        }
        .lf .ant-checkbox-checked .ant-checkbox-inner {
          background: #b8855a !important; border-color: #b8855a !important;
        }
        .lf .ant-form-item-explain-error {
          font-family: 'Outfit', sans-serif !important;
          font-size: 1.15rem !important; color: #c0674a !important;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#2c1f14",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        {/* Dev hint */}
        <div className="absolute top-0 right-0 w-auto h-auto p-5 bg-white">
          <p>email: user@gmail.com</p>
          <p>pass: 123456</p>
        </div>

        {/* Decorative blobs */}
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(180,120,70,0.18) 0%, transparent 70%)",
            top: -120,
            right: -100,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 360,
            height: 360,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(180,120,70,0.12) 0%, transparent 70%)",
            bottom: -80,
            left: -80,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            background: "#fff",
            borderRadius: 12,
            padding: "48px 44px 40px",
            width: "100%",
            maxWidth: isLogin ? 440 : 520,
            boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
            transition: "max-width 0.3s",
          }}
        >
          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "2.2rem",
                fontWeight: 600,
                color: "#2c1f14",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {isLogin ? "Đăng nhập" : "Đăng ký"}
            </h2>
            <p
              style={{
                fontSize: "1.4rem",
                color: "#b8855a",
                marginTop: 6,
                letterSpacing: "0.08em",
                fontWeight: 500,
              }}
            >
              Đặt sảnh tiệc sang trọng
            </p>
          </div>

          <div
            style={{
              height: 1,
              background:
                "linear-gradient(to right, transparent, #e0d4c8, transparent)",
              marginBottom: 24,
            }}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
            className="lf"
          >
            {/* ── ĐĂNG KÝ fields ── */}
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-x-4">
                  <Form.Item
                    name="full_name"
                    label="Họ và tên"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ tên" },
                    ]}
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
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                      },
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

                <Form.Item name="address" label="Địa chỉ">
                  <Input
                    prefix={<HomeOutlined />}
                    placeholder="123 Đường ABC, Quận 1, TP.HCM"
                    size="large"
                  />
                </Form.Item>
              </>
            )}

            {/* Email — dùng cho cả 2 mode */}
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
                placeholder="admin@wedding.vn"
                size="large"
                autoComplete="email"
              />
            </Form.Item>

            {/* Password — chỉ khi đăng nhập */}
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

            {/* Note — chỉ khi đăng ký */}
            {!isLogin && (
              <Form.Item name="note" label="Ghi chú">
                <Input.TextArea
                  placeholder="Ghi chú thêm (không bắt buộc)..."
                  rows={2}
                  prefix={<FileTextOutlined />}
                />
              </Form.Item>
            )}

            {/* Terms — chỉ khi đăng ký */}
            {!isLogin && (
              <Form.Item
                name="terms"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, val) =>
                      val
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("Vui lòng đồng ý điều khoản"),
                          ),
                  },
                ]}
                style={{ marginBottom: 0 }}
              >
                <Checkbox>
                  Tôi đồng ý với{" "}
                  <a
                    href="#"
                    style={{ color: "#b8855a", textDecoration: "none" }}
                  >
                    điều khoản sử dụng
                  </a>
                </Checkbox>
              </Form.Item>
            )}

            {/* Quên mật khẩu — chỉ khi đăng nhập */}
            {isLogin && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginBottom: 24,
                }}
              >
                <a
                  href="#"
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "1.4rem",
                    color: "#b8855a",
                    textDecoration: "none",
                  }}
                >
                  Quên mật khẩu?
                </a>
              </div>
            )}

            <Form.Item style={{ marginTop: isLogin ? 0 : 20 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
                style={{
                  height: 52,
                  background: "#2c1f14",
                  border: "none",
                  borderRadius: 8,
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  color: "#f5e8d8",
                  boxShadow: "0 2px 14px rgba(44,31,20,0.25)",
                }}
              >
                {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
              </Button>
            </Form.Item>
          </Form>

          <div
            className="flex items-center justify-center gap-2"
            style={{
              fontSize: "1.4rem",
              color: "#9e8070",
              textAlign: "center",
              marginTop: 22,
            }}
          >
            <span>
              {isLogin ? "Chưa có tài khoản?" : "Bạn đã có tài khoản?"}
            </span>
            <div
              style={{
                color: "#b8855a",
                textDecoration: "none",
                fontWeight: 500,
              }}
              className="cursor-pointer"
              onClick={switchMode}
            >
              {isLogin ? "Đăng ký ngay" : "Đăng nhập ngay"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginAndRegister;
