export interface NguonTuLieu {
  ten_tai_lieu: string;
  don_vi_cung_cap: string;
  tac_gia_nguoi_ghi_nhan: string;
  nam_cong_bo: string;
  loai_nguon: 'Chính thức' | 'Nghiên cứu' | 'Cộng đồng cung cấp';
  duong_dan?: string;
}

export interface ToaDo {
  vi_do: number;
  kinh_do: number;
  ten_dia_diem: string;
}

export interface DiSan {
  id: string;
  la_du_lieu_minh_hoa?: boolean;
  ghi_chu_minh_hoa?: string;
  ten_di_san: string;
  ten_ban_dia: string;
  chu_giai_ten_ban_dia?: string;
  loai_hinh: string;
  
  // Specific geographic & community stratification
  vung_van_hoa: string; // "Tây Nguyên"
  dan_toc: string; // "Người Ê Đê"
  tinh_thanh: string; // "Tỉnh Đắk Lắk"
  huyen_thi: string; // "Huyện Cư M'gar" | "TP. Buôn Ma Thuột" | ...
  xa_phuong: string; // "Xã Cư M'gar (Địa bàn khảo sát dự kiến)" | ...
  buon_lang: string; // Tên buôn xác thực hoặc "Đang xác minh buôn/làng"
  trang_thai_dia_ban: 'Đã xác minh' | 'Đang xác minh địa bàn' | 'Địa bàn khảo sát dự kiến';

  dia_danh_hien_nay: string;
  dia_danh_tu_lieu: string;
  mo_ta: string;
  lich_su_nguon_goc: string;
  boi_canh_thuc_hanh: string;
  nghe_nhan_nguoi_thuc_hanh: string[];
  nguoi_cung_cap: string;
  pham_vi_duoc_phep_su_dung: string;
  tinh_trang_ghi_danh: string;
  hinh_anh: string;
  am_thanh?: string;
  video?: string;
  nguon_tu_lieu: NguonTuLieu[];
  toa_do: ToaDo | null;
}

export interface HoatDongTruyenDay {
  id: string;
  ten_hoat_dong: string;
  di_san_lien_quan_id: string;
  nghe_nhan_huong_dan: string;
  don_vi_to_chuc: string;
  dia_diem: string;
  thoi_gian: string;
  doi_tuong_tham_gia: string;
  mo_ta: string;
  loai_hinh: string;
  dia_phuong: string;
  nguon_xac_thuc: string;
}

export type ManHinhId =
  | 'trang-chu'
  | 'ban-do'
  | 'danh-sach'
  | 'chi-tiet'
  | 'truyen-day'
  | 'hoi-dap-gemini'
  | 'nguon-tu-lieu'
  | 'gioi-thieu';
