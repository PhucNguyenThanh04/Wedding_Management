import { Steps } from "antd";
import { useTheme } from "../../../context/themeContext";
import {
  ConfigProvider,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Card,
  Tag,
  Divider,
  Alert,
  Result,
  Empty,
  message,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  CheckCircleFilled,
  ArrowLeftOutlined,
  CrownOutlined,
  StarOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const MOCK_HALLS = [
  {
    id: 1,
    name: "Sảnh Hồng Ngọc",
    capacity: 50,
    price: 5000000,
    status: "active",
    icon: <HeartOutlined />,
    image:
      "https://mgs-storage.sgp1.digitaloceanspaces.com/gala/2022/06/1-2.jpg",
    color: "#f43f5e",
    booked: [],
    description: "Không gian lãng mạn, phù hợp tiệc nhỏ ấm cúng",
  },
  {
    id: 2,
    name: "Sảnh Bạch Kim",
    capacity: 80,
    price: 8000000,
    status: "active",
    icon: <StarOutlined />,
    image:
      "https://mgs-storage.sgp1.digitaloceanspaces.com/gala/2022/06/3-2.jpg",
    color: "#a78bfa",
    booked: ["2025-03-15", "2025-03-20"],
    description: "Sang trọng, hiện đại với hệ thống âm thanh ánh sáng cao cấp",
  },
  {
    id: 3,
    name: "Sảnh Kim Cương",
    capacity: 120,
    price: 12000000,
    status: "active",
    icon: <CrownOutlined />,
    image:
      "https://mgs-storage.sgp1.digitaloceanspaces.com/gala/2022/06/sanh-tiec-cuoi-theo-mua-thu.jpg",
    color: "#fbbf24",
    booked: [],
    description: "Đẳng cấp hoàng gia, trang trí dát vàng độc quyền",
  },
  {
    id: 4,
    name: "Sảnh Ngọc Trai",
    capacity: 60,
    price: 6500000,
    status: "active",
    icon: <StarOutlined />,
    image:
      "https://mgs-storage.sgp1.digitaloceanspaces.com/gala/2022/06/5-1.jpg",
    color: "#38bdf8",
    booked: ["2025-03-18"],
    description: "Nhẹ nhàng, tinh tế với tông màu ngọc trai dịu dàng",
  },
];

function ActionModal() {
  const { t } = useTheme();
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [selectedHall, setSelectedHall] = useState(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const navigate = useNavigate();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isDateBooked = (hallId, date) => {
    const hall = MOCK_HALLS.find((h) => h.id === hallId);
    return hall?.booked.includes(dayjs(date).format("YYYY-MM-DD"));
  };

  const handleNext = async () => {
    if (current === 0) {
      try {
        await form.validateFields([
          "brideName",
          "groomName",
          "phone",
          "guestCount",
          "weddingDate",
        ]);
        const formData = form.getFieldValue();
        sessionStorage.setItem("formData", JSON.stringify(formData));

        const weddingDate = form.getFieldValue("weddingDate");
        if (weddingDate && weddingDate < dayjs().startOf("day")) {
          message.error("Ngày tổ chức không thể trong quá khứ");
          return;
        }

        setCurrent(1);
      } catch (error) {
        console.log(error);
        message.error("Vui lòng điền đầy đủ và chính xác thông tin");
      }
    } else if (current === 1) {
      if (!selectedHall) {
        message.error("Vui lòng chọn sảnh tiệc");
        return;
      }

      const weddingDate = form.getFieldValue("weddingDate");

      if (weddingDate && isDateBooked(selectedHall.id, weddingDate)) {
        message.error(
          "Sảnh này đã được đặt vào ngày bạn chọn. Vui lòng chọn sảnh khác.",
        );
        setSelectedHall(null);
        return;
      }
      setCurrent(2);
    } else if (current === 2) {
      try {
        setCurrent(3);
        setBookingComplete(true);
        message.success("Đặt tiệc thành công!");
      } catch (error) {
        console.log(error);
        message.error("Có lỗi xảy ra. Vui lòng thử lại!");
      }
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleHallSelect = (hall) => {
    const weddingDate = form.getFieldValue("weddingDate");
    if (weddingDate && isDateBooked(hall.id, weddingDate)) {
      message.error("Sảnh này đã được đặt vào ngày bạn chọn");
      return;
    }
    setSelectedHall(hall);
  };

  const renderStepContent = () => {
    switch (current) {
      case 0:
        return (
          <div className="mt-8">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                guestCount: 50,
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-8">
                <Form.Item
                  name="full_name"
                  label="Họ tên người đặt"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập họ tên người đặt tiệc",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Nhập tên người đặt tiệc"
                    size="large"
                    style={{ height: 45 }}
                  />
                </Form.Item>

                <Form.Item
                  name="event_type"
                  label="Loại tiệc"
                  rules={[
                    { required: true, message: "Vui lòng nhập loại tiệc" },
                  ]}
                >
                  <Input
                    placeholder="Ví dụ: Tiệc cưới, tiệc sinh nhật..."
                    style={{ height: 45 }}
                  />
                </Form.Item>

                <Form.Item
                  name="event_shift"
                  label="Ca tiệc"
                  rules={[{ required: true, message: "Vui lòng nhập ca tiệc" }]}
                >
                  <Input
                    placeholder="Ví dụ: Sáng, chiều, tối..."
                    style={{ height: 45 }}
                  />
                </Form.Item>
                <Form.Item
                  name="event_time"
                  label="Giờ cụ thể"
                  rules={[
                    { required: true, message: "Vui lòng nhập giờ cụ thể" },
                  ]}
                >
                  <Input
                    placeholder="Ví dụ: 10:00, 18:00..."
                    style={{ height: 45 }}
                  />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined className="text-gray-400" />}
                    placeholder="090xxxxxxx"
                    size="large"
                    style={{ height: 45 }}
                  />
                </Form.Item>

                <Form.Item
                  name="guestCount"
                  label="Số lượng khách"
                  rules={[
                    { required: true, message: "Vui lòng nhập số lượng khách" },
                  ]}
                >
                  <InputNumber
                    min={10}
                    max={500}
                    className="w-full"
                    size="large"
                    placeholder="Nhập số lượng khách"
                    style={{ height: 45, width: "100%" }}
                  />
                </Form.Item>

                <Form.Item
                  name="weddingDate"
                  label="Ngày tổ chức"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày tổ chức" },
                  ]}
                >
                  <DatePicker
                    className="w-full"
                    size="large"
                    format="DD/MM/YYYY"
                    disabledDate={(current) => {
                      return current && current < dayjs().startOf("day");
                    }}
                    style={{ height: 45, width: "100%" }}
                    placeholder="Chọn ngày tổ chức"
                  />
                </Form.Item>
              </div>

              <Form.Item name="note" label="Ghi chú thêm">
                <TextArea
                  rows={3}
                  placeholder="Nhập yêu cầu đặc biệt nếu có..."
                />
              </Form.Item>
            </Form>
          </div>
        );

      case 1: {
        const weddingDate = form.getFieldValue("weddingDate");

        if (!weddingDate)
          return (
            <div className="text-center text-[1.6rem] text-blue-600">
              Vui lòng chọn ngày đặt tiệc để chúng tôi có thể chọn sảnh trống và
              phù hợp với bạn!
            </div>
          );

        return (
          <div className="mt-8">
            <Alert
              title="Chọn sảnh tiệc"
              description={
                weddingDate
                  ? `Ngày tổ chức: ${dayjs(weddingDate).format("DD/MM/YYYY")}`
                  : "Vui lòng chọn ngày tổ chức trước"
              }
              type="info"
              showIcon
              className="mb-6"
            />

            <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              {MOCK_HALLS.filter(
                (hall) => !isDateBooked(hall.id, weddingDate),
              ).map((hall) => {
                const isSelected = selectedHall?.id === hall.id;

                return (
                  <Card
                    key={hall.id}
                    hoverable
                    className={`flex flex-col h-full relative cursor-pointer transition-all duration-300 overflow-hidden`}
                    onClick={() => handleHallSelect(hall)}
                    bodyStyle={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      padding: 0,
                    }}
                  >
                    <img
                      src={hall.image}
                      alt={hall.name}
                      className="w-full h-[30rem] object-cover"
                    />

                    <div className="flex-1 p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                          style={{ backgroundColor: hall.color }}
                        >
                          {hall.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{hall.name}</h3>
                          <p className="text-gray-500 line-clamp-2">
                            {hall.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div>
                          <div className="text-gray-500">Sức chứa</div>
                          <div className="font-medium">
                            {hall.capacity} khách
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-500">Giá thuê</div>
                          <div className="font-bold text-blue-600">
                            {formatCurrency(hall.price)}
                          </div>
                        </div>
                      </div>

                      {hall.booked.length > 0 && (
                        <div className="mt-3 text-gray-400">
                          Đã đặt:{" "}
                          {hall.booked
                            .map((d) => dayjs(d).format("DD/MM"))
                            .join(", ")}
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <button
                        className={`w-full h-[4.2rem] ${isSelected ? "bg-green-600 hover:bg-green-500" : "bg-blue-600 hover:bg-blue-500"}  flex items-center justify-center text-white  transition-colors duration-300 rounded-xl cursor-pointer`}
                        onClick={() => {
                          setSelectedHall(hall);
                        }}
                      >
                        {isSelected ? "Đã chọn" : "Chọn sảnh"}
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>

            {MOCK_HALLS.length === 0 && (
              <Empty description="Không có sảnh nào phù hợp" />
            )}
          </div>
        );
      }

      case 2: {
        const formData = form.getFieldsValue();

        return (
          <div className="mt-8">
            <Alert
              message="Xác nhận thông tin"
              description="Vui lòng kiểm tra lại thông tin trước khi đặt tiệc"
              type="warning"
              showIcon
              className="mb-6"
            />

            <Card className="mb-6">
              <div className="space-y-4">
                <div>
                  <Title level={5}>Thông tin cơ bản</Title>
                  <Divider className="my-2" />
                  <div className="grid grid-cols-2 gap-3 ">
                    <div>
                      <span className="text-gray-500">Cô dâu:</span>
                      <span className="ml-2 font-medium">
                        {formData.brideName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Chú rể:</span>
                      <span className="ml-2 font-medium">
                        {formData.groomName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">SĐT:</span>
                      <span className="ml-2 font-medium">{formData.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Số khách:</span>
                      <span className="ml-2 font-medium">
                        {formData.guestCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Ngày cưới:</span>
                      <span className="ml-2 font-medium">
                        {dayjs(formData.weddingDate).format("DD/MM/YYYY")}
                      </span>
                    </div>
                    {formData.address && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Địa chỉ:</span>
                        <span className="ml-2 font-medium">
                          {formData.address}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedHall && (
                  <div>
                    <Title level={5}>Sảnh đã chọn</Title>
                    <Divider className="my-2" />
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: selectedHall.color }}
                      >
                        {selectedHall.icon}
                      </div>
                      <div>
                        <div className="font-semibold">{selectedHall.name}</div>
                        <div className=" text-gray-500">
                          {selectedHall.description}
                        </div>
                        <div className=" mt-1">
                          <Tag color="blue">
                            Sức chứa: {selectedHall.capacity} khách
                          </Tag>
                          <Tag color="green">
                            {formatCurrency(selectedHall.price)}
                          </Tag>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-gray-500">Tổng tiền</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedHall && formatCurrency(selectedHall.price)}
                  </div>
                </div>
                <CheckCircleFilled className="text-3xl text-green-500" />
              </div>
            </Card>
          </div>
        );
      }

      case 3: {
        return (
          <Result
            status="success"
            title="Đặt tiệc thành công!"
            subTitle={`Cảm ơn ${form.getFieldValue("brideName")} và ${form.getFieldValue("groomName")} đã tin tưởng sử dụng dịch vụ. Chúng tôi sẽ liên hệ trong thời gian sớm nhất.`}
            extra={[
              <Button
                type="primary"
                key="console"
                onClick={() => {
                  setCurrent(0);
                  setSelectedHall(null);
                  setBookingComplete(false);
                  form.resetFields();
                }}
              >
                Đặt tiệc mới
              </Button>,
            ]}
          />
        );
      }

      default:
        return null;
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#667eea",
          borderRadius: 8,
        },
      }}
    >
      <div
        style={{
          animation: "fadeUp .35s ease both",
          background: t.surface,
        }}
        className="relative p-6 md:p-8 rounded-lg min-h-screen"
      >
        <button
          className="absolute top-6 left-6 px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors duration-300"
          style={{ color: t.text }}
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Quay lại</span>
        </button>
        <div className="text-center mb-8">
          <Title level={2} style={{ color: "green", margin: 0 }}>
            Tạo lịch đặt tiệc cưới
          </Title>
          <p style={{ color: t.textMuted, marginTop: 8 }}>
            Chọn ngày, chọn sảnh — để chúng tôi tạo nên ngày trọng đại không thể
            quên.
          </p>
        </div>

        <Steps
          current={current}
          className="mb-8"
          style={{ width: "80%", margin: "50px auto" }}
          items={[
            {
              title: "Thông tin",
              icon: <UserOutlined />,
            },
            {
              title: "Chọn sảnh",
              icon: <StarOutlined />,
            },
            {
              title: "Xác nhận",
              icon: <CheckCircleFilled />,
            },
            {
              title: "Hoàn tất",
              icon: <CrownOutlined />,
            },
          ]}
        />

        <div className="mt-6">{renderStepContent()}</div>

        {current < 3 && (
          <div className="flex justify-between mt-8">
            <Button
              size="large"
              onClick={handlePrev}
              disabled={current === 0}
              icon={<ArrowLeftOutlined />}
            >
              Quay lại
            </Button>
            <button
              onClick={handleNext}
              disabled={bookingComplete}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl"
            >
              {current === 2 ? "Hoàn tất" : "Tiếp theo"}
            </button>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
}

export default ActionModal;
