import useReveal from "../../../hooks/useReveal";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Button, Tag } from "antd";

const MENUS = [
  {
    name: "Gói Bạc",
    price: "2.500.000đ",
    guests: "100+ khách",
    tag: "Phổ biến",
    tagColor: "blue",
    featured: false,
    items: ["Khai vị (3 món)", "Món chính (5 món)", "Tráng miệng", "Đồ uống"],
  },
  {
    name: "Gói Vàng",
    price: "3.500.000đ",
    guests: "150+ khách",
    tag: "Đề xuất",
    tagColor: "gold",
    featured: true,
    items: [
      "Khai vị (4 món)",
      "Món chính (7 món)",
      "Hải sản tươi",
      "Tráng miệng",
      "Đồ uống cao cấp",
    ],
  },
  {
    name: "Gói Kim Cương",
    price: "5.000.000đ",
    guests: "200+ khách",
    tag: "Cao cấp",
    tagColor: "purple",
    featured: false,
    items: [
      "Khai vị (5 món)",
      "Món chính (8 món)",
      "Hải sản nhập khẩu",
      "Tráng miệng",
      "Rượu vang VIP",
    ],
  },
];

function MenuSection() {
  const ref = useReveal();

  return (
    <section id="menu" className="py-24 px-6 bg-stone-50">
      <div className="xl:px-[15rem] sm:px-[5rem] px-[2rem] mx-auto">
        <div ref={ref} className="reveal text-center mb-16">
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
          {MENUS.map((m, i) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const r = useReveal(i * 100);

            return (
              <div
                key={i}
                ref={r}
                className={`relative bg-white rounded-xl p-8 flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 ${
                  m.featured ? "border-amber-500" : "border-stone-100"
                }`}
              >
                {m.featured && (
                  <div className="absolute -top-3 right-6">
                    <Tag color="gold" className="text-[1.6rem] font-bold px-3">
                      ĐỀ XUẤT
                    </Tag>
                  </div>
                )}

                <Tag
                  color={m.tagColor}
                  className="self-start mb-4 text-[1.6rem]"
                >
                  {m.tag}
                </Tag>

                <h3 className="text-gray-900 text-[1.6rem] font-bold mb-1">
                  {m.name}
                </h3>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-amber-600">
                    {m.price}
                  </span>
                  <span className="text-gray-400 text-[1.4rem]">/ bàn</span>
                </div>

                <p className="text-gray-400 text-[1.6rem] mb-5">{m.guests}</p>

                <ul className="flex flex-col gap-2.5 mb-8 flex-1 list-none p-0">
                  {m.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-[1.4rem] text-gray-600"
                    >
                      <CheckCircleOutlined className="text-amber-500 flex-shrink-0 text-[1.6rem]" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Button
                  type={m.featured ? "primary" : "default"}
                  block
                  size="large"
                  href="#contact"
                  style={
                    m.featured
                      ? {
                          background: "#d97706",
                          border: "none",
                          borderRadius: 8,
                          fontWeight: 600,
                        }
                      : { borderRadius: 8, fontWeight: 500 }
                  }
                >
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
