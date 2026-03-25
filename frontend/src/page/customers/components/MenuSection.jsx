import { CheckCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Tag } from "antd";
import { getMenus } from "../../../apis/menu.api";
import { formatPrice } from "../../../utils/formatPrice";

const MENUS = [
  {
    items: [
      "Salad rau củ trộn sốt mayonnaise",
      "Soup gà nấm hương",
      "Cá basa sốt chua ngọt",
      "Thịt heo quay da giòn",
      "Rau xào thập cẩm",
      "Tráng miệng trái cây theo mùa",
      "Nước ngọt + trà đá",
    ],
  },
  {
    items: [
      "Khai vị hải sản kiểu Thái",
      "Soup bào ngư nấm đông cô",
      "Tôm sú hấp nước dừa",
      "Bò lúc lắc tiêu đen",
      "Cá hồi áp chảo sốt teriyaki",
      "Rau củ hấp xốt bơ",
      "Chè đậu đen hạnh nhân",
      "Đồ uống cao cấp (bia + nước ngọt)",
    ],
  },
  {
    items: [
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
  },
];

function MenuSection() {
  const { data: menus = [], isLoading } = useQuery({
    queryKey: ["menus"],
    queryFn: getMenus,
  });

  if (isLoading) {
    return (
      <section id="menu" className="py-24 px-6 bg-stone-50">
        <div className="xl:px-[15rem] sm:px-[5rem] px-[2rem] mx-auto">
          <div className="text-center mb-16">
            <div className="h-10 w-96 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-[500px] bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-8 h-[520px] animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-24 px-6 bg-stone-50">
      <div className="xl:px-[15rem] sm:px-[5rem] px-[2rem] mx-auto">
        <div className="reveal text-center mb-16">
          <h2
            className="font-semibold"
            style={{
              fontSize: "2.8rem",
            }}
          >
            Gói tiệc <em className="text-amber-500 not-italic">phù hợp</em> mọi
            nhu cầu
          </h2>
          <p className="text-[1.4rem] text-gray-500">
            Giá tính trên mỗi bàn. Có thể tùy chỉnh thêm món theo yêu cầu của
            quý khách.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {menus.slice(0, 3).map((m, i) => {
            const items = MENUS.find((_, index) => index === i).items;
            return (
              <div
                key={i}
                className={`relative bg-white rounded-xl p-8 flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 border-amber-500`}
              >
                <h3 className="text-gray-900 text-[1.6rem] font-bold mb-1">
                  {m.name}
                </h3>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-amber-600">
                    {formatPrice(m.price)}
                  </span>
                  <span className="text-gray-400 text-[1.4rem]">/ bàn</span>
                </div>

                <p className="text-gray-400 text-[1.6rem] mb-5">
                  {m.min_guests} người
                </p>

                <ul className="flex flex-col gap-2.5 mb-8 flex-1 list-none p-0">
                  {items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-[1.4rem] text-gray-600"
                    >
                      <CheckCircleOutlined className="text-amber-500 flex-shrink-0 text-[1.6rem]" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Button type="primary" block size="large" href="#contact">
                  Chọn gói này
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default MenuSection;
