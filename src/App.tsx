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

import { EDE_HERITAGES_15 } from './data/edeHeritageData';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ManHinhId>('trang-chu');
  const [heritages, setHeritages] = useState<DiSan[]>(EDE_HERITAGES_15);
  const [selectedHeritage, setSelectedHeritage] = useState<DiSan | null>(null);
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
  const [geminiInitialHeritageId, setGeminiInitialHeritageId] = useState<string | undefined>(undefined);

  // Load heritages from backend /api/disan, localStorage, or fallback disan.json
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/disan');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setHeritages(data);
            localStorage.setItem('j02_ede_heritages', JSON.stringify(data));
            return;
          }
        }

        const localCached = localStorage.getItem('j02_ede_heritages');
        if (localCached) {
          const parsed = JSON.parse(localCached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setHeritages(parsed);
            return;
          }
        }

        const fallbackRes = await fetch('/disan.json');
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          if (Array.isArray(fallbackData) && fallbackData.length > 0) {
            setHeritages(fallbackData);
            localStorage.setItem('j02_ede_heritages', JSON.stringify(fallbackData));
            return;
          }
        }
      } catch (err) {
        console.warn('Sử dụng dữ liệu khởi tạo mặc định:', err);
      }
    }

    loadData();
  }, []);

  // Save heritages to backend, state, and localStorage
  const handleSaveHeritages = async (updated: DiSan[]) => {
    try {
      localStorage.setItem('j02_ede_heritages', JSON.stringify(updated));
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
    localStorage.removeItem('j02_ede_heritages');
    await handleSaveHeritages(EDE_HERITAGES_15);
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
