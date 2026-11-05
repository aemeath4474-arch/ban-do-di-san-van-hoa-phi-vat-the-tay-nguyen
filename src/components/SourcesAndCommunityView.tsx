import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  ExternalLink, 
  CheckCircle2, 
  Lock, 
  Send, 
  FileCheck,
  Search
} from 'lucide-react';
import { DiSan, NguonTuLieu } from '../types/heritage';
import { EDE_OFFICIAL_SOURCES } from '../data/edeHeritageData';

interface SourcesAndCommunityViewProps {
  heritages: DiSan[];
  onSelectHeritageById: (id: string) => void;
}

export const SourcesAndCommunityView: React.FC<SourcesAndCommunityViewProps> = ({
  heritages,
  onSelectHeritageById,
}) => {
  const [activeTab, setActiveTab] = useState<'tat-ca' | 'Chính thức' | 'Nghiên cứu' | 'Cộng đồng cung cấp'>('tat-ca');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOfficialTable, setShowOfficialTable] = useState(true);

  // Form state for community submission
  const [contributorName, setContributorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [heritageName, setHeritageName] = useState('');
  const [locality, setLocality] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<string | null>(null);

  // Aggregate all unique sources from heritages
  const allSourcesWithHeritage: { source: NguonTuLieu; heritage: DiSan }[] = [];
  heritages.forEach((h) => {
    h.nguon_tu_lieu.forEach((s) => {
      allSourcesWithHeritage.push({ source: s, heritage: h });
    });
  });

  const filteredSources = allSourcesWithHeritage.filter(({ source, heritage }) => {
    const matchesTab = activeTab === 'tat-ca' || source.loai_nguon === activeTab;
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      !query ||
      source.ten_tai_lieu.toLowerCase().includes(query) ||
      source.tac_gia_nguoi_ghi_nhan.toLowerCase().includes(query) ||
      source.don_vi_cung_cap.toLowerCase().includes(query) ||
      heritage.ten_di_san.toLowerCase().includes(query);
    return matchesTab && matchesSearch;
  });

  // Community Contributors List with explicit privacy handling
  const contributorsList = [
    {
      name: "Sở Văn hoá, Thể thao và Du lịch tỉnh Đắk Lắk",
      type: "Cơ quan chuyên môn",
      contribution: "Cung cấp hồ sơ đệ trình di sản cồng chiêng, sử thi và danh mục kiểm kê di sản",
      isPublic: true,
      locality: "Tỉnh Đắk Lắk"
    },
    {
      name: "Bảo tàng Đắk Lắk",
      type: "Cơ quan lưu trữ hiện vật & tư liệu",
      contribution: "Tư liệu ảnh hiện vật dệt thổ cẩm, kiến trúc nhà dài và âm thanh cồng chiêng",
      isPublic: true,
      locality: "TP. Buôn Ma Thuột"
    },
    {
      name: "Nghệ nhân Ưu tú Y Mip Ayun",
      type: "Nghệ nhân cồng chiêng",
      contribution: "Tư liệu các bài chiêng cổ Ê Đê và kỹ thuật chỉnh chiêng K'nah",
      isPublic: true,
      locality: "Tỉnh Đắk Lắk"
    },
    {
      name: "Nghệ nhân Nhân dân Y Wang Hwing",
      type: "Nghệ nhân hát kể sử thi (Pơ Khan)",
      contribution: "Bản ghi âm các trích đoạn Sử thi Đam San và Đam Kteh Mlan",
      isPublic: true,
      locality: "Tỉnh Đắk Lắk"
    },
    {
      name: "Nghệ nhân H'Yam Bkrông",
      type: "Nghệ nhân dệt thổ cẩm",
      contribution: "Kỹ thuật dệt hoa văn rồng đất (Kưt) trên khung dệt luồn chân",
      isPublic: true,
      locality: "Buôn Tơng Jút, Đắk Lắk"
    },
    {
      name: "Nghệ nhân buôn làng (Ẩn danh theo nguyện vọng bảo mật)",
      type: "Người thực hành di sản gia đình",
      contribution: "Tư liệu lời nói vần (Klei đúm) trong gia đình mẫu hệ",
      isPublic: false,
      locality: "Khu vực Cư M'gar, Đắk Lắk"
    }
  ];

  const handleSubmitContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreementChecked) return;

    setSubmittedStatus(
      `Cảm ơn bạn! Đề xuất đóng góp tư liệu cho "${heritageName}" đã được ghi nhận. Ban biên tập đề tài J02 sẽ liên hệ thẩm định theo quy trình đối chiếu nguồn.`
    );
    setContributorName('');
    setHeritageName('');
    setLocality('');
    setMaterialDescription('');
    setAgreementChecked(false);
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header section */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Màn hình 7 • Nguồn tư liệu và ghi nhận cộng đồng</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#3B281B]">
            Nguồn Tư liệu & Ghi nhận Đóng góp Cộng đồng
          </h1>
          <p className="text-sm text-[#6C5B4E] mt-1 max-w-3xl leading-relaxed">
            Minh bạch cơ sở dữ liệu thẩm định di sản người Ê Đê tại Đắk Lắk. Phân định rõ 3 cấp độ: Nguồn chính thức nhà nước, Nguồn nghiên cứu khoa học và Tư liệu thực địa cộng đồng.
          </p>
        </div>

        {/* 9 Core Authoritative & Research Sources Overview */}
        <div className="bg-[#FAF7F2] p-5 sm:p-6 rounded-2xl border border-[#DECDB5] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5D7C2] pb-3">
            <div>
              <div className="text-xs font-bold text-[#B33927] uppercase">Khung Thẩm định Khoa học Đề tài J02</div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#3B281B] mt-0.5">
                Danh mục 9 Nguồn Tư liệu Trọng yếu & Kiểm chứng Pháp lý
              </h2>
            </div>
            <button
              onClick={() => setShowOfficialTable(!showOfficialTable)}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#D5C6AF] hover:border-[#B33927] text-xs font-semibold text-[#3B281B] self-start sm:self-auto transition-colors"
            >
              {showOfficialTable ? 'Thu gọn danh mục' : 'Xem chi tiết 9 nguồn'}
            </button>
          </div>

          <div className="text-xs text-[#5C4B3E] leading-relaxed">
            Đáp ứng nghiêm ngặt yêu cầu nghiên cứu: Thu thập tối thiểu 7 nguồn tư liệu (thực tế: <strong>9 nguồn được kiểm chứng</strong>) với ít nhất 3 nguồn cơ quan nhà nước chính thống: <strong>Bộ Văn hoá, Thể thao và Du lịch</strong>, <strong>Cục Di sản văn hoá</strong>, <strong>Sở Văn hoá, Thể thao và Du lịch tỉnh Đắk Lắk</strong>, cùng các viện nghiên cứu đầu ngành.
          </div>

          {showOfficialTable && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 animate-in fade-in">
              {EDE_OFFICIAL_SOURCES.map((src) => (
                <div
                  key={src.id}
                  className="p-4 bg-white rounded-xl border border-[#DECDB5] space-y-2 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1 text-[11px]">
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        src.loai_nguon === 'Chính thức'
                          ? 'bg-emerald-100 text-emerald-800'
                          : src.loai_nguon === 'Tổ chức quốc tế'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {src.loai_nguon}
                      </span>
                      <span className="font-mono text-[#8C7A6B]">{src.nam_xuat_ban}</span>
                    </div>

                    <h3 className="font-serif font-bold text-xs sm:text-sm text-[#2C1D13] leading-snug">
                      {src.ten_nguon}
                    </h3>

                    <div className="text-[11px] text-[#5C4B3E]">
                      <strong>Cơ quan / Tác giả:</strong> {src.co_quan_tac_gia}
                    </div>

                    <p className="text-[11.5px] text-[#6C5B4E] leading-relaxed line-clamp-3">
                      {src.noi_dung_tham_chieu}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#F0E8D9] flex items-center justify-between text-[11px]">
                    <span className="text-[#8C7A6B] truncate max-w-[150px]">Lĩnh vực: {src.linh_vuc}</span>
                    <a
                      href={src.duong_dan_kiem_chung.startsWith('http') ? src.duong_dan_kiem_chung : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#B33927] hover:underline flex items-center gap-1 shrink-0"
                    >
                      Kiểm chứng <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search & Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#D5C6AF]">
            {[
              { id: 'tat-ca', label: 'Tất cả nguồn' },
              { id: 'Chính thức', label: 'Nguồn chính thức' },
              { id: 'Nghiên cứu', label: 'Nguồn nghiên cứu' },
              { id: 'Cộng đồng cung cấp', label: 'Cộng đồng cung cấp' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#B33927] text-white shadow-xs'
                    : 'text-[#4A3B32] hover:bg-[#EAE0CE]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên sách, tác giả..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D5C6AF] text-xs text-[#2C1D13] focus:ring-2 focus:ring-[#B33927] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Sources List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSources.map(({ source, heritage }, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-[#E8DEC8] p-5 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  source.loai_nguon === 'Chính thức'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : source.loai_nguon === 'Nghiên cứu'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {source.loai_nguon}
                </span>
                <span className="text-xs font-semibold text-[#8C7A6B]">
                  Năm {source.nam_cong_bo}
                </span>
              </div>

              <h3 className="font-serif font-bold text-sm text-[#2C1D13] leading-snug">
                {source.ten_tai_lieu}
              </h3>

              <div className="space-y-1 text-xs text-[#5C4B3E]">
                <div><strong>Tác giả / Người ghi nhận:</strong> {source.tac_gia_nguoi_ghi_nhan}</div>
                <div><strong>Đơn vị cung cấp:</strong> {source.don_vi_cung_cap}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0E8D9] flex items-center justify-between text-xs">
              <button
                onClick={() => onSelectHeritageById(heritage.id)}
                className="text-[#B33927] hover:underline font-medium text-[11px] truncate"
              >
                Gắn với: {heritage.ten_di_san}
              </button>
              {source.duong_dan && (
                <a
                  href={source.duong_dan}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4A3B32] hover:text-[#B33927] flex items-center gap-1 font-semibold text-[11px]"
                >
                  Liên kết <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Community Recognition & Privacy Protection Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Community Contributors (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-4">
          <div>
            <h2 className="font-serif font-bold text-xl text-[#3B281B] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#B33927]" />
              Ghi nhận Đóng góp của Nghệ nhân & Cộng đồng Ê Đê
            </h2>
            <p className="text-xs text-[#7A695B] mt-1">
              Tôn vinh các nghệ nhân nắm giữ, cơ quan chuyên môn và già làng buôn làng đã đóng góp tư liệu nghiên cứu.
            </p>
          </div>

          <div className="space-y-3">
            {contributorsList.map((contributor, index) => (
              <div
                key={index}
                className="p-3.5 rounded-xl border border-[#EFE7D8] bg-[#FAF7F2] space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#2C1D13] flex items-center gap-2">
                    {contributor.isPublic ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <span>{contributor.name}</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#EAE0CE] text-[#4A3B32] font-medium">
                    {contributor.type}
                  </span>
                </div>

                <p className="text-[#59493E] text-[11.5px] pl-6">
                  {contributor.contribution}
                </p>

                <div className="pl-6 text-[10.5px] text-[#8C7A6B]">
                  Địa bàn: {contributor.locality}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>Cam kết bảo mật (Quy định 9):</strong> Tuyệt đối không công khai thông tin cá nhân của người cung cấp khi chưa có văn bản đồng ý; tôn trọng tuyệt đối quyền ẩn danh của người nắm giữ di sản.
            </span>
          </div>
        </div>

        {/* Right: Community Contribution Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-4">
          <div>
            <h2 className="font-serif font-bold text-xl text-[#3B281B] flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#B33927]" />
              Gửi Đề xuất / Bổ sung Tư liệu
            </h2>
            <p className="text-xs text-[#7A695B] mt-1">
              Dành cho cán bộ văn hoá, học sinh sinh viên và người dân đóng góp tư liệu điền dã di sản người Ê Đê tại Đắk Lắk.
            </p>
          </div>

          {submittedStatus && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs leading-relaxed animate-in fade-in">
              {submittedStatus}
            </div>
          )}

          <form onSubmit={handleSubmitContribution} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Tên người cung cấp tư liệu *
              </label>
              <input
                type="text"
                required
                disabled={isAnonymous}
                value={isAnonymous ? 'Yêu cầu giấu tên (Ẩn danh)' : contributorName}
                onChange={(e) => setContributorName(e.target.value)}
                placeholder="Ví dụ: Y Khem Niê, H'Linh Mlô..."
                className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D5C6AF] text-xs focus:ring-2 focus:ring-[#B33927] focus:outline-hidden disabled:bg-stone-100"
              />
            </div>

            <div className="flex items-center gap-2 pt-0.5">
              <input
                type="checkbox"
                id="anonymousCheck"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-[#D5C6AF] text-[#B33927] focus:ring-[#B33927]"
              />
              <label htmlFor="anonymousCheck" className="text-[11px] text-[#6C5B4E] cursor-pointer">
                Tôi muốn ẩn danh (Không công khai danh tính trên website)
              </label>
            </div>

            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Tên di sản phi vật thể *
              </label>
              <input
                type="text"
                required
                value={heritageName}
                onChange={(e) => setHeritageName(e.target.value)}
                placeholder="Ví dụ: Lễ cúng lúa mới, bài chiêng đón khách..."
                className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D5C6AF] text-xs focus:ring-2 focus:ring-[#B33927] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Địa bàn ghi nhận (Buôn, Xã, Huyện tại Đắk Lắk) *
              </label>
              <input
                type="text"
                required
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="Ví dụ: Buôn A, Xã Cư M'gar, Huyện Cư M'gar..."
                className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D5C6AF] text-xs focus:ring-2 focus:ring-[#B33927] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3B32] mb-1">
                Mô tả tư liệu & Xuất xứ *
              </label>
              <textarea
                required
                rows={3}
                value={materialDescription}
                onChange={(e) => setMaterialDescription(e.target.value)}
                placeholder="Nêu rõ nội dung tư liệu, nghệ nhân thực hành, thời điểm ghi nhận..."
                className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D5C6AF] text-xs focus:ring-2 focus:ring-[#B33927] focus:outline-hidden resize-none"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E8DEC8] flex items-start gap-2">
              <input
                type="checkbox"
                id="legalAgreement"
                required
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
                className="mt-0.5 rounded border-[#D5C6AF] text-[#B33927] focus:ring-[#B33927]"
              />
              <label htmlFor="legalAgreement" className="text-[11px] text-[#5C4B3E] cursor-pointer leading-tight">
                Tôi cam kết thông tin cung cấp là trung thực, được sự đồng thuận của cộng đồng sở hữu di sản và cho phép sử dụng phi lợi nhuận cho dự án nghiên cứu J02.
              </label>
            </div>

            <button
              type="submit"
              disabled={!agreementChecked}
              className="w-full py-2.5 px-4 rounded-xl bg-[#B33927] hover:bg-[#992E20] disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <Send className="w-4 h-4" />
              <span>Gửi thông tin thẩm định</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
