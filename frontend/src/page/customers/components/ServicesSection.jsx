import useReveal from "../../../hooks/useReveal";

const SERVICES = [
  {
    icon: "🏛️",
    title: "Không gian đẳng cấp",
    body: "Ba sảnh tiệc với thiết kế riêng biệt, từ ấm cúng đến hoành tráng, phù hợp mọi quy mô.",
  },
  {
    icon: "🍽️",
    title: "Thực đơn tinh tế",
    body: "Đội ngũ bếp trưởng 5 sao, hơn 50 món đặc sản, tùy chỉnh theo yêu cầu từng cặp đôi.",
  },
  {
    icon: "🎵",
    title: "Âm thanh & Ánh sáng",
    body: "Hệ thống âm thanh ánh sáng chuyên nghiệp, MC và ban nhạc sống theo yêu cầu.",
  },
  {
    icon: "💐",
    title: "Trang trí độc quyền",
    body: "Hàng ngàn mẫu thiết kế, phong cách từ cổ điển đến hiện đại, tùy chỉnh theo sở thích.",
  },
  {
    icon: "🚗",
    title: "Bãi đỗ xe rộng rãi",
    body: "Khuôn viên 5.000m2 với bãi đỗ xe miễn phí cho toàn bộ khách mời.",
  },
  {
    icon: "💍",
    title: "Tư vấn trọn gói",
    body: "Chuyên viên đồng hành từ khi lên kế hoạch đến kết thúc buổi tiệc hoàn hảo.",
  },
];
function ServiceCard({ s, index }) {
  const r = useReveal(index * 70);
  return (
    <div
      ref={r}
      className="bg-stone-50 rounded-xl p-7 hover:bg-amber-50 hover:shadow-md transition-all duration-300 border border-transparent hover:border-amber-200 cursor-default"
    >
      <div className="text-4xl mb-4">{s.icon}</div>
      <h4 className="text-gray-900 text-[1.6rem] font-semibold mb-2">
        {s.title}
      </h4>
      <p className="text-gray-400 text-[1.4rem] leading-relaxed font-light">
        {s.body}
      </p>
    </div>
  );
}

function ServicesSection() {
  const ref = useReveal();

  return (
    <section id="services" className="py-24 px-6 bg-white">
      <div className="xl:px-[15rem] sm:px-[5rem] px-[2rem] mx-auto">
        <div ref={ref} className="reveal text-center mb-16">
          <h2 className="font-semibold" style={{ fontSize: "2.8rem" }}>
            Mọi điều bạn cần cho{" "}
            <em className="text-amber-500 not-italic">ngày trọng đại</em>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <ServiceCard key={i} s={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
