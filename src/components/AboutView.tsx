import React from 'react';
import { 
  Info, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Users, 
  BookOpen, 
  GraduationCap, 
  HeartHandshake,
  Check,
  FileCheck,
  AlertTriangle
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const mandatoryRules = [
    { id: 1, title: 'Độc lập & Trọng tâm xác định', desc: 'Xác định rõ Vùng văn hoá Tây Nguyên, cộng đồng người Ê Đê và địa bàn nghiên cứu tỉnh Đắk Lắk (khảo sát dự kiến: Xã Cư M\'gar).' },
    { id: 2, title: 'Vận hành công khai', desc: 'Sản phẩm chạy trực tuyến ổn định trên đường dẫn Cloud Run công khai phục vụ nghiệm thu.' },
    { id: 3, title: 'Nguồn tư liệu xác thực', desc: 'Mọi thông tin đều gắn với nguồn xuất bản, quyết định công bố của Bộ VHTTDL hoặc biên bản điền dã; không đưa tin không căn cứ.' },
    { id: 4, title: 'Chuẩn hoá tên gọi & địa danh', desc: 'Phân định rõ vùng văn hoá Tây Nguyên, dân tộc Ê Đê, địa bàn hành chính Đắk Lắk, xã Cư M\'gar và từng buôn làng.' },
    { id: 5, title: 'Tôn trọng sự đồng thuận nghệ nhân', desc: 'Tư liệu nghệ nhân chỉ công khai khi có sự đồng ý; bảo lưu quyền giấu tên theo ý nguyện.' },
    { id: 6, title: 'Trung thực khoa học', desc: 'Không tự suy đoán hoặc bịa thông tin; thiếu tư liệu ghi rõ là "Chưa có tư liệu xác thực" hoặc "Đang xác minh địa bàn".' },
    { id: 7, title: 'Không đánh đồng văn hoá', desc: 'Không gán ghép thông tin di sản của dân tộc này hoặc vùng này sang dân tộc / vùng văn hoá khác.' },
    { id: 8, title: 'Không tự ý chế tác ảnh tâm linh', desc: 'Tuyệt đối không dùng hình ảnh giả tạo, phóng đại nghi lễ hay trang phục của di sản có thật.' },
    { id: 9, title: 'Bảo mật thông tin cá nhân', desc: 'Bảo vệ dữ liệu riêng tư của người cung cấp tư liệu và người nắm giữ di sản.' },
    { id: 10, title: 'Bảo mật API Key máy chủ', desc: 'Tích hợp Gemini AI hoàn toàn qua backend Node/Express server.ts, không để lộ key trên client.' },
    { id: 11, title: 'Trải nghiệm đa thiết bị tối ưu', desc: 'Giao diện tải nhanh, chữ dễ đọc, không bị lỗi font hay giãn khoảng cách ký tự tiếng Việt.' },
    { id: 12, title: 'Kỷ luật báo cáo tiến độ', desc: 'Báo cáo tiến độ đầy đủ theo từng ngày cho Trưởng nhóm và Phó nhóm theo quy chế thực tập.' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in">
      {/* Header section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
          <Info className="w-3.5 h-3.5 text-amber-700" />
          <span>Màn hình 8 • Giới thiệu đề tài J02 & Hồ sơ thực tập sinh</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#3B281B]">
          Bản đồ di sản phi vật thể Tây Nguyên
        </h1>
        <p className="text-sm sm:text-base text-[#6C5B4E] leading-relaxed">
          Đề tài nghiên cứu và phát triển nền tảng số hoá, lưu trữ khoa học và kết nối dữ liệu di sản văn hoá phi vật thể Việt Nam — Trọng tâm <strong>Vùng văn hoá Tây Nguyên</strong> và cộng đồng <strong>Người Ê Đê tại tỉnh Đắk Lắk</strong>.
        </p>

        {/* Student Internship Credentials Card */}
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-[#FAF7F2] to-[#F3ECE0] border-2 border-[#D5C6AF] shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#992E20] text-amber-100 flex items-center justify-center font-serif font-bold text-xl shadow-md shadow-[#992E20]/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-[#992E20]">
                Hồ sơ tác giả thực hiện
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2C1D13]">
                Nguyễn Văn An
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-2 border-t border-[#E0D2BC]">
            <div className="p-3 bg-white/80 rounded-xl border border-[#DECDB5]">
              <span className="text-[#7A695B] block text-[11px]">Mã sinh viên:</span>
              <span className="font-bold text-[#2C1D13] text-sm">PH70154</span>
            </div>
            <div className="p-3 bg-white/80 rounded-xl border border-[#DECDB5]">
              <span className="text-[#7A695B] block text-[11px]">Mã đề tài:</span>
              <span className="font-bold text-[#2C1D13] text-sm text-[#992E20]">J02</span>
            </div>
            <div className="p-3 bg-white/80 rounded-xl border border-[#DECDB5]">
              <span className="text-[#7A695B] block text-[11px]">Nhóm thực tập:</span>
              <span className="font-bold text-[#2C1D13] text-sm text-[#B33927]">Nhóm 1 Đợt 15</span>
            </div>
            <div className="p-3 bg-white/80 rounded-xl border border-[#DECDB5]">
              <span className="text-[#7A695B] block text-[11px]">Chương trình thực tập:</span>
              <span className="font-bold text-[#2C1D13] text-xs">FPT Polytechnic & IMTA TECH</span>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2 font-medium">
            <HeartHandshake className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Sản phẩm thực tập thuộc Chương trình Thực tập sinh Đợt 15 FPT Polytechnic và IMTA TECH, dự án xã hội phi lợi nhuận.
            </span>
          </div>
        </div>
      </div>

      {/* Research Scope & Cultural Subject Details */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-6">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#3B281B] flex items-center gap-2">
          <MapPin className="w-6 h-6 text-[#B33927]" />
          Phạm vi Nghiên cứu Chính thức Đề tài J02
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-[#4A3B32] leading-relaxed">
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-base text-[#2C1D13] border-b border-[#F0E8D9] pb-1.5">
              1. Vùng văn hoá Tây Nguyên & Tỉnh Đắk Lắk
            </h3>
            <p>
              Tây Nguyên là vùng văn hoá đặc sắc của Việt Nam với các cao nguyên đất đỏ bazan xếp tầng, hệ sinh thái rừng rậm nhiệt đới và lưu vực các con sông lớn như Sông Srêpôk.
            </p>
            <p>
              Đắk Lắk là trung tâm văn hoá lâu đời của người Ê Đê, nơi lưu giữ cấu trúc buôn làng truyền thống, bến nước sinh thái và hệ thống nghi lễ nông nghiệp nương rẫy phong phú.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif font-bold text-base text-[#2C1D13] border-b border-[#F0E8D9] pb-1.5">
              2. Cộng đồng Người Ê Đê & Khảo sát tại Xã Cư M'gar
            </h3>
            <p>
              Người Ê Đê (Anak Đê) tổ chức xã hội theo chế độ mẫu hệ, cư trú trong các ngôi nhà dài (Sang đê). Kho tàng di sản bao gồm Cồng chiêng (UNESCO ghi danh), Sử thi (Klei Khan), Lời nói vần (Klei đúm), Dệt thổ cẩm và Lễ cúng bến nước.
            </p>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <strong>Xác định rõ về địa bàn khảo sát dự kiến:</strong> Xã Cư M'gar hiện là địa bàn khảo sát dự kiến, chưa khẳng định toàn xã là cộng đồng đại diện cho người Ê Đê. Dự án thiết kế dữ liệu để cập nhật chính xác đến từng buôn cụ thể khi có nguồn thẩm định.
            </div>
          </div>
        </div>
      </div>

      {/* Methodology Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-6">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#3B281B] flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-[#B33927]" />
          Phương pháp Thu thập & Thẩm định Dữ liệu
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC8] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#992E20] text-white flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-[#2C1D13] text-sm">Hồ sơ chính thức quốc gia</h3>
            <p className="text-[#59493E] leading-relaxed">
              Đối chiếu trực tiếp với Quyết định công bố của Bộ VHTTDL, hồ sơ đệ trình UNESCO và danh mục kiểm kê di sản của Sở VHTTDL tỉnh Đắk Lắk.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC8] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#992E20] text-white flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-[#2C1D13] text-sm">Khảo sát buôn làng cụ thể</h3>
            <p className="text-[#59493E] leading-relaxed">
              Xác minh sự hiện diện của di sản tại từng buôn/làng; nếu chưa có tài liệu xác thực tại xã Cư M'gar thì để trạng thái "Đang xác minh địa bàn".
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC8] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#992E20] text-white flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-[#2C1D13] text-sm">Không tạo dữ liệu giả</h3>
            <p className="text-[#59493E] leading-relaxed">
              Tuyệt đối không tự suy đoán tên nghệ nhân, tên buôn, toạ độ địa lý hay thông tin ghi danh khi chưa có nguồn trích dẫn cụ thể.
            </p>
          </div>
        </div>
      </div>

      {/* Compliance with 12 Mandatory Requirements */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#3B281B] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            Bảng Kiểm tra Tuân thủ 12 Yêu cầu Bắt buộc
          </h2>
          <p className="text-xs text-[#7A695B] mt-1">
            Cam kết thực hiện nghiêm túc quy chế thực tập và đạo đức nghiên cứu di sản văn hoá Tây Nguyên.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mandatoryRules.map((rule) => (
            <div
              key={rule.id}
              className="p-3.5 rounded-xl border border-[#EFE7D8] bg-[#FAF7F2] flex items-start gap-3 text-xs"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-[#2C1D13]">
                  Điều {rule.id}: {rule.title}
                </div>
                <div className="text-[#59493E] text-[11.5px] leading-relaxed">
                  {rule.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
