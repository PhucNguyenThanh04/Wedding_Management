import {
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import ConsultationModal from "./ConsultationModal";
import { AnimatePresence } from "framer-motion";

function ContactSection() {
  const [showConsultation, setShowConsultation] = useState(false);
  return (
    <section
      id="contact"
      className="relative py-32 px-6 text-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1800&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-black/62" />
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="w-8 h-px bg-amber-500" />
          <span className="text-amber-400  tracking-widest uppercase font-semibold">
            Liên hệ với chúng tôi
          </span>
          <span className="w-8 h-px bg-amber-500" />
        </div>
        <h2
          className="text-white font-bold leading-tight mb-4"
          style={{
            fontSize: "clamp(2rem,4vw,3.2rem)",
          }}
        >
          Sáng tạo nên{" "}
          <em className="text-amber-300 not-italic">kỹ niệm không thể quên?</em>
        </h2>
        <p className="text-white/50 text-base mb-10 font-light">
          Liên hệ ngay hôm nay để được tư vấn miễn phí và nhận ưu đãi đặc biệt.
        </p>
        <div className="flex flex-col flex-wrap items-center gap-4 justify-center mb-14">
          <button
            size="large"
            style={{
              background: "#d97706",
              border: "none",
              color: "#fff",
              borderRadius: 6,
              height: 50,
              paddingInline: 36,
              fontWeight: 600,
              fontSize: 15,
            }}
            onClick={() => setShowConsultation(true)}
          >
            Đặt lịch tư vấn miễn phí
          </button>
          <button className="px-8 h-12 rounded-md text-white/70 border border-white/30  hover:border-amber-400 hover:text-amber-300 transition-colors bg-transparent cursor-pointer">
            📞 035 7124 853
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-white/40">
          <div className="flex items-center gap-2">
            <EnvironmentOutlined className="text-amber-400" />
            đường số 5, khu dân cư Thạnh Mỹ, Q. Cái Răng, TP. Cần Thơ
          </div>
          <div className="flex items-center gap-2">
            <ClockCircleOutlined className="text-amber-400" />
            08:00 - 22:00 moi ngay
          </div>
          <div className="flex items-center gap-2">
            <PhoneOutlined className="text-amber-400" />
            028 3812 3456
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showConsultation && (
          <ConsultationModal onClose={() => setShowConsultation(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}

export default ContactSection;
