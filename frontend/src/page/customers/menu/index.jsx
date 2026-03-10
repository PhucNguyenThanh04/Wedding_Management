import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import DishesModal from "../components/DishesModal";

const dishes = [
  {
    id: 1,
    name: "Gỏi tôm xoài",
    category: "Khai vị",
    price: 120000,
    image:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&q=80",
    desc: "Tôm tươi, xoài xanh, rau thơm, nước mắm chua ngọt",
  },
  {
    id: 2,
    name: "Súp hải sản",
    category: "Khai vị",
    price: 95000,
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80",
    desc: "Tôm, mực, cua, nấm hương, trứng cút",
  },
  {
    id: 3,
    name: "Bò bít tết sốt tiêu đen",
    category: "Món chính",
    price: 280000,
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80",
    desc: "Thăn bò Úc, sốt tiêu đen, khoai tây nghiền",
  },
  {
    id: 4,
    name: "Cá hồi nướng miso",
    category: "Món chính",
    price: 320000,
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
    desc: "Cá hồi Na Uy, sốt miso Nhật, rau củ nướng",
  },

  {
    id: 6,
    name: "Bánh panna cotta hoa hồng",
    category: "Tráng miệng",
    price: 75000,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",
    desc: "Panna cotta vanilla, sốt hoa hồng, dâu tây",
  },
  {
    id: 7,
    name: "Bánh mousse chocolate",
    category: "Tráng miệng",
    price: 85000,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
    desc: "Mousse chocolate đen 70%, lớp gương bóng",
  },
  {
    id: 8,
    name: "Nước ép trái cây tươi",
    category: "Đồ uống",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",
    desc: "Cam, dứa, dưa hấu, kiwi — theo mùa",
  },
  {
    id: 9,
    name: "Rượu vang đỏ Pháp",
    category: "Đồ uống",
    price: 350000,
    image:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80",
    desc: "Bordeaux, chai 750ml, phục vụ theo bàn",
  },
];

const packages = [
  {
    id: "pkg-silver",
    name: "Gói Bạc",
    subtitle: "Silver Package",
    price: 890000,
    unit: "/ khách",
    color: "#8a9bb0",
    gradient: "linear-gradient(135deg, #8a9bb0 0%, #c5cfd9 100%)",
    dishes: [1, 2, 5, 6, 8],
    note: "Tối thiểu 100 khách · Bao gồm setup bàn tiệc cơ bản",
    highlight: false,
  },
  {
    id: "pkg-gold",
    name: "Gói Vàng",
    subtitle: "Gold Package",
    price: 1390000,
    unit: "/ khách",
    color: "#e8a020",
    gradient: "linear-gradient(135deg, orange 0%, #f0d080 100%)",
    dishes: [1, 2, 3, 5, 6, 7, 8],
    note: "Tối thiểu 80 khách · Bao gồm hoa tươi trang trí bàn",
    highlight: true,
  },
  {
    id: "pkg-diamond",
    name: "Gói Kim Cương",
    subtitle: "Diamond Package",
    price: 1990000,
    unit: "/ khách",
    color: "#7ec8e3",
    gradient: "linear-gradient(135deg, #5b86a8 0%, #a8d5ea 100%)",
    dishes: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    note: "Tối thiểu 50 khách · Toàn bộ dịch vụ premium",
    highlight: false,
  },
];

function MenuPage() {
  const [current, setCurrent] = useState("package");
  const [openDishes, setOpenDishes] = useState(null);
  const formatPrice = (price) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  const openPkgDishes = openDishes
    ? dishes.filter((d) => openDishes.dishes.includes(d.id))
    : [];
  return (
    <>
      <Header isBg={true} />
      <div className="xl:px-[15rem] sm:px-[5rem] px-[2rem] w-full h-auto pt-[10rem] pb-[5rem]">
        <div className="text-center">
          <h2 className="text-[2rem] tracking-wide text-[#d0690e] uppercase text-center">
            Nhà hàng tiệc cưới
          </h2>
          <h4 className="uppercase text-[3rem] font-bold text-[#d0690e]">
            thực đơn & gói tiệc
          </h4>
          <p className="text-[#d0690e]">
            Tinh hoa ẩm thực được nhà hàng chọn lọc cho ngày trọng đại nhất của
            bạn!
          </p>
        </div>
        <div className="flex items-center gap-[1rem] justify-center py-10">
          <button
            className={`px-16 py-5 rounded-xl ${current === "package" ? "text-white bg-orange-400" : "text-orange-400 border border-orange-400 "}`}
            onClick={() => setCurrent("package")}
          >
            Gói tiệc
          </button>
          <button
            className={`px-16 py-5 rounded-xl ${current === "dishes" ? "text-white bg-orange-400" : "text-orange-400 border border-orange-400 "}`}
            onClick={() => setCurrent("dishes")}
          >
            Món ăn đơn lẻ
          </button>
        </div>

        {current === "package" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2rem]">
            {packages.map((pkg) => {
              const pkgDishes = dishes.filter((d) => pkg.dishes.includes(d.id));
              return (
                <div
                  key={pkg.id}
                  className={`relative h-full flex flex-col rounded-3xl overflow-hidden transition-all duration-500 shadow-lg`}
                >
                  <div
                    style={{ background: pkg.gradient }}
                    className="p-7 text-white relative w-full h-[15rem]"
                  >
                    <p className="text-[1.4rem] tracking-[0.25em] uppercase opacity-80 mb-1">
                      {pkg.subtitle}
                    </p>
                    <h3 className="text-[2rem] font-bold tracking-wide">
                      {pkg.name}
                    </h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-bold">
                        {formatPrice(pkg.price)}
                      </span>
                      <span className="opacity-70 text-[1.4rem]">
                        {pkg.unit}
                      </span>
                    </div>
                    <p className="mt-2 text-[1.4rem] opacity-70">{pkg.note}</p>
                  </div>

                  <div className="flex-1 w-full p-6 h-auto flex flex-col">
                    <p className="text-[#5a4a3a] text-[1.4rem] font-semibold mb-3 uppercase tracking-widest">
                      {pkgDishes.length} món bao gồm
                    </p>
                    <ul className="space-y-2 mb-4">
                      {pkgDishes.map((d) => (
                        <li
                          key={d.id}
                          className="flex items-center gap-2 text-[1.4rem] text-[#3a2a1a]"
                        >
                          <span style={{ color: pkg.color }}>✦</span>
                          <span className="font-medium">{d.name}</span>
                          <span className="text-[#aaa] ml-auto text-[1.4rem]">
                            {d.category}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div>
                      <button
                        className="flex items-center justify-between text-[1.2rem] hover:border-gray-500 cursor-pointer px-8 py-2 rounded-full border border-gray-300 transition-colors duration-300 mb-8"
                        onClick={() =>
                          setOpenDishes((prev) =>
                            prev?.id === pkg.id ? null : pkg,
                          )
                        }
                      >
                        <span>Xem món ăn</span>
                        <FontAwesomeIcon icon={faAngleRight} />
                      </button>
                    </div>

                    <button
                      style={{
                        background: pkg.highlight
                          ? pkg.gradient
                          : "transparent",
                        borderColor: pkg.color,
                        color: pkg.highlight ? "white" : pkg.color,
                      }}
                      className="w-full py-3 rounded-xl font-semibold text-[1.4rem] border-2 transition-all duration-300 hover:shadow-lg tracking-wide uppercase mt-auto"
                    >
                      Chọn gói này
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {dishes.map((dish) => {
              return (
                <div key={dish.id}>
                  <div className="h-[35rem] md:h-auto group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative overflow-hidden h-[22rem]">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 right-3 bg-white/90 text-[#d0690e] text-[1.1rem] font-semibold px-3 py-1 rounded-full shadow">
                        {dish.category}
                      </span>
                    </div>
                    <div className="p-5 flex-1">
                      <h3 className="text-[1.6rem] line-clamp-1 font-bold text-[#2c1810] mb-1">
                        {dish.name}
                      </h3>
                      <p className="text-[1.3rem] text-[#7a6a5a] leading-relaxed mb-1 line-clamp-2 min-h-[4rem]">
                        {dish.desc}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-[#d0690e] font-bold text-[1.6rem]">
                          {formatPrice(dish.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <DishesModal
          pkg={openDishes}
          pkgDishes={openPkgDishes}
          onClose={() => setOpenDishes(null)}
        />
      </div>
      <Footer />
    </>
  );
}

export default MenuPage;
