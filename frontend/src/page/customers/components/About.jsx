import { Button } from "antd";
import useReveal from "../../../hooks/useReveal.jsx";
import { CheckCircleOutlined } from "@ant-design/icons";

function AboutSection() {
  const ref = useReveal();
  return (
    <section id="about" className="grid md:grid-cols-2">
      <div className="relative overflow-hidden" style={{ minHeight: 420 }}>
        <img
          src="https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=900&q=80"
          alt="Nha hang"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          style={{ minHeight: 420 }}
        />
        <div className="absolute bottom-6 left-6 bg-amber-500 text-white text-[1.4rem] font-bold tracking-widest uppercase px-4 py-2">
          Thành lập 2009
        </div>
      </div>
      <div
        ref={ref}
        className="reveal flex flex-col justify-center px-12 py-16 bg-stone-50"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="w-6 h-px bg-amber-500" />
          <span className="text-amber-500 text-[1.4rem] tracking-widest uppercase font-semibold">
            Về chúng tôi
          </span>
        </div>
        <h2
          className="text-gray-900 font-bold leading-tight mb-4"
          style={{
            fontSize: "2.8rem",
          }}
        >
          Không gian tiệc cưới <em className="text-amber-600">đẳng cấp nhất</em>{" "}
          Cái Răng, Cần Thơ
        </h2>
        <div className="w-10 h-0.5 bg-amber-500 mb-5 rounded" />
        <p className="text-gray-500 text-[1.4rem] leading-relaxed font-light mb-4">
          WeddingKPVT tọa lạc tại trung tâm quận Cái Răng, TP. Cần Thơ với tổng
          diện tích hơn 8.000m², bao gồm 3 sảnh tiệc sang trọng có sức chứa từ
          200 đến 1.000 khách, cùng
        </p>
        <p className="text-gray-500 text-[1.4rem] leading-relaxed font-light mb-7">
          Với đội ngũ hơn 200 nhân viên chuyên nghiệp, từ bếp trưởng 5 sao đến
          đội ngũ trang trí, mọi chi tiết đều được chăm chút tỉ mỉ.
        </p>
        <div className="flex flex-col gap-3 mb-8">
          {[
            "Hơn 3.800 tiệc cưới thành công",
            "3 sảnh tiệc với thiết kế độc đáo",
            "Đội ngủ bếp trưởng 5 sao",
            "Dịch vụ trọn gói, tư vấn miễn phí",
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-[1.2rem] text-gray-600"
            >
              <CheckCircleOutlined className="text-amber-500 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
        <Button
          type="primary"
          size="large"
          href="#contact"
          style={{
            background: "#d97706",
            border: "none",
            borderRadius: 6,
            fontWeight: 600,
            alignSelf: "flex-start",
          }}
        >
          Tư vấn miễn phí
        </Button>
      </div>
    </section>
  );
}

export default AboutSection;
