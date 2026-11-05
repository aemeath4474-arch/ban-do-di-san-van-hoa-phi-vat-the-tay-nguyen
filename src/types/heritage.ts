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
  // 1. Mã tư liệu (Mã định danh duy nhất)
  id: string;
  ma_tu_lieu: string;

  // Dữ liệu thẩm định / nhãn minh họa
  la_du_lieu_minh_hoa?: boolean;
  ghi_chu_minh_hoa?: string;

  // 2. Tên di sản & 3. Tên bản địa
  ten_di_san: string;
  ten_ban_dia: string;
  chu_giai_ten_ban_dia?: string;

  // 4. Loại hình di sản
  loai_hinh: string;
  
  // 5. Cộng đồng chủ thể & 6. Vùng văn hóa & 7. Tỉnh/Thành phố
  dan_toc: string; // Tương thích ngược: "Người Ê Đê"
  cong_dong_chu_the: string; // Chuẩn hóa: "Cộng đồng người Ê Đê (Anak Đê)"
  vung_van_hoa: string; // "Tây Nguyên"
  tinh_thanh: string; // "Tỉnh Đắk Lắk"
  
  // 8. Huyện/Thị & 9. Xã/Phường & 10. Buôn/Làng
  huyen_thi: string; // "Huyện Cư M'gar", "TP. Buôn Ma Thuột", ...
  xa_phuong: string; // "Xã Cư M'gar (Địa bàn khảo sát dự kiến)", ...
  buon_lang: string; // Tên buôn hoặc "Đang xác minh buôn/làng"
  trang_thai_dia_ban?: 'Đã xác minh' | 'Đang xác minh địa bàn' | 'Địa bàn khảo sát dự kiến';

  // 11. Địa danh hiện nay & 12. Địa danh lịch sử
  dia_danh_hien_nay: string;
  dia_danh_lich_su: string;
  dia_danh_tu_lieu?: string; // Tương thích ngược

  // 13. Nội dung mô tả & 14. Giá trị di sản
  mo_ta: string;
  gia_tri_di_san: string;
  lich_su_nguon_goc?: string; // Tương thích ngược
  boi_canh_thuc_hanh?: string; // Tương thích ngược

  // 15. Nghệ nhân / Người thực hành
  nghe_nhan_nguoi_thuc_hanh: string[];

  // 16. Tình trạng bảo tồn & 17. Hoạt động truyền dạy
  tinh_trang_bao_ton: string;
  tinh_trang_ghi_danh?: string; // Tương thích ngược
  hoat_dong_truyen_day: string;

  // 18. Hình ảnh & 19. Video & 20. Âm thanh
  hinh_anh: string;
  video: string;
  am_thanh: string;

  // 21. Nguồn tư liệu & 22. Đường dẫn nguồn
  nguon_tu_lieu: NguonTuLieu[];
  duong_dan_nguon: string;

  // 23. Ngày thu thập & 24. Người thu thập & 25. Quyền sử dụng
  ngay_thu_thap: string;
  nguoi_thu_thap: string;
  quyen_su_dung: string;
  nguoi_cung_cap?: string; // Tương thích ngược
  pham_vi_duoc_phep_su_dung?: string; // Tương thích ngược

  // 26. Trạng thái thẩm định & 27. Phạm vi xác minh
  trang_thai_tham_dinh: 'Đã xác minh' | 'Đã có nhưng cần xác minh' | 'Chưa xác minh';
  pham_vi_xac_minh: string;

  // 28. Thời gian cập nhật
  thoi_gian_cap_nhat: string;

  // 29. Tọa độ GPS gắn với địa bàn thực tế
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
