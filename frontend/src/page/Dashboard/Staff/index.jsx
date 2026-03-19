import { Input, Select, Typography, Skeleton } from "antd";
import { useTheme } from "../../../context/themeContext";
import { useState } from "react";
import ActionStaff from "./ActionStaff";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllStaff } from "../../../apis/staff.api";
import staff_male from "../../../assets/images/staff_male.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const { Text } = Typography;

function StaffSkeleton({ t }) {
  return Array.from({ length: 5 }).map((_, index) => (
    <tr key={index} style={{ borderBottom: `1px solid ${t.border}` }}>
      <td className="p-2">
        <Skeleton.Avatar active shape="square" size={50} />
      </td>
      <td className="p-2">
        <Skeleton active title={false} paragraph={{ rows: 1, width: 120 }} />
      </td>
      <td className="p-2">
        <Skeleton active title={false} paragraph={{ rows: 1, width: 160 }} />
      </td>
      <td className="p-2">
        <Skeleton active title={false} paragraph={{ rows: 1, width: 100 }} />
      </td>
      <td className="p-2">
        <Skeleton active title={false} paragraph={{ rows: 1, width: 80 }} />
      </td>
      <td className="p-2">
        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          <Skeleton.Button active size="small" style={{ width: 90 }} />
          <Skeleton.Button active size="small" style={{ width: 60 }} />
        </div>
      </td>
    </tr>
  ));
}

function Staff() {
  const { t } = useTheme();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(null);
  const [openAction, setOpenAction] = useState({
    open: false,
    action: "add",
    data: null,
  });
  const [openDelete, setOpenDelete] = useState(null);

  const { data: staffs = [], isLoading } = useQuery({
    queryKey: ["staffs"],
    queryFn: getAllStaff,
  });

  const handleDeleteStaff = () => {
    // gọi API delete ở đây
    console.log("Delete staff...");

    setOpenDelete(false);
  };

  const filteredStaffs = staffs.filter((staff) => {
    const matchSearch =
      search === "" ||
      staff.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      staff.email?.toLowerCase().includes(search.toLowerCase()) ||
      staff.phone?.includes(search);

    const matchRole = !roleFilter || staff.role === roleFilter;

    return matchSearch && matchRole;
  });

  return (
    <div
      style={{
        background: t.surface ?? "#f8fafc",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div className="flex items-center justify-between w-full">
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 600,
                color: t.text ?? "#1e293b",
                lineHeight: 1.2,
              }}
            >
              Quản lý nhân viên
            </h2>
            <Text type="secondary">Quản lý toàn bộ nhân viên của nhà hàng</Text>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-md transition"
            onClick={() =>
              setOpenAction({ open: true, action: "add", data: null })
            }
          >
            Thêm nhân viên
          </button>
        </div>
      </div>

      <div className="w-full flex items-center gap-5">
        <Input
          placeholder="Tìm kiếm nhân viên..."
          style={{ height: 45, width: 400, border: `1px solid #ccc` }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          placeholder="Lọc theo vai trò..."
          style={{ height: 45, width: 400 }}
          value={roleFilter}
          allowClear
          onChange={(value) => setRoleFilter(value)}
          options={[
            { label: "Nhân viên", value: "staff" },
            { label: "Quản trị viên", value: "admin" },
          ]}
        />
        <button className="px-8 h-[4.5rem] bg-blue-500 rounded-xl text-white hover:bg-blue-600">
          <FontAwesomeIcon icon={faFilter} />
          Lọc
        </button>
      </div>

      <table
        className="w-full border-collapse mt-10"
        style={{ border: `1px solid ${t.border}` }}
      >
        <thead
          style={{
            background: t.surface2,
            borderBottom: `1px solid ${t.border}`,
          }}
        >
          <tr style={{ color: t.text ?? "#1e293b" }}>
            <th className="p-2 text-start">Ảnh đại diện</th>
            <th className="p-2 text-start">Họ tên</th>
            <th className="p-2 text-start">Email</th>
            <th className="p-2 text-start">Số điện thoại</th>
            <th className="p-2 text-start">Trạng thái</th>
            <th className="p-2 text-start">Vị trí</th>
            <th className="p-2 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody style={{ color: t.text ?? "#1e293b" }}>
          {isLoading ? (
            <StaffSkeleton t={t} />
          ) : (
            filteredStaffs.map((staff) => (
              <tr
                key={staff.id}
                style={{ borderBottom: `1px solid ${t.border}` }}
              >
                <td className="p-2">
                  <img
                    src={staff_male}
                    alt={staff.name}
                    style={{ width: 50, height: 50, borderRadius: "5px" }}
                  />
                </td>
                <td className="p-2">{staff.full_name}</td>
                <td className="p-2">{staff.email}</td>
                <td className="p-2">{staff.phone}</td>
                <td className="p-2">
                  <span
                    className={`${staff.is_active ? "text-green-600 px-6 py-1 bg-green-50" : "text-red-600 px-6 py-1 bg-red-50"} rounded-full`}
                  >
                    {staff.is_active ? "Đang làm" : "Đã nghỉ"}
                  </span>
                </td>
                <td className="p-2">Nhân viên</td>
                <td
                  className="p-2"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Link
                    to={`detail/${staff.id}`}
                    style={{
                      color: "#fff",
                      background: "#4caf50",
                      textDecoration: "none",
                      display: "block",
                      textAlign: "center",
                      transition: "background .3s",
                      fontSize: 14,
                      padding: "6px 12px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Xem chi tiết
                  </Link>
                  <button
                    style={{
                      padding: "6px 12px",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    className="bg-amber-500 hover:bg-amber-600 transition"
                    onClick={() =>
                      setOpenAction({ open: true, action: "edit", data: staff })
                    }
                  >
                    Sửa
                  </button>
                  <button
                    style={{
                      padding: "6px 12px",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    className="bg-red-500 hover:bg-red-600 transition"
                    onClick={() => setOpenDelete(staff.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ActionStaff
        open={openAction.open}
        action={openAction.action}
        data={openAction.data}
        onClose={() => setOpenAction({ open: false, action: "", data: null })}
      />

      {openDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-[400px] p-6 animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Xác nhận xoá
            </h2>

            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xoá nhân viên này không? Hành động này không
              thể hoàn tác.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenDelete(false)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
              >
                Huỷ
              </button>

              <button
                onClick={() => handleDeleteStaff()}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Staff;
