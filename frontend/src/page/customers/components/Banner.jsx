import { Button } from "antd";
import { ArrowDownOutlined } from "@ant-design/icons";

function Banner() {
  return (
    <section
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/15" />

      <div className="relative z-10 xl:px-[15rem] sm:px-[5rem] px-[2rem] mx-auto w-full pt-28 pb-20">
        {/* ↑ bỏ px-6 thừa */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-5 fade-1">
            <span className="w-8 h-px bg-amber-400" />
            <span className="text-amber-300 text-[1.2rem] tracking-widest uppercase font-medium">
              Nhà hàng tiệc cưới cao cấp
            </span>
          </div>
          <h1
            className="text-white font-bold leading-tight mb-6 fade-2"
            style={{ fontSize: "clamp(2.8rem,6vw,5rem)" }}
          >
            Nơi tình yêu trở thành{" "}
            <em className="text-amber-300 not-italic">kỷ niệm</em> vĩnh cửu
            {/* ↑ kỷ niệm */}
          </h1>
          <p className="text-white/65 text-[1.4rem] font-light leading-relaxed mb-10 max-w-xl fade-3">
            Hơn 15 năm đồng hành cùng hàng nghìn cặp đôi, WeddingKPVT mang đến
            không gian tiệc cưới hoàn hảo nhất tại Cái Răng, Cần Thơ.
            {/* ↑ Cái Răng, Cần Thơ */}
          </p>
          <div className="flex flex-wrap gap-4 fade-4">
            <Button
              size="large"
              href="#contact"
              style={{
                background: "#d97706",
                border: "none",
                color: "#fff",
                borderRadius: 6,
                height: 50,
                paddingInline: 32,
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              Đặt tiệc ngay
            </Button>
            <button
              className="px-8 py-3 rounded-md text-white/80 border border-white/30 font-medium hover:border-amber-400 hover:text-amber-300 transition-colors bg-transparent cursor-pointer"
              onClick={() =>
                document
                  .querySelector("#halls")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Xem sảnh tiệc
            </button>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 fade-5">
          {[
            ["15+", "Năm kinh nghiệm"],
            ["3.800+", "Tiệc cưới thành công"],
            ["3", "Sảnh tiệc cao cấp"], // ↑ Sảnh
            ["98%", "Khách hàng hài lòng"],
          ].map(([n, l], i) => (
            <div key={i}>
              <div
                className="text-amber-300 font-bold"
                style={{ fontSize: "2rem" }}
              >
                {n}
              </div>
              <div className="text-white/40 text-xs tracking-wider uppercase mt-1">
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/40 text-xs tracking-widest no-underline hover:text-amber-300 transition-colors fade-6"
      >
        <ArrowDownOutlined />
        <span>Khám phá</span>
      </a>
    </section>
  );
}

export default Banner;
