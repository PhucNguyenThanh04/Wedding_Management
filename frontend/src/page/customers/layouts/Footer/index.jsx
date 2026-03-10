function Footer() {
  return (
    <footer className="bg-stone-950">
      <div className="xl:px-[15rem] sm:px-[5rem] px-[2rem] mx-auto py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-[1.4rem] leading-none">
              💍
            </div>
            <span className="text-amber-300 text-[2.2rem] font-bold">
              WeddingKPVT
            </span>
          </div>
          <p className="text-white/60 text-[1.4rem] leading-relaxed font-light max-w-xs">
            Nhà hàng tiệc cưới cao cấp tại Cái Răng, Cần Thơ. Hơn 15 năm đồng
            hành cùng hàng nghìn cặp đôi trên hành trình tình yêu.
          </p>
          <div className="flex gap-3 mt-6">
            {["F", "in", "YT"].map((s) => (
              <div
                key={s}
                className="w-14 h-14 rounded-full border border-white/60 flex items-center justify-center text-white/60 text-[1.4rem] hover:border-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-white text-[1.4rem] tracking-widest uppercase mb-5">
            Liên kết
          </div>
          <ul className="flex flex-col gap-3 list-none p-0">
            {["Giới thiệu", "Sảnh tiệc", "Thực đơn", "Dịch vụ", "Liên hệ"].map(
              (l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-white/60 text-[1.4rem] no-underline hover:text-amber-400 transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

        <div>
          <div className="text-white text-[1.4rem] tracking-widest uppercase mb-5">
            Liên hệ
          </div>
          <ul className="flex flex-col gap-3 list-none p-0 text-white/60 text-[1.4rem]">
            <li>📞 0292 3812 345</li>
            <li>✉️ info@weddingkpvt.vn</li>
            <li>
              📍 đường số 5, khu dân cư Thạnh Mỹ, Q. Cái Răng, TP. Cần Thơ
            </li>
            <li>🕐 08:00 – 22:00 mỗi ngày</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-5 xl:px-[15rem] sm:px-[5rem] px-[2rem]">
        <div className="mx-auto flex flex-wrap justify-between gap-2 text-[1.4rem] text-white">
          <span>© 2026 WeddingKPVT. Tất cả quyền được bảo lưu.</span>
          <div className="flex gap-4">
            <a
              href="#"
              className="no-underline text-white hover:text-amber-400 transition-colors"
            >
              Chính sách bảo mật
            </a>
            <a
              href="#"
              className="no-underline text-white hover:text-amber-400 transition-colors"
            >
              Điều khoản sử dụng
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
