import { useState, useMemo } from "react";
import {
  Modal,
  Form,
  InputNumber,
  Select,
  Button,
  Divider,
  ConfigProvider,
  Tag,
  Progress,
} from "antd";
import {
  DollarOutlined,
  BankOutlined,
  WalletOutlined,
  CheckCircleOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../../../context/themeContext";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import axiosInstance from "../../../../config/axiosInstance";

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n) + "đ";

const PAYMENT_METHODS = [
  { value: "cash", label: "Tiền mặt", icon: <WalletOutlined /> },
  { value: "transfer", label: "Chuyển khoản", icon: <BankOutlined /> },
];

const MOCK_HISTORY = [
  {
    id: "TT001",
    amount: 10000000,
    method: "cash",
    note: "Đặt cọc lần đầu",
    date: "2024-11-15",
  },
  {
    id: "TT002",
    amount: 20000000,
    method: "transfer",
    note: "Thanh toán đợt 2",
    date: "2024-12-20",
  },
];

function PaymentModal({ open, onClose, record }) {
  const { t } = useTheme();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const themeConfig = useMemo(() => ({ token: { controlHeight: 44 } }), []);

  const paid = record?.deposit ?? 0;
  const total = record?.total ?? 0;
  const remaining = total - paid;
  const paidPercent = total > 0 ? Math.round((paid / total) * 100) : 0;

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = async (values) => {
    if (values.amount > remaining) {
      toast.error("Số tiền thu vượt quá số tiền còn lại!");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.patch(
        `/api/v1/orders/${record.id}/status`,
        values,
      );
      if (res.response.status === 204) {
        toast.success("Cập nhật thanh toán thành công!");
        handleClose();
      }
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const methodColor = { cash: "#8a6a3a", transfer: "#2563eb" };
  const methodLabel = { cash: "Tiền mặt", transfer: "Chuyển khoản" };

  if (!record) return null;

  return (
    <ConfigProvider theme={themeConfig}>
      <Modal
        centered
        open={open}
        onCancel={handleClose}
        destroyOnHidden
        footer={null}
        width={650}
        title={
          <div className="flex items-center gap-2.5">
            <span className="block w-1 h-5 rounded bg-gradient-to-b from-[#d4aa78] to-[#8a6a3a] shrink-0" />
            <DollarOutlined className="" />
            <span style={{ color: t.text, fontWeight: 700, fontSize: 17 }}>
              Thu tiền / Cập nhật thanh toán
            </span>
          </div>
        }
      >
        <div
          style={{ maxHeight: 600, scrollbarWidth: "none" }}
          className="overflow-auto"
        >
          <div className=" border border-stone-200 rounded-2xl p-5 mt-4 mb-5">
            <div className="flex justify-between  mb-2">
              <span className="text-stone-400">Tổng hợp đồng</span>
              <span className="font-mono ">{fmt(total)}</span>
            </div>
            <div className="flex justify-between  mb-2">
              <span className="text-stone-400">Đã thanh toán</span>
              <span className="font-mono text-green-500">{fmt(paid)}</span>
            </div>
            <Divider style={{ margin: "10px 0", borderColor: "#e8dfd0" }} />
            <div className="flex justify-between items-center">
              <span className="font-bold">Còn lại</span>
              <span
                className="font-mono"
                style={{ color: remaining > 0 ? "#d4622a" : "#2db88a" }}
              >
                {fmt(remaining)}
              </span>
            </div>
            <div className="mt-3">
              <Progress
                percent={paidPercent}
                showInfo={false}
                strokeColor={{ "0%": "#5fff5c", "100%": "#03a800" }}
                trailColor="#e8dfd0"
                strokeWidth={8}
                strokeLinecap="round"
              />
              <div className="flex justify-between text-[1.2rem] text-stone-400 mt-1">
                <span>
                  Đã thanh toán <strong className="">{paidPercent}%</strong>
                </span>
                <span>Còn {100 - paidPercent}%</span>
              </div>
            </div>
          </div>

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <div className="grid grid-cols-2 gap-x-4">
              <Form.Item
                label={
                  <span style={{ color: t.textDim, fontWeight: 600 }}>
                    Số tiền thu
                  </span>
                }
                name="amount"
                rules={[
                  { required: true, message: "Nhập số tiền" },
                  {
                    type: "number",
                    min: 1000,
                    message: "Tối thiểu 1.000đ",
                  },
                  {
                    validator: (_, value) => {
                      if (value && value > remaining) {
                        return Promise.reject(
                          new Error(
                            `Số tiền không được vượt quá ${fmt(remaining)}`,
                          ),
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  className="w-full"
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(v) =>
                    `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  }
                  parser={(v) => v.replace(/\./g, "")}
                  placeholder="VD: 10.000.000"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span style={{ color: t.textDim, fontWeight: 600 }}>
                    Hình thức
                  </span>
                }
                name="method"
                rules={[{ required: true, message: "Chọn hình thức" }]}
                initialValue="cash"
              >
                <Select
                  options={PAYMENT_METHODS.map((m) => ({
                    value: m.value,
                    label: (
                      <span className="flex items-center gap-2">
                        {m.icon} {m.label}
                      </span>
                    ),
                  }))}
                />
              </Form.Item>
            </div>

            <Form.Item
              label={
                <span style={{ color: t.textDim, fontWeight: 600 }}>
                  Ghi chú
                </span>
              }
              name="note"
            >
              <input
                className="w-full border border-stone-200 rounded-lg px-3 py-2  outline-none focus:border-[#d4aa78] transition-colors"
                placeholder="VD: Thanh toán đợt 2, chuyển khoản Vietcombank..."
                style={{ height: 44 }}
              />
            </Form.Item>

            <Divider style={{ borderColor: "#f0ece6" }} />

            <div className="mb-5">
              <p className="flex items-center gap-2  font-semibold mb-3">
                <HistoryOutlined /> Lịch sử thanh toán
              </p>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {MOCK_HISTORY.length === 0 ? (
                  <p className=" text-stone-400 text-center py-3">
                    Chưa có lịch sử
                  </p>
                ) : (
                  MOCK_HISTORY.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between border border-stone-200 rounded-xl px-4 py-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircleOutlined className="text-emerald-400 text-base" />
                        <div>
                          <p className=" font-semibold  m-0">{h.note}</p>
                          <p className="text-[12px] text-stone-400 m-0">
                            {dayjs(h.date).format("DD/MM/YYYY")} ·{" "}
                            <span style={{ color: methodColor[h.method] }}>
                              {methodLabel[h.method]}
                            </span>
                          </p>
                        </div>
                      </div>
                      <span className="font-mono  text-green-500">
                        +{fmt(h.amount)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button size="middle" onClick={handleClose}>
                Hủy
              </Button>
              <Button
                size="middle"
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<DollarOutlined />}
              >
                Xác nhận thu tiền
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
}

export default PaymentModal;
