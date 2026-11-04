import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  RefreshCcw,
  AlertCircle
} from 'lucide-react';
import { DiSan } from '../types/heritage';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isStrictRefusal?: boolean;
}

interface GeminiQAViewProps {
  heritages: DiSan[];
  initialQuestion?: string;
  initialHeritageId?: string;
  onSelectHeritageById: (id: string) => void;
}

export const GeminiQAView: React.FC<GeminiQAViewProps> = ({
  heritages,
  initialQuestion,
  initialHeritageId,
  onSelectHeritageById,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Xin chào quý độc giả! Tôi là Trợ lý Tra cứu Di sản Phi vật thể Vùng văn hoá Tây Nguyên – Cộng đồng Người Ê Đê (Đề tài J02).

Tôi hoạt động tuân thủ nghiêm ngặt theo **Điều 5 & Điều 7** của đề án:
• Chỉ sử dụng dữ liệu đã kiểm duyệt trong tệp \`disan.json\` và các nguồn tư liệu được trích dẫn.
• Mọi câu trả lời luôn chỉ rõ: **Tên di sản, Dân tộc sở hữu, Địa bàn hiện nay và Nguồn tư liệu**.
• Phân định rõ địa bàn khảo sát dự kiến tại Xã Cư M'gar, không tự tạo tên buôn hoặc nghệ nhân chưa có nguồn.
• Nếu câu hỏi nằm ngoài phạm vi dữ liệu đã có, tôi sẽ thông báo rõ: *"Hiện chưa có tư liệu xác thực để trả lời câu hỏi này trong hệ thống dữ liệu di sản đã được thẩm định."*`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState(initialQuestion || '');
  const [selectedHeritageFilter, setSelectedHeritageFilter] = useState(initialHeritageId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Suggested questions based on Ê Đê cultural heritages in Đắk Lắk
  const suggestedQueries = [
    {
      label: 'Cồng chiêng Ê Đê',
      query: 'Không gian văn hoá Cồng chiêng của người Ê Đê có những đặc trưng gì và được thực hành ở đâu?',
    },
    {
      label: 'Lời nói vần (Klei đúm)',
      query: 'Lời nói vần (Klei đúm) của người Ê Đê tại huyện Cư M\'gar có vai trò gì trong luật tục buôn làng?',
    },
    {
      label: 'Sử thi Khan Đam San',
      query: 'Nghệ thuật kể Sử thi Ê Đê (Klei Khan) diễn ra trong bối cảnh nào và có nguồn tư liệu từ đâu?',
    },
    {
      label: 'Dệt thổ cẩm Ê Đê',
      query: 'Nghề dệt thổ cẩm của người Ê Đê sử dụng khung dệt và hoa văn truyền thống gì?',
    },
    {
      label: 'Khảo sát Xã Cư M\'gar',
      query: 'Tình trạng khảo sát di sản của người Ê Đê tại địa bàn xã Cư M\'gar hiện nay như thế nào?',
    },
    {
      label: 'Kiểm tra từ chối (Ngoài phạm vi)',
      query: 'Hãy cho biết thông tin về Nghệ thuật Xòe Thái Tây Bắc hoặc Ca trù Bắc Bộ?',
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const question = (textToSend || inputQuestion).trim();
    if (!question || isLoading) return;

    setErrorMsg(null);
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          heritageId: selectedHeritageFilter || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Lỗi máy chủ (${response.status})`);
      }

      const data = await response.json();
      const answerText = data.answer || 'Hiện chưa có tư liệu xác thực để trả lời câu hỏi này.';
      const isRefusal = answerText.includes('Hiện chưa có tư liệu xác thực');

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: answerText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isStrictRefusal: isRefusal,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Lỗi khi gửi câu hỏi:', err);
      setErrorMsg(err.message || 'Không thể kết nối đến máy chủ.');
      const errorBotMsg: Message = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ **Không thể hoàn tất tra cứu:** ${err.message || 'Vui lòng kiểm tra lại kết nối mạng hoặc khoá API.'}`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorBotMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header section */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Màn hình 6 • Hỏi đáp di sản với Gemini AI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#3B281B]">
            Hỏi đáp Di sản Người Ê Đê – Tây Nguyên
          </h1>
          <p className="text-sm text-[#6C5B4E] mt-1 max-w-3xl leading-relaxed">
            Tích hợp Gemini AI với cơ chế kiểm chứng nghiêm ngặt: chỉ sử dụng dữ liệu trong tệp 
            <code className="mx-1 px-1.5 py-0.5 rounded-sm bg-[#FAF7F2] border border-[#DECDB5] text-[#992E20] font-mono text-xs">disan.json</code> 
            và nguồn tư liệu văn bản đã được thẩm định.
          </p>
        </div>

        {/* Boundary Rules Reminder Box */}
        <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#DECDB5] text-xs text-[#524237] space-y-1.5">
          <div className="font-bold text-[#3B281B] flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-[#B33927]" />
            <span>Khuôn khổ trả lời của Trợ lý AI (Điều 5 & Đề tài J02):</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11.5px]">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Chỉ dùng tư liệu trong disan.json, không dùng kiến thức ngoài.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Nêu đủ: Tên di sản, Dân tộc Ê Đê, Địa bàn Đắk Lắk và Nguồn tư liệu.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Không tự khẳng định xã Cư M'gar là đại diện khi chưa có nguồn buôn.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Thiếu tư liệu sẽ thông báo rõ: "Hiện chưa có tư liệu xác thực".</span>
            </li>
          </ul>
        </div>

        {/* Heritage Focus Selector */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F0E8D9] text-xs">
          <span className="font-semibold text-[#4A3B32]">Phạm vi tra cứu:</span>
          <select
            value={selectedHeritageFilter}
            onChange={(e) => setSelectedHeritageFilter(e.target.value)}
            className="bg-[#FAF7F2] border border-[#D5C6AF] text-[#3B281B] rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-[#B33927] focus:outline-hidden"
          >
            <option value="">Toàn bộ di sản người Ê Đê ({heritages.length} di sản)</option>
            {heritages.map((h) => (
              <option key={h.id} value={h.id}>
                {h.ten_di_san} ({h.dan_toc} - {h.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Suggested Questions Chips */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-[#7A695B] flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#B33927]" />
          <span>Gợi ý câu hỏi kiểm chứng:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedQueries.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.query)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF7F2] border border-[#D5C6AF] hover:border-[#B33927] text-xs text-[#3B281B] transition-colors text-left flex items-center gap-1.5 disabled:opacity-50"
            >
              <span className="text-[#B33927] font-bold text-[10px]">#{idx + 1}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Thread Messages Box */}
      <div className="bg-white rounded-2xl border border-[#E8DEC8] p-4 sm:p-6 shadow-xs min-h-[420px] flex flex-col justify-between space-y-4">
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#B33927] to-[#7B1D12] text-amber-200 flex items-center justify-center shrink-0 shadow-xs border border-amber-300/30">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-[#B33927] text-white rounded-tr-none'
                    : msg.isStrictRefusal
                    ? 'bg-amber-50 text-amber-950 border border-amber-200 rounded-tl-none'
                    : 'bg-[#FAF7F2] text-[#2C1D13] border border-[#E8DEC8] rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line font-normal">{msg.text}</div>
                <div
                  className={`text-[10px] text-right pt-1 ${
                    msg.sender === 'user' ? 'text-amber-200' : 'text-[#8C7A6B]'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-[#3E2F24] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-[#B33927] text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC8] text-xs text-[#7A695B] flex items-center gap-2">
                <RefreshCcw className="w-3.5 h-3.5 animate-spin text-[#B33927]" />
                <span>Đang đối chiếu dữ liệu disan.json về di sản người Ê Đê...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="pt-4 border-t border-[#F0E8D9] space-y-2">
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="relative">
            <textarea
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi về di sản văn hoá người Ê Đê tại Đắk Lắk (Enter để gửi)..."
              rows={2}
              className="w-full pl-4 pr-12 py-3 rounded-xl bg-[#FAF7F2] border border-[#D5C6AF] text-xs sm:text-sm text-[#2C1D13] placeholder-[#8C7A6B] focus:ring-2 focus:ring-[#B33927] focus:outline-hidden resize-none"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputQuestion.trim() || isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#B33927] hover:bg-[#992E20] text-white disabled:opacity-40 transition-colors shadow-2xs"
              title="Gửi câu hỏi"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#8C7A6B] px-1">
            <span>🔒 Bảo mật: Gọi API thông qua máy chủ server.ts, không để lộ API Key trên trình duyệt.</span>
            <span>Đề tài J02 • Người Ê Đê</span>
          </div>
        </div>
      </div>
    </div>
  );
};
