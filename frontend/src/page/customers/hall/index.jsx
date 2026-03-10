import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faExpand,
  faAngleRight,
  faLocationDot,
  faChampagneGlasses,
} from "@fortawesome/free-solid-svg-icons";

const halls = [
  {
    id: 1,
    name: "Sảnh Ruby",
    subtitle: "Ruby Hall",
    capacity: "200 – 350 khách",
    area: "800 m²",
    floor: "Tầng 1",
    highlight: false,
    tag: "Tiêu chuẩn",
    tagColor: "#8a9bb0",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80",
      "https://images.unsplash.com/photo-1478146059778-26f2a88abaa4?w=400&q=80",
      "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=400&q=80",
    ],
    desc: "Không gian rộng rãi với hệ thống ánh sáng hiện đại, phù hợp cho các buổi tiệc cưới truyền thống và hiện đại.",
    features: [
      "Sân khấu 120m²",
      "Hệ thống âm thanh 5.1",
      "Điều hòa trung tâm",
      "Bãi đỗ xe 100 chỗ",
    ],
  },
  {
    id: 2,
    name: "Sảnh Sapphire",
    subtitle: "Sapphire Hall",
    capacity: "350 – 600 khách",
    area: "1.500 m²",
    floor: "Tầng 2",
    highlight: true,
    tag: "Phổ biến nhất",
    tagColor: "#e8a020",
    image:
      "https://dp1.diamondplace.vn/wp-content/uploads/2023/10/sapphire-3-1.webp",
    gallery: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80",
      "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=400&q=80",
    ],
    desc: "Sảnh tiệc cao cấp với thiết kế sang trọng, trần cao 8m, ánh đèn pha lê lộng lẫy, tạo nên không gian choáng ngợp và đẳng cấp.",
    features: [
      "Sân khấu 200m²",
      "Màn hình LED 4K",
      "Phòng tân lang tân nương",
      "Thang máy VIP",
    ],
  },
  {
    id: 3,
    name: "Sảnh Diamond",
    subtitle: "Diamond Hall",
    capacity: "600 – 1.000 khách",
    area: "2.800 m²",
    floor: "Tầng 3",
    highlight: false,
    tag: "Cao cấp nhất",
    tagColor: "#5b86a8",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=400&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80",
      "https://images.unsplash.com/photo-1478146059778-26f2a88abaa4?w=400&q=80",
    ],
    desc: "Kiệt tác kiến trúc với không gian tổ chức sự kiện quy mô lớn. Hệ thống kỹ thuật hiện đại bậc nhất, đáp ứng mọi yêu cầu khắt khe nhất.",
    features: [
      "2 sân khấu linh hoạt",
      "Hệ thống chiếu sáng thông minh",
      "Phòng VIP riêng biệt",
      "Bãi đỗ xe 300 chỗ",
    ],
  },
];

function HallCard({ hall, onSelect, selected }) {
  const isSelected = selected?.id === hall.id;

  return (
    <div
      className={`group bg-white rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer
        ${isSelected ? "shadow-2xl scale-[1.02] ring-2 ring-[#d0690e]" : "shadow-md hover:shadow-xl hover:-translate-y-1"}`}
      onClick={() => onSelect(isSelected ? null : hall)}
    >
      {/* Ảnh */}
      <div className="relative overflow-hidden h-[25rem]">
        <img
          src={hall.image}
          alt={hall.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Tag */}
        <span
          style={{ background: hall.tagColor }}
          className="absolute top-4 right-4 text-white text-[1.2rem] font-semibold px-4 py-1 rounded-full shadow"
        >
          {hall.tag}
        </span>
        {/* Tên sảnh overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <p className="text-[1.3rem] tracking-[0.2em] uppercase opacity-70">
            {hall.subtitle}
          </p>
          <h3 className="text-[2.2rem] font-bold">{hall.name}</h3>
        </div>
      </div>

      {/* Thông tin */}
      <div className="p-6">
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2 text-[1.3rem] text-gray-500">
            <FontAwesomeIcon icon={faUsers} className="text-[#d0690e]" />
            <span>{hall.capacity}</span>
          </div>
          <div className="flex items-center gap-2 text-[1.3rem] text-gray-500">
            <FontAwesomeIcon icon={faExpand} className="text-[#d0690e]" />
            <span>{hall.area}</span>
          </div>
          <div className="flex items-center gap-2 text-[1.3rem] text-gray-500">
            <FontAwesomeIcon icon={faLocationDot} className="text-[#d0690e]" />
            <span>{hall.floor}</span>
          </div>
        </div>
        <p className="text-[1.4rem] text-gray-500 leading-relaxed mb-4">
          {hall.desc}
        </p>

        <ul className="space-y-1 mb-5">
          {hall.features.map((f, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-[1.3rem] text-[#3a2a1a]"
            >
              <span className="text-[#d0690e]">✦</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <button
          style={{ borderColor: hall.tagColor, color: hall.tagColor }}
          className="w-full py-3 rounded-xl font-semibold text-[1.4rem] border-2 transition-all duration-300 hover:shadow-lg tracking-wide uppercase"
        >
          {isSelected ? "Đang xem" : "Xem chi tiết"}
        </button>
      </div>
    </div>
  );
}

function HallDetail({ hall, onClose }) {
  if (!hall) return null;
  return (
    <div className="mt-[4rem] bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100">
      <div className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
        <div>
          <p className="text-[1.3rem] tracking-[0.2em] text-[#d0690e] uppercase">
            {hall.subtitle}
          </p>
          <h3 className="text-[2.5rem] font-bold text-[#d0690e] uppercase">
            {hall.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-[1.4rem] text-gray-400 hover:text-[#d0690e] border border-gray-200 hover:border-[#d0690e] px-6 py-2 rounded-xl transition-all duration-200"
        >
          Đóng ✕
        </button>
      </div>

      <div className="flex gap-[4rem] p-10">
        {/* Gallery */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="rounded-2xl overflow-hidden h-[30rem]">
            <img
              src={hall.image}
              alt={hall.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {hall.gallery.map((img, i) => (
              <div key={i} className="rounded-xl overflow-hidden h-[10rem]">
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Chi tiết */}
        <div className="w-[40rem] flex flex-col justify-between">
          <div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { icon: faUsers, label: "Sức chứa", value: hall.capacity },
                { icon: faExpand, label: "Diện tích", value: hall.area },
                { icon: faLocationDot, label: "Vị trí", value: hall.floor },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-orange-50 rounded-2xl p-4 text-center"
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="text-[#d0690e] text-[2rem] mb-2"
                  />
                  <p className="text-[1.1rem] text-gray-400">{item.label}</p>
                  <p className="text-[1.4rem] font-bold text-[#3a2a1a]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-[1.5rem] text-gray-600 leading-relaxed mb-6">
              {hall.desc}
            </p>

            <p className="text-[1.4rem] font-semibold text-[#5a4a3a] uppercase tracking-widest mb-3">
              Tiện ích nổi bật
            </p>
            <ul className="space-y-2 mb-8">
              {hall.features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-[1.4rem] text-[#3a2a1a]"
                >
                  <span className="text-[#d0690e]">✦</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <button className="flex items-center justify-center gap-3 text-[1.5rem] bg-[#d0690e] text-white px-8 py-4 rounded-xl hover:bg-[#b85a0a] transition-all duration-300 font-semibold uppercase tracking-wide shadow-md">
            <FontAwesomeIcon icon={faChampagneGlasses} />
            <span>Đặt sảnh này</span>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
      </div>
    </div>
  );
}

function HallPage() {
  const [selectedHall, setSelectedHall] = useState(null);

  return (
    <>
      <Header isBg={true} />

      {/* ── HERO ── */}
      <div className="relative w-full h-[55rem] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=1600&q=80"
          alt="wedding hall hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center xl:px-[15rem] sm:px-[5rem] px-[2rem]  px-6">
          <h2 className="text-[2rem] tracking-wide uppercase opacity-80">
            không gian tổ chức tiệc
          </h2>
          <h1 className="text-[4.5rem] font-bold uppercase mt-2 leading-tight">
            sảnh tiệc cưới
          </h1>
          <div className="w-[6rem] h-[0.3rem] bg-[#d0690e] mx-auto mt-4 mb-6" />
          <p className="text-[1.6rem] opacity-80 max-w-[70rem] leading-relaxed">
            Ba không gian đẳng cấp — được thiết kế riêng để mỗi khoảnh khắc
            trong ngày cưới của bạn đều trở nên lộng lẫy và đáng nhớ.
          </p>
        </div>
      </div>

      <div className="xl:px-[15rem] sm:px-[5rem] px-[2rem]  px-6 w-full h-auto pb-[6rem]">
        {/* ── TIÊU ĐỀ SECTION ── */}
        <div className="text-center py-[5rem] border-b border-gray-100">
          <h2 className="text-[2rem] tracking-wide text-[#d0690e] uppercase">
            Lựa chọn không gian
          </h2>
          <h4 className="uppercase text-[3rem] font-bold text-[#d0690e]">
            các sảnh tiệc của chúng tôi
          </h4>
          <p className="text-[1.5rem] text-gray-500 mt-3 max-w-[60rem] mx-auto">
            Từ tiệc cưới nhỏ ấm cúng đến đại tiệc hoành tráng — chúng tôi có
            không gian phù hợp cho mọi quy mô và phong cách.
          </p>
        </div>

        {/* ── DANH SÁCH SẢNH ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-[4rem]">
          {halls.map((hall) => (
            <HallCard
              key={hall.id}
              hall={hall}
              selected={selectedHall}
              onSelect={setSelectedHall}
            />
          ))}
        </div>

        <HallDetail hall={selectedHall} onClose={() => setSelectedHall(null)} />
      </div>
      <Footer />
    </>
  );
}

export default HallPage;
