import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../../context/themeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  DatePicker,
  TimePicker,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllHall } from "../../../apis/hall.api";
import { getAllCustomer } from "../../../apis/customer.api";
import { createBooking } from "../../../apis/booking.api";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useState } from "react";

const EVENT_SHIFT_OPTIONS = [
  { value: "MORNING", label: "Buổi sáng" },
  { value: "AFTERNOON", label: "Buổi trưa" },
  { value: "EVENING", label: "Buổi tối" },
];

const EVENT_TYPE_OPTIONS = [
  { value: "wedding", label: "Tiệc cưới" },
  { value: "birthday", label: "Sinh nhật" },
  { value: "conference", label: "Hội nghị" },
  { value: "other", label: "Khác" },
];

const SHIFT_TIME_RANGE = {
  MORNING: { start: 6, end: 11 },
  AFTERNOON: { start: 11, end: 14 },
  EVENING: { start: 17, end: 22 },
};

function ActionBookingModal({ onClose }) {
  const { t } = useTheme();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [selectedShift, setSelectedShift] = useState(null);

  const { data: dataHall } = useQuery({
    queryKey: ["halls"],
    queryFn: getAllHall,
  });
  const hallOptions = (dataHall?.data?.items ?? []).map((h) => ({
    value: h.id,
    label: h.name,
  }));

  const { data: dataCustomer } = useQuery({
    queryKey: ["customers"],
    queryFn: getAllCustomer,
  });

  const customerOptions =
    dataCustomer?.map((c) => ({
      value: c.id,
      label: `${c.full_name} — ${c.phone}`,
    })) ?? [];

  const { mutate: createB, isPending } = useMutation({
    mutationFn: (payload) => createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Đặt sảnh thành công!");
      onClose();
    },
    onError: (err) => {
      console.log(err.message);
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra!");
    },
  });

  const getDisabledTime = () => {
    if (!selectedShift) return {};
    const { start, end } = SHIFT_TIME_RANGE[selectedShift];
    return {
      disabledHours: () =>
        Array.from({ length: 24 }, (_, i) => i).filter(
          (h) => h < start || h > end,
        ),
      disabledMinutes: (selectedHour) => {
        if (!selectedShift) return [];
        const { end } = SHIFT_TIME_RANGE[selectedShift];
        if (selectedHour === end)
          return Array.from({ length: 60 }, (_, i) => i);
        return [];
      },
    };
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        customer_id: values.customer_id,
        hall_id: values.hall_id,
        event_date: dayjs(values.event_date).format("YYYY-MM-DD"),
        event_shift: values.event_shift,
        event_time: dayjs(values.event_time).format("HH:mm:ss"),
        event_type: values.event_type,
        so_ban: values.so_ban,
        notes: values.notes?.trim() ?? "",
      };
      createB(payload);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const labelClass = "text-[1.4rem] font-medium text-gray-700";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-full z-[999] h-full flex items-center justify-center bg-[#3535356a]"
    >
      <div
        className="w-[66rem] h-auto p-10 rounded-md relative"
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
          <h2 className="text-[2.2rem] font-semibold">Đặt sảnh</h2>
          <p className="text-gray-500 text-[1.4rem]">
            Điền đầy đủ thông tin để tạo booking mới.
          </p>
        </div>

        <div
          className="max-h-[50rem] overflow-auto pr-1"
          style={{ scrollbarWidth: "none" }}
        >
          <Form form={form} layout="vertical" requiredMark={false}>
            <div className="grid grid-cols-2 gap-x-5">
              <div className="col-span-2">
                <Form.Item
                  label={<span className={labelClass}>Khách hàng</span>}
                  name="customer_id"
                  rules={[
                    { required: true, message: "Vui lòng chọn khách hàng" },
                  ]}
                >
                  <Select
                    placeholder="Tìm theo tên hoặc số điện thoại..."
                    size="large"
                    showSearch
                    filterOption={(input, option) =>
                      option?.label?.toLowerCase().includes(input.toLowerCase())
                    }
                    options={customerOptions}
                    className="w-full"
                  />
                </Form.Item>
              </div>

              <Form.Item
                label={<span className={labelClass}>Sảnh</span>}
                name="hall_id"
                rules={[{ required: true, message: "Vui lòng chọn sảnh" }]}
              >
                <Select
                  placeholder="Chọn sảnh"
                  size="large"
                  options={hallOptions}
                  className="w-full"
                />
              </Form.Item>

              <Form.Item
                label={<span className={labelClass}>Loại sự kiện</span>}
                name="event_type"
                rules={[
                  { required: true, message: "Vui lòng chọn loại sự kiện" },
                ]}
              >
                <Select
                  placeholder="Chọn loại sự kiện"
                  size="large"
                  options={EVENT_TYPE_OPTIONS}
                  className="w-full"
                />
              </Form.Item>

              <Form.Item
                label={<span className={labelClass}>Ngày tổ chức</span>}
                name="event_date"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày tổ chức" },
                ]}
              >
                <DatePicker
                  placeholder="Chọn ngày"
                  size="large"
                  format="DD/MM/YYYY"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                  className="w-full rounded-md"
                />
              </Form.Item>

              <Form.Item
                label={<span className={labelClass}>Ca tiệc</span>}
                name="event_shift"
                rules={[{ required: true, message: "Vui lòng chọn ca tiệc" }]}
              >
                <Select
                  placeholder="Chọn ca"
                  size="large"
                  options={EVENT_SHIFT_OPTIONS}
                  className="w-full"
                  onChange={(val) => {
                    setSelectedShift(val);
                    form.setFieldValue("event_time", null);
                  }}
                />
              </Form.Item>

              <Form.Item
                label={<span className={labelClass}>Giờ bắt đầu</span>}
                name="event_time"
                rules={[
                  { required: true, message: "Vui lòng chọn giờ bắt đầu" },
                ]}
              >
                <TimePicker
                  placeholder={
                    selectedShift
                      ? `${SHIFT_TIME_RANGE[selectedShift].start}:00 - ${SHIFT_TIME_RANGE[selectedShift].end}:00`
                      : "Chọn ca trước"
                  }
                  size="large"
                  format="HH:mm"
                  minuteStep={15}
                  disabled={!selectedShift}
                  disabledTime={getDisabledTime}
                  hideDisabledOptions
                  className="w-full rounded-md"
                />
              </Form.Item>
              <Form.Item
                label={<span className={labelClass}>Số bàn</span>}
                name="so_ban"
                rules={[
                  { required: true, message: "Vui lòng nhập số bàn" },
                  { type: "number", min: 1, message: "Số bàn phải lớn hơn 0" },
                ]}
              >
                <InputNumber
                  placeholder="VD: 10"
                  min={1}
                  size="large"
                  className="w-full rounded-md"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <div className="col-span-2">
                <Form.Item
                  label={<span className={labelClass}>Ghi chú</span>}
                  name="notes"
                >
                  <Input.TextArea
                    placeholder="Yêu cầu đặc biệt, trang trí, thực đơn..."
                    rows={3}
                    className="rounded-md resize-none"
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button
            onClick={onClose}
            disabled={isPending}
            size="large"
            className="px-8 rounded-md border-gray-300 text-gray-700 hover:!border-gray-400"
          >
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={isPending}
            size="large"
            className="px-8 rounded-md bg-blue-500 hover:!bg-blue-600 border-none"
          >
            Xác nhận đặt sảnh
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default ActionBookingModal;
