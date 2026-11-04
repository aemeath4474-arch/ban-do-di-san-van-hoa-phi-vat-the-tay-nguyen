import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  ShieldAlert, 
  Volume2, 
  Video,
  AlertTriangle
} from 'lucide-react';
import { DiSan } from '../types/heritage';

interface HeritageListViewProps {
  heritages: DiSan[];
  onSelectHeritage: (heritage: DiSan) => void;
  onAskGeminiAboutHeritage: (heritage: DiSan) => void;
}

export const HeritageListView: React.FC<HeritageListViewProps> = ({
  heritages,
  onSelectHeritage,
  onAskGeminiAboutHeritage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('Tất cả');
  const [filterEthnicity, setFilterEthnicity] = useState('Tất cả');
  const [filterLocality, setFilterLocality] = useState('Tất cả');
  const [filterCategory, setFilterCategory] = useState('Tất cả');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [filterSurveyStatus, setFilterSurveyStatus] = useState('Tất cả');
  const [sortBy, setSortBy] = useState<'ten_az' | 'ten_za' | 'dia_phuong'>('ten_az');

  // Extract unique filter options
  const regions = useMemo(() => {
    return ['Tất cả', ...Array.from(new Set(heritages.map((h) => h.vung_van_hoa)))];
  }, [heritages]);

  const ethnicities = useMemo(() => {
    return ['Tất cả', ...Array.from(new Set(heritages.map((h) => h.dan_toc)))];
  }, [heritages]);

  const categories = useMemo(() => {
    return ['Tất cả', ...Array.from(new Set(heritages.map((h) => h.loai_hinh)))];
  }, [heritages]);

  const localities = useMemo(() => {
    const list = new Set<string>();
    heritages.forEach((h) => {
      if (h.huyen_thi) list.add(h.huyen_thi);
      if (h.dia_danh_hien_nay.includes('Cư M\'gar')) list.add('Cư M\'gar');
      if (h.dia_danh_hien_nay.includes('Buôn Ma Thuột')) list.add('Buôn Ma Thuột');
      if (h.dia_danh_hien_nay.includes('Buôn Hồ')) list.add('Buôn Hồ');
    });
    return ['Tất cả', ...Array.from(list)];
  }, [heritages]);

  // Filter and sort items
  const filteredHeritages = useMemo(() => {
    return heritages
      .filter((h) => {
        const query = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !query ||
          h.ten_di_san.toLowerCase().includes(query) ||
          h.ten_ban_dia.toLowerCase().includes(query) ||
          h.dia_danh_hien_nay.toLowerCase().includes(query) ||
          (h.buon_lang && h.buon_lang.toLowerCase().includes(query)) ||
          h.mo_ta.toLowerCase().includes(query);

        const matchesRegion = filterRegion === 'Tất cả' || h.vung_van_hoa === filterRegion;
        const matchesEthnicity = filterEthnicity === 'Tất cả' || h.dan_toc.includes(filterEthnicity);
        const matchesCategory = filterCategory === 'Tất cả' || h.loai_hinh === filterCategory;
        const matchesLocality =
          filterLocality === 'Tất cả' ||
          (h.huyen_thi && h.huyen_thi.includes(filterLocality)) ||
          h.dia_danh_hien_nay.includes(filterLocality);

        const matchesStatus =
          filterStatus === 'Tất cả' ||
          (filterStatus === 'UNESCO' && h.tinh_trang_ghi_danh.includes('UNESCO')) ||
          (filterStatus === 'Quốc gia' && h.tinh_trang_ghi_danh.includes('quốc gia')) ||
          (filterStatus === 'Kiểm kê' && (h.tinh_trang_ghi_danh.includes('kiểm kê') || h.tinh_trang_ghi_danh.includes('Lập hồ sơ')));

        const matchesSurveyStatus =
          filterSurveyStatus === 'Tất cả' || h.trang_thai_dia_ban === filterSurveyStatus;

        return (
          matchesSearch &&
          matchesRegion &&
          matchesEthnicity &&
          matchesCategory &&
          matchesLocality &&
          matchesStatus &&
          matchesSurveyStatus
        );
      })
      .sort((a, b) => {
        if (sortBy === 'ten_az') {
          return a.ten_di_san.localeCompare(b.ten_di_san, 'vi');
        } else if (sortBy === 'ten_za') {
          return b.ten_di_san.localeCompare(a.ten_di_san, 'vi');
        } else {
          return a.dia_danh_hien_nay.localeCompare(b.dia_danh_hien_nay, 'vi');
        }
      });
  }, [
    heritages,
    searchTerm,
    filterRegion,
    filterEthnicity,
    filterCategory,
    filterLocality,
    filterStatus,
    filterSurveyStatus,
    sortBy,
  ]);

  return (
    <div className="space-y-6">
      {/* Header & Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>Màn hình 3 • Danh mục di sản phi vật thể</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#3B281B]">
            Danh mục Di sản Văn hoá Người Ê Đê (Đắk Lắk)
          </h1>
          <p className="text-sm text-[#6C5B4E] mt-1 max-w-3xl leading-relaxed">
            Tra cứu di sản theo vùng văn hoá Tây Nguyên, cộng đồng người Ê Đê và địa bàn hành chính tỉnh Đắk Lắk.
            Địa bàn khảo sát dự kiến: <strong>Xã Cư M'gar</strong> (phân định rõ trạng thái xác minh theo buôn).
          </p>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên di sản, tên gọi bản địa (Ching K’nah, Klei Khan, Klei đúm...) hoặc buôn/địa bàn..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#D5C6AF] text-sm text-[#2C1D13] placeholder-[#8C7A6B] focus:ring-2 focus:ring-[#B33927] focus:outline-hidden"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8C7A6B] hover:text-[#B33927]"
            >
              Xoá
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {/* Loại hình */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6C5B4E] mb-1">Loại hình di sản</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#D5C6AF] text-[#3B281B] text-xs rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-[#B33927] focus:outline-hidden"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Địa bàn khảo sát */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6C5B4E] mb-1">Địa bàn / Huyện thị</label>
            <select
              value={filterLocality}
              onChange={(e) => setFilterLocality(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#D5C6AF] text-[#3B281B] text-xs rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-[#B33927] focus:outline-hidden"
            >
              {localities.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Trạng thái khảo sát */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6C5B4E] mb-1">Khảo sát Xã Cư M'gar</label>
            <select
              value={filterSurveyStatus}
              onChange={(e) => setFilterSurveyStatus(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#D5C6AF] text-[#3B281B] text-xs rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-[#B33927] focus:outline-hidden"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Địa bàn khảo sát dự kiến">Địa bàn khảo sát dự kiến</option>
              <option value="Đang xác minh địa bàn">Đang xác minh địa bàn</option>
              <option value="Đã xác minh">Đã xác minh</option>
            </select>
          </div>

          {/* Dân tộc */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6C5B4E] mb-1">Cộng đồng</label>
            <select
              value={filterEthnicity}
              onChange={(e) => setFilterEthnicity(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#D5C6AF] text-[#3B281B] text-xs rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-[#B33927] focus:outline-hidden"
            >
              {ethnicities.map((eth) => (
                <option key={eth} value={eth}>
                  {eth}
                </option>
              ))}
            </select>
          </div>

          {/* Cấp ghi danh */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6C5B4E] mb-1">Cấp ghi danh</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#D5C6AF] text-[#3B281B] text-xs rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-[#B33927] focus:outline-hidden"
            >
              <option value="Tất cả">Tất cả cấp độ</option>
              <option value="UNESCO">UNESCO công nhận</option>
              <option value="Quốc gia">Cấp Quốc gia</option>
              <option value="Kiểm kê">Đang kiểm kê</option>
            </select>
          </div>

          {/* Sắp xếp */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6C5B4E] mb-1">Sắp xếp</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#FAF7F2] border border-[#D5C6AF] text-[#3B281B] text-xs rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-[#B33927] focus:outline-hidden"
            >
              <option value="ten_az">Tên di sản (A-Z)</option>
              <option value="ten_za">Tên di sản (Z-A)</option>
              <option value="dia_phuong">Địa bàn</option>
            </select>
          </div>
        </div>

        {/* Results summary bar */}
        <div className="flex items-center justify-between text-xs text-[#7A695B] pt-2 border-t border-[#F0E8D9]">
          <div>
            Hiển thị <strong className="text-[#B33927]">{filteredHeritages.length}</strong> di sản người Ê Đê có nguồn tư liệu xác thực
          </div>
          {(filterCategory !== 'Tất cả' || filterLocality !== 'Tất cả' || filterSurveyStatus !== 'Tất cả' || searchTerm) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('Tất cả');
                setFilterLocality('Tất cả');
                setFilterRegion('Tất cả');
                setFilterEthnicity('Tất cả');
                setFilterStatus('Tất cả');
                setFilterSurveyStatus('Tất cả');
              }}
              className="text-[#B33927] hover:underline font-medium"
            >
              Đặt lại tất cả bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Heritage Cards Grid */}
      {filteredHeritages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHeritages.map((heritage) => (
            <div
              key={heritage.id}
              className="bg-white rounded-2xl border border-[#E8DEC8] hover:border-[#B33927]/40 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
            >
              {/* Card Image Banner */}
              <div className="relative h-48 w-full bg-[#EAE0CE] overflow-hidden">
                <img
                  src={heritage.hinh_anh}
                  alt={heritage.ten_di_san}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as any).src = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>

                {/* Survey Status Badge */}
                <div className="absolute top-3 left-3 bg-[#B33927] text-white text-[10.5px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  {heritage.trang_thai_dia_ban}
                </div>

                {/* Media indicators */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {heritage.am_thanh && (
                    <span className="p-1 rounded-md bg-black/50 text-white backdrop-blur-xs" title="Có tư liệu âm thanh">
                      <Volume2 className="w-3.5 h-3.5" />
                    </span>
                  )}
                  {heritage.video && (
                    <span className="p-1 rounded-md bg-black/50 text-white backdrop-blur-xs" title="Có tư liệu video">
                      <Video className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                {/* Category Pill on bottom of image */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-white bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
                    {heritage.loai_hinh}
                  </span>
                  <span className="text-[10px] font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded-sm">
                    {heritage.id}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#2C1D13] leading-snug group-hover:text-[#B33927] transition-colors">
                      {heritage.ten_di_san}
                    </h3>
                    <div className="text-xs font-semibold text-[#8B4513] italic mt-0.5">
                      {heritage.ten_ban_dia}
                    </div>
                  </div>

                  <p className="text-xs text-[#635347] line-clamp-3 leading-relaxed">
                    {heritage.mo_ta}
                  </p>
                </div>

                {/* Administrative and buôn stratification */}
                <div className="space-y-1.5 pt-3 border-t border-[#F0E8D9] text-xs text-[#524237]">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B33927] shrink-0 mt-0.5" />
                    <span className="line-clamp-1"><strong>Địa bàn:</strong> {heritage.dia_danh_hien_nay}</span>
                  </div>

                  {heritage.buon_lang && (
                    <div className="flex items-start gap-1.5 text-[11px] text-[#7A695B]">
                      <span className="font-bold text-[#8C7A6B] shrink-0">🏠</span>
                      <span className="line-clamp-1"><strong>Buôn/làng:</strong> {heritage.buon_lang}</span>
                    </div>
                  )}

                  {heritage.nguon_tu_lieu && heritage.nguon_tu_lieu.length > 0 && (
                    <div className="flex items-start gap-1.5 text-[11px] text-[#7A695B]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">
                        <strong>Nguồn:</strong> {heritage.nguon_tu_lieu[0].ten_tai_lieu}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => onSelectHeritage(heritage)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#B33927] text-[#2C1D13] hover:text-white border border-[#D5C6AF] hover:border-[#B33927] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Xem hồ sơ chi tiết</span>
                  </button>
                  <button
                    onClick={() => onAskGeminiAboutHeritage(heritage)}
                    title="Hỏi trợ lý Gemini AI về di sản này"
                    className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-semibold transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8DEC8] p-12 text-center space-y-3">
          <ShieldAlert className="w-12 h-12 text-amber-600 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-[#3B281B]">
            Chưa có tư liệu xác thực cho bộ lọc này
          </h3>
          <p className="text-sm text-[#7A695B] max-w-md mx-auto">
            Hệ thống tuân thủ nguyên tắc không tự tạo di sản giả để lấp đầy. Bạn có thể nới lỏng bộ lọc hoặc tìm kiếm theo từ khoá khác.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCategory('Tất cả');
              setFilterLocality('Tất cả');
              setFilterSurveyStatus('Tất cả');
            }}
            className="px-4 py-2 rounded-xl bg-[#B33927] text-white text-xs font-semibold hover:bg-[#992E20] transition-colors"
          >
            Xem toàn bộ di sản đã xác thực
          </button>
        </div>
      )}
    </div>
  );
};
