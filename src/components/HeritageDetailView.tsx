import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Sparkles, 
  Volume2, 
  Video, 
  ShieldCheck, 
  Users, 
  Award, 
  FileText, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertTriangle,
  Home
} from 'lucide-react';
import { DiSan } from '../types/heritage';

interface HeritageDetailViewProps {
  heritage: DiSan;
  onBack: () => void;
  onAskGemini: (heritage: DiSan) => void;
}

export const HeritageDetailView: React.FC<HeritageDetailViewProps> = ({
  heritage,
  onBack,
  onAskGemini,
}) => {
  const [copiedCitation, setCopiedCitation] = useState(false);

  // Generate standard academic citation (TCVN / APA)
  const generateCitation = () => {
    const firstSource = heritage.nguon_tu_lieu[0];
    const author = firstSource ? firstSource.tac_gia_nguoi_ghi_nhan : 'Bộ Văn hoá, Thể thao và Du lịch';
    const year = firstSource ? firstSource.nam_cong_bo : '2021';
    const title = firstSource ? firstSource.ten_tai_lieu : heritage.ten_di_san;
    const publisher = firstSource ? firstSource.don_vi_cung_cap : 'Hồ sơ Di sản văn hoá phi vật thể Tây Nguyên';
    return `${author} (${year}). ${title}. Trích xuất từ Hệ thống Bản đồ Di sản Phi vật thể Tây Nguyên: ${heritage.ten_di_san} (${heritage.id}).`;
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(generateCitation());
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in">
      {/* Navigation Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#F3ECE0] text-[#3B281B] border border-[#D5C6AF] text-sm font-semibold transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh mục</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCitation}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#F3ECE0] text-[#4A3B32] border border-[#D5C6AF] text-xs font-semibold transition-colors"
            title="Sao chép trích dẫn khoa học"
          >
            {copiedCitation ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCitation ? 'Đã sao chép trích dẫn' : 'Trích dẫn di sản (APA)'}</span>
          </button>

          <button
            onClick={() => onAskGemini(heritage)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#B33927] to-[#8C2314] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#B33927]/20 hover:brightness-110 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Hỏi AI về di sản này</span>
          </button>
        </div>
      </div>

      {/* Verification & Survey Status Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-amber-950">
            HỒ SƠ DI SẢN CỘNG ĐỒNG NGƯỜI Ê ĐÊ – TỈNH ĐẮK LẮK
          </div>
          <p className="text-amber-900 leading-relaxed text-xs">
            Trạng thái khảo sát tại Xã Cư M'gar: <strong>{heritage.trang_thai_dia_ban}</strong>. 
            Buôn/làng ghi nhận: <strong>{heritage.buon_lang || 'Đang xác minh buôn/làng'}</strong>.
            Hệ thống không tự suy đoán buôn làng hoặc nghệ nhân khi chưa có hồ sơ thực địa xác thực.
          </p>
        </div>
      </div>

      {/* Main Header Card with Image & Title */}
      <div className="bg-white rounded-3xl border border-[#E8DEC8] overflow-hidden shadow-xs">
        <div className="relative h-64 sm:h-80 md:h-96 w-full bg-[#EAE0CE]">
          <img
            src={heritage.hinh_anh}
            alt={heritage.ten_di_san}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>

          {/* Badges on Hero */}
          <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-[#B33927] text-white font-bold uppercase text-[11px]">
                {heritage.loai_hinh}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 font-semibold border border-white/20">
                {heritage.dan_toc}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                Mã: {heritage.id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-md">
              {heritage.ten_di_san}
            </h1>

            <div className="flex items-center gap-2 text-amber-200 text-sm sm:text-base font-serif italic">
              <span>Tên bản địa: <strong>{heritage.ten_ban_dia}</strong></span>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="p-6 bg-[#FAF7F2] border-t border-[#E8DEC8] flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-[#4A3B32]">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#B33927]" />
            <span><strong>Tình trạng ghi danh:</strong> {heritage.tinh_trang_ghi_danh}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#B33927]" />
            <span><strong>Vùng văn hoá:</strong> {heritage.vung_van_hoa} (Tỉnh Đắk Lắk)</span>
          </div>
        </div>
      </div>

      {/* Grid of 20 Detailed Attributes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Essential Cultural Information (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* Section: Tên gọi bản địa & Chú giải */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-3">
            <h2 className="font-serif font-bold text-lg text-[#3B281B] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B33927]"></span>
              Tên gọi bản địa và Ngôn ngữ Ê Đê
            </h2>
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] space-y-2">
              <div className="text-base font-serif font-bold text-[#8B4513]">
                {heritage.ten_ban_dia}
              </div>
              <p className="text-xs sm:text-sm text-[#5C4B3E] leading-relaxed">
                <strong>Chú giải tiếng Việt phổ thông:</strong> {heritage.chu_giai_ten_ban_dia || 'Chưa ghi nhận chú giải phương ngữ.'}
              </p>
            </div>
          </div>

          {/* Section: Mô tả & Đặc điểm */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-3">
            <h2 className="font-serif font-bold text-lg text-[#3B281B] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B33927]"></span>
              Mô tả và Đặc điểm Di sản
            </h2>
            <p className="text-sm text-[#4A3B32] leading-relaxed whitespace-pre-line">
              {heritage.mo_ta}
            </p>
          </div>

          {/* Section: Lịch sử & Nguồn gốc */}
          {heritage.lich_su_nguon_goc && (
            <div className="bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-3">
              <h2 className="font-serif font-bold text-lg text-[#3B281B] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B33927]"></span>
                Lịch sử và Nguồn gốc ghi nhận
              </h2>
              <p className="text-sm text-[#4A3B32] leading-relaxed">
                {heritage.lich_su_nguon_goc}
              </p>
            </div>
          )}

          {/* Section: Không gian & Bối cảnh thực hành */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-3">
            <h2 className="font-serif font-bold text-lg text-[#3B281B] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B33927]"></span>
              Không gian và Bối cảnh thực hành di sản
            </h2>
            <p className="text-sm text-[#4A3B32] leading-relaxed">
              {heritage.boi_canh_thuc_hanh}
            </p>
          </div>

          {/* Section: Tư liệu Đa phương tiện */}
          {(heritage.am_thanh || heritage.video) && (
            <div className="bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-4">
              <h2 className="font-serif font-bold text-lg text-[#3B281B] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B33927]"></span>
                Tư liệu Nghe - Nhìn có nguồn xác thực
              </h2>

              {heritage.am_thanh && (
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#3B281B] flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-[#B33927]" />
                      Bản thu âm thanh diễn xướng:
                    </span>
                    <span className="text-[11px] text-[#7A695B]">Âm thanh mẫu</span>
                  </div>
                  <audio controls className="w-full h-9 rounded-lg" src={heritage.am_thanh}>
                    Trình duyệt của bạn không hỗ trợ phát âm thanh.
                  </audio>
                </div>
              )}

              {heritage.video && (
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#3B281B] flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#B33927]" />
                    Video tư liệu thực địa:
                  </span>
                  <a
                    href={heritage.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#B33927] hover:underline font-semibold flex items-center gap-1"
                  >
                    Xem tư liệu ghi hình <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Section: Danh mục nguồn tư liệu chuẩn */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-lg text-[#3B281B] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#B33927]" />
              Danh mục Nguồn tư liệu thẩm định ({heritage.nguon_tu_lieu.length})
            </h2>
            <div className="space-y-3">
              {heritage.nguon_tu_lieu.map((source, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-xl border border-[#E8DEC8] bg-[#FAF7F2] text-xs space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-serif font-bold text-sm text-[#2C1D13]">
                      {source.ten_tai_lieu}
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                      source.loai_nguon === 'Chính thức'
                        ? 'bg-emerald-100 text-emerald-800'
                        : source.loai_nguon === 'Nghiên cứu'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {source.loai_nguon}
                    </span>
                  </div>

                  <div className="text-[#59493E] space-y-0.5">
                    <div><strong>Tác giả / Người ghi nhận:</strong> {source.tac_gia_nguoi_ghi_nhan}</div>
                    <div><strong>Đơn vị cung cấp:</strong> {source.don_vi_cung_cap}</div>
                    <div><strong>Năm công bố:</strong> {source.nam_cong_bo}</div>
                  </div>

                  {source.duong_dan && (
                    <div className="pt-1">
                      <a
                        href={source.duong_dan}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#B33927] hover:underline flex items-center gap-1 text-[11px] font-medium"
                      >
                        Đường dẫn tra cứu tư liệu gốc <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: People, Locality & Legal Rights (1 col) */}
        <div className="space-y-6">
          {/* Locality & Buôn Stratification Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-3 text-xs">
            <h3 className="font-serif font-bold text-base text-[#3B281B] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#B33927]" />
              Phân định Địa bàn Khảo sát
            </h3>

            <div className="space-y-2 text-[#524237]">
              <div>
                <span className="font-semibold text-[#3B281B]">Vùng văn hoá:</span>
                <p className="mt-0.5">{heritage.vung_van_hoa}</p>
              </div>

              <div className="pt-2 border-t border-[#F0E8D9]">
                <span className="font-semibold text-[#3B281B]">Cộng đồng / Dân tộc:</span>
                <p className="mt-0.5">{heritage.dan_toc}</p>
              </div>

              <div className="pt-2 border-t border-[#F0E8D9]">
                <span className="font-semibold text-[#3B281B]">Tỉnh / Thành phố:</span>
                <p className="mt-0.5">{heritage.tinh_thanh || 'Tỉnh Đắk Lắk'}</p>
              </div>

              <div className="pt-2 border-t border-[#F0E8D9]">
                <span className="font-semibold text-[#3B281B]">Huyện / Thị xã:</span>
                <p className="mt-0.5">{heritage.huyen_thi || 'Huyện Cư M\'gar'}</p>
              </div>

              <div className="pt-2 border-t border-[#F0E8D9]">
                <span className="font-semibold text-[#3B281B]">Xã / Phường khảo sát:</span>
                <p className="mt-0.5">{heritage.xa_phuong || 'Xã Cư M\'gar (Địa bàn khảo sát dự kiến)'}</p>
              </div>

              <div className="pt-2 border-t border-[#F0E8D9]">
                <span className="font-semibold text-[#3B281B]">Buôn / Làng cụ thể:</span>
                <p className="mt-0.5 font-medium text-[#992E20]">{heritage.buon_lang || 'Đang xác minh buôn/làng'}</p>
              </div>

              {heritage.dia_danh_tu_lieu && (
                <div className="pt-2 border-t border-[#F0E8D9]">
                  <span className="font-semibold text-[#3B281B]">Địa danh tư liệu lịch sử:</span>
                  <p className="mt-0.5 italic">{heritage.dia_danh_tu_lieu}</p>
                </div>
              )}

              {heritage.toa_do ? (
                <div className="pt-2 border-t border-[#F0E8D9]">
                  <span className="font-semibold text-[#3B281B]">Toạ độ GPS xác thực:</span>
                  <p className="mt-0.5 font-mono text-[11px] text-[#7A695B]">
                    {heritage.toa_do.vi_do}°B, {heritage.toa_do.kinh_do}°Đ
                  </p>
                </div>
              ) : (
                <div className="pt-2 border-t border-[#F0E8D9] text-[#8C7A6B] italic">
                  Chưa gắn toạ độ (chỉ hiển thị toạ độ khi có vị trí xác thực).
                </div>
              )}
            </div>
          </div>

          {/* Master Artisans & Practitioners */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-3 text-xs">
            <h3 className="font-serif font-bold text-base text-[#3B281B] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#B33927]" />
              Nghệ nhân & Người thực hành
            </h3>

            <div className="space-y-2">
              {heritage.nghe_nhan_nguoi_thuc_hanh && heritage.nghe_nhan_nguoi_thuc_hanh.length > 0 ? (
                heritage.nghe_nhan_nguoi_thuc_hanh.map((artisan, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E8DEC8] font-medium text-[#3B281B]"
                  >
                    {artisan}
                  </div>
                ))
              ) : (
                <p className="text-[#7A695B] italic">
                  Chưa có thông tin nghệ nhân được phép công khai.
                </p>
              )}
            </div>
            <div className="text-[11px] text-[#8C7A6B] italic">
              * Theo quy định đề tài, chỉ công khai nghệ nhân khi có tư liệu đồng ý chính thức.
            </div>
          </div>

          {/* Provider & Usage Permission Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-3 text-xs">
            <h3 className="font-serif font-bold text-base text-[#3B281B] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Đơn vị cung cấp & Quyền sử dụng
            </h3>

            <div className="space-y-2 text-[#524237]">
              <div>
                <span className="font-semibold text-[#3B281B]">Người / Đơn vị cung cấp:</span>
                <p className="mt-0.5">{heritage.nguoi_cung_cap}</p>
              </div>

              <div className="pt-2 border-t border-[#F0E8D9]">
                <span className="font-semibold text-[#3B281B]">Phạm vi được phép sử dụng:</span>
                <p className="mt-0.5 text-[#6B5A4D]">{heritage.pham_vi_duoc_phep_su_dung}</p>
              </div>
            </div>
          </div>

          {/* Academic citation box */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#DECDB5] space-y-2 text-xs">
            <div className="font-bold text-[#3B281B] flex items-center justify-between">
              <span>Trích dẫn khoa học (TCVN/APA):</span>
              <button
                onClick={handleCopyCitation}
                className="text-[#B33927] hover:underline text-[11px] font-semibold"
              >
                {copiedCitation ? 'Đã sao chép' : 'Sao chép'}
              </button>
            </div>
            <p className="font-mono text-[11px] text-[#59493E] bg-white p-3 rounded-lg border border-[#D5C6AF] leading-relaxed break-words">
              {generateCitation()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
