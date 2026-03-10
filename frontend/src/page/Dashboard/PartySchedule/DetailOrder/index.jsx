import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useTheme } from "../../../../context/themeContext";
import { STATUS } from "../EditStatusModal";
import { MOCK_BOOKINGS } from "..";
import { Button, Tag, Divider, Progress } from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DollarOutlined,
  CalendarOutlined,
  HomeOutlined,
  UserOutlined,
  PhoneOutlined,
  HeartOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import ActionModal from "../ActionModal";
import PaymentModal from "./PaymentModal";

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n) + "đ";

function SectionCard({ icon, title, children }) {
  const { t } = useTheme();
  return (
    <div
      style={{ background: t.surface }}
      className=" border border-[#e8dfd0] rounded-[18px] p-7 mb-5 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-stone-100">
        <span className="block w-1 h-5 rounded bg-gradient-to-b from-[#d4aa78] to-[#8a6a3a] shrink-0" />
        <span className=" leading-none">{icon}</span>
        <span className=" font-semibold">{title}</span>
      </div>
      {children}
    </div>
  );
}

function InfoTile({ icon, label, value }) {
  return (
    <div className="flex flex-col gap-1.5 border border-stone-200 rounded-[14px] px-4 py-3 hover:border-[#d4aa78] transition-colors duration-150">
      <span className="flex items-center gap-1.5 text-[1.4rem] tracking-[1.5px]">
        {icon} {label}
      </span>
      <span className=" font-semibold">{value}</span>
    </div>
  );
}

function DetailOrderPage() {
  const { t } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [actionModal, setActionModal] = useState({
    action: "create",
    dataUpdate: null,
  });
  const [paymentOpen, setPaymentOpen] = useState(false);
  const record = MOCK_BOOKINGS.find((b) => b.id === id);

  const paid = record.deposit;
  const remaining = record.total - paid;
  const paidPercent = Math.round((paid / record.total) * 100);

  if (!record) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <HeartOutlined className="text-5xl text-amber-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Không tìm thấy đơn đặt tiệc
          </h2>
          <p className="text-gray-400 mb-6">
            Mã đơn không tồn tại hoặc đã bị xóa.
          </p>
          <Button type="primary" size="large" onClick={() => navigate(-1)}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        animation: "fadeUp .35s ease both",
        background: t.surface,
        scrollbarWidth: "none",
      }}
      className="h-[calc(100vh-10rem)] overflow-auto"
    >
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-[2rem] py-[1rem] border-b border-[#e8dfd0]"
        style={{ background: t.surface }}
      >
        <div className="flex items-center gap-6">
          <Button
            size="middle"
            iconPlacement="start"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <div className="flex items-center gap-2.5">
            <span className="block w-1 h-5 rounded bg-gradient-to-b from-[#d4aa78] to-[#8a6a3a]" />
            <span
              className="font-semibold text-[20px] mb-1"
              style={{ color: t.text }}
            >
              Chi tiết đơn đặt tiệc
            </span>
          </div>
        </div>
        <Tag
          color={STATUS[record.status].antColor}
          style={{
            borderRadius: 20,
            fontSize: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            border: "1px solid #00da0b",
            color: "#00da0b",
            padding: "8px 20px",
            background: t.surface,
          }}
        >
          {STATUS[record.status].icon}
          {STATUS[record.status].label}
        </Tag>
      </div>

      <div className="px-6 py-9 md:px-8">
        <>
          <div className="relative overflow-hidden rounded-[18px] px-7 py-5 mb-6 flex items-center justify-between shadow-sm hover:shadow-md border border-stone-200 transition-shadow duration-200">
            <div>
              <p className="text-[11px] uppercase tracking-[2px] font-semibold mb-1 m-0">
                Mã đặt tiệc
              </p>
              <p className="font-mono text-2xl font-semibold text-[#d4aa78] tracking-widest m-0">
                {record.id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-white/40 uppercase tracking-[2px] font-semibold mb-1 m-0">
                Ngày đặt
              </p>
              <p className="text-[13px] font-medium text-white/60 m-0">
                {dayjs(record.createdAt ?? record.date).format(
                  "DD / MM / YYYY",
                )}
              </p>
            </div>
          </div>
          <SectionCard icon="💍" title="Thông tin cặp đôi">
            <div className="grid grid-cols-2 gap-3.5 mb-3.5">
              <div className=" border border-stone-200 rounded-[14px] px-5 py-8 hover:-translate-y-0.5 transition-transform duration-150 cursor-default">
                <p className="text-[1.4rem] tracking-[1.8px] mb-1.5 m-0">
                  ♂ Chú rể
                </p>
                <p className="font-mono text-[18px] font-semibold leading-tight m-0">
                  {record.groom}
                </p>
              </div>
              <div className=" border border-stone-200 rounded-[14px] px-5 py-8 hover:-translate-y-0.5 transition-transform duration-150 cursor-default">
                <p className="text-[1.4rem] tracking-[1.8px] mb-1.5 m-0">
                  ♀ Cô dâu
                </p>
                <p className="font-mono text-[18px] font-semibold leading-tight m-0">
                  {record.bride}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 border border-stone-200 rounded-[12px] px-4 py-3">
              <PhoneOutlined className="text-stone-400 shrink-0" />
              <span className="font-mono font-medium">{record.phone}</span>
            </div>
          </SectionCard>

          <div className="grid grid-cols-2 gap-5">
            <SectionCard icon="📅" title="Thông tin buổi tiệc">
              <div className="space-y-5 ">
                <InfoTile
                  icon={<CalendarOutlined />}
                  label="Ngày tiệc"
                  value={dayjs(record.date).format("DD / MM / YYYY")}
                />
                <InfoTile
                  icon={<HomeOutlined />}
                  label="Sảnh"
                  value={record.hall?.name ?? record.hall}
                />
                <InfoTile
                  icon={<UserOutlined />}
                  label="Số bàn"
                  value={`${record.tables} bàn`}
                />
                <InfoTile
                  icon={<span>🍽️</span>}
                  label="Thực đơn"
                  value={record.menu}
                />
              </div>
            </SectionCard>
            <SectionCard icon="💰" title="Thanh toán">
              <div>
                <div className="flex justify-between items-center py-2.5">
                  <span className=" text-stone-400">Tổng giá trị hợp đồng</span>
                  <span className="font-mono tabular-nums">
                    {fmt(record.total)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className=" text-stone-400">Đã đặt cọc</span>
                  <span className="font-mono text-green-500">{fmt(paid)}</span>
                </div>

                <Divider style={{ margin: "8px 0", borderColor: "#f0ece6" }} />

                <div className="flex justify-between items-center py-1.5">
                  <span className=" font-semibold">
                    Còn lại phải thanh toán
                  </span>
                  <span
                    className="font-mono text-2xl font-semibold tabular-nums"
                    style={{ color: remaining > 0 ? "#d4622a" : "#2db88a" }}
                  >
                    {fmt(remaining)}
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <Progress
                  percent={paidPercent}
                  showInfo={false}
                  strokeColor={{ "0%": "#5fff5c", "100%": "#03a800" }}
                  trailColor="#f0ece6"
                  strokeWidth={10}
                  strokeLinecap="round"
                />
                <div className="flex justify-between text-[1.2rem] text-stone-400 mt-1.5">
                  <span>
                    Đã thanh toán{" "}
                    <strong className="text-[#8a6a3a]">{paidPercent}%</strong>
                  </span>
                  <span>Còn {100 - paidPercent}%</span>
                </div>
              </div>
            </SectionCard>
          </div>

          {record.note && (
            <SectionCard icon="📝" title="Ghi chú">
              <div className="flex items-start gap-3 border border-amber-200 rounded-[14px] px-5 py-4  text-[#ff9d00] leading-relaxed">
                <span className="text-lg shrink-0 mt-0.5">📝</span>
                <span>{record.note}</span>
              </div>
            </SectionCard>
          )}

          <div className="flex justify-end gap-3 mt-7 flex-wrap">
            <Button
              size="large"
              icon={<FileDoneOutlined />}
              className="rounded-xl flex items-center"
              onClick={() => navigate(`/dashboard/contract/${record.id}`)}
            >
              Xem hợp đồng
            </Button>
            <Button
              size="large"
              icon={<EditOutlined />}
              className="rounded-xl flex items-center"
              onClick={() => {
                setActionModal({ action: "edit", dataUpdate: record });
                setModalOpen(true);
              }}
            >
              Chỉnh sửa thông tin
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<DollarOutlined />}
              className="rounded-xl flex items-center"
              onClick={() => setPaymentOpen(true)}
            >
              Thu tiền / Cập nhật thanh toán
            </Button>
          </div>
        </>
      </div>

      <ActionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        action={actionModal.action}
        dataEdit={actionModal.dataUpdate}
      />
      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        record={record}
      />
    </div>
  );
}

export default DetailOrderPage;
