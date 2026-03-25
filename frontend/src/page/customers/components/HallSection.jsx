import { useQuery } from "@tanstack/react-query";
import { getAllHall } from "../../../apis/hall.api";
import { formatPrice } from "../../../utils/formatPrice";

function HallSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden shadow-md bg-white">
      <div
        className="w-full bg-gray-200 animate-pulse"
        style={{ height: 320 }}
      />

      <div className="p-6 space-y-4">
        <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />

        <div className="h-7 bg-gray-200 rounded animate-pulse w-3/4" />

        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-28" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
        </div>
      </div>
    </div>
  );
}

function HallsSection() {
  const { data: dataHall, isLoading } = useQuery({
    queryKey: ["halls"],
    queryFn: getAllHall,
  });

  const halls = dataHall?.data?.items ?? [];

  return (
    <section id="halls" className="py-24 px-6 bg-white">
      <div className="xl:px-[15rem] sm:px-[5rem] px-[2rem] mx-auto">
        <div className="reveal text-center mb-16">
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
          {isLoading ? (
            <HallSkeleton />
          ) : (
            halls.slice(0, 3).map((h, i) => {
              const priceHall = Number(h.price_per_table) + h.max_tables;
              return (
                <div
                  key={i}
                  className="reveal group relative overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={h.image_url}
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
                      {h.max_tables} bàn
                    </div>
                    <h3 className="text-white  font-bold mb-1">{h.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 ">{h.capacity} người</span>
                      <span className="text-amber-300  font-semibold">
                        {formatPrice(priceHall)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

export default HallsSection;
