import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useTheme } from "../../../context/themeContext";
import { Button, Divider, Tag } from "antd";
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { MOCK_BOOKINGS } from "../PartySchedule";
import { STATUS } from "../PartySchedule/EditStatusModal";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n) + "đ";

const MENU_LABEL = {
  silver: "Gói Bạc — 1.200.000đ/bàn",
  gold: "Gói Vàng — 1.800.000đ/bàn",
  platinum: "Gói Bạch Kim — 2.500.000đ/bàn",
  diamond: "Gói Kim Cương — 3.500.000đ/bàn",
};

function ContractPage() {
  const { t } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const contractRef = useRef();

  const record = MOCK_BOOKINGS.find((b) => b.id === id);

  const paid = record.deposit ?? 0;
  const remaining = record.total - paid;
  const depositPercent = Math.round((paid / record.total) * 100);
  const st = STATUS[record.status];
  const contractNo = `HD-${record.id}`;
  const signDate = dayjs(record.createdAt ?? record.date).format("DD/MM/YYYY");

  const exportPDF = async () => {
    const element = contractRef.current;
    const style = document.createElement("style");
    style.id = "html2canvas-fix";
    style.innerHTML = `
    *, *::before, *::after {
      color: inherit !important;
      border-color: #e5e7eb !important;
    }
  `;
    document.head.appendChild(style);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      onclone: (clonedDoc) => {
        const allEls = clonedDoc.querySelectorAll("*");
        allEls.forEach((el) => {
          const computed = window.getComputedStyle(el);
          ["color", "backgroundColor", "borderColor"].forEach((prop) => {
            const val = computed[prop];
            if (val && val.includes("oklch")) {
              el.style[prop] = "#000000";
            }
          });
        });
      },
    });

    document.getElementById("html2canvas-fix")?.remove();

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 295;

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Hop-dong-${contractNo}.pdf`);
  };

  if (!record) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Không tìm thấy hợp đồng.</p>
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
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
      className="rounded-lg h-[calc(100vh-10rem)] overflow-auto"
    >
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-[2rem] py-[1rem] border-b border-[#e8dfd0]"
        style={{ background: t.surface }}
      >
        <div className="flex items-center gap-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="rounded-[10px]"
          >
            Quay lại
          </Button>
          <div className="flex items-center gap-2.5">
            <span className="block w-1 h-5 rounded bg-gradient-to-b from-[#d4aa78] to-[#8a6a3a]" />
            <FileDoneOutlined className="text-[#8a6a3a]" />
            <span
              className="font-semibold text-[20px]"
              style={{ color: t.text }}
            >
              Hợp đồng đặt tiệc — {contractNo}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Tag
            color={st.antColor}
            className="flex items-center gap-1.5 px-4 py-1.5 font-semibold"
            style={{
              margin: 0,
              background: `${st.antColor}`,
              color: st.antColor,
              border: `1px solid ${st.antColor}`,
              padding: "5px 15px",
              borderRadius: "50rem",
            }}
          >
            {st.icon} {st.label}
          </Tag>
          <Button type="primary" icon={<PrinterOutlined />} onClick={exportPDF}>
            Xuất PDF
          </Button>
        </div>
      </div>

      <div className="py-10 px-4" style={{ background: t.surface }}>
        <div
          ref={contractRef}
          className="contract-paper rounded-2xl shadow-md border border-[#e8dfd0] max-w-[800px] mx-auto px-14 py-12"
        >
          <div className="text-center mb-12">
            <p className="text-[14px] font-semibold uppercase tracking-[3px] text-[#8a6a3a] mb-1">
              Nhà hàng tiệc cưới
            </p>
            <h1 className="text-[28px] font-semibold   leading-tight">
              TRUNG TÂM HỘI NGHỊ & TIỆC CƯỚI
            </h1>
            <p className="text-[14px]  mt-1 mb-0">
              đường trần chiên, khu dân cư Thạnh Mỹ, TP.Cần Thơ &nbsp;|&nbsp;
              0357 124 853
            </p>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-[#e8dfd0]" />
              <span className=" text-xl">✦</span>
              <div className="flex-1 h-px bg-[#e8dfd0]" />
            </div>

            <h2 className="text-[20px] font-semibold uppercase">
              Hợp đồng đặt tiệc cưới
            </h2>
            <p className="text-[14px]  mt-1 mb-0">
              Số hợp đồng: <strong className=" font-mono">{contractNo}</strong>
              &nbsp;—&nbsp; Ngày ký: <strong className="">{signDate}</strong>
            </p>
          </div>

          <section className="mb-5">
            <p className="font-semibold text-[14px]  mb-2 uppercase tracking-wider">
              Bên A — Nhà hàng (Bên cung cấp dịch vụ)
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[14px] ">
              <p className="">
                <span className="">Tên đơn vị:</span>{" "}
                <strong>Trung tâm Hội nghị & Tiệc cưới KPVT</strong>
              </p>
              <p className="">
                <span className="">Điện thoại:</span> 0357 124 853
              </p>
              <p className=" col-span-2">
                <span className="">Địa chỉ:</span> đường trần chiên, khu dân cư
                Thạnh Mỹ, TP.Cần Thơ
              </p>
              <p className="">
                <span className="">Người đại diện:</span> Ông Nguyễn Trung Kiên
              </p>
              <p className="">
                <span className="">Chức vụ:</span> Giám đốc
              </p>
            </div>
          </section>

          <Divider style={{ borderColor: "#ede8e0", margin: "16px 0" }} />

          <section className="mb-5">
            <p className="font-semibold text-[14px]  mb-2 uppercase tracking-wider">
              Bên B — Khách hàng (Bên sử dụng dịch vụ)
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[14px] ">
              <p className="">
                <span className="">Chú rể:</span>{" "}
                <strong>{record.groom}</strong>
              </p>
              <p className="">
                <span className="">Cô dâu:</span>{" "}
                <strong>{record.bride}</strong>
              </p>
              <p className="">
                <span className="">Số điện thoại:</span> {record.phone}
              </p>
            </div>
          </section>

          <Divider style={{ borderColor: "#ede8e0", margin: "16px 0" }} />

          <section className="mb-5">
            <p className="font-semibold text-[14px]  mb-3 uppercase tracking-wider">
              Điều 1 — Thông tin dịch vụ
            </p>
            <table className="w-full text-[14px] border-collapse">
              <tbody>
                {[
                  [
                    "Ngày tổ chức tiệc",
                    dayjs(record.date).format("DD/MM/YYYY"),
                  ],
                  ["Sảnh tổ chức", record.hall?.name ?? record.hall],
                  ["Số lượng bàn", `${record.tables} bàn`],
                  ["Gói thực đơn", MENU_LABEL[record.menu] ?? record.menu],
                ].map(([label, value]) => (
                  <tr key={label} className="border-b border-[#f0ece6]">
                    <td className="py-2 pr-4  w-[200px]">{label}</td>
                    <td className="py-2 font-semibold ">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {record.note && (
              <div className="mt-5 border border-amber-200 rounded-xl px-4 py-3 text-[14px] ">
                <strong>Yêu cầu đặc biệt:</strong> {record.note}
              </div>
            )}
          </section>

          <Divider style={{ borderColor: "#ede8e0", margin: "16px 0" }} />

          <section className="mb-5">
            <p className="font-semibold text-[14px]  mb-3 uppercase tracking-wider">
              Điều 2 — Giá trị hợp đồng & Thanh toán
            </p>
            <table className="w-full text-[14px] border-collapse">
              <tbody>
                {[
                  ["Tổng giá trị hợp đồng", fmt(record.total), ""],
                  [
                    `Tiền đặt cọc (${depositPercent}%)`,
                    fmt(paid),
                    "text-green-600",
                  ],
                  [
                    "Số tiền còn lại",
                    fmt(remaining),
                    remaining > 0 ? "text-orange-600" : "text-green-600",
                  ],
                ].map(([label, value, cls]) => (
                  <tr key={label} className="border-b border-[#f0ece6]">
                    <td className="py-2 pr-4  w-[200px]">{label}</td>
                    <td className={`py-2 font-mono ${cls}`}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[14px]  mt-3 ">
              Số tiền còn lại phải được thanh toán{" "}
              <strong>trước ngày tổ chức tiệc 3 ngày</strong>. Trường hợp hủy
              hợp đồng trong vòng 30 ngày trước ngày tiệc, tiền cọc sẽ không
              được hoàn trả.
            </p>
          </section>

          <Divider style={{ borderColor: "#ede8e0", margin: "16px 0" }} />

          <section className="mb-8">
            <p className="font-semibold text-[14px]  mb-2 uppercase tracking-wider">
              Điều 3 — Điều khoản chung
            </p>
            <ol className="text-[14px]  space-y-1.5 pl-4 ">
              <li>
                Hai bên cam kết thực hiện đúng các điều khoản đã thỏa thuận
                trong hợp đồng.
              </li>
              <li>
                Mọi thay đổi về ngày tiệc, sảnh hoặc số bàn phải được thông báo
                trước ít nhất <strong>15 ngày</strong>.
              </li>
              <li>
                Nhà hàng chịu trách nhiệm đảm bảo chất lượng dịch vụ như đã cam
                kết.
              </li>
              <li>
                Hợp đồng có hiệu lực kể từ ngày ký và chấm dứt sau khi buổi tiệc
                kết thúc và thanh toán đầy đủ.
              </li>
              <li>
                Mọi tranh chấp được giải quyết theo pháp luật hiện hành của nước
                Cộng hòa Xã hội Chủ nghĩa Việt Nam.
              </li>
            </ol>
          </section>

          <div className="grid grid-cols-2 gap-12 text-center text-[14px]">
            <div>
              <p className="font-semibold  uppercase tracking-wider mb-1 ">
                Đại diện Bên A
              </p>
              <p className=" mb-6 ">(Ký, ghi rõ họ tên)</p>
              <div className="sig-line mx-auto" />
              <p className="mt-20 font-semibold">Nguyễn Văn A</p>
              <p className=" ">Giám đốc</p>
            </div>
            <div>
              <p className="font-semibold  uppercase tracking-wider mb-1 ">
                Đại diện Bên B
              </p>
              <p className=" mb-6 ">(Ký, ghi rõ họ tên)</p>
              <div className="sig-line mx-auto" />
              <p className="mt-20 font-semibold  ">{record.groom}</p>
              <p className=" ">Khách hàng</p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 h-px bg-[#e8dfd0]" />
              <span className=" text-base tracking-[6px]">✦ ✦ ✦</span>
              <div className="flex-1 h-px bg-[#e8dfd0]" />
            </div>
            <p className="text-[12px] text-stone-500 ">
              Hợp đồng được lập thành 02 bản có giá trị pháp lý như nhau, mỗi
              bên giữ 01 bản.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractPage;
