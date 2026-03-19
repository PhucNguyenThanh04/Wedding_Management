import { faClose, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useTheme } from "../../../context/themeContext";
import { Button } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  completedOrder,
  confirmOrder,
  inProcessOrder,
} from "../../../apis/booking.api";
import { toast } from "react-toastify";

const NEXT_STATUS_MAP = {
  booking_pending: [
    {
      value: "confirmed",
      label: "Xác nhận đơn",
      apiFn: confirmOrder,
      color: "bg-blue-500 hover:bg-blue-600",
    },
  ],
  confirmed: [
    {
      value: "in_progress",
      label: "Bắt đầu diễn ra",
      apiFn: inProcessOrder,
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ],
  in_progress: [
    {
      value: "completed",
      label: "Hoàn thành",
      apiFn: completedOrder,
      color: "bg-green-500 hover:bg-green-600",
    },
  ],
};

const STATUS_CONFIG = {
  booking_pending: {
    label: "Chờ xác nhận",
    class: "bg-yellow-100 text-yellow-700",
  },
  confirmed: { label: "Đã xác nhận", class: "bg-blue-100 text-blue-700" },
  in_progress: {
    label: "Đang diễn ra",
    class: "bg-purple-100 text-purple-700",
  },
  completed: { label: "Hoàn thành", class: "bg-green-100 text-green-700" },
  cancelled: { label: "Đã hủy", class: "bg-red-100 text-red-700" },
};

function UpdateStatusBookingModal({ onClose, booking }) {
  const { t } = useTheme();
  const queryClient = useQueryClient();

  const nextStatuses = NEXT_STATUS_MAP[booking.status] ?? [];
  const currentCfg = STATUS_CONFIG[booking.status] ?? {
    label: booking.status,
    class: "bg-gray-100 text-gray-600",
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ apiFn, id }) => apiFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Cập nhật trạng thái thành công!");
      onClose();
    },
    onError: (err) => {
      console.log(err);

      toast.error(err?.response?.data?.message || "Có lỗi xảy ra!");
    },
  });

  const handleUpdate = (next) => {
    mutate({ apiFn: next.apiFn, id: booking.id });
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

        <div className="space-y-1 mb-8">
          <h2 className="text-[2rem] font-semibold">Cập nhật trạng thái</h2>
          <p className="text-gray-500 text-[1.4rem]">
            Đơn{" "}
            <span className="font-semibold text-gray-700">#{booking.id}</span>
          </p>
        </div>

        <div className="mb-8 p-5 rounded-md bg-gray-50 border border-gray-200 space-y-2">
          <p className="text-[1.3rem] text-gray-500">Trạng thái hiện tại</p>
          <span
            className={`inline-block px-4 py-1.5 rounded-full text-[1.4rem] font-medium ${currentCfg.class}`}
          >
            {currentCfg.label}
          </span>
        </div>

        {nextStatuses.length > 0 ? (
          <div className="space-y-3">
            <p className="text-[1.4rem] font-medium text-gray-700">
              Chuyển sang trạng thái
            </p>
            {nextStatuses.map((next) => {
              const nextCfg = STATUS_CONFIG[next.value];
              return (
                <div
                  key={next.value}
                  className="flex items-center justify-between p-4 rounded-md border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[1.3rem] font-medium ${currentCfg.class}`}
                    >
                      {currentCfg.label}
                    </span>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-gray-400"
                    />
                    <span
                      className={`px-3 py-1 rounded-full text-[1.3rem] font-medium ${nextCfg?.class}`}
                    >
                      {nextCfg?.label}
                    </span>
                  </div>
                  <button
                    onClick={() => handleUpdate(next)}
                    disabled={isPending}
                    className={`px-5 py-2 text-white rounded-md transition-colors text-[1.4rem] disabled:opacity-60 disabled:cursor-not-allowed ${next.color}`}
                  >
                    {isPending ? "Đang xử lý..." : next.label}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400 text-[1.4rem]">
            Đơn này không thể chuyển trạng thái tiếp theo.
          </div>
        )}

        <div className="flex justify-end mt-8">
          <Button
            onClick={onClose}
            size="large"
            className="px-8 rounded-md border-gray-300 text-gray-700 hover:!border-gray-400"
          >
            Đóng
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default UpdateStatusBookingModal;
