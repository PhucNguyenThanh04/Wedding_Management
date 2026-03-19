import { useState } from "react";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import {
  Form,
  InputNumber,
  Input,
  Button,
  Select,
  DatePicker,
  TimePicker,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAvailableHalls } from "../../../apis/hall.api";
import { createBooking } from "../../../apis/booking.api";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useAuth } from "../../../hooks/useAuth";

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

const labelClass = "text-[1.4rem] font-medium text-gray-700";

function BookingPage() {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedHall, setSelectedHall] = useState(null);
  const [searchParams, setSearchParams] = useState(null);

  const { data: availableHalls, isFetching: isSearching } = useQuery({
    queryKey: ["available-halls", searchParams],
    queryFn: () => getAvailableHalls(searchParams),
    enabled: !!searchParams,
    select: (res) => res?.data ?? [],
  });

  const { mutate: createB, isPending } = useMutation({
    mutationFn: (payload) => createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      toast.success("Đặt sảnh thành công!");
      form.resetFields();
      setSelectedShift(null);
      setSelectedHall(null);
      setSearchParams(null);
    },
    onError: (err) => {
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
        if (selectedHour === end)
          return Array.from({ length: 60 }, (_, i) => i);
        return [];
      },
    };
  };

  const resetSearch = () => {
    setSelectedHall(null);
    setSearchParams(null);
  };

  const handleSearch = async () => {
    try {
      const values = await form.validateFields([
        "event_date",
        "event_shift",
        "event_time",
        "event_type",
        "so_ban",
      ]);
      setSelectedHall(null);
      setSearchParams({
        event_date: dayjs(values.event_date).format("YYYY-MM-DD"),
        shift: values.event_shift,
        min_tables: values.so_ban,
      });
    } catch {
      // antd tự hiển thị lỗi validation
    }
  };

  const handleSubmit = async () => {
    if (!selectedHall) {
      toast.warning("Vui lòng chọn sảnh!");
      return;
    }
    try {
      const values = await form.validateFields();
      const payload = {
        customer_id: user.id,
        hall_id: selectedHall.id,
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
    }
  };

  const handleReset = () => {
    form.resetFields();
    setSelectedShift(null);
    setSelectedHall(null);
    setSearchParams(null);
  };

  return (
    <>
      <Header isBg={true} />

      <div className="h-auto bg-gray-100 pt-[10rem] pb-[5rem]">
        <div className="px-[15rem] space-y-6">
          <div className="bg-white p-10 rounded-md shadow">
            <div className="space-y-1 mb-8">
              <h2 className="text-[2.2rem] font-semibold">Đặt sảnh tiệc</h2>
              <p className="text-gray-500 text-[1.4rem]">
                Điền đầy đủ thông tin bên dưới để xem các sảnh còn trống.
              </p>
            </div>

            <Form form={form} layout="vertical" requiredMark={false}>
              <div className="grid grid-cols-3 gap-x-5">
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
                    onChange={resetSearch}
                  />
                </Form.Item>

                <Form.Item
                  label={<span className={labelClass}>Số bàn</span>}
                  name="so_ban"
                  rules={[
                    { required: true, message: "Vui lòng nhập số bàn" },
                    {
                      type: "number",
                      min: 1,
                      message: "Số bàn phải lớn hơn 0",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="VD: 10"
                    min={1}
                    size="large"
                    style={{ width: "100%" }}
                    className="rounded-md"
                    onChange={resetSearch}
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
                    onChange={resetSearch}
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
                      resetSearch();
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
                        ? `${SHIFT_TIME_RANGE[selectedShift].start}:00 – ${SHIFT_TIME_RANGE[selectedShift].end}:00`
                        : "Chọn ca trước"
                    }
                    size="large"
                    format="HH:mm"
                    minuteStep={15}
                    disabled={!selectedShift}
                    disabledTime={getDisabledTime}
                    hideDisabledOptions
                    className="w-full rounded-md"
                    onChange={resetSearch}
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

            <div className="flex justify-end gap-3">
              <Button
                onClick={handleReset}
                size="large"
                className="px-8 rounded-md border-gray-300 text-gray-700 hover:!border-gray-400"
              >
                Nhập lại
              </Button>
              <Button
                type="primary"
                size="large"
                loading={isSearching}
                onClick={handleSearch}
                className="px-8 rounded-md bg-blue-500 hover:!bg-blue-600 border-none"
              >
                Tìm sảnh trống
              </Button>
            </div>
          </div>

          {searchParams && (
            <div className="bg-white p-10 rounded-md shadow">
              <div className="space-y-1 mb-6">
                <h3 className="text-[1.8rem] font-semibold">Chọn sảnh</h3>
                <p className="text-gray-500 text-[1.4rem]">
                  {isSearching
                    ? "Đang tìm kiếm..."
                    : availableHalls?.length > 0
                      ? `Tìm thấy ${availableHalls.length} sảnh còn trống.`
                      : "Không có sảnh trống cho thời gian này."}
                </p>
              </div>

              {isSearching ? (
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-[10rem] rounded-md bg-gray-100 animate-pulse"
                    />
                  ))}
                </div>
              ) : availableHalls?.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-[1.4rem]">
                  Vui lòng thử chọn ngày hoặc ca khác.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {availableHalls.map((hall) => {
                      const isSelected = selectedHall?.id === hall.id;
                      return (
                        <button
                          key={hall.id}
                          type="button"
                          onClick={() => setSelectedHall(hall)}
                          className={`text-left p-5 rounded-md border-2 transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                          }`}
                        >
                          <div>
                            <img src={hall.image_url} alt="image hall" />
                            <div className="flex items-start justify-between">
                              <p className="text-[1.5rem] font-semibold text-gray-800">
                                {hall.name}
                              </p>
                              {isSelected && (
                                <span className="text-[1.2rem] text-blue-600 font-medium">
                                  ✓ Đã chọn
                                </span>
                              )}
                            </div>
                            {hall.capacity && (
                              <p className="text-[1.3rem] text-gray-500 mt-1">
                                Sức chứa: {hall.capacity} bàn
                              </p>
                            )}
                            {hall.description && (
                              <p className="text-[1.3rem] text-gray-400 mt-1 line-clamp-2">
                                {hall.description}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="primary"
                      size="large"
                      loading={isPending}
                      disabled={!selectedHall}
                      onClick={handleSubmit}
                      className="px-8 rounded-md bg-blue-500 hover:!bg-blue-600 border-none"
                    >
                      Xác nhận đặt sảnh
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default BookingPage;
