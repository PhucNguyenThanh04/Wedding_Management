import useReveal from "../../../hooks/useReveal";
import SectionHeading from "./SectionHeading";

const HALLS = [
  {
    name: "Sanh Hong Ngoc",
    cap: "Toi da 200 khach",
    tables: "10-25 ban",
    price: "500.000d/ban",
    color: "#f43f5e",
    img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
  },
  {
    name: "Sanh Bach Kim",
    cap: "Toi da 320 khach",
    tables: "20-40 ban",
    price: "800.000d/ban",
    color: "#a78bfa",
    img: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800&q=80",
  },
  {
    name: "Sanh Kim Cuong",
    cap: "Toi da 480 khach",
    tables: "30-60 ban",
    price: "1.200.000d/ban",
    color: "#f59e0b",
    img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
  },
];

function HallsSection() {
  const ref = useReveal();
  return (
    <section id="halls" className="py-24 px-6 bg-white">
      <div className="xl:px-[15rem] sm:px-[5rem] px-[2rem] mx-auto">
        <div ref={ref} className="reveal text-center mb-16">
          <h2
            className="font-semibold"
            style={{
              fontSize: "2.8rem",
            }}
          >
            Ba sảnh tiệc <em className="text-amber-500 not-italic">độc đáo</em>
          </h2>
          <p className="text-[1.4rem] text-gray-500">
            Mỗi sảnh được thiết kế mang cá tính riêng biệt, phù hợp mọi quy mô
            và phong cách.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {HALLS.map((h, i) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const r = useReveal(i * 100);
            return (
              <div
                key={i}
                ref={r}
                className="reveal group relative overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={h.img}
                  alt={h.name}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ height: 320 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div
                    className=" font-bold tracking-widest uppercase mb-2 px-2.5 py-1 inline-block rounded-full text-white"
                    style={{ background: h.color }}
                  >
                    {h.tables}
                  </div>
                  <h3 className="text-white  font-bold mb-1">{h.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 ">{h.cap}</span>
                    <span className="text-amber-300  font-semibold">
                      {h.price}
                    </span>
                  </div>
                  <button className="mt-4 w-full py-2 rounded-lg  font-semibold text-white border border-white/30 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-transparent cursor-pointer hover:bg-white/10">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HallsSection;
