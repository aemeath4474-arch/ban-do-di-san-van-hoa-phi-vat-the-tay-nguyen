/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { MapView } from './components/MapView';
import { HeritageListView } from './components/HeritageListView';
import { HeritageDetailView } from './components/HeritageDetailView';
import { TransmissionView } from './components/TransmissionView';
import { GeminiQAView } from './components/GeminiQAView';
import { SourcesAndCommunityView } from './components/SourcesAndCommunityView';
import { AboutView } from './components/AboutView';
import { DataManagementModal } from './components/DataManagementModal';
import { DiSan, ManHinhId } from './types/heritage';

// Initial verified records for J02: Tay Nguyen - E De community in Dak Lak
const INITIAL_EDE_HERITAGES: DiSan[] = [
  {
    id: "DS-TN-EDE-001",
    la_du_lieu_minh_hoa: false,
    ghi_chu_minh_hoa: "Di sản văn hoá phi vật thể đại diện của nhân loại được UNESCO ghi danh. Đã đối chiếu hồ sơ chính thức.",
    ten_di_san: "Không gian văn hoá Cồng chiêng Tây Nguyên (Cộng đồng người Ê Đê)",
    ten_ban_dia: "Ching Êđê / Ching K’nah",
    chu_giai_ten_ban_dia: "\"Ching\" là cồng chiêng. Bộ chiêng K’nah của người Ê Đê gồm có chiêng bằng (k'nah) và chiêng núm (ching), thường đi cùng trống H’gơr, thanh la Chêch tạo thành dàn nhạc thiêng liêng.",
    loai_hinh: "Nghệ thuật trình diễn dân gian",
    vung_van_hoa: "Tây Nguyên",
    dan_toc: "Người Ê Đê",
    tinh_thanh: "Tỉnh Đắk Lắk",
    huyen_thi: "TP. Buôn Ma Thuột & Huyện Cư M'gar",
    xa_phuong: "Xã Cư M'gar (Địa bàn khảo sát dự kiến)",
    buon_lang: "Đang xác minh buôn/làng tại địa bàn khảo sát",
    trang_thai_dia_ban: "Địa bàn khảo sát dự kiến",
    dia_danh_hien_nay: "Xã Cư M'gar, Huyện Cư M'gar và các buôn trên địa bàn tỉnh Đắk Lắk",
    dia_danh_tu_lieu: "Cao nguyên Đắk Lắk (Đàng Gar / M'gar)",
    mo_ta: "Không gian văn hoá Cồng chiêng của người Ê Đê gắn bó mật thiết với vòng đời người (lễ thổi tai đặt tên, lễ trưởng thành) và chu kỳ nông nghiệp (lễ tỉa bắp, lễ mừng cơm mới, lễ cúng bến nước). Âm vang cồng chiêng là phương tiện kết nối con người với thế giới thần linh (Yang) và gắn kết cộng đồng buôn làng.",
    lich_su_nguon_goc: "Tư liệu dân tộc học khẳng định cồng chiêng gắn liền với văn minh nương rẫy mẫu hệ Tây Nguyên từ thời tiền sử, truyền nối qua hàng chục thế hệ người Ê Đê.",
    boi_canh_thuc_hanh: "Thực hành trong gian Gah (gian khách) của nhà dài truyền thống, trước sân nhà dài và tại các lễ hội chung của buôn làng.",
    nghe_nhan_nguoi_thuc_hanh: [
      "Nghệ nhân Ưu tú Y Mip Ayun (Đắk Lắk - được phép công khai)",
      "Đội chiêng buôn buôn làng (Đang lập danh mục xác minh nghệ nhân tại xã Cư M'gar)"
    ],
    nguoi_cung_cap: "Sở Văn hoá, Thể thao và Du lịch tỉnh Đắk Lắk; Bảo tàng Đắk Lắk",
    pham_vi_duoc_phep_su_dung: "Sử dụng phục vụ nghiên cứu khoa học, giáo dục di sản và số hoá văn hoá cộng đồng phi lợi nhuận.",
    tinh_trang_ghi_danh: "Di sản văn hoá phi vật thể đại diện của nhân loại (UNESCO công nhận năm 2008, ghi danh năm 2005)",
    hinh_anh: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    am_thanh: "https://actions.google.com/sounds/v1/ambiences/temple_bell_reverb.ogg",
    video: "",
    nguon_tu_lieu: [
      {
        ten_tai_lieu: "Hồ sơ đệ trình UNESCO Kiệt tác truyền khẩu và phi vật thể nhân loại Không gian văn hoá Cồng chiêng Tây Nguyên",
        don_vi_cung_cap: "Cục Di sản văn hoá - Bộ Văn hoá, Thể thao và Du lịch",
        tac_gia_nguoi_ghi_nhan: "Viện Văn hoá Nghệ thuật Quốc gia Việt Nam",
        nam_cong_bo: "2005",
        loai_nguon: "Chính thức",
        duong_dan: "http://dsvh.gov.vn"
      },
      {
        ten_tai_lieu: "Âm nhạc cồng chiêng Êđê",
        don_vi_cung_cap: "Nhà xuất bản Âm nhạc",
        tac_gia_nguoi_ghi_nhan: "Tô Ngọc Thanh",
        nam_cong_bo: "1995",
        loai_nguon: "Nghiên cứu"
      }
    ],
    toa_do: {
      vi_do: 12.8256,
      kinh_do: 108.0617,
      ten_dia_diem: "Khu vực Huyện Cư M'gar, Tỉnh Đắk Lắk (Địa bàn khảo sát)"
    }
  },
  {
    "id": "DS-TN-EDE-002",
    "la_du_lieu_minh_hoa": false,
    "ghi_chu_minh_hoa": "Di sản văn hoá phi vật thể quốc gia theo Quyết định số 2684/QĐ-BVHTTDL.",
    "ten_di_san": "Sử thi Ê Đê (Khan Êđê)",
    "ten_ban_dia": "Klei Khan (Khan Đam San, Khan Đam Kteh Mlan)",
    "chu_giai_ten_ban_dia": "\"Klei\" nghĩa là lời, chuyện; \"Khan\" là hát kể sử thi. Klei Khan là nghệ thuật hát kể các trường ca anh hùng của dân tộc Ê Đê.",
    "loai_hinh": "Nghệ thuật trình diễn dân gian",
    "vung_van_hoa": "Tây Nguyên",
    "dan_toc": "Người Ê Đê",
    "tinh_thanh": "Tỉnh Đắk Lắk",
    "huyen_thi": "Huyện Cư M'gar & Huyện Krông Năng",
    "xa_phuong": "Xã Cư M'gar (Địa bàn khảo sát dự kiến)",
    "buon_lang": "Đang xác minh buôn/làng có nghệ nhân kể Khan",
    "trang_thai_dia_ban": "Đang xác minh địa bàn",
    "dia_danh_hien_nay": "Tỉnh Đắk Lắk (Đang khảo sát sâu tại xã Cư M'gar)",
    "dia_danh_tu_lieu": "Vùng cư trú mẫu hệ người Ê Đê Đắk Lắk",
    "mo_ta": "Sử thi Ê Đê (Klei Khan) là kho tàng văn học dân gian truyền khẩu đồ sộ, ngợi ca các tù trưởng anh hùng giàu mạnh, dũng cảm, bảo vệ buôn làng chống lại thú dữ và kẻ thù. Người kể Khan (Pơ Khan) nằm hát kể bên bếp lửa suốt đêm, diễn tả tâm trạng và hành động của nhân vật bằng giọng điệu truyền cảm.",
    "lich_su_nguon_goc": "Được truyền miệng qua nhiều thế kỷ, tiêu biểu là bộ sử thi Đam San do học giả L. Sabatier sưu tầm và công bố năm 1927.",
    "boi_canh_thuc_hanh": "Thực hành ban đêm bên bếp lửa nhà dài, trong các dịp mừng lúa mới, lễ hội buôn làng hoặc những đêm rỗi việc nương rẫy.",
    "nghe_nhan_nguoi_thuc_hanh": [
      "Nghệ nhân Nhân dân Y Wang Hwing (Đắk Lắk - được phép công khai)",
      "Đang xác minh nghệ nhân hát kể Khan tại xã Cư M'gar"
    ],
    "nguoi_cung_cap": "Hội Văn học Nghệ thuật các dân tộc thiểu số tỉnh Đắk Lắk",
    "pham_vi_duoc_phep_su_dung": "Lưu trữ số hoá văn học dân gian và bảo tồn ngữ âm bản địa.",
    "tinh_trang_ghi_danh": "Di sản văn hoá phi vật thể quốc gia (Bộ VHTTDL ghi danh năm 2014 theo QĐ số 2684/QĐ-BVHTTDL)",
    "hinh_anh": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80",
    "am_thanh": "",
    "video": "",
    "nguon_tu_lieu": [
      {
        "ten_tai_lieu": "Quyết định số 2684/QĐ-BVHTTDL công bố Danh mục Di sản văn hoá phi vật thể quốc gia",
        "don_vi_cung_cap": "Bộ Văn hoá, Thể thao và Du lịch",
        "tac_gia_nguoi_ghi_nhan": "Bộ VHTTDL",
        "nam_cong_bo": "2014",
        "loai_nguon": "Chính thức",
        "duong_dan": "http://bvhttdl.gov.vn"
      },
      {
        "ten_tai_lieu": "Kho tàng Sử thi Tây Nguyên - Sử thi Êđê Đam San",
        "don_vi_cung_cap": "Nhà xuất bản Khoa học Xã hội",
        "tac_gia_nguoi_ghi_nhan": "Viện Nghiên cứu Văn hoá Dân gian",
        "nam_cong_bo": "2003",
        "loai_nguon": "Nghiên cứu"
      }
    ],
    "toa_do": {
      "vi_do": 12.6738,
      "kinh_do": 108.0378,
      "ten_dia_diem": "TP. Buôn Ma Thuột, Tỉnh Đắk Lắk"
    }
  },
  {
    "id": "DS-TN-EDE-003",
    "la_du_lieu_minh_hoa": false,
    "ghi_chu_minh_hoa": "Di sản văn hoá phi vật thể quốc gia theo Quyết định số 1673/QĐ-BVHTTDL ngày 27/05/2021.",
    "ten_di_san": "Lời nói vần của người Ê Đê (Klei đúm)",
    "ten_ban_dia": "Klei đúm (Klei Duôm / Klei K'dăm)",
    "chu_giai_ten_ban_dia": "\"Klei đúm\" là lời nói có vần có điệu, cấu trúc đối xứng nhịp nhàng, là phương thức diễn đạt truyền thống cô đọng trí tuệ của người Ê Đê.",
    "loai_hinh": "Tập quán xã hội và tín ngưỡng",
    "vung_van_hoa": "Tây Nguyên",
    "dan_toc": "Người Ê Đê",
    "tinh_thanh": "Tỉnh Đắk Lắk",
    "huyen_thi": "Huyện Cư M'gar",
    "xa_phuong": "Xã Cư M'gar (Địa bàn khảo sát dự kiến)",
    "buon_lang": "Đang xác minh buôn/làng tại địa bàn khảo sát",
    "trang_thai_dia_ban": "Địa bàn khảo sát dự kiến",
    "dia_danh_hien_nay": "Huyện Cư M'gar và các huyện thị trên địa bàn tỉnh Đắk Lắk",
    "dia_danh_tu_lieu": "Huyện Cư M'gar, Đắk Lắk",
    "mo_ta": "Lời nói vần (Klei đúm) là tri thức dân gian đặc sắc được người Ê Đê đúc kết qua nhiều thế hệ, sử dụng vần lưng, vần chân linh hoạt để răn dạy con cháu phép ứng xử trong gia đình mẫu hệ, bảo vệ rừng, tôn trọng luật tục buôn làng và giải quyết mâu thuẫn xã hội.",
    "lich_su_nguon_goc": "Bắt nguồn từ ngôn ngữ truyền khẩu của người Ê Đê, gắn liền với tập quán xét xử luật tục (Klei phat kdi) và giao tiếp đời sống hàng ngày.",
    "boi_canh_thuc_hanh": "Thực hành trong các buổi xét xử luật tục buôn làng, lời hát ru của bà và mẹ, các cuộc đối đáp tâm tình bên ché rượu cần và khuyên răn con cháu.",
    "nghe_nhan_nguoi_thuc_hanh": [
      "Nghệ nhân Aê H'Ngoan (Cư M'gar, Đắk Lắk - được phép công khai)",
      "Đang tiếp tục khảo sát nghệ nhân lời nói vần tại xã Cư M'gar"
    ],
    "nguoi_cung_cap": "Phòng Văn hoá - Thông tin Huyện Cư M'gar phối hợp Sở VHTTDL Đắk Lắk",
    "pham_vi_duoc_phep_su_dung": "Nghiên cứu ngôn ngữ tộc người và bảo tồn tiếng nói bản địa.",
    "tinh_trang_ghi_danh": "Di sản văn hoá phi vật thể quốc gia (Bộ VHTTDL ghi danh năm 2021 theo QĐ số 1673/QĐ-BVHTTDL)",
    "hinh_anh": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
    "am_thanh": "",
    "video": "",
    "nguon_tu_lieu": [
      {
        "ten_tai_lieu": "Quyết định số 1673/QĐ-BVHTTDL đưa Lời nói vần của người Êđê huyện Cư M'gar vào Danh mục Di sản văn hoá phi vật thể quốc gia",
        "don_vi_cung_cap": "Bộ Văn hoá, Thể thao và Du lịch",
        "tac_gia_nguoi_ghi_nhan": "Bộ trưởng Bộ VHTTDL",
        "nam_cong_bo": "2021",
        "loai_nguon": "Chính thức",
        "duong_dan": "http://dsvh.gov.vn"
      },
      {
        "ten_tai_lieu": "Luật tục Êđê - Lời nói vần trong xét xử và đời sống cộng đồng",
        "don_vi_cung_cap": "Nhà xuất bản Văn hoá Dân tộc",
        "tac_gia_nguoi_ghi_nhan": "Ngô Đức Thịnh, Chu Thái Sơn",
        "nam_cong_bo": "1996",
        "loai_nguon": "Nghiên cứu"
      }
    ],
    "toa_do": {
      "vi_do": 12.8256,
      "kinh_do": 108.0617,
      "ten_dia_diem": "Huyện Cư M'gar, Tỉnh Đắk Lắk"
    }
  },
  {
    "id": "DS-TN-EDE-004",
    "la_du_lieu_minh_hoa": false,
    "ghi_chu_minh_hoa": "Di sản văn hoá phi vật thể quốc gia theo Quyết định của Bộ VHTTDL năm 2020.",
    "ten_di_san": "Nghệ thuật dệt thổ cẩm của người Ê Đê",
    "ten_ban_dia": "Mnơng mnga mtô (Dệt hoa văn vải cổ truyền)",
    "chu_giai_ten_ban_dia": "\"Mnơng mnga mtô\" là việc tạo hoa văn trên trang phục truyền thống bằng sợi bông dệt tay với các dải màu chàm, đỏ, vàng, trắng đặc trưng.",
    "loai_hinh": "Nghề thủ công truyền thống",
    "vung_van_hoa": "Tây Nguyên",
    "dan_toc": "Người Ê Đê",
    "tinh_thanh": "Tỉnh Đắk Lắk",
    "huyen_thi": "Thị xã Buôn Hồ & Huyện Cư M'gar",
    "xa_phuong": "Xã Cư M'gar (Địa bàn khảo sát dự kiến)",
    "buon_lang": "Đang xác minh buôn/làng có nghề dệt đang hoạt động",
    "trang_thai_dia_ban": "Đang xác minh địa bàn",
    "dia_danh_hien_nay": "Tỉnh Đắk Lắk (Đang khảo sát thực địa tại xã Cư M'gar)",
    "dia_danh_tu_lieu": "Các buôn làng người Ê Đê Kpă và Ê Đê Adham",
    "mo_ta": "Nghề dệt thổ cẩm truyền thống của người Ê Đê sử dụng khung cửi luồn chân (khung dệt ngồi bệt giương chân kéo căng sợi), nhuộm sợi từ vỏ cây rừng, củ nâu và bùn chàm. Hoa văn trên áo, váy (Kteh), khố (Kpin) thể hiện rồng đất (Kưt), chim, rùa và cành lá hình học biểu thị thế giới quan mẫu hệ.",
    "lich_su_nguon_goc": "Là tiêu chuẩn đạo đức và sự khéo léo của người phụ nữ Ê Đê trong chế độ mẫu hệ, được truyền dạy từ mẹ sang con gái qua nhiều thế hệ.",
    "boi_canh_thuc_hanh": "Dệt vào thời gian rảnh rỗi nông nhàn tại gian Ôk (gian sinh hoạt gia đình) của nhà dài hoặc dưới bóng cây trong sân buôn.",
    "nghe_nhan_nguoi_thuc_hanh": [
      "Nghệ nhân H'Yam Bkrông (Đắk Lắk - được phép công khai)",
      "Đang xác minh nghệ nhân dệt tại xã Cư M'gar"
    ],
    "nguoi_cung_cap": "Bảo tàng Đắk Lắk và Hợp tác xã dệt thổ cẩm buôn Tơng Jút",
    "pham_vi_duoc_phep_su_dung": "Giới thiệu trang phục dân tộc, đào tạo nghề truyền thống và bảo tồn di sản phi thương mại.",
    "tinh_trang_ghi_danh": "Di sản văn hoá phi vật thể quốc gia (Bộ VHTTDL ghi danh năm 2020)",
    "hinh_anh": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
    "am_thanh": "",
    "video": "",
    "nguon_tu_lieu": [
      {
        "ten_tai_lieu": "Trang phục cổ truyền và kỹ thuật dệt thổ cẩm Êđê",
        "don_vi_cung_cap": "Viện Mỹ thuật - Trường ĐH Mỹ thuật Việt Nam",
        "tac_gia_nguoi_ghi_nhan": "Nguyễn Văn Huy",
        "nam_cong_bo": "2018",
        "loai_nguon": "Nghiên cứu"
      },
      {
        "ten_tai_lieu": "Quyết định công bố Di sản Nghề dệt thổ cẩm người Êđê tỉnh Đắk Lắk",
        "don_vi_cung_cap": "Bộ Văn hoá, Thể thao và Du lịch",
        "tac_gia_nguoi_ghi_nhan": "Bộ VHTTDL",
        "nam_cong_bo": "2020",
        "loai_nguon": "Chính thức"
      }
    ],
    "toa_do": {
      "vi_do": 12.9238,
      "kinh_do": 108.1812,
      "ten_dia_diem": "Khu vực Buôn Hồ / Cư M'gar, Đắk Lắk"
    }
  },
  {
    "id": "DS-TN-EDE-005",
    "la_du_lieu_minh_hoa": false,
    "ghi_chu_minh_hoa": "Di sản trong danh mục kiểm kê di sản văn hoá phi vật thể tỉnh Đắk Lắk.",
    "ten_di_san": "Lễ cúng bến nước của người Ê Đê",
    "ten_ban_dia": "Ngă ngê kơ đêi êa (Lễ tạ ơn Yang Êa)",
    "chu_giai_ten_ban_dia": "\"Ngă ngê\" là làm lễ cúng, \"kơ đêi êa\" là bến nước. Đây là nghi lễ tạ ơn thần nước (Yang Êa) và tổ chức dọn rửa bến nước buôn làng sau mùa thu hoạch.",
    "loai_hinh": "Lễ hội truyền thống",
    "vung_van_hoa": "Tây Nguyên",
    "dan_toc": "Người Ê Đê",
    "tinh_thanh": "Tỉnh Đắk Lắk",
    "huyen_thi": "Huyện Cư M'gar & Huyện Krông Ana",
    "xa_phuong": "Xã Cư M'gar (Địa bàn khảo sát dự kiến)",
    "buon_lang": "Chưa có tư liệu xác thực tại địa bàn khảo sát cụ thể",
    "trang_thai_dia_ban": "Đang xác minh địa bàn",
    "dia_danh_hien_nay": "Tỉnh Đắk Lắk (Xã Cư M'gar hiện đang khảo sát)",
    "dia_danh_tu_lieu": "Các bến nước tự nhiên đầu nguồn tại Đắk Lắk",
    "mo_ta": "Lễ cúng bến nước diễn ra hàng năm vào khoảng tháng Chạp hoặc tháng Giêng sau khi thu hoạch lúa rẫy. Thầy cúng (Pơ phao) cùng chủ bến nước dâng lễ vật (rượu cần, gà, heo) tạ ơn Yang Êa đã cho nguồn nước trong lành, cầu chúc buôn làng ấm no, khoẻ mạnh, không có dịch bệnh.",
    "lich_su_nguon_goc": "Bắt nguồn từ tín ngưỡng vạn vật hữu linh và ý thức bảo vệ nguồn nước đầu nguồn của cư dân nông nghiệp nương rẫy Tây Nguyên.",
    "boi_canh_thuc_hanh": "Thực hành tại đầu nguồn bến nước tự nhiên của buôn và tại nhà dài của chủ bến nước.",
    "nghe_nhan_nguoi_thuc_hanh": [
      "Thầy cúng buôn làng (Đang xác minh thầy cúng có tư liệu được phép công khai tại xã Cư M'gar)"
    ],
    "nguoi_cung_cap": "Sở Văn hoá, Thể thao và Du lịch tỉnh Đắk Lắk (Tư liệu kiểm kê di sản lễ hội)",
    "pham_vi_duoc_phep_su_dung": "Bảo tồn nghi thức dân gian, giáo dục ý thức bảo vệ môi trường sinh thái nguồn nước.",
    "tinh_trang_ghi_danh": "Trong danh mục kiểm kê di sản văn hoá phi vật thể tỉnh Đắk Lắk",
    "hinh_anh": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80",
    "am_thanh": "",
    "video": "",
    "nguon_tu_lieu": [
      {
        "ten_tai_lieu": "Lễ hội truyền thống các dân tộc thiểu số Đắk Lắk",
        "don_vi_cung_cap": "Sở Văn hoá, Thể thao và Du lịch tỉnh Đắk Lắk",
        "tac_gia_nguoi_ghi_nhan": "Hội Văn nghệ Dân gian Đắk Lắk",
        "nam_cong_bo": "2016",
        "loai_nguon": "Nghiên cứu"
      }
    ],
    "toa_do": null
  },
  {
    "id": "DS-TN-EDE-006",
    "la_du_lieu_minh_hoa": false,
    "ghi_chu_minh_hoa": "Tri thức dân gian về kiến trúc và không gian sinh hoạt nhà dài mẫu hệ người Ê Đê.",
    "ten_di_san": "Tri thức dân gian về Nhà dài của người Ê Đê",
    "ten_ban_dia": "Sang đê (Nhà dài mẫu hệ)",
    "chu_giai_ten_ban_dia": "\"Sang\" nghĩa là nhà, \"Sang đê\" là nhà dài của người Ê Đê theo chế độ mẫu hệ, mỗi khi người con gái trong gia đình lấy chồng thì nhà lại nối dài thêm một nhịp gian.",
    "loai_hinh": "Tri thức dân gian",
    "vung_van_hoa": "Tây Nguyên",
    "dan_toc": "Người Ê Đê",
    "tinh_thanh": "Tỉnh Đắk Lắk",
    "huyen_thi": "Huyện Cư M'gar & TP. Buôn Ma Thuột",
    "xa_phuong": "Xã Cư M'gar (Địa bàn khảo sát dự kiến)",
    "buon_lang": "Đang xác minh buôn/làng tại địa bàn khảo sát",
    "trang_thai_dia_ban": "Đang xác minh địa bàn",
    "dia_danh_hien_nay": "Tỉnh Đắk Lắk (Xã Cư M'gar đang tiến hành kiểm kê thực địa)",
    "dia_danh_tu_lieu": "Các buôn làng truyền thống cao nguyên Đắk Lắk",
    "mo_ta": "Nhà dài Ê Đê là biểu tượng sống động nhất của chế độ mẫu hệ. Cầu thang chính (cầu thang Cái) tạc hình bầu ngực căng tròn và vầng trăng khuyết dành riêng cho phụ nữ và khách quý; cầu thang Đực nhỏ hơn dành cho nam giới. Không gian bên trong chia làm hai phần: gian khách (Gah) đặt bếp lửa, chiêng, ché, ghế Kpan; và gian Ôk chia các buồng ngủ của các cặp vợ chồng theo dòng mẹ.",
    "lich_su_nguon_goc": "Được xây dựng theo quy tắc luật tục truyền đời 'nhà dài như tiếng chiêng ngân', phản ánh sự cố kết dòng họ mẫu hệ.",
    "boi_canh_thuc_hanh": "Không gian sinh sống thường nhật của đại gia đình mẫu hệ, nơi diễn ra mọi nghi lễ, tiếp khách và sinh hoạt cộng đồng.",
    "nghe_nhan_nguoi_thuc_hanh": [
      "Các già làng, thợ mộc làm nhà dài truyền thống (Đang xác minh tại xã Cư M'gar)"
    ],
    "nguoi_cung_cap": "Viện Dân tộc học và Bảo tàng Dân tộc học Việt Nam",
    "pham_vi_duoc_phep_su_dung": "Nghiên cứu kiến trúc dân gian và bảo tồn không gian văn hoá buôn làng.",
    "tinh_trang_ghi_danh": "Đang kiểm kê / Lập hồ sơ di sản cấp quốc gia",
    "hinh_anh": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    "am_thanh": "",
    "video": "",
    "nguon_tu_lieu": [
      {
        "ten_tai_lieu": "Kiến trúc nhà dài Êđê và cấu trúc xã hội truyền thống",
        "don_vi_cung_cap": "Viện Dân tộc học",
        "tac_gia_nguoi_ghi_nhan": "PGS.TS. Nguyễn Khắc Tụng",
        "nam_cong_bo": "1994",
        "loai_nguon": "Nghiên cứu"
      }
    ],
    "toa_do": null
  }
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ManHinhId>('trang-chu');
  const [heritages, setHeritages] = useState<DiSan[]>(INITIAL_EDE_HERITAGES);
  const [selectedHeritage, setSelectedHeritage] = useState<DiSan | null>(null);
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
  const [geminiInitialHeritageId, setGeminiInitialHeritageId] = useState<string | undefined>(undefined);

  // Load heritages from backend /api/disan or public disan.json
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/disan');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setHeritages(data);
            return;
          }
        }

        const fallbackRes = await fetch('/disan.json');
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          if (Array.isArray(fallbackData) && fallbackData.length > 0) {
            setHeritages(fallbackData);
          }
        }
      } catch (err) {
        console.warn('Sử dụng dữ liệu khởi tạo mặc định:', err);
      }
    }

    loadData();
  }, []);

  // Save heritages to backend and state
  const handleSaveHeritages = async (updated: DiSan[]) => {
    try {
      await fetch('/api/disan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      setHeritages(updated);
    } catch (err) {
      console.error('Lỗi lưu server, lưu trên client:', err);
      setHeritages(updated);
    }
  };

  const handleResetToDefault = async () => {
    await handleSaveHeritages(INITIAL_EDE_HERITAGES);
  };

  const handleSelectHeritage = (heritage: DiSan) => {
    setSelectedHeritage(heritage);
    setCurrentScreen('chi-tiet');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHeritageById = (id: string) => {
    const found = heritages.find((h) => h.id === id);
    if (found) {
      handleSelectHeritage(found);
    } else {
      setCurrentScreen('danh-sach');
    }
  };

  const handleAskGeminiAboutHeritage = (heritage: DiSan) => {
    setGeminiInitialHeritageId(heritage.id);
    setCurrentScreen('hoi-dap-gemini');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C1D13] flex flex-col font-sans selection:bg-[#B33927] selection:text-white">
      {/* Global Navigation Bar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDataManagement={() => setIsDataManagementOpen(true)}
        heritageCount={heritages.length}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentScreen === 'trang-chu' && (
          <HomeView
            heritages={heritages}
            onNavigate={(screen) => {
              setCurrentScreen(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectHeritage={handleSelectHeritage}
            onQuickSearch={() => setCurrentScreen('danh-sach')}
          />
        )}

        {currentScreen === 'ban-do' && (
          <MapView
            heritages={heritages}
            onSelectHeritage={handleSelectHeritage}
            onAskGeminiAboutHeritage={handleAskGeminiAboutHeritage}
          />
        )}

        {currentScreen === 'danh-sach' && (
          <HeritageListView
            heritages={heritages}
            onSelectHeritage={handleSelectHeritage}
            onAskGeminiAboutHeritage={handleAskGeminiAboutHeritage}
          />
        )}

        {currentScreen === 'chi-tiet' && selectedHeritage && (
          <HeritageDetailView
            heritage={selectedHeritage}
            onBack={() => setCurrentScreen('danh-sach')}
            onAskGemini={handleAskGeminiAboutHeritage}
          />
        )}

        {currentScreen === 'truyen-day' && (
          <TransmissionView
            heritages={heritages}
            onSelectHeritageById={handleSelectHeritageById}
          />
        )}

        {currentScreen === 'hoi-dap-gemini' && (
          <GeminiQAView
            heritages={heritages}
            initialHeritageId={geminiInitialHeritageId}
            onSelectHeritageById={handleSelectHeritageById}
          />
        )}

        {currentScreen === 'nguon-tu-lieu' && (
          <SourcesAndCommunityView
            heritages={heritages}
            onSelectHeritageById={handleSelectHeritageById}
          />
        )}

        {currentScreen === 'gioi-thieu' && <AboutView />}
      </main>

      {/* Data Management Modal */}
      <DataManagementModal
        isOpen={isDataManagementOpen}
        onClose={() => setIsDataManagementOpen(false)}
        heritages={heritages}
        onSaveHeritages={handleSaveHeritages}
        onResetToDefault={handleResetToDefault}
      />

      {/* Footer with Student Credentials & Project Statement */}
      <footer className="mt-16 bg-[#21150C] text-stone-300 border-t border-[#3E2F24] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Project Brand */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#B33927] text-white flex items-center justify-center font-serif font-black">
                  Ê
                </div>
                <span className="font-serif font-bold text-base text-white">
                  Bản đồ di sản phi vật thể Tây Nguyên
                </span>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed max-w-md">
                Đề tài J02: Nghiên cứu Vùng văn hoá Tây Nguyên và cộng đồng Người Ê Đê tại tỉnh Đắk Lắk. 
                Địa bàn khảo sát dự kiến: Xã Cư M'gar. Cam kết tuân thủ nghiêm ngặt 12 nguyên tắc đạo đức nghiên cứu di sản.
              </p>
              <div className="pt-2 text-amber-300/90 text-xs font-medium">
                Nguyễn Văn An – Mã sinh viên PH70154 – Mã đề tài J02 – Nhóm 1 Đợt 15.
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="space-y-2">
              <div className="text-white font-bold text-xs uppercase">Màn hình chức năng</div>
              <ul className="space-y-1.5 text-stone-400">
                <li><button onClick={() => setCurrentScreen('trang-chu')} className="hover:text-amber-200">1. Trang chủ</button></li>
                <li><button onClick={() => setCurrentScreen('ban-do')} className="hover:text-amber-200">2. Bản đồ di sản</button></li>
                <li><button onClick={() => setCurrentScreen('danh-sach')} className="hover:text-amber-200">3. Danh mục di sản</button></li>
                <li><button onClick={() => setCurrentScreen('truyen-day')} className="hover:text-amber-200">5. Hoạt động truyền dạy</button></li>
                <li><button onClick={() => setCurrentScreen('hoi-dap-gemini')} className="hover:text-amber-200">6. Hỏi đáp Gemini AI</button></li>
                <li><button onClick={() => setCurrentScreen('nguon-tu-lieu')} className="hover:text-amber-200">7. Nguồn tư liệu & Cộng đồng</button></li>
                <li><button onClick={() => setCurrentScreen('gioi-thieu')} className="hover:text-amber-200">8. Giới thiệu đề tài J02</button></li>
              </ul>
            </div>

            {/* Col 3: Research Institution & Ethics */}
            <div className="space-y-2">
              <div className="text-white font-bold text-xs uppercase">Tổ chức thực hiện</div>
              <p className="text-stone-400 text-xs leading-relaxed">
                Sản phẩm thực tập thuộc Chương trình Thực tập sinh Đợt 15 FPT Polytechnic và IMTA TECH, dự án xã hội phi lợi nhuận.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsDataManagementOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#3E2F24] hover:bg-[#4E3B2E] text-amber-100 text-xs font-medium transition-colors border border-[#523F31]"
                >
                  ⚙️ Quản lý & Xuất/Nhập disan.json
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#332215] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
            <div>
              © 2026 Bản đồ Di sản Phi vật thể Tây Nguyên (Người Ê Đê - Đắk Lắk) • Dự án xã hội phi lợi nhuận.
            </div>
            <div>
              Nguyễn Văn An (PH70154) • Đề tài J02 • FPT Polytechnic & IMTA TECH
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
