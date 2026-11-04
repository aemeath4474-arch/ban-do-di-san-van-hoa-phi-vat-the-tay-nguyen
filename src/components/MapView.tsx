import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  ExternalLink, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  BookOpen,
  AlertTriangle
} from 'lucide-react';
import { DiSan } from '../types/heritage';

interface MapViewProps {
  heritages: DiSan[];
  onSelectHeritage: (heritage: DiSan) => void;
  onAskGeminiAboutHeritage: (heritage: DiSan) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  heritages,
  onSelectHeritage,
  onAskGeminiAboutHeritage,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);

  // Geographic bounds for Central Highlands (Tây Nguyên) / Dak Lak province focus
  // Longitude (Kinh độ Đông): 107.3°E to 109.0°E
  // Latitude (Vĩ độ Bắc): 12.1°N to 13.5°N
  const BOUNDS = {
    minLng: 107.3,
    maxLng: 109.0,
    minLat: 12.1,
    maxLat: 13.5,
  };

  // SVG canvas dimensions
  const SVG_WIDTH = 900;
  const SVG_HEIGHT = 680;

  // Project Lat/Lng to SVG X/Y
  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * SVG_WIDTH;
    const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * SVG_HEIGHT;
    return { x, y };
  };

  // Only take heritages with authenticated coordinates
  // Strictly adhering to: "Chỉ hiển thị điểm có tọa độ được xác thực; không tự đặt vị trí."
  const validHeritages = heritages.filter(
    (h) => h.toa_do && typeof h.toa_do.vi_do === 'number' && typeof h.toa_do.kinh_do === 'number'
  );

  // Filtered heritages based on selected category
  const filteredHeritages = validHeritages.filter((h) => {
    if (selectedCategory === 'Tất cả') return true;
    return h.loai_hinh === selectedCategory;
  });

  // Group heritages by location identifier / coordinates
  const locationGroups: { [key: string]: { toa_do: any; heritages: DiSan[] } } = {};
  filteredHeritages.forEach((h) => {
    if (!h.toa_do) return;
    const key = `${h.toa_do.vi_do.toFixed(3)}_${h.toa_do.kinh_do.toFixed(3)}`;
    if (!locationGroups[key]) {
      locationGroups[key] = {
        toa_do: h.toa_do,
        heritages: [],
      };
    }
    locationGroups[key].heritages.push(h);
  });

  const categories = [
    'Tất cả',
    'Nghệ thuật trình diễn dân gian',
    'Lễ hội truyền thống',
    'Tập quán xã hội và tín ngưỡng',
    'Nghề thủ công truyền thống',
    'Tri thức dân gian',
  ];

  // Category Color Scheme
  const getCategoryColor = (loaiHinh: string) => {
    switch (loaiHinh) {
      case 'Nghệ thuật trình diễn dân gian':
        return '#B33927'; // Đỏ đất bazan
      case 'Lễ hội truyền thống':
        return '#D97706'; // Hổ phách
      case 'Tập quán xã hội và tín ngưỡng':
        return '#0284C7'; // Lam đậm
      case 'Nghề thủ công truyền thống':
        return '#059669'; // Chàm xanh rừng
      case 'Tri thức dân gian':
        return '#7C3AED'; // Tía hoàng thổ
      default:
        return '#6B7280';
    }
  };

  const activeGroup = selectedLocation ? locationGroups[selectedLocation] : null;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5 text-amber-700" />
              <span>Màn hình 2 • Bản đồ không gian địa lý di sản</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#3B281B]">
              Bản đồ Di sản Tây Nguyên – Tỉnh Đắk Lắk
            </h1>
            <p className="text-sm text-[#6C5B4E] mt-1 max-w-2xl leading-relaxed">
              Không gian di sản văn hoá phi vật thể của cộng đồng người Ê Đê tại tỉnh Đắk Lắk.
              Địa bàn khảo sát dự kiến: <strong>Xã Cư M'gar</strong> (đang trong quá trình khảo sát, xác minh buôn cụ thể).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[#7A695B]">Lọc loại hình:</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedLocation(null);
              }}
              className="bg-[#FAF7F2] border border-[#D5C6AF] text-[#3B281B] text-xs sm:text-sm rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-[#B33927] focus:outline-hidden"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Legend pills */}
        <div className="mt-4 pt-4 border-t border-[#F0E8D9] flex flex-wrap items-center gap-3 text-xs">
          <span className="font-semibold text-[#4A3B32] flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Chú giải di sản:
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#3B281B]">
            <span className="w-3 h-3 rounded-full bg-[#B33927]"></span> Cồng chiêng & Sử thi
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#3B281B]">
            <span className="w-3 h-3 rounded-full bg-[#0284C7]"></span> Lời nói vần (Klei đúm)
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#3B281B]">
            <span className="w-3 h-3 rounded-full bg-[#059669]"></span> Dệt thổ cẩm Ê Đê
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#3B281B]">
            <span className="w-3 h-3 rounded-full bg-[#D97706]"></span> Lễ cúng bến nước
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#3B281B]">
            <span className="w-3 h-3 rounded-full bg-[#7C3AED]"></span> Nhà dài mẫu hệ
          </span>
          <div className="ml-auto text-[11px] text-[#8C7A6B] italic">
            * Chỉ hiển thị điểm có toạ độ xác thực (không tự đặt vị trí)
          </div>
        </div>
      </div>

      {/* Main Map + Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Map Area (8 cols on lg) */}
        <div className="lg:col-span-8 bg-[#F5EFE6] rounded-2xl border border-[#DECDB5] p-3 sm:p-4 shadow-sm relative overflow-hidden">
          {/* Map Controls */}
          <div className="absolute top-6 right-6 z-10 flex flex-col gap-1.5 bg-white/90 backdrop-blur-xs p-1.5 rounded-xl border border-[#D5C6AF] shadow-md">
            <button
              onClick={() => setZoomLevel((prev) => Math.min(prev + 0.25, 2))}
              className="p-1.5 text-[#4A3B32] hover:bg-[#EAE0CE] rounded-lg transition-colors"
              title="Phóng to"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75))}
              className="p-1.5 text-[#4A3B32] hover:bg-[#EAE0CE] rounded-lg transition-colors"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setSelectedLocation(null);
              }}
              className="p-1.5 text-[#4A3B32] hover:bg-[#EAE0CE] rounded-lg transition-colors"
              title="Đặt lại bản đồ"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Map Region Tag */}
          <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#D5C6AF] shadow-xs text-xs space-y-0.5">
            <div className="font-bold text-[#3B281B]">Cao nguyên Đắk Lắk – Tây Nguyên</div>
            <div className="text-[11px] text-[#992E20] font-semibold">Khảo sát dự kiến: Xã Cư M'gar</div>
          </div>

          {/* SVG Map Container */}
          <div className="w-full overflow-auto rounded-xl bg-[#ECE4D4] border border-[#D9CABA]">
            <div 
              style={{ 
                transform: `scale(${zoomLevel})`, 
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease-out' 
              }}
              className="min-w-[650px] relative"
            >
              <svg
                viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                className="w-full h-auto select-none"
              >
                <defs>
                  {/* Subtle red basalt plateau terrain pattern */}
                  <pattern id="basaltPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="1.5" fill="#D3C2A9" opacity="0.4" />
                  </pattern>
                  <linearGradient id="riverSrepok" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4A88A9" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#2E627E" stopOpacity="0.85" />
                  </linearGradient>
                </defs>

                {/* Base Red Basalt Plateau Background */}
                <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="#EFE8DC" />
                <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#basaltPattern)" />

                {/* Dak Lak Province Boundaries & Surrounding Central Highlands */}
                {/* 1. Ea H'leo & Krông Búk (Phía Bắc Đắk Lắk) */}
                <path
                  d="M 280 40 L 520 50 L 580 160 L 410 200 L 250 140 Z"
                  fill="#DFD2BA"
                  stroke="#BEAD90"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <text x="360" y="90" fill="#88745E" fontSize="12" fontWeight="600">
                  Huyện Ea H'leo / Krông Búk
                </text>

                {/* 2. Huyện Cư M'gar & Thị xã Buôn Hồ (TRỌNG TÂM KHẢO SÁT) */}
                <path
                  d="M 260 180 L 440 180 L 520 270 L 420 360 L 240 330 L 210 240 Z"
                  fill="#E4D5BC"
                  stroke="#992E20"
                  strokeWidth="2.5"
                />
                <rect x="250" y="210" width="180" height="24" rx="4" fill="#992E20" opacity="0.1" />
                <text x="340" y="226" fill="#992E20" fontSize="13" fontWeight="bold" textAnchor="middle">
                  HUYỆN CƯ M'GAR (ĐỊA BÀN KHẢO SÁT)
                </text>
                <text x="340" y="244" fill="#7A695B" fontSize="10.5" fontStyle="italic" textAnchor="middle">
                  Xã Cư M'gar (Đang xác minh buôn làng)
                </text>

                {/* 3. Thành phố Buôn Ma Thuột (Trung tâm văn hoá Đắk Lắk) */}
                <path
                  d="M 240 330 L 420 360 L 460 480 L 330 520 L 200 460 Z"
                  fill="#E6D7BD"
                  stroke="#BEAD90"
                  strokeWidth="1.8"
                />
                <text x="320" y="440" fill="#7A654E" fontSize="13" fontWeight="bold">
                  TP. BUÔN MA THUỘT
                </text>

                {/* 4. Krông Năng & Ea Kar (Phía Đông) */}
                <path
                  d="M 520 160 L 740 180 L 720 360 L 520 270 Z"
                  fill="#DFD2BA"
                  stroke="#BEAD90"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <text x="600" y="240" fill="#88745E" fontSize="12" fontWeight="600">
                  Krông Năng & Ea Kar
                </text>

                {/* 5. Krông Ana & Lắk (Phía Nam) */}
                <path
                  d="M 200 460 L 330 520 L 480 500 L 580 620 L 360 650 L 170 560 Z"
                  fill="#DFD2BA"
                  stroke="#BEAD90"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <text x="350" y="580" fill="#88745E" fontSize="12" fontWeight="600">
                  Huyện Krông Ana & Hồ Lắk
                </text>

                {/* Sông Srêpôk huyền thoại (Dòng sông chảy ngược Tây Nguyên) */}
                <path
                  d="M 120 480 Q 200 420, 260 360 T 310 260 T 260 140 T 180 80"
                  fill="none"
                  stroke="url(#riverSrepok)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <text x="180" y="280" fill="#2E627E" fontSize="11" fontStyle="italic" fontWeight="600">
                  Sông Srêpôk (Krông Ana & Krông Nô)
                </text>

                {/* Plot authenticated markers */}
                {Object.entries(locationGroups).map(([key, group]) => {
                  const { vi_do, kinh_do, ten_dia_diem } = group.toa_do;
                  const { x, y } = projectCoords(vi_do, kinh_do);
                  const isSelected = selectedLocation === key;
                  const primaryHeritage = group.heritages[0];
                  const markerColor = getCategoryColor(primaryHeritage.loai_hinh);
                  const count = group.heritages.length;

                  return (
                    <g
                      key={key}
                      onClick={() => setSelectedLocation(key)}
                      onMouseEnter={() => setHoveredPoint({ x, y, name: ten_dia_diem, heritages: group.heritages })}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="cursor-pointer transition-transform hover:scale-110"
                    >
                      {isSelected && (
                        <circle
                          cx={x}
                          cy={y}
                          r="26"
                          fill={markerColor}
                          opacity="0.25"
                          className="animate-ping"
                        />
                      )}

                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 18 : 13}
                        fill={markerColor}
                        opacity={isSelected ? 0.35 : 0.2}
                      />

                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 12 : 9}
                        fill={markerColor}
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                        className="shadow-md"
                      />

                      <text
                        x={x}
                        y={y + 3.5}
                        fill="#FFFFFF"
                        fontSize={count > 9 ? '8' : '10'}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {count > 1 ? count : '✦'}
                      </text>

                      {/* Clean label without kerning distortion */}
                      <rect
                        x={x - 75}
                        y={y + 14}
                        width="150"
                        height="20"
                        rx="4"
                        fill="rgba(255, 255, 255, 0.92)"
                        stroke="#D5C6AF"
                        strokeWidth="0.75"
                      />
                      <text
                        x={x}
                        y={y + 27}
                        fill="#3B281B"
                        fontSize="9.5"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {ten_dia_diem.split(',')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip on hover */}
              {hoveredPoint && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${(hoveredPoint.x / SVG_WIDTH) * 100}%`,
                    top: `${(hoveredPoint.y / SVG_HEIGHT) * 100}%`,
                    transform: 'translate(-50%, -125%)',
                  }}
                  className="pointer-events-none z-30 bg-[#2C2018] text-white p-2.5 rounded-lg shadow-xl text-xs max-w-xs border border-amber-500/30"
                >
                  <div className="font-bold text-amber-200">{hoveredPoint.name}</div>
                  <div className="text-[11px] text-stone-300 mt-1">
                    {hoveredPoint.heritages.length} di sản ghi nhận:
                  </div>
                  <ul className="list-disc list-inside text-[10.5px] text-amber-50 mt-0.5 space-y-0.5">
                    {hoveredPoint.heritages.map((h: DiSan) => (
                      <li key={h.id} className="truncate">{h.ten_di_san}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-[#7D6B58] px-2">
            <div>💡 Nhấn vào điểm toạ độ trên bản đồ để tra cứu di sản đã xác thực.</div>
            <div>Toạ độ chuẩn WGS84</div>
          </div>
        </div>

        {/* Selected Location Details Panel (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          {activeGroup ? (
            <div className="bg-white rounded-2xl border border-[#E8DEC8] p-5 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B33927] bg-[#B33927]/10 px-2 py-0.5 rounded-full mb-1">
                    <MapPin className="w-3 h-3" /> Điểm toạ độ xác thực
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#3B281B] leading-snug">
                    {activeGroup.toa_do.ten_dia_diem}
                  </h3>
                  <div className="text-xs text-[#7A695B] mt-0.5">
                    Toạ độ: {activeGroup.toa_do.vi_do}°B, {activeGroup.toa_do.kinh_do}°Đ
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-[#FAF7F2] text-[#3B281B] rounded-lg border border-[#E0D2BC]">
                  {activeGroup.heritages.length} di sản
                </span>
              </div>

              <div className="border-t border-[#F0E8D9] pt-3">
                <div className="text-xs font-semibold text-[#5C4B3E] uppercase mb-2.5">
                  Danh mục di sản tại địa bàn:
                </div>
                <div className="space-y-3">
                  {activeGroup.heritages.map((heritage) => (
                    <div
                      key={heritage.id}
                      className="p-3 rounded-xl border border-[#EFE7D8] bg-[#FAF7F2] hover:bg-[#F3ECE0] transition-colors space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-serif font-bold text-sm text-[#2C1D13]">
                            {heritage.ten_di_san}
                          </div>
                          <div className="text-xs italic text-[#8B4513] font-medium">
                            {heritage.ten_ban_dia}
                          </div>
                        </div>
                        <span 
                          className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-white whitespace-nowrap"
                          style={{ backgroundColor: getCategoryColor(heritage.loai_hinh) }}
                        >
                          {heritage.loai_hinh}
                        </span>
                      </div>

                      <div className="text-[11px] px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-900 border border-amber-200">
                        Trạng thái địa bàn: <strong>{heritage.trang_thai_dia_ban}</strong>
                        {heritage.buon_lang && (
                          <span className="block text-[10px] text-[#7A695B]">
                            Buôn/Làng: {heritage.buon_lang}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#615246] line-clamp-2">
                        {heritage.mo_ta}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => onSelectHeritage(heritage)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-[#B33927] hover:bg-[#992E20] text-white text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Xem chi tiết hồ sơ</span>
                        </button>
                        <button
                          onClick={() => onAskGeminiAboutHeritage(heritage)}
                          title="Hỏi AI về di sản này"
                          className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-medium transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E8DEC8] p-6 text-center shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8DEC8] text-[#8C7A6B] flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6 text-[#B33927]" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#3B281B]">
                Chọn toạ độ khảo sát trên bản đồ
              </h3>
              <p className="text-xs text-[#7A695B] leading-relaxed">
                Nhấp vào các điểm đánh dấu trên bản đồ Đắk Lắk để xem di sản của cộng đồng người Ê Đê đã có tư liệu xác thực.
              </p>

              {/* Research Scope Clarification Card */}
              <div className="pt-3 border-t border-[#F0E8D9] text-left text-xs space-y-2 text-[#5E4E42]">
                <div className="font-semibold text-[#3B281B] flex items-center gap-1.5 text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Lưu ý về địa bàn khảo sát dự kiến:</span>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11.5px] text-amber-900 leading-relaxed">
                  Xã Cư M'gar hiện là địa bàn khảo sát dự kiến của đề tài J02. Các di sản đang được xác minh đến từng buôn cụ thể; không tự ý khẳng định toàn xã là đại diện hay tự tạo toạ độ ảo khi chưa có hồ sơ thực địa.
                </div>
              </div>
            </div>
          )}

          {/* Cultural Region Overview Card */}
          <div className="bg-[#FAF7F2] rounded-2xl border border-[#DECDB5] p-5 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-[#992E20] font-bold">
              <Info className="w-4 h-4" />
              <span>Đặc trưng không gian văn hoá Ê Đê</span>
            </div>
            <p className="text-[#59493E] leading-relaxed">
              Cộng đồng người Ê Đê sinh sống chủ yếu trên cao nguyên đất đỏ Đắk Lắk theo chế độ mẫu hệ truyền thống. 
              Các di sản văn hoá gắn chặt với cấu trúc nhà dài (Sang đê), bến nước buôn làng, âm vang cồng chiêng K'nah và kho tàng sử thi Klei Khan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
