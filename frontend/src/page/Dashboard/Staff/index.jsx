import { Input, Select, Typography } from "antd";
import { useTheme } from "../../../context/themeContext";
import { useState } from "react";
import ActionStaff from "./ActionStaff";
import { Link } from "react-router-dom";

const { Text } = Typography;

const MOCK_StaffS = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "trungkien@gmail.com",
    password: "123456",
    image: "https://i.pravatar.cc/150?img=1",
    phone: "0123456789",
    totalSpent: 5000000,
  },
  {
    id: 2,
    name: "Nguyễn Văn A",
    email: "trungkien@gmail.com",
    password: "123456",
    image: "https://i.pravatar.cc/150?img=1",
    phone: "0123456789",
    totalSpent: 5000000,
  },
  {
    id: 3,
    name: "Nguyễn Văn A",
    email: "trungkien@gmail.com",
    password: "123456",
    image: "https://i.pravatar.cc/150?img=1",
    phone: "0123456789",
    totalSpent: 5000000,
  },
  {
    id: 4,
    name: "Nguyễn Văn A",
    email: "trungkien@gmail.com",
    password: "123456",
    image: "https://i.pravatar.cc/150?img=1",
    phone: "0123456789",
    totalSpent: 5000000,
  },
];

function Staff() {
  const { t } = useTheme();
  const [query, setQuery] = useState({
    search: "",
    limit: 10,
    page: 1,
  });
  const [openAction, setOpenAction] = useState({
    open: false,
    action: "add",
    data: null,
  });

  const handleChangeInput = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  console.log(query);

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
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-md transition "
            onClick={() =>
              setOpenAction({
                open: true,
                action: "add",
                data: null,
              })
            }
          >
            Thêm nhân viên
          </button>
        </div>
      </div>
      <div className="w-full flex items-center">
        <Input
          placeholder="Tìm kiếm nhân viên..."
          style={{ height: 45, width: 400, border: `1px solid #ccc` }}
          name="search"
          onChange={handleChangeInput}
        />
        <Select
          placeholder="Tìm kiếm nhân viên..."
          style={{ height: 45, width: 400, border: `1px solid #ccc` }}
          name="search"
          onChange={handleChangeInput}
        />
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
            <th className="p-2 text-start">Tổng chi tiêu</th>
            <th className="p-2 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody style={{ color: t.text ?? "#1e293b" }}>
          {MOCK_StaffS.map((Staff) => (
            <tr
              key={Staff.id}
              style={{ borderBottom: `1px solid ${t.border}` }}
            >
              <td className="p-2">
                <img
                  src={Staff.image}
                  alt={Staff.name}
                  style={{ width: 50, height: 50, borderRadius: "5px" }}
                />
              </td>
              <td className="p-2">{Staff.name}</td>
              <td className="p-2">{Staff.email}</td>
              <td className="p-2">{Staff.phone}</td>
              <td className="p-2 text-start">
                {Staff.totalSpent.toLocaleString()}đ
              </td>
              <td
                className="p-2"
                style={{ display: "flex", justifyContent: "center", gap: 10 }}
              >
                <Link
                  to={`detail/${Staff.id}`}
                  style={{
                    color: "#fff",
                    background: "#4caf50",
                    textDecoration: "none",
                    display: "inline-block",
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
                    setOpenAction({
                      open: true,
                      action: "edit",
                      data: Staff,
                    })
                  }
                >
                  Sửa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ActionStaff
        open={openAction.open}
        action={openAction.action}
        data={openAction.data}
        onClose={() => setOpenAction({ open: false, action: "", data: null })}
      />
    </div>
  );
}

export default Staff;
