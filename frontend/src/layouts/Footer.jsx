const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-rose-600 to-pink-600 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <i className="fas fa-heart text-3xl"></i>
              <h3 className="text-2xl font-serif">Our Wedding</h3>
            </div>
            <p className="text-rose-100">
              Hành trình tình yêu của chúng tôi bắt đầu từ những điều giản dị
              nhất, và giờ đây chúng tôi sẵn sàng bước vào chương mới của cuộc
              đời.
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 flex items-center justify-center space-x-2">
              <i className="fas fa-link"></i>
              <span>Liên kết nhanh</span>
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#story"
                  className="text-rose-100 hover:text-white transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <i className="fas fa-chevron-right text-xs"></i>
                  <span>Câu chuyện của chúng tôi</span>
                </a>
              </li>
              <li>
                <a
                  href="#gallery"
                  className="text-rose-100 hover:text-white transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <i className="fas fa-chevron-right text-xs"></i>
                  <span>Album ảnh cưới</span>
                </a>
              </li>
              <li>
                <a
                  href="#event"
                  className="text-rose-100 hover:text-white transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <i className="fas fa-chevron-right text-xs"></i>
                  <span>Thông tin sự kiện</span>
                </a>
              </li>
              <li>
                <a
                  href="#rsvp"
                  className="text-rose-100 hover:text-white transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <i className="fas fa-chevron-right text-xs"></i>
                  <span>Xác nhận tham dự</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-right">
            <h3 className="text-xl font-semibold mb-4 flex items-center justify-center md:justify-end space-x-2">
              <i className="fas fa-address-book"></i>
              <span>Liên hệ</span>
            </h3>
            <div className="space-y-3 mb-4">
              <p className="flex items-center justify-center md:justify-end space-x-2 text-rose-100">
                <i className="fas fa-phone"></i>
                <span>+84 123 456 789</span>
              </p>
              <p className="flex items-center justify-center md:justify-end space-x-2 text-rose-100">
                <i className="fas fa-envelope"></i>
                <span>wedding@example.com</span>
              </p>
              <p className="flex items-center justify-center md:justify-end space-x-2 text-rose-100">
                <i className="fas fa-map-marker-alt"></i>
                <span>Hà Nội, Việt Nam</span>
              </p>
            </div>

            <div className="flex items-center justify-center md:justify-end space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300"
                aria-label="TikTok"
              >
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-rose-400 pt-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-rose-100 flex items-center justify-center space-x-2">
              <i className="fas fa-copyright"></i>
              <span>2026 Our Wedding. Made with</span>
              <i className="fas fa-heart text-red-300 animate-pulse"></i>
            </p>
            <div className="flex items-center space-x-6 text-rose-100">
              <a
                href="#"
                className="hover:text-white transition-colors duration-300"
              >
                Chính sách bảo mật
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-300"
              >
                Điều khoản sử dụng
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
