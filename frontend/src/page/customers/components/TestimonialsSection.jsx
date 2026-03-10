import useReveal from "../../../hooks/useReveal";
import { StarFilled } from "@ant-design/icons";

const TESTIMONIALS = [
  {
    name: "Minh Anh & Tuấn Kiệt",
    event: "Tiệc cưới - Sảnh Kim Cương",
    text: "Không gian tuyệt đẹp, dịch vụ chu đáo từng chi tiết. Đám cưới chúng tôi hoàn hảo hơn cả mơ.",
  },
  {
    name: "Thu Hà & Đức Thịnh",
    event: "Tiệc cưới - Sảnh Bạch Kim",
    text: "Đội ngũ nhân viên nhiệt tình và chuyên nghiệp. Thực đơn phong phú, khách mời ai cũng khen.",
  },
  {
    name: "Phương Linh & Hoàng Nam",
    event: "Tiệc cưới - Sảnh Hồng Ngọc",
    text: "Từ trang trí đến âm thanh đều hoàn hảo. Chúng tôi sẽ giới thiệu WeddingKPVT cho tất cả bạn bè.",
  },
];

function TestimonialCard({ item, index }) {
  const r = useReveal(index * 100);
  return (
    <div
      ref={r}
      className="reveal border border-gray-400 rounded-xl p-7 hover:border-amber-500/40 transition-colors duration-300"
    >
      <div className="flex gap-0.5 mb-4">
        {[...Array(5)].map((_, j) => (
          <StarFilled key={j} className="text-amber-400 text-[1.4rem]" />
        ))}
      </div>
      <p className="text-[1.4rem] leading-relaxed italic mb-6 font-light">
        "{item.text}"
      </p>
      <div>
        <div className="text-amber-300 text-[1.4rem] font-semibold">
          {item.name}
        </div>
        <div className="text-[1.2rem] mt-0.5">{item.event}</div>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const ref = useReveal();
  return (
    <section className="py-24 px-6">
      <div className="xl:px-[15rem] sm:px-[5rem] px-[2rem] mx-auto">
        <div ref={ref} className="reveal text-center mb-16">
          <h2 className="font-semibold" style={{ fontSize: "2.8rem" }}>
            Những cặp đôi{" "}
            <em className="text-amber-300 not-italic">hạnh phúc</em> nói gì
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, i) => (
            <TestimonialCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
