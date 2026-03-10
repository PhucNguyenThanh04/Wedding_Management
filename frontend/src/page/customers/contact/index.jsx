import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faLocationDot,
  faClock,
  faAngleRight,
  faChampagneGlasses,
} from "@fortawesome/free-solid-svg-icons";

const contacts = [
  {
    icon: faPhone,
    label: "Điện thoại",
    value: "035 7124 853",
    sub: "Gọi ngay để được tư vấn",
  },
  {
    icon: faEnvelope,
    label: "Email",
    value: "nguyentrungkien@gmail.com",
    sub: "Phản hồi trong vòng 24 giờ",
  },
  {
    icon: faLocationDot,
    label: "Địa chỉ",
    value: "đường số 5, khu dân cư Thạnh Mỹ",
    sub: "Q. Cái Răng, TP. Cần Thơ",
  },
  {
    icon: faClock,
    label: "Giờ làm việc",
    value: "06:00 – 11:59",
    sub: "Tất cả các ngày trong tuần",
  },
];

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    guests: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    setSent(true);
  };

  return (
    <>
      <Header isBg={true} />

      <div className="relative w-full h-[45rem] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1600&q=80"
          alt="contact hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center text-white text-center xl:px-[15rem] sm:px-[5rem] px-[2rem]">
          <h2 className="text-[2rem] tracking-wide uppercase opacity-80">
            Chúng tôi luôn sẵn sàng
          </h2>
          <h1 className="text-[4.5rem] font-bold uppercase mt-2 leading-tight">
            liên hệ với chúng tôi
          </h1>
          <div className="w-[6rem] h-[0.3rem] bg-[#d0690e] mx-auto mt-4 mb-6" />
          <p className="text-[1.6rem] opacity-80 max-w-[60rem] leading-relaxed">
            Để lại thông tin — đội ngũ tư vấn của chúng tôi sẽ liên hệ lại trong
            thời gian sớm nhất.
          </p>
        </div>
      </div>

      <div className="xl:px-[15rem] sm:px-[5rem] px-[2rem] w-full h-auto pb-[6rem]">
        <div className="grid grid-col-1 md:grid-col-3 lg:grid-cols-4 gap-6 py-[5rem] border-b border-gray-100">
          {contacts.map((c, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center bg-white rounded-2xl shadow-md px-6 py-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-[5rem] h-[5rem] rounded-full bg-orange-50 flex items-center justify-center mb-4">
                <FontAwesomeIcon
                  icon={c.icon}
                  className="text-[#d0690e] text-[2rem]"
                />
              </div>
              <p className="text-[1.2rem] text-gray-400 uppercase tracking-widest mb-1">
                {c.label}
              </p>
              <p className="text-[1.5rem] font-bold text-[#2c1810]">
                {c.value}
              </p>
              <p className="text-[1.3rem] text-gray-400 mt-1">{c.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[5rem] pt-[5rem]">
          <div className="flex-1">
            <h2 className="text-[2rem] tracking-wide text-[#d0690e] uppercase">
              Gửi yêu cầu tư vấn
            </h2>
            <h4 className="uppercase text-[3rem] font-bold text-[#d0690e] mt-1 mb-2">
              đặt lịch miễn phí
            </h4>
            <div className="w-[5rem] h-[0.3rem] bg-[#d0690e] mb-8" />

            {sent ? (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-10 text-center">
                <span className="text-[5rem]">🎉</span>
                <h3 className="text-[2rem] font-bold text-[#d0690e] mt-4 mb-2">
                  Gửi thành công!
                </h3>
                <p className="text-[1.5rem] text-gray-500">
                  Chúng tôi sẽ liên hệ lại với bạn trong vòng 24 giờ.
                </p>
                <button
                  onClick={() => {
                    setForm({
                      name: "",
                      phone: "",
                      email: "",
                      date: "",
                      guests: "",
                      message: "",
                    });
                    setSent(false);
                  }}
                  className="mt-6 text-[1.4rem] border border-[#d0690e] text-[#d0690e] px-8 py-3 rounded-xl hover:bg-[#d0690e] hover:text-white transition-all duration-300"
                >
                  Gửi yêu cầu khác
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="flex md:flex-row flex-col gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-[1.3rem] font-semibold text-[#5a4a3a] uppercase tracking-widest">
                      Họ và tên *
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      className="border border-gray-200 rounded-xl px-5 py-4 text-[1.4rem] outline-none focus:border-[#d0690e] transition-colors"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-[1.3rem] font-semibold text-[#5a4a3a] uppercase tracking-widest">
                      Số điện thoại *
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="0909 xxx xxx"
                      className="border border-gray-200 rounded-xl px-5 py-4 text-[1.4rem] outline-none focus:border-[#d0690e] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-[1.3rem] font-semibold text-[#5a4a3a] uppercase tracking-widest">
                      Email
                    </label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className="border border-gray-200 rounded-xl px-5 py-4 text-[1.4rem] outline-none focus:border-[#d0690e] transition-colors"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-[1.3rem] font-semibold text-[#5a4a3a] uppercase tracking-widest">
                      Ngày tổ chức
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className="border border-gray-200 rounded-xl px-5 py-4 text-[1.4rem] outline-none focus:border-[#d0690e] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[1.3rem] font-semibold text-[#5a4a3a] uppercase tracking-widest">
                    Số lượng khách dự kiến
                  </label>
                  <div className="flex gap-3">
                    {["Dưới 200", "200 – 350", "trên 350"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setForm((p) => ({ ...p, guests: opt }))}
                        className={`flex-1 py-3 rounded-xl text-[1.3rem] font-medium border-2 transition-all duration-200
                          ${
                            form.guests === opt
                              ? "bg-[#d0690e] text-white border-[#d0690e]"
                              : "bg-white text-[#5a4a3a] border-gray-200 hover:border-[#d0690e] hover:text-[#d0690e]"
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[1.3rem] font-semibold text-[#5a4a3a] uppercase tracking-widest">
                    Ghi chú thêm
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Yêu cầu đặc biệt, phong cách trang trí, thực đơn..."
                    className="border border-gray-200 rounded-xl px-5 py-4 text-[1.4rem] outline-none focus:border-[#d0690e] transition-colors resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="flex items-center justify-center gap-3 bg-[#d0690e] text-white text-[1.5rem] font-semibold py-4 rounded-xl hover:bg-[#b85a0a] transition-all duration-300 uppercase tracking-wide shadow-md"
                >
                  <FontAwesomeIcon icon={faChampagneGlasses} />
                  <span>Gửi yêu cầu tư vấn</span>
                  <FontAwesomeIcon icon={faAngleRight} />
                </button>
              </div>
            )}
          </div>

          <div className="w-auto flex flex-col gap-6">
            <div className="rounded-3xl overflow-hidden shadow-xl h-[40rem]">
              <iframe
                title="Bản đồ WeddingKPVT"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.6!2d105.7715!3d10.0183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zQ8OhaSBSxINuZywgQ-G6p24gVGjGoQ!5e0!3m2!1svi!2svn!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-md p-7">
              <h3 className="text-[1.6rem] font-bold text-[#d0690e] uppercase tracking-widest mb-4">
                Giờ hoạt động
              </h3>
              <ul className="space-y-3">
                {[
                  ["Thứ 2 – Thứ 6", "06:00 – 11:59"],
                  ["Thứ 7 – Chủ nhật", "07:00 – 23:00"],
                  ["Ngày lễ", "nghĩ"],
                ].map(([day, time]) => (
                  <li
                    key={day}
                    className="flex justify-between items-center text-[1.4rem]"
                  >
                    <span className="text-gray-500">{day}</span>
                    <span className="font-semibold text-[#2c1810]">{time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ContactPage;
