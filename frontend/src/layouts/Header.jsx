import React, { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <i className="fas fa-heart text-rose-500 text-2xl"></i>
            <span className="text-2xl font-serif text-gray-800">
              Our Wedding
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#home"
              className="text-gray-700 hover:text-rose-500 transition-colors duration-300 flex items-center space-x-2"
            >
              <i className="fas fa-home"></i>
              <span>Trang chủ</span>
            </a>
            <a
              href="#story"
              className="text-gray-700 hover:text-rose-500 transition-colors duration-300 flex items-center space-x-2"
            >
              <i className="fas fa-book-heart"></i>
              <span>Câu chuyện</span>
            </a>
            <a
              href="#gallery"
              className="text-gray-700 hover:text-rose-500 transition-colors duration-300 flex items-center space-x-2"
            >
              <i className="fas fa-images"></i>
              <span>Album ảnh</span>
            </a>
            <a
              href="#event"
              className="text-gray-700 hover:text-rose-500 transition-colors duration-300 flex items-center space-x-2"
            >
              <i className="fas fa-calendar-heart"></i>
              <span>Sự kiện</span>
            </a>
            <a
              href="#rsvp"
              className="bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600 transition-colors duration-300 flex items-center space-x-2"
            >
              <i className="fas fa-envelope-open-text"></i>
              <span>Xác nhận tham dự</span>
            </a>
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            <i
              className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"} text-2xl`}
            ></i>
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <a
                href="#home"
                className="text-gray-700 hover:text-rose-500 transition-colors duration-300 flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-home w-5"></i>
                <span>Trang chủ</span>
              </a>
              <a
                href="#story"
                className="text-gray-700 hover:text-rose-500 transition-colors duration-300 flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-book-heart w-5"></i>
                <span>Câu chuyện</span>
              </a>
              <a
                href="#gallery"
                className="text-gray-700 hover:text-rose-500 transition-colors duration-300 flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-images w-5"></i>
                <span>Album ảnh</span>
              </a>
              <a
                href="#event"
                className="text-gray-700 hover:text-rose-500 transition-colors duration-300 flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-calendar-heart w-5"></i>
                <span>Sự kiện</span>
              </a>
              <a
                href="#rsvp"
                className="bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600 transition-colors duration-300 flex items-center space-x-2 justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-envelope-open-text"></i>
                <span>Xác nhận tham dự</span>
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
