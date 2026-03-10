import { useEffect, useRef, useState } from "react";
import { PhoneOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleRight,
  faArrowRightFromBracket,
  faBorderAll,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../../../hooks/useUser";
import thai from "../../../../assets/images/thai.jpg";

const NAV_LINKS = [
  { label: "Giới thiệu", href: "/about" },
  { label: "Sảnh tiệc", href: "/halls" },
  { label: "Thực đơn", href: "/menu" },
  { label: "Liên hệ", href: "/contact" },
];

function Header({ isBg }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const elementRef = useRef(null);
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isBg) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScrolled(true);
    } else {
      const fn = () => setScrolled(window.scrollY > 60);
      window.addEventListener("scroll", fn);
      return () => window.removeEventListener("scroll", fn);
    }
  }, [isBg]);

  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (elementRef.current && !elementRef.current.contains(e.target)) {
        setShowPersonalModal(false);
      }
    };

    document.addEventListener("click", handleClickOutSide);
    return () => {
      document.removeEventListener("click", handleClickOutSide);
    };
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur shadow-sm" : "bg-transparent"}`}
      >
        <div
          className="xl:px-[15rem] sm:px-[5rem] px-[2rem]  px-6 mx-auto flex items-center justify-between"
          style={{ height: 72 }}
        >
          <a href="/" className="flex items-center gap-2 no-underline">
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center  leading-none">
              💍
            </div>
            <span
              className={` font-bold transition-colors duration-300 ${scrolled ? "text-gray-900" : "text-white"}`}
            >
              WeddingKPVT
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={` no-underline transition-colors hover:text-amber-500 ${scrolled ? "text-gray-600" : "text-white/80"}`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:02838123456"
              className={`flex items-center gap-1.5  no-underline transition-colors hover:text-amber-400 ${scrolled ? "text-gray-500" : "text-white/70"}`}
            >
              <PhoneOutlined />
              <span>035 7124 853</span>
            </a>
            {user ? (
              <div
                className="relative flex items-center gap-2.5 text-gray-500 cursor-pointer bg-white border border-gray-300 p-1 rounded-full"
                ref={elementRef}
                onClick={() => setShowPersonalModal(true)}
              >
                <img
                  src={thai}
                  alt="Avatar"
                  className="w-[3rem] rounded-full"
                />
                <FontAwesomeIcon icon={faAngleDown} />

                {showPersonalModal && (
                  <div className="absolute top-[calc(100%+1rem)] right-0 w-[30rem] auto bg-white rounded-xl shadow-xl divide-y-1 divide-gray-200">
                    <div
                      className="rounded-tl-xl rounded-tr-xl p-6 p-6 flex items-center gap-4 hover:bg-gray-100 "
                      onClick={() => navigate("/orders")}
                    >
                      <FontAwesomeIcon icon={faBorderAll} />
                      Xem đơn đặt tiệc
                    </div>
                    <div
                      className="rounded-bl-xl rounded-br-xl p-6 flex items-center gap-4 hover:bg-gray-100 text-red-500"
                      onClick={handleLogout}
                    >
                      <FontAwesomeIcon icon={faArrowRightFromBracket} />
                      Đăng xuất
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={`/auth`}
                className="px-6 py-4 bg-red-500 text-white text-[1.4rem] rounded-xl hover:bg-red-600 transition-colors duration-300"
              >
                Đăng nhập
                <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden  bg-transparent border-none cursor-pointer transition-colors ${scrolled ? "text-gray-800" : "text-white"}`}
          >
            {open ? <CloseOutlined /> : <MenuOutlined />}
          </button>
        </div>
      </header>
      {open && (
        <div className=" md:hidden fixed inset-0 w-full h-full z-[9999] bg-[#33333366]">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-[80%] h-full bg-white border-t border-gray-100 px-6 py-5 flex flex-col gap-4 shadow-xl ml-auto "
          >
            <button
              className="absolute top-2 right-2 w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              onClick={() => setOpen(false)}
            >
              <FontAwesomeIcon icon={faClose} />
            </button>
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-gray-700  py-1 no-underline hover:text-amber-500 transition-colors"
              >
                {l.label}
              </a>
            ))}
            <Button
              type="primary"
              block
              style={{
                background: "#d97706",
                border: "none",
                padding: "20px 0",
              }}
            >
              Đặt tiệc ngay
            </Button>
          </motion.div>
        </div>
      )}
    </>
  );
}

export default Header;
