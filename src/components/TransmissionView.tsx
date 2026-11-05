import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  CheckCircle2, 
  ExternalLink, 
  BookOpen, 
  ShieldAlert,
  Search,
  Filter
} from 'lucide-react';
import { HoatDongTruyenDay, DiSan } from '../types/heritage';
import { danhSachTruyenDay } from '../data/transmissionData';

interface TransmissionViewProps {
  heritages: DiSan[];
  onSelectHeritageById: (id: string) => void;
}

export const TransmissionView: React.FC<TransmissionViewProps> = ({
  heritages,
  onSelectHeritageById,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocality, setFilterLocality] = useState('Tất cả');
  const [filterCategory, setFilterCategory] = useState('Tất cả');

  // Filter activities
  const filteredActivities = danhSachTruyenDay.filter((item) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      !query ||
      item.ten_hoat_dong.toLowerCase().includes(query) ||
      item.nghe_nhan_huong_dan.toLowerCase().includes(query) ||
      item.dia_phuong.toLowerCase().includes(query) ||
      item.mo_ta.toLowerCase().includes(query);

    const matchesLocality = filterLocality === 'Tất cả' || item.dia_phuong.includes(filterLocality);
    const matchesCategory = filterCategory === 'Tất cả' || item.loai_hinh === filterCategory;

    return matchesSearch && matchesLocality && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5 text-amber-700" />
            <span>Màn hình 5 • Kết nối và truyền dạy di sản</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#3B281B]">
            Thực hành & Trao truyền Di sản trong Cộng đồng
          </h1>
          <p className="text-sm text-[#6C5B4E] mt-1 max-w-3xl leading-relaxed">
            Tập hợp các lớp học, câu lạc bộ bảo tồn và hoạt động truyền dạy của nghệ nhân người Ê Đê cho thế hệ trẻ tại tỉnh Đắk Lắk. 
            Mọi thông tin hoạt động và nghệ nhân đều được trích dẫn từ các tư liệu xác thực tại địa phương và cơ quan chuyên môn.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="sm:col-span-1">
            <label className="block text-[11px] font-semibold text-[#6C5B4E] mb-1">Tìm kiếm hoạt động</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm lớp học, nghệ nhân..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D5C6AF] text-xs text-[#2C1D13] focus:ring-2 focus:ring-[#B33927] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6C5B4E] mb-1">Địa phương</label>
            <select
              value={filterLocality}
              onChange={(e) => setFilterLocality(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#D5C6AF] text-[#3B281B] text-xs rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#B33927] focus:outline-hidden"
            >
              <option value="Tất cả">Tất cả địa phương</option>
              <option value="Cư M'gar">Huyện Cư M'gar (Địa bàn khảo sát dự kiến)</option>
              <option value="Buôn Ma Thuột">TP. Buôn Ma Thuột</option>
              <option value="Đắk Lắk">Toàn tỉnh Đắk Lắk</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6C5B4E] mb-1">Loại hình di sản</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#D5C6AF] text-[#3B281B] text-xs rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#B33927] focus:outline-hidden"
            >
              <option value="Tất cả">Tất cả loại hình</option>
              <option value="Nghệ thuật trình diễn dân gian">Trình diễn dân gian (Cồng chiêng)</option>
              <option value="Ngữ văn dân gian">Ngữ văn dân gian (Sử thi, Lời nói vần)</option>
              <option value="Tập quán xã hội và tín ngưỡng">Tập quán xã hội và tín ngưỡng</option>
              <option value="Nghề thủ công truyền thống">Nghề thủ công truyền thống (Dệt thổ cẩm, Đan lát)</option>
              <option value="Tri thức dân gian">Tri thức dân gian (Nhà dài, Rượu cần)</option>
            </select>
          </div>
        </div>

        {/* Ethical commitment notice */}
        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DEC8] flex items-center gap-2 text-xs text-[#7A695B]">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Nguyên tắc đạo đức số hoá:</strong> Không tự tạo tên nghệ nhân, không bịa đặt sự kiện và không sử dụng hình ảnh suy đoán sai lệch bối cảnh tâm linh.
          </span>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredActivities.map((act) => {
          const linkedHeritage = heritages.find((h) => h.id === act.di_san_lien_quan_id);

          return (
            <div
              key={act.id}
              className="bg-white rounded-2xl border border-[#E8DEC8] hover:border-[#B33927]/40 p-6 shadow-xs hover:shadow-sm transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    {act.loai_hinh}
                  </span>
                  <span className="text-xs text-[#7A695B] flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#B33927]" />
                    {act.dia_phuong}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-[#2C1D13] leading-snug">
                  {act.ten_hoat_dong}
                </h3>

                <p className="text-xs sm:text-sm text-[#5C4B3E] leading-relaxed">
                  {act.mo_ta}
                </p>

                {/* Details Breakdown */}
                <div className="space-y-2 pt-2 border-t border-[#F0E8D9] text-xs text-[#4A3B32]">
                  <div className="flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-[#B33927] shrink-0 mt-0.5" />
                    <div>
                      <strong>Nghệ nhân truyền dạy:</strong>
                      <span className="ml-1 text-[#2C1D13] font-medium">{act.nghe_nhan_huong_dan}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-[#5C4B3E] shrink-0 mt-0.5" />
                    <div>
                      <strong>Đơn vị tổ chức & Đối tượng:</strong>
                      <span className="ml-1">{act.don_vi_to_chuc} ({act.doi_tuong_tham_gia})</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-[#5C4B3E] shrink-0 mt-0.5" />
                    <div>
                      <strong>Thời gian & Địa điểm:</strong>
                      <span className="ml-1">{act.thoi_gian} tại {act.dia_diem}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-1 border-t border-[#F5EFE6] text-[11px] text-[#7A695B]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Nguồn xác thực:</strong> {act.nguon_xac_thuc}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              {linkedHeritage && (
                <div className="pt-3 border-t border-[#F0E8D9]">
                  <button
                    onClick={() => onSelectHeritageById(linkedHeritage.id)}
                    className="w-full py-2 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#B33927] text-[#3B281B] hover:text-white border border-[#D5C6AF] hover:border-[#B33927] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Xem hồ sơ di sản liên quan ({linkedHeritage.ten_di_san})</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
