import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import thai from "../../../assets/images/thai.jpg";
import phuc from "../../../assets/images/phuc.png";
import vi from "../../../assets/images/vi.png";
import {
  faHeart,
  faStar,
  faUsers,
  faAward,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";

const stats = [
  { icon: faHeart, value: "1.200+", label: "Đám cưới thành công" },
  { icon: faUsers, value: "50.000+", label: "Khách hài lòng" },
  { icon: faStar, value: "15+", label: "Năm kinh nghiệm" },
  { icon: faAward, value: "20+", label: "Giải thưởng uy tín" },
];

const team = [
  {
    name: "Lương Triều Vĩ",
    role: "Nhân viên phục vụ",
    image: vi,
    desc: "Với 15 năm kinh nghiệm phục vụ tại các đám cưới ngoài trời, và nay anh vào làm nhà hàng chúng tôi.",
  },
  {
    name: "Lưu Quốc Thái",
    role: "Nhân viên phụ nấu ăn",
    image: thai,
    desc: "Chuyên nhận nấu tiệc ma chay, nay có cơ hội được nhận vào nhà hàng chúng tôi làm việc.",
  },
  {
    name: "Nguyễn Thành Phúc",
    role: "Bồi bàn",
    image: phuc,
    desc: "Chuyên bưng nước cho các quán cafe, nay anh cũng được tôi tuyển vào đây làm.",
  },
];

const values = [
  {
    title: "Tận tâm",
    desc: "Mỗi buổi tiệc là một tác phẩm — chúng tôi chú trọng từng chi tiết nhỏ nhất để ngày của bạn trở nên hoàn hảo.",
    icon: "💛",
  },
  {
    title: "Chuyên nghiệp",
    desc: "Đội ngũ được đào tạo bài bản, quy trình chuẩn mực, đảm bảo mọi sự kiện diễn ra suôn sẻ.",
    icon: "🏆",
  },
  {
    title: "Sáng tạo",
    desc: "Không có hai đám cưới nào giống nhau — chúng tôi cá nhân hóa mọi trải nghiệm theo câu chuyện của bạn.",
    icon: "✨",
  },
];

function AboutPage() {
  return (
    <>
      <Header isBg={true} />

      <div className="relative w-full h-[60rem] overflow-hidden ">
        <img
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80"
          alt="wedding hall"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center xl:px-[15rem] sm:px-[5rem] px-[2rem]  px-6">
          <h2 className="text-[2rem] tracking-wide uppercase opacity-80">
            Câu chuyện của chúng tôi
          </h2>
          <h1 className="text-[4.5rem] font-bold uppercase mt-2 leading-tight">
            Về chúng tôi
          </h1>
          <div className="w-[6rem] h-[0.3rem] bg-[#d0690e] mx-auto mt-4 mb-6" />
          <p className="text-[1.6rem] opacity-80 max-w-[70rem] leading-relaxed">
            Hơn 15 năm đồng hành cùng hàng nghìn cặp đôi — chúng tôi không chỉ
            tổ chức tiệc cưới, chúng tôi tạo ra những kỷ niệm trọn đời.
          </p>
        </div>
      </div>

      <div className="xl:px-[15rem] sm:px-[5rem] px-[2rem]  px-6 w-full h-auto pb-[6rem]">
        {/* ── THỐNG KÊ ── */}
        <div className="grid md:grid-col-3 grid-cols-2 lg:grid-cols-4 gap-6 py-[5rem] border-b border-gray-100">
          {stats.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center bg-white rounded-2xl shadow-md px-6 py-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-[5rem] h-[5rem] rounded-full bg-orange-50 flex items-center justify-center mb-4">
                <FontAwesomeIcon
                  icon={s.icon}
                  className="text-[#d0690e] text-[2rem]"
                />
              </div>
              <span className="text-[3rem] font-bold text-[#d0690e]">
                {s.value}
              </span>
              <span className="text-[1.3rem] text-gray-500 mt-1">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── CÂU CHUYỆN ── */}
        <div className="grid grid-cols-1  md:flex items-center gap-[6rem] py-[5rem] border-b border-gray-100">
          <div className="flex-1">
            <h2 className="text-[2rem] tracking-wide text-[#d0690e] uppercase">
              Hành trình hình thành
            </h2>
            <h4 className="uppercase text-[3rem] font-bold text-[#d0690e] mt-1 leading-tight">
              15 năm — một chặng đường
            </h4>
            <div className="w-[5rem] h-[0.3rem] bg-[#d0690e] mt-4 mb-6" />
            <p className="text-[1.5rem] text-gray-600 leading-relaxed mb-4">
              Được thành lập năm 2009 tại Cần Thơ, nhà hàng tiệc cưới của chúng
              tôi bắt đầu từ một ước mơ giản dị: mang đến cho mỗi cặp đôi một
              ngày cưới thật sự ý nghĩa và trọn vẹn.
            </p>
            <p className="text-[1.5rem] text-gray-600 leading-relaxed mb-6">
              Qua từng năm tháng, chúng tôi không ngừng nâng cấp cơ sở vật chất,
              đào tạo đội ngũ và hoàn thiện dịch vụ — để xứng đáng với niềm tin
              mà hàng nghìn gia đình đã trao gửi.
            </p>
            <button className="flex items-center gap-3 text-[1.4rem] text-[#d0690e] border border-[#d0690e] px-8 py-3 rounded-xl hover:bg-[#d0690e] hover:text-white transition-all duration-300">
              <span>Liên hệ với chúng tôi</span>
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          </div>
          <div className="flex-1 relative h-[45rem]">
            <img
              src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80"
              alt="about"
              className="w-full h-full object-cover rounded-3xl shadow-xl"
            />
            <div className="absolute -bottom-4 -left-4 bg-[#d0690e] text-white px-8 py-5 rounded-2xl shadow-lg">
              <span className="text-[3rem] font-bold block">2009</span>
              <span className="text-[1.3rem] opacity-80">Năm thành lập</span>
            </div>
          </div>
        </div>

        {/* ── GIÁ TRỊ CỐT LÕI ── */}
        <div className="py-[5rem] border-b border-gray-100">
          <div className="text-center mb-[4rem]">
            <h2 className="text-[2rem] tracking-wide text-[#d0690e] uppercase">
              Điều chúng tôi tin tưởng
            </h2>
            <h4 className="uppercase text-[3rem] font-bold text-[#d0690e]">
              giá trị cốt lõi
            </h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-8 text-center"
              >
                <span className="text-[4rem]">{v.icon}</span>
                <h3 className="text-[2rem] font-bold text-[#d0690e] mt-4 mb-3 uppercase">
                  {v.title}
                </h3>
                <p className="text-[1.4rem] text-gray-500 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── ĐỘI NGŨ ── */}
        <div className="py-[5rem]">
          <div className="text-center mb-[4rem]">
            <h2 className="text-[2rem] tracking-wide text-[#d0690e] uppercase">
              Những con người tài năng
            </h2>
            <h4 className="uppercase text-[3rem] font-bold text-[#d0690e]">
              đội ngũ của chúng tôi
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden h-[28rem]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-[1.8rem] font-bold">{member.name}</h3>
                    <p className="text-[1.3rem] text-[#f0c070]">
                      {member.role}
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[1.4rem] text-gray-500 leading-relaxed">
                    {member.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AboutPage;
