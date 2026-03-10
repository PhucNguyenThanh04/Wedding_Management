import {
  Modal,
  Select,
  Tag,
  Button,
  Input,
  Space,
  message,
  Divider,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { toast } from "react-toastify";
// import axiosInstance from "../../../config/axiosInstance";

// eslint-disable-next-line react-refresh/only-export-components
export const STATUS = {
  pending: {
    label: "Chờ xác nhận",
    color: "orange",
    antColor: "warning",
    icon: <ClockCircleOutlined />,
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "#4f8ef7",
    antColor: "processing",
    icon: <CheckCircleOutlined />,
  },
  deposited: {
    label: "Đã cọc",
    color: "#a855f7",
    antColor: "purple",
    icon: <DollarOutlined />,
  },
  completed: {
    label: "Hoàn thành",
    color: "#22d3a5",
    antColor: "success",
    icon: <CheckCircleOutlined />,
  },
  cancelled: {
    label: "Đã hủy",
    color: "#f43f5e",
    antColor: "error",
    icon: <CloseCircleOutlined />,
  },
};

const allowedTransitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["deposited", "cancelled"],
  deposited: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

function EditStatusModal({ open, onClose, record }) {
  const [newStatus, setNewStatus] = useState(record?.status || "pending");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!record) return null;

  const currentStatus = STATUS[record.status];
  const possibleStatuses = allowedTransitions[record.status] || [];

  const handleSubmit = async () => {
    if (newStatus === record.status) {
      toast.warning("Trạng thái không thay đổi");
      return;
    }

    setLoading(true);
    try {
      // const res = await axiosInstance.patch(`/api/v1/orders/:${record.id}`, {
      //   status: STATUS[newStatus].label,
      // });

      // if (res.response.status === 204) {
      //   toast.success(
      //     `Đã cập nhật trạng thái thành "${STATUS[newStatus].label}"`,
      //   );
      // }

      onClose();
      setNote("");
    } catch (err) {
      message.error(
        "Cập nhật thất bại: " + (err.message || "Lỗi không xác định"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={"Cập nhật trạng thái đơn đặt tiệc"}
      open={open}
      onCancel={onClose}
      centered
      destroyOnHidden
      width={600}
      footer={null}
    >
      <div className="py-6 px-2 space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className=" text-gray-500 mb-1">
            Mã đơn & Trạng thái hiện tại
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium ">{record.id}</span>
            <Tag
              color={currentStatus.antColor}
              style={{ padding: "4px 12px", fontSize: 14, borderRadius: 20 }}
            >
              {currentStatus.icon} {currentStatus.label}
            </Tag>
          </div>
        </div>

        <div>
          <label className="block  font-medium text-gray-700 mb-2">
            Chuyển sang trạng thái:
          </label>
          <Select
            value={newStatus}
            onChange={setNewStatus}
            style={{ width: "100%" }}
            size="large"
            disabled={possibleStatuses.length === 0}
          >
            {possibleStatuses.map((key) => {
              const st = STATUS[key];
              return (
                <Select.Option key={key} value={key}>
                  <Space>
                    {st.icon}
                    {st.label}
                  </Space>
                </Select.Option>
              );
            })}
          </Select>
        </div>

        {(newStatus === "cancelled" || note) && (
          <div>
            <label className="block  font-medium text-gray-700 mb-2">
              {newStatus === "cancelled" ? "Lý do hủy đơn *" : "Ghi chú"}
            </label>
            <Input.TextArea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                newStatus === "cancelled"
                  ? "Ví dụ: Khách thay đổi kế hoạch, đặt nhầm ngày..."
                  : "Ghi chú thêm (nếu có)"
              }
              required={newStatus === "cancelled"}
            />
          </div>
        )}

        <Divider />
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button size="middle" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            type="primary"
            size="middle"
            loading={loading}
            disabled={
              newStatus === record.status ||
              (newStatus === "cancelled" && !note.trim())
            }
            onClick={handleSubmit}
          >
            Cập nhật
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default EditStatusModal;
