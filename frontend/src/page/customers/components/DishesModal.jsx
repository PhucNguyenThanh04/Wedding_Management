import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function DishesModal({ pkg, pkgDishes, onClose }) {
  if (!pkg) return;
  return (
    <div className="w-full h-full fixed inset-0 flex items-center justify-center bg-[#3a3a3a61] z-[9999]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative w-[95%] md:w-[60rem] h-auto rounded-xl bg-white p-10"
      >
        <h3 className="uppercase text-[2rem] text-[#d0690e] pb-6">
          các món ăn của gói {pkg.name}
        </h3>
        <button
          className="absolute top-2 right-2 w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {pkgDishes.slice(0, 6).map((d) => (
            <div
              key={d.id}
              className="rounded-lg overflow-hidden aspect-square relative group"
            >
              <img
                src={d.image}
                alt={d.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[10px] text-center px-1 leading-tight">
                  {d.name}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end mt-10">
          <button
            className="px-8 py-4 rounded-md bg-gray-200 hover:bg-gray-300 "
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default DishesModal;
