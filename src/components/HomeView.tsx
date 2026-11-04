import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  BookOpen, 
  Sparkles, 
  Users, 
  ShieldCheck, 
  Info, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  Award,
  Layers,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { DiSan, ManHinhId } from '../types/heritage';

interface HomeViewProps {
  heritages: DiSan[];
  onNavigate: (screen: ManHinhId) => void;
  onSelectHeritage: (heritage: DiSan) => void;
  onQuickSearch: (term: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  heritages,
  onNavigate,
  onSelectHeritage,
  onQuickSearch,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onQuickSearch(searchInput.trim());
      onNavigate('danh-sach');
    }
  };

  const featuredHeritages = heritages.slice(0, 3);

  const unescoCount = heritages.filter((h) => h.tinh_trang_ghi_danh.includes('UNESCO')).length;
  const nationalCount = heritages.filter((h) => h.tinh_trang_ghi_danh.includes('quốc gia')).length;
  const validCoordinatesCount = heritages.filter((h) => h.toa_do !== null).length;

  return (
    <div className="space-y-10 pb-12 animate-in fade-in">
      {/* Hero Banner with Central Highlands Cultural Palette */}
      <div className="relative rounded-3xl overflow-hidden border border-[#E8DEC8] bg-[#2C1D13] text-white shadow-md">
        <div className="absolute inset-0 opacity-35 mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&q=80"
            alt="Vùng văn hoá Tây Nguyên Đắk Lắk"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#21150C]/95 via-[#2C1D13]/85 to-transparent"></div>

        <div className="relative p-6 sm:p-10 lg:p-12 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Đề tài J02 • Số hoá Di sản Văn hoá Phi vật thể</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-amber-50 leading-tight">
            Bản đồ di sản phi vật thể Tây Nguyên
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            Nghiên cứu trọng tâm <strong>Vùng văn hoá Tây Nguyên</strong> với cộng đồng được lựa chọn là <strong>Người Ê Đê</strong> tại <strong>tỉnh Đắk Lắk</strong>. 
            Địa bàn khảo sát dự kiến để tìm hiểu sâu hơn: <strong>Xã Cư M'gar, tỉnh Đắk Lắk</strong>.
          </p>

          {/* Search Bar in Hero */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="relative max-w-xl">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tìm nhanh di sản (Ching K’nah, Klei Khan, Lời nói vần, Dệt thổ cẩm...)..."
                className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white text-[#2C1D13] placeholder-stone-400 text-xs sm:text-sm shadow-lg focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-[#B33927] hover:bg-[#992E20] text-white text-xs font-bold transition-colors shadow-xs"
              >
                Tra cứu
              </button>
            </div>
          </form>

          {/* Quick Action Badges */}
          <div className="pt-3 flex flex-wrap items-center gap-3 text-xs">
            <button
              onClick={() => onNavigate('ban-do')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 text-stone-900 font-bold hover:bg-amber-300 transition-colors shadow-xs"
            >
              <MapPin className="w-4 h-4 text-[#992E20]" />
              <span>Bản đồ toạ độ Tây Nguyên</span>
            </button>
            <button
              onClick={() => onNavigate('hoi-dap-gemini')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 transition-colors backdrop-blur-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Hỏi đáp Gemini AI</span>
            </button>
            <button
              onClick={() => onNavigate('danh-sach')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 transition-colors backdrop-blur-xs"
            >
              <BookOpen className="w-4 h-4" />
              <span>Danh mục {heritages.length} di sản xác thực</span>
            </button>
          </div>
        </div>
      </div>

      {/* Survey Scope Clarification Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs sm:text-sm text-amber-950 flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">
            THỐNG NHẤT PHẠM VI NGHIÊN CỨU & NGUYÊN TẮC ĐỊA BÀN (ĐỀ TÀI J02)
          </div>
          <p className="leading-relaxed text-amber-900 text-xs">
            Phân biệt rõ ràng 3 cấp độ: <strong>Vùng văn hoá Tây Nguyên</strong>, <strong>Cộng đồng người Ê Đê</strong> và <strong>Địa bàn hành chính tỉnh Đắk Lắk</strong>.
            Xã Cư M'gar là địa bàn khảo sát dự kiến để tìm hiểu sâu hơn, chưa khẳng định toàn xã là cộng đồng đại diện cho người Ê Đê. 
            Mọi di sản đều được gắn nguồn tư liệu riêng; những địa bàn/buôn chưa xác minh được ghi rõ trạng thái <em>"Đang xác minh địa bàn"</em>.
          </p>
        </div>
      </div>

      {/* Key Numbers & Focus Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-1">
          <div className="text-xs font-semibold text-[#7A695B] uppercase">Di sản Ê Đê có nguồn</div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#B33927]">{heritages.length}</div>
          <div className="text-[11px] text-[#8C7A6B]">Tư liệu văn bản thẩm định</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-1">
          <div className="text-xs font-semibold text-[#7A695B] uppercase">Cấp đại diện nhân loại</div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#D97706]">{unescoCount} UNESCO</div>
          <div className="text-[11px] text-[#8C7A6B]">Cồng chiêng Tây Nguyên</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-1">
          <div className="text-xs font-semibold text-[#7A695B] uppercase">Di sản cấp quốc gia</div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#2C1D13]">{nationalCount} Quốc gia</div>
          <div className="text-[11px] text-[#8C7A6B]">Sử thi, Lời nói vần, Thổ cẩm</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-1">
          <div className="text-xs font-semibold text-[#7A695B] uppercase">Toạ độ xác thực GPS</div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#059669]">{validCoordinatesCount} Điểm</div>
          <div className="text-[11px] text-[#8C7A6B]">Chỉ hiển thị điểm có toạ độ thật</div>
        </div>
      </div>

      {/* Cultural Region & Community Spotlight Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F0E8D9] pb-4">
          <div>
            <div className="text-xs font-bold text-[#B33927] uppercase">Trọng tâm nghiên cứu</div>
            <h2 className="text-2xl font-serif font-bold text-[#3B281B] mt-0.5">
              Văn hoá Người Ê Đê trên Cao nguyên Đắk Lắk
            </h2>
          </div>
          <button
            onClick={() => onNavigate('gioi-thieu')}
            className="text-xs font-semibold text-[#B33927] hover:underline flex items-center gap-1 self-start md:self-auto"
          >
            <span>Tìm hiểu chi tiết đề tài J02</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-[#4A3B32]">
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC8] space-y-2">
            <div className="font-serif font-bold text-base text-[#2C1D13] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B33927]"></span>
              Cồng chiêng & Sử thi Khan
            </div>
            <p className="leading-relaxed text-[#59493E]">
              Bộ chiêng K’nah và trường ca anh hùng Đam San, Xinh Nhã vang lên bên bếp lửa nhà dài là linh hồn văn hoá ngàn đời của người Ê Đê, kết nối con người với thế giới thần linh (Yang).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC8] space-y-2">
            <div className="font-serif font-bold text-base text-[#2C1D13] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]"></span>
              Lời nói vần & Luật tục
            </div>
            <p className="leading-relaxed text-[#59493E]">
              Klei đúm (Lời nói vần) đúc kết kinh nghiệm sống mẫu hệ, khuyên răn con cháu sống thuận hoà với buôn làng, bảo vệ rừng thiêng và gìn giữ nguồn nước đầu nguồn.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC8] space-y-2">
            <div className="font-serif font-bold text-base text-[#2C1D13] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669]"></span>
              Nhà dài & Thổ cẩm mẫu hệ
            </div>
            <p className="leading-relaxed text-[#59493E]">
              Kiến trúc nhà sàn dài (Sang đê) với cầu thang Cái tạc hình bầu ngực căng tràn và kỹ thuật dệt hoa văn rồng đất (Kưt) trên nền vải chàm biểu thị quyền uy và sự tài hoa của người phụ nữ Ê Đê.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Heritages Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#B33927] uppercase">Hồ sơ thẩm định</div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#3B281B]">
              Di sản Tiêu biểu của Người Ê Đê đã có Nguồn tư liệu
            </h2>
          </div>
          <button
            onClick={() => onNavigate('danh-sach')}
            className="text-xs font-semibold text-[#B33927] hover:underline flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredHeritages.map((heritage) => (
            <div
              key={heritage.id}
              onClick={() => onSelectHeritage(heritage)}
              className="bg-white rounded-2xl border border-[#E8DEC8] hover:border-[#B33927]/40 shadow-xs hover:shadow-md transition-all overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-44 w-full bg-[#EAE0CE] overflow-hidden">
                <img
                  src={heritage.hinh_anh}
                  alt={heritage.ten_di_san}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                <div className="absolute top-3 left-3 bg-[#B33927] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {heritage.trang_thai_dia_ban}
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-xs font-semibold">
                    {heritage.loai_hinh}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#2C1D13] group-hover:text-[#B33927] transition-colors leading-snug">
                    {heritage.ten_di_san}
                  </h3>
                  <div className="text-xs italic text-[#8B4513] font-medium">
                    {heritage.ten_ban_dia}
                  </div>
                  <p className="text-xs text-[#5C4B3E] line-clamp-2 mt-1.5 leading-relaxed">
                    {heritage.mo_ta}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F0E8D9] text-[11px] text-[#7A695B] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#B33927]" />
                    <span className="truncate">{heritage.dia_danh_hien_nay}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="truncate">Nguồn: {heritage.nguon_tu_lieu[0]?.ten_tai_lieu}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
