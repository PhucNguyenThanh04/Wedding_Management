import {
  faClose,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useTheme } from "../../../context/themeContext";
import { Form, Input, Button } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { cancelOrder } from "../../../apis/booking.api";

function CancelBookingModal({ onClose, booking }) {
  const { t } = useTheme();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, reason }) =>
      cancelOrder(id, { cancellation_reason: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Đã hủy đơn đặt tiệc!");
      onClose();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra!");
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      mutate({ id: booking.id, reason: values.cancellation_reason.trim() });
    } catch {
      // Ant validate tự hiển thị lỗi
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-full z-[1000] h-full flex items-center justify-center bg-[#3535356a]"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-[46rem] h-auto p-10 rounded-md relative"
        style={{ background: t.surface }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 hover:text-red-500 transition-colors"
        >
          <FontAwesomeIcon icon={faClose} className="text-[1.8rem]" />
        </button>

        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="text-red-500 text-[2.2rem]"
            />
          </div>
          <h2 className="text-[2rem] font-semibold">Hủy đơn đặt tiệc</h2>
          <p className="text-gray-500 text-[1.4rem]">
            Đơn{" "}
            <span className="font-semibold text-gray-700">#{booking.id}</span>{" "}
            sẽ bị hủy và không thể khôi phục. Vui lòng nhập lý do hủy.
          </p>
        </div>

        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item
            label={
              <span className="text-[1.4rem] font-medium text-gray-700">
                Lý do hủy
              </span>
            }
            name="cancellation_reason"
            rules={[{ required: true, message: "Vui lòng nhập lý do hủy" }]}
          >
            <Input.TextArea
              placeholder="VD: Khách yêu cầu hủy, thay đổi kế hoạch..."
              rows={3}
              className="rounded-md resize-none"
            />
          </Form.Item>
        </Form>

        <div className="flex items-center justify-end gap-3 mt-4">
          <Button
            onClick={onClose}
            disabled={isPending}
            size="large"
            className="px-8 rounded-md border-gray-300 text-gray-700 hover:!border-gray-400"
          >
            Đóng
          </Button>
          <Button
            danger
            size="large"
            onClick={handleSubmit}
            loading={isPending}
            className="px-8 rounded-md border-none"
          >
            Xác nhận hủy
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CancelBookingModal;
