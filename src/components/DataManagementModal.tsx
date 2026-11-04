import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  AlertCircle,
  FileJson
} from 'lucide-react';
import { DiSan } from '../types/heritage';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  heritages: DiSan[];
  onSaveHeritages: (updated: DiSan[]) => Promise<void>;
  onResetToDefault: () => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  heritages,
  onSaveHeritages,
  onResetToDefault,
}) => {
  const [activeTab, setActiveTab] = useState<'danh-sach' | 'them-moi' | 'nhap-xuat'>('danh-sach');
  const [editingHeritage, setEditingHeritage] = useState<DiSan | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // New Heritage Form State
  const initialNewHeritage: DiSan = {
    id: `DS-TN-EDE-${Date.now().toString().slice(-4)}`,
    la_du_lieu_minh_hoa: false,
    ghi_chu_minh_hoa: '',
    ten_di_san: '',
    ten_ban_dia: '',
    chu_giai_ten_ban_dia: '',
    loai_hinh: 'Nghệ thuật trình diễn dân gian',
    vung_van_hoa: 'Tây Nguyên',
    dan_toc: 'Người Ê Đê',
    tinh_thanh: 'Tỉnh Đắk Lắk',
    huyen_thi: 'Huyện Cư M\'gar',
    xa_phuong: 'Xã Cư M\'gar (Địa bàn khảo sát dự kiến)',
    buon_lang: 'Đang xác minh buôn/làng',
    trang_thai_dia_ban: 'Địa bàn khảo sát dự kiến',
    dia_danh_hien_nay: 'Xã Cư M\'gar, Huyện Cư M\'gar, Tỉnh Đắk Lắk',
    dia_danh_tu_lieu: '',
    mo_ta: '',
    lich_su_nguon_goc: '',
    boi_canh_thuc_hanh: '',
    nghe_nhan_nguoi_thuc_hanh: [''],
    nguoi_cung_cap: 'Sở Văn hoá, Thể thao và Du lịch tỉnh Đắk Lắk',
    pham_vi_duoc_phep_su_dung: 'Sử dụng phi thương mại cho nghiên cứu và giáo dục di sản',
    tinh_trang_ghi_danh: 'Di sản văn hoá phi vật thể quốc gia',
    hinh_anh: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    am_thanh: '',
    video: '',
    nguon_tu_lieu: [
      {
        ten_tai_lieu: '',
        don_vi_cung_cap: '',
        tac_gia_nguoi_ghi_nhan: '',
        nam_cong_bo: '2023',
        loai_nguon: 'Chính thức',
        duong_dan: '',
      },
    ],
    toa_do: {
      vi_do: 12.8256,
      kinh_do: 108.0617,
      ten_dia_diem: 'Huyện Cư M\'gar, Tỉnh Đắk Lắk',
    },
  };

  const [formData, setFormData] = useState<DiSan>(initialNewHeritage);

  if (!isOpen) return null;

  const handleEditClick = (h: DiSan) => {
    setEditingHeritage(h);
    setFormData({ ...h });
    setActiveTab('them-moi');
  };

  const handleDeleteClick = async (id: string) => {
    if (confirm(`Bạn có chắc chắn muốn xoá bản ghi di sản mã "${id}" khỏi hệ thống?`)) {
      const updated = heritages.filter((h) => h.id !== id);
      setIsSaving(true);
      try {
        await onSaveHeritages(updated);
        setStatusMessage({ text: `Đã xoá bản ghi ${id} thành công!`, type: 'success' });
      } catch (err: any) {
        setStatusMessage({ text: `Lỗi khi lưu: ${err.message}`, type: 'error' });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      let updated: DiSan[];
      if (editingHeritage) {
        updated = heritages.map((h) => (h.id === editingHeritage.id ? formData : h));
      } else {
        updated = [formData, ...heritages];
      }

      await onSaveHeritages(updated);
      setStatusMessage({
        text: editingHeritage
          ? `Đã cập nhật bản ghi di sản "${formData.ten_di_san}"!`
          : `Đã thêm di sản mới "${formData.ten_di_san}" vào disan.json!`,
        type: 'success',
      });
      setEditingHeritage(null);
      setFormData(initialNewHeritage);
      setActiveTab('danh-sach');
    } catch (err: any) {
      setStatusMessage({ text: `Lỗi khi lưu dữ liệu: ${err.message}`, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Export JSON file
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(heritages, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'disan.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON file
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          await onSaveHeritages(parsed);
          setStatusMessage({ text: `Nhập thành công ${parsed.length} bản ghi từ tệp JSON!`, type: 'success' });
          setActiveTab('danh-sach');
        } else {
          throw new Error('Dữ liệu JSON phải là một mảng bản ghi');
        }
      } catch (err: any) {
        setStatusMessage({ text: `Lỗi định dạng tệp JSON: ${err.message}`, type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-[#D5C6AF] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-[#FAF7F2] border-b border-[#E8DEC8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#992E20] text-white flex items-center justify-center">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2C1D13]">
                Quản lý Dữ liệu Di sản (disan.json)
              </h2>
              <div className="text-xs text-[#7A695B]">
                Cơ chế số hoá, chỉnh sửa và nhập liệu phân tầng buôn/xã cho đề tài J02
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#7A695B] hover:text-[#2C1D13] hover:bg-[#EAE0CE] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#F0E8D9] bg-[#FAF7F2] text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('danh-sach');
              setEditingHeritage(null);
            }}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'danh-sach'
                ? 'border-[#B33927] text-[#B33927]'
                : 'border-transparent text-[#7A695B] hover:text-[#2C1D13]'
            }`}
          >
            Danh sách dữ liệu ({heritages.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('them-moi');
              if (!editingHeritage) setFormData(initialNewHeritage);
            }}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'them-moi'
                ? 'border-[#B33927] text-[#B33927]'
                : 'border-transparent text-[#7A695B] hover:text-[#2C1D13]'
            }`}
          >
            {editingHeritage ? `Sửa: ${editingHeritage.ten_di_san}` : '+ Thêm di sản mới'}
          </button>
          <button
            onClick={() => setActiveTab('nhap-xuat')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'nhap-xuat'
                ? 'border-[#B33927] text-[#B33927]'
                : 'border-transparent text-[#7A695B] hover:text-[#2C1D13]'
            }`}
          >
            Nhập / Xuất file JSON
          </button>
        </div>

        {/* Status notification */}
        {statusMessage && (
          <div
            className={`mx-6 mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-red-50 text-red-900 border border-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'danh-sach' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#7A695B]">
                <span>Danh sách các bản ghi hiện có trong <code className="text-[#992E20] font-mono">disan.json</code>:</span>
                <button
                  onClick={() => {
                    setActiveTab('them-moi');
                    setFormData(initialNewHeritage);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#B33927] text-white font-semibold flex items-center gap-1 hover:bg-[#992E20]"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm bản ghi
                </button>
              </div>

              <div className="space-y-2.5">
                {heritages.map((h) => (
                  <div
                    key={h.id}
                    className="p-3.5 rounded-xl border border-[#E8DEC8] bg-[#FAF7F2] hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-[#EAE0CE] text-[#4A3B32]">
                          {h.id}
                        </span>
                        <strong className="text-sm font-serif text-[#2C1D13]">{h.ten_di_san}</strong>
                        <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold border border-amber-200">
                          {h.trang_thai_dia_ban}
                        </span>
                      </div>
                      <div className="text-[#7A695B]">
                        {h.dan_toc} • {h.dia_danh_hien_nay} • {h.loai_hinh}
                        {h.buon_lang && ` • Buôn: ${h.buon_lang}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleEditClick(h)}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-[#D5C6AF] hover:bg-[#EAE0CE] text-[#3B281B] flex items-center gap-1"
                        title="Chỉnh sửa bản ghi"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteClick(h.id)}
                        className="p-1.5 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 text-red-700"
                        title="Xoá bản ghi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'them-moi' && (
            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 leading-relaxed">
                <strong>Quy tắc cập nhật địa bàn Đề tài J02:</strong> Phân định rõ Vùng văn hoá (Tây Nguyên), Dân tộc (Người Ê Đê), Tỉnh (Đắk Lắk), Xã (Cư M'gar - địa bàn khảo sát) và Buôn cụ thể. 
                Nếu chưa có nguồn xác minh buôn, để trạng thái <em>"Đang xác minh địa bàn"</em>.
              </div>

              {/* Status Flag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8]">
                <div>
                  <label className="block font-semibold text-[#3B281B] mb-1">Trạng thái địa bàn khảo sát *</label>
                  <select
                    value={formData.trang_thai_dia_ban}
                    onChange={(e) => setFormData({ ...formData, trang_thai_dia_ban: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#D5C6AF]"
                  >
                    <option value="Địa bàn khảo sát dự kiến">Địa bàn khảo sát dự kiến (Xã Cư M'gar)</option>
                    <option value="Đang xác minh địa bàn">Đang xác minh địa bàn / Buôn cụ thể</option>
                    <option value="Đã xác minh">Đã xác minh có nguồn thực địa</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#3B281B] mb-1">Buôn / Làng cụ thể (nếu có nguồn)</label>
                  <input
                    type="text"
                    value={formData.buon_lang || ''}
                    onChange={(e) => setFormData({ ...formData, buon_lang: e.target.value })}
                    placeholder="Ví dụ: Buôn A, Buôn K'na... hoặc 'Đang xác minh buôn/làng'"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#D5C6AF]"
                  />
                </div>
              </div>

              {/* Grid Inputs for required fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#3B281B] mb-1">Mã định danh (id) *</label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D5C6AF]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3B281B] mb-1">Tên di sản chính thức *</label>
                  <input
                    type="text"
                    required
                    value={formData.ten_di_san}
                    onChange={(e) => setFormData({ ...formData, ten_di_san: e.target.value })}
                    placeholder="Ví dụ: Lời nói vần của người Ê Đê"
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D5C6AF]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3B281B] mb-1">Tên gọi bản địa (tiếng Ê Đê) *</label>
                  <input
                    type="text"
                    required
                    value={formData.ten_ban_dia}
                    onChange={(e) => setFormData({ ...formData, ten_ban_dia: e.target.value })}
                    placeholder="Ví dụ: Klei đúm"
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D5C6AF]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3B281B] mb-1">Chú giải tiếng Việt phổ thông</label>
                  <input
                    type="text"
                    value={formData.chu_giai_ten_ban_dia || ''}
                    onChange={(e) => setFormData({ ...formData, chu_giai_ten_ban_dia: e.target.value })}
                    placeholder="Ý nghĩa của tên bản địa..."
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D5C6AF]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3B281B] mb-1">Loại hình di sản *</label>
                  <select
                    value={formData.loai_hinh}
                    onChange={(e) => setFormData({ ...formData, loai_hinh: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D5C6AF]"
                  >
                    <option value="Nghệ thuật trình diễn dân gian">Nghệ thuật trình diễn dân gian</option>
                    <option value="Tập quán xã hội và tín ngưỡng">Tập quán xã hội và tín ngưỡng</option>
                    <option value="Lễ hội truyền thống">Lễ hội truyền thống</option>
                    <option value="Nghề thủ công truyền thống">Nghề thủ công truyền thống</option>
                    <option value="Tiếng nói, chữ viết">Tiếng nói, chữ viết</option>
                    <option value="Tri thức dân gian">Tri thức dân gian</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#3B281B] mb-1">Vùng văn hoá *</label>
                  <input
                    type="text"
                    required
                    value={formData.vung_van_hoa}
                    onChange={(e) => setFormData({ ...formData, vung_van_hoa: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D5C6AF]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3B281B] mb-1">Dân tộc / Cộng đồng *</label>
                  <input
                    type="text"
                    required
                    value={formData.dan_toc}
                    onChange={(e) => setFormData({ ...formData, dan_toc: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D5C6AF]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3B281B] mb-1">Tỉnh / Thành phố *</label>
                  <input
                    type="text"
                    required
                    value={formData.tinh_thanh || 'Tỉnh Đắk Lắk'}
                    onChange={(e) => setFormData({ ...formData, tinh_thanh: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D5C6AF]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3B281B] mb-1">Huyện / Thị xã *</label>
                  <input
                    type="text"
                    required
                    value={formData.huyen_thi || 'Huyện Cư M\'gar'}
                    onChange={(e) => setFormData({ ...formData, huyen_thi: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D5C6AF]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3B281B] mb-1">Xã / Phường *</label>
                  <input
                    type="text"
                    required
                    value={formData.xa_phuong || 'Xã Cư M\'gar (Địa bàn khảo sát dự kiến)'}
                    onChange={(e) => setFormData({ ...formData, xa_phuong: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D5C6AF]"
                  />
                </div>
              </div>

              {/* Textareas */}
              <div>
                <label className="block font-semibold text-[#3B281B] mb-1">Mô tả và Đặc điểm di sản *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.mo_ta}
                  onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D5C6AF]"
                />
              </div>

              {/* Coordinates Section */}
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] space-y-2">
                <span className="font-bold text-[#3B281B] block">Toạ độ địa lý (Chỉ nhập khi có toạ độ xác thực)</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="Vĩ độ (vd: 12.8256)"
                    value={formData.toa_do?.vi_do || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        toa_do: e.target.value ? {
                          vi_do: parseFloat(e.target.value) || 0,
                          kinh_do: formData.toa_do?.kinh_do || 0,
                          ten_dia_diem: formData.toa_do?.ten_dia_diem || '',
                        } : null,
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#D5C6AF]"
                  />
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="Kinh độ (vd: 108.0617)"
                    value={formData.toa_do?.kinh_do || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        toa_do: e.target.value ? {
                          vi_do: formData.toa_do?.vi_do || 0,
                          kinh_do: parseFloat(e.target.value) || 0,
                          ten_dia_diem: formData.toa_do?.ten_dia_diem || '',
                        } : null,
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#D5C6AF]"
                  />
                  <input
                    type="text"
                    placeholder="Tên địa điểm toạ độ"
                    value={formData.toa_do?.ten_dia_diem || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        toa_do: formData.toa_do ? {
                          ...formData.toa_do,
                          ten_dia_diem: e.target.value,
                        } : null,
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#D5C6AF]"
                  />
                </div>
              </div>

              {/* Source Details */}
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] space-y-2">
                <span className="font-bold text-[#3B281B] block">Nguồn tư liệu thẩm định riêng của di sản *</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Tên tài liệu / Quyết định công bố..."
                    value={formData.nguon_tu_lieu[0]?.ten_tai_lieu || ''}
                    onChange={(e) => {
                      const updatedSources = [...formData.nguon_tu_lieu];
                      updatedSources[0].ten_tai_lieu = e.target.value;
                      setFormData({ ...formData, nguon_tu_lieu: updatedSources });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#D5C6AF]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Tác giả / Người ghi nhận..."
                    value={formData.nguon_tu_lieu[0]?.tac_gia_nguoi_ghi_nhan || ''}
                    onChange={(e) => {
                      const updatedSources = [...formData.nguon_tu_lieu];
                      updatedSources[0].tac_gia_nguoi_ghi_nhan = e.target.value;
                      setFormData({ ...formData, nguon_tu_lieu: updatedSources });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#D5C6AF]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0E8D9]">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('danh-sach');
                    setEditingHeritage(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#4A3B32] border border-[#D5C6AF] hover:bg-[#EAE0CE]"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#B33927] hover:bg-[#992E20] text-white font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingHeritage ? 'Lưu cập nhật' : 'Thêm vào cơ sở dữ liệu'}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'nhap-xuat' && (
            <div className="space-y-6 text-xs">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC8] space-y-3">
                <h3 className="font-serif font-bold text-base text-[#2C1D13] flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#B33927]" />
                  Tải xuất tệp disan.json
                </h3>
                <p className="text-[#59493E] leading-relaxed">
                  Xuất toàn bộ {heritages.length} bản ghi hiện tại thành tệp <code className="font-mono text-[#B33927]">disan.json</code> để lưu trữ, phục vụ báo cáo tiến độ đề tài J02.
                </p>
                <button
                  onClick={handleExportJSON}
                  className="px-4 py-2 rounded-xl bg-[#B33927] hover:bg-[#992E20] text-white font-semibold flex items-center gap-2 shadow-2xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải về tệp disan.json ({heritages.length} bản ghi)</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC8] space-y-3">
                <h3 className="font-serif font-bold text-base text-[#2C1D13] flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#059669]" />
                  Nhập dữ liệu từ tệp JSON bên ngoài
                </h3>
                <p className="text-[#59493E] leading-relaxed">
                  Chọn tệp <code className="font-mono text-[#059669]">.json</code> chứa danh sách các di sản người Ê Đê để nạp vào hệ thống.
                </p>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportJSON}
                  className="block text-xs text-[#59493E] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#059669] file:text-white hover:file:bg-[#047857] cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <h3 className="font-serif font-bold text-base text-amber-950 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-800" />
                  Khôi phục dữ liệu gốc Đề tài J02
                </h3>
                <p className="text-amber-900 leading-relaxed">
                  Đặt lại hệ thống về bộ dữ liệu di sản người Ê Đê tại Đắk Lắk đã thẩm định.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Khôi phục về dữ liệu di sản gốc của đề tài J02?')) {
                      onResetToDefault();
                      setStatusMessage({ text: 'Đã khôi phục dữ liệu gốc!', type: 'success' });
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Khôi phục dữ liệu gốc</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
