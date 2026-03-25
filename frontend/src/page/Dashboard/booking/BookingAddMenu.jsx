import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, message, Spin, Tag } from "antd";
import { ArrowLeftOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { getBookingById } from "../../../apis/booking.api";
import { getMenus } from "../../../apis/menu.api";
import { addMenuBooking } from "../../../apis/booking.api";
import { formatPrice } from "../../../utils/formatPrice";
import dayjs from "dayjs";

const MENU_ITEMS = [
  // Gói Cơ bản
  [
    "Salad rau củ trộn sốt mayonnaise",
    "Soup gà nấm hương",
    "Cá basa sốt chua ngọt",
    "Thịt heo quay da giòn",
    "Rau xào thập cẩm",
    "Tráng miệng trái cây theo mùa",
    "Nước ngọt + trà đá",
  ],
  // Gói Tiêu chuẩn
  [
    "Khai vị hải sản kiểu Thái",
    "Soup bào ngư nấm đông cô",
    "Tôm sú hấp nước dừa",
    "Bò lúc lắc tiêu đen",
    "Cá hồi áp chảo sốt teriyaki",
    "Rau củ hấp xốt bơ",
    "Chè đậu đen hạnh nhân",
    "Đồ uống cao cấp (bia + nước ngọt)",
  ],
  // Gói Cao cấp
  [
    "Foie gras áp chảo sốt rượu vang",
    "Soup vi cá mập bào ngư",
    "Tôm hùm baby nướng phô mai",
    "Bò Wagyu sốt tiêu xanh",
    "Cá mú hấp Hong Kong",
    "Mì ý hải sản sốt kem",
    "Rau bina xào tỏi tây",
    "Tiramisu & bánh flan kem",
    "Rượu vang đỏ & trắng cao cấp",
  ],
];

function BookingAddMenu() {
  const { id } = useParams(); // booking id (order_id)
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedMenuIndex, setSelectedMenuIndex] = useState(null);

  // Lấy thông tin đơn đặt tiệc
  const { data: bookingData, isLoading: loadingBooking } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingById(id),
  });

  const booking = bookingData?.data;

  const { data: menus = [], isLoading: loadingMenus } = useQuery({
    queryKey: ["menus"],
    queryFn: getMenus,
  });
  console.log(booking);

  const addMenuMutation = useMutation({
    mutationFn: ({ menu_id, quantity = 1, notes = "" }) =>
      addMenuBooking({
        order_id: id,
        menu_id,
        quantity,
        notes,
      }),

    onSuccess: () => {
      message.success("Đã thêm menu vào đơn đặt tiệc thành công!");
      queryClient.invalidateQueries(["booking", id]);
      navigate(`/dashboard/booking-detail/${id}`);
    },
    onError: (error) => {
      console.error(error);
      message.error("Thêm menu thất bại. Vui lòng thử lại!");
    },
  });

  const handleAddMenu = () => {
    if (selectedMenuIndex === null) {
      message.warning("Vui lòng chọn một gói menu");
      return;
    }

    const selectedMenu = menus[selectedMenuIndex];
    if (!selectedMenu?.id) {
      message.error("Không tìm thấy thông tin menu");
      return;
    }

    addMenuMutation.mutate({
      menu_id: selectedMenu.id,
      quantity: booking?.so_ban || 1,
      notes: "", // bạn có thể thêm ô input ghi chú sau nếu cần
    });
  };

  if (loadingBooking || loadingMenus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-20 text-red-500 text-xl">
        Không tìm thấy đơn đặt tiệc
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="px-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(`/dashboard/booking-detail/${id}`)}
          >
            Quay lại chi tiết đơn
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Chọn gói menu cho đơn #{booking.id}
            </h1>
            <p className="text-gray-500 mt-1">
              {dayjs(booking.event_date).format("DD/MM/YYYY")} •{" "}
              {booking.event_shift} • {booking.so_ban} bàn
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {menus.slice(0, 3).map((menu, index) => {
            const isSelected = selectedMenuIndex === index;
            const items = MENU_ITEMS[index] || [];

            return (
              <div
                key={menu.id}
                onClick={() => setSelectedMenuIndex(index)}
                className={`bg-white rounded-2xl p-8 border-2 transition-all cursor-pointer hover:shadow-xl ${
                  isSelected
                    ? "border-amber-500 shadow-xl scale-[1.02]"
                    : "border-transparent hover:border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {menu.name}
                    </h3>
                    <p className="text-gray-500 mt-1">
                      {menu.min_guests} người/bàn
                    </p>
                  </div>
                  {isSelected && <Tag color="amber">Đã chọn</Tag>}
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-amber-600">
                    {formatPrice(menu.price)}
                  </span>
                  <span className="text-gray-400"> / bàn</span>
                </div>

                <ul className="space-y-3 mb-10 min-h-[280px]">
                  {items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <CheckCircleOutlined className="text-amber-500 text-xl flex-shrink-0 mt-0.5" />
                      <span className="text-[1.4rem]">{item}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  type={isSelected ? "primary" : "default"}
                  block
                  size="large"
                  className="h-12 text-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMenuIndex(index);
                  }}
                >
                  {isSelected ? "Đã chọn gói này" : "Chọn gói này"}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center gap-4">
          <Button
            size="large"
            onClick={() => navigate(`/dashboard/booking-detail/${id}`)}
            className="px-10"
          >
            Hủy
          </Button>

          <Button
            type="primary"
            size="large"
            loading={addMenuMutation.isPending}
            onClick={handleAddMenu}
            disabled={selectedMenuIndex === null}
            className="px-14 h-14 text-lg font-medium"
          >
            Áp dụng menu vào đơn
          </Button>
        </div>

        <p className="text-center text-gray-500 mt-6">
          Sau khi áp dụng, bạn có thể bổ sung món ăn thêm nếu cần
        </p>
      </div>
    </div>
  );
}

export default BookingAddMenu;
