import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "../../../context/themeContext";
import { faAdd, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllHall, toggleHallAvailability } from "../../../apis/hall.api";
import { useState, useMemo } from "react";
import ActionHallModal from "./ActionHallModal";
import { toast } from "react-toastify";

const Stat = ({ halls }) => {
  const { t } = useTheme();
  const total = halls.length;
  const available = halls.filter((h) => h.is_available).length;
  const inUse = total - available;

  const formStat = [
    { id: 1, title: "Tổng sảnh", data: total, color: "text-blue-600" },
    {
      id: 2,
      title: "Còn trống hiện tại",
      data: available,
      color: "text-green-600",
    },
    { id: 3, title: "Đang hoạt động", data: inUse, color: "text-red-600" },
  ];

  return (
    <div className="grid grid-cols-3 gap-10">
      {formStat.map((stat) => (
        <div
          key={stat.id}
          className="p-4 border border-gray-300 rounded-md"
          style={{ background: t.surface }}
        >
          <h3 className="text-[1.6rem]">{stat.title}</h3>
          <p className={`text-[2.2rem] font-semibold ${stat.color}`}>
            {stat.data}
          </p>
        </div>
      ))}
    </div>
  );
};

function Hall() {
  const { t } = useTheme();
  const queryClient = useQueryClient();

  const { data: dataHall, isLoading } = useQuery({
    queryKey: ["halls"],
    queryFn: getAllHall,
  });
  const halls = dataHall?.data?.items ?? [];

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [openAction, setOpenAction] = useState({
    open: false,
    action: "add",
    dataUpdate: null,
  });

  const { mutate: toggleAvailability, isPending: isToggling } = useMutation({
    mutationFn: (hallId) => toggleHallAvailability(hallId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["halls"] });
      toast.success("Cập nhật trạng thái thành công!");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    },
  });

  const filteredHalls = useMemo(() => {
    return halls.filter((hall) => {
      const matchSearch = hall.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchStatus =
        filterStatus === "all"
          ? true
          : filterStatus === "active"
            ? hall.is_available
            : !hall.is_available;
      return matchSearch && matchStatus;
    });
  }, [halls, search, filterStatus]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <div
      className="p-10 rounded-md space-y-6"
      style={{ background: t.surface, minHeight: "100vh" }}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-[2.2rem] font-semibold">Quản lý Sảnh</h2>
          <p>Quản lý toàn bộ sảnh của nhà hàng.</p>
        </div>
        <div>
          <button
            type="button"
            onClick={() =>
              setOpenAction({ open: true, action: "add", dataUpdate: null })
            }
            className="flex items-center gap-2 justify-center px-8 py-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 rounded-md"
          >
            <FontAwesomeIcon icon={faAdd} />
            <p>Thêm sảnh mới</p>
          </button>
        </div>
      </div>

      <Stat halls={halls} />

      <div className="grid grid-cols-4 gap-5">
        <div className="relative col-span-1">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[4.5rem] rounded-md border border-gray-300 outline-none pl-10"
            placeholder="Nhập tên sảnh..."
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full h-[4.5rem] rounded-md border border-gray-300 outline-none pl-8 col-span-1"
        >
          <option value="all">Tất cả</option>
          <option value="active">Còn trống</option>
          <option value="inactive">Đang hoạt động</option>
        </select>
      </div>

      <table className="w-full h-auto text-gray-700 divide-y divide-gray-300 border border-gray-300">
        <thead>
          <tr className="text-gray-700 divide-x divide-gray-300 bg-gray-50">
            <th className="p-4 text-start">STT</th>
            <th className="p-4 text-center">Tên sảnh</th>
            <th className="p-4 text-center">Trạng thái</th>
            <th className="p-4 text-center">Vị trí</th>
            <th className="p-4 text-center">Sức chứa</th>
            <th className="p-4 text-center">Giá / Bàn</th>
            <th className="p-4 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {isLoading ? (
            <tr>
              <td colSpan={7} className="text-center py-8 text-gray-500">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : filteredHalls.length > 0 ? (
            filteredHalls.map((hall, index) => (
              <tr
                key={hall.id}
                className="text-gray-700 divide-x divide-gray-300 hover:bg-cyan-50 transition-colors"
              >
                <td className="p-4 text-start">{index + 1}</td>
                <td className="p-4 text-center font-medium">{hall.name}</td>
                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full ${
                      hall.is_available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {hall.is_available ? "Còn trống" : "Đang hoạt động"}
                  </span>
                </td>
                <td className="p-4 text-center">{hall.location}</td>
                <td className="p-4 text-center">{hall.capacity} người</td>
                <td className="p-4 text-center">
                  {formatPrice(hall.price_per_table)}
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() =>
                        setOpenAction({
                          open: true,
                          action: "edit",
                          dataUpdate: hall,
                        })
                      }
                      className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-md transition-colors "
                    >
                      Xem / Sửa
                    </button>
                    <button
                      onClick={() => toggleAvailability(hall.id)}
                      disabled={isToggling}
                      className={`px-4 py-2 text-white rounded-md transition-colors  ${
                        hall.is_available
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      {hall.is_available ? "Đặt bận" : "Mở trống"}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-8 text-gray-500">
                Không có sảnh nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {openAction.open && (
        <ActionHallModal
          onClose={() =>
            setOpenAction({ open: false, action: "add", dataUpdate: null })
          }
          action={openAction.action}
          dataUpdate={openAction.dataUpdate}
        />
      )}
    </div>
  );
}

export default Hall;
