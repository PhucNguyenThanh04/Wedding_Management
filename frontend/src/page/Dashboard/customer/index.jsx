import { Input, Typography, Skeleton } from "antd";
import { SearchOutlined, PhoneOutlined } from "@ant-design/icons";
import { useTheme } from "../../../context/themeContext";
import { useState } from "react";
import ActionCustomer from "./ActionCustomer";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllCustomer, getCustomerByPhone } from "../../../apis/customer.api";
import male from "../../../assets/images/staff_male.png";

const { Text } = Typography;

function CustomerSkeleton({ t }) {
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

function Customer() {
  const { t } = useTheme();
  const [searchText, setSearchText] = useState(""); // tìm theo tên/email
  const [searchPhone, setSearchPhone] = useState(""); // tìm theo SĐT
  const [openAction, setOpenAction] = useState({
    open: false,
    action: "add",
    data: null,
  });

  const { data: allCustomers = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ["customers"],
    queryFn: getAllCustomer,
    enabled: !searchPhone,
  });

  const { data: phoneResult, isLoading: isLoadingPhone } = useQuery({
    queryKey: ["customers", "phone", searchPhone],
    queryFn: () => getCustomerByPhone(searchPhone),
    enabled: searchPhone.length >= 8,
  });

  const isLoading = searchPhone ? isLoadingPhone : isLoadingAll;

  const displayCustomers = (() => {
    if (searchPhone) {
      if (searchPhone.length < 8) return [];
      return phoneResult ? [phoneResult] : [];
    }
    if (!searchText) return allCustomers;
    return allCustomers.filter(
      (c) =>
        c.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchText.toLowerCase()),
    );
  })();

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
              Quản Lý Khách Hàng
            </h2>
            <Text type="secondary">
              Quản lý toàn bộ khách hàng của nhà hàng
            </Text>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-md transition"
            onClick={() =>
              setOpenAction({ open: true, action: "add", data: null })
            }
          >
            Thêm khách hàng
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Tìm theo tên hoặc email..."
          style={{ height: 45, width: 360, border: `1px solid #ccc` }}
          prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
          value={searchText}
          disabled={!!searchPhone}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          onClear={() => setSearchText("")}
        />

        <Input
          placeholder="Tìm theo số điện thoại..."
          style={{ height: 45, width: 360, border: `1px solid #ccc` }}
          prefix={
            <PhoneOutlined
              style={{ color: searchPhone ? "#0ea5e9" : "#94a3b8" }}
            />
          }
          value={searchPhone}
          disabled={!!searchText}
          onChange={(e) => {
            // chỉ cho nhập số
            const val = e.target.value.replace(/\D/g, "");
            setSearchPhone(val);
          }}
          allowClear
          onClear={() => setSearchPhone("")}
          suffix={
            searchPhone &&
            searchPhone.length < 8 && (
              <span style={{ fontSize: 11, color: "#f59e0b" }}>
                còn {8 - searchPhone.length} số
              </span>
            )
          }
        />
      </div>

      <table
        className="w-full border-collapse mt-6"
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
            <th className="p-2 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody style={{ color: t.text ?? "#1e293b" }}>
          {isLoading ? (
            <CustomerSkeleton t={t} />
          ) : displayCustomers.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="text-center p-10"
                style={{ color: t.text }}
              >
                {searchPhone && searchPhone.length < 8
                  ? `Nhập ít nhất 8 số để tìm kiếm`
                  : "Không tìm thấy khách hàng phù hợp"}
              </td>
            </tr>
          ) : (
            displayCustomers.map((customer) => {
              console.log(customer);
              
              return (
                <tr
                  key={customer.id}
                  style={{ borderBottom: `1px solid ${t.border}` }}
                >
                  <td className="p-2">
                    <img
                      src={customer.image ?? male}
                      alt={customer.full_name}
                      style={{ width: 50, height: 50, borderRadius: "5px" }}
                    />
                  </td>
                  <td className="p-2">{customer.full_name}</td>
                  <td className="p-2">{customer.email}</td>
                  <td className="p-2">{customer.phone}</td>
                  {/* <td className="p-2 text-start">{customer.} 500.000.000đ</td> */}
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
                      to={`detail/${customer.id}`}
                      style={{
                        color: "#fff",
                        background: "#4caf50",
                        textDecoration: "none",
                        display: "inline-block",
                        textAlign: "center",
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
                          data: customer,
                        })
                      }
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <ActionCustomer
        open={openAction.open}
        action={openAction.action}
        data={openAction.data}
        onClose={() =>
          setOpenAction({ open: false, action: "add", data: null })
        }
      />
    </div>
  );
}

export default Customer;
