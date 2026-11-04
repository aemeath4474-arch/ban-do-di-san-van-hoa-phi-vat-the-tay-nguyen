import React from 'react';
import { 
  Compass, 
  MapPin, 
  BookOpen, 
  Sparkles, 
  Users, 
  ShieldCheck, 
  Info, 
  Database,
  Menu,
  X
} from 'lucide-react';
import { ManHinhId } from '../types/heritage';

interface NavbarProps {
  currentScreen: ManHinhId;
  onNavigate: (screen: ManHinhId) => void;
  onOpenDataManagement: () => void;
  heritageCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onOpenDataManagement,
  heritageCount,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems: { id: ManHinhId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'trang-chu', label: 'Trang chủ', icon: <Compass className="w-4 h-4" /> },
    { id: 'ban-do', label: 'Bản đồ di sản', icon: <MapPin className="w-4 h-4" /> },
    { id: 'danh-sach', label: 'Danh mục di sản', icon: <BookOpen className="w-4 h-4" />, badge: `${heritageCount}` },
    { id: 'truyen-day', label: 'Truyền dạy', icon: <Users className="w-4 h-4" /> },
    { id: 'hoi-dap-gemini', label: 'Hỏi đáp AI', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
    { id: 'nguon-tu-lieu', label: 'Nguồn tư liệu', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'gioi-thieu', label: 'Giới thiệu', icon: <Info className="w-4 h-4" /> },
  ];

  const handleNavClick = (id: ManHinhId) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DEC8] shadow-xs">
      {/* Top Banner Notice for Student Internship & Tay Nguyen / E De Research Scope */}
      <div className="bg-[#992E20] text-amber-50 px-4 py-1.5 text-xs text-center font-medium flex items-center justify-between overflow-x-auto">
        <span className="hidden md:inline">
          🏛️ Đề tài J02: Vùng văn hoá Tây Nguyên • Cộng đồng Người Ê Đê • Đắk Lắk (Khảo sát dự kiến: Xã Cư M'gar)
        </span>
        <span className="md:hidden mx-auto">
          🏛️ Di sản Tây Nguyên • Người Ê Đê • Đắk Lắk
        </span>
        <div className="hidden lg:flex items-center gap-3 text-[11px] text-amber-200">
          <span>Nguyễn Văn An – PH70154 (Đề tài J02)</span>
          <span>•</span>
          <span>FPT Polytechnic & IMTA TECH Đợt 15</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div 
            onClick={() => handleNavClick('trang-chu')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B33927] to-[#7B1D12] text-amber-100 flex items-center justify-center shadow-md shadow-[#B33927]/20 border border-amber-300/30 group-hover:scale-105 transition-transform">
              <span className="font-serif font-black text-xl leading-none">Ê</span>
            </div>
            <div>
              <div className="text-base sm:text-lg font-serif font-bold text-[#3B281B] group-hover:text-[#B33927] transition-colors leading-tight">
                Bản đồ di sản phi vật thể Tây Nguyên
              </div>
              <div className="text-[11px] sm:text-xs font-medium text-[#7D6B58] flex items-center gap-1.5">
                <span>Vùng văn hoá Tây Nguyên</span>
                <span className="w-1 h-1 rounded-full bg-[#B33927]"></span>
                <span className="text-[#992E20] font-semibold">Người Ê Đê (Đắk Lắk)</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-[#B33927] text-white shadow-xs font-semibold'
                      : 'text-[#4A3B32] hover:bg-[#EFE7D8] hover:text-[#2B1D15]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/25 text-white' : 'bg-[#E3D6C0] text-[#5C4535]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenDataManagement}
              title="Quản lý & Bổ sung dữ liệu di sản (JSON)"
              className="px-3 py-2 rounded-lg bg-[#EAE0CE] hover:bg-[#DDD0BC] text-[#3E2F24] text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors border border-[#D5C6AF]"
            >
              <Database className="w-4 h-4 text-[#992E20]" />
              <span className="hidden sm:inline">Quản lý dữ liệu</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-[#3E2F24] hover:bg-[#EAE0CE]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-t border-[#E8DEC8] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between ${
                  isActive
                    ? 'bg-[#B33927] text-white font-semibold'
                    : 'text-[#3E2F24] hover:bg-[#EAE0CE]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#E0D2BC] text-[#4A392C]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
