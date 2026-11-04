import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get disan.json file path
function getDisanPath(): string {
  const rootPath = path.resolve(__dirname, 'disan.json');
  const publicPath = path.resolve(__dirname, 'public', 'disan.json');
  if (fs.existsSync(rootPath)) return rootPath;
  return publicPath;
}

// GET all heritage records
app.get('/api/disan', (req, res) => {
  try {
    const filePath = getDisanPath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return res.json(JSON.parse(data));
    }
    return res.status(404).json({ error: 'Không tìm thấy tệp disan.json' });
  } catch (error: any) {
    console.error('Lỗi khi đọc disan.json:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ khi đọc dữ liệu di sản' });
  }
});

// POST /api/disan to update records or append
app.post('/api/disan', (req, res) => {
  try {
    const updatedData = req.body;
    if (!Array.isArray(updatedData)) {
      return res.status(400).json({ error: 'Dữ liệu phải là mảng danh sách di sản' });
    }

    const rootPath = path.resolve(__dirname, 'disan.json');
    const publicPath = path.resolve(__dirname, 'public', 'disan.json');

    const jsonString = JSON.stringify(updatedData, null, 2);
    fs.writeFileSync(rootPath, jsonString, 'utf-8');
    if (fs.existsSync(path.resolve(__dirname, 'public'))) {
      fs.writeFileSync(publicPath, jsonString, 'utf-8');
    }

    return res.json({ success: true, count: updatedData.length });
  } catch (error: any) {
    console.error('Lỗi khi ghi dữ liệu:', error);
    return res.status(500).json({ error: 'Không thể lưu dữ liệu di sản' });
  }
});

// Gemini Q&A Endpoint strictly grounded in disan.json
app.post('/api/ask-gemini', async (req, res) => {
  try {
    const { question, heritageId } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Vui lòng cung cấp câu hỏi hợp lệ.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Chưa cấu hình GEMINI_API_KEY trên máy chủ. Vui lòng kiểm tra mục Settings > Secrets.',
      });
    }

    // Read disan.json
    const filePath = getDisanPath();
    let records: any[] = [];
    if (fs.existsSync(filePath)) {
      records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    // If specific heritageId is requested, we can prioritize it
    const relevantRecords = heritageId
      ? records.filter((r) => r.id === heritageId)
      : records;

    const dataContext = JSON.stringify(relevantRecords, null, 2);

    const systemInstruction = `Bạn là trợ lý AI chuyên môn về số hoá và lưu trữ di sản văn hoá phi vật thể Việt Nam trong ứng dụng "Bản đồ di sản phi vật thể theo vùng văn hoá". 
Dự án tập trung vào: Vùng văn hoá Tây Bắc và cộng đồng dân tộc Thái (Thái Đen, Thái Trắng) tại các địa bàn Sơn La, Điện Biên, Lai Châu, Yên Bái, Hoà Bình.

QUY TẮC BẮT BUỘC VÀ KHÔNG ĐƯỢC VI PHẠM (Được quy định trong Điều 5 và Điều 7 của đề án nghiên cứu):
1. BẮT BUỘC CHỈ ĐƯỢC TRẢ LỜI DỰA TRÊN DỮ LIỆU ĐƯỢC CUNG CẤP TRONG TỆP disan.json DƯỚI ĐÂY cùng các nguồn tư liệu được khai báo trong mỗi bản ghi.
2. TUYỆT ĐỐI KHÔNG sử dụng kiến thức bên ngoài, không tự suy đoán, bổ sung hoặc sáng tác thông tin.
3. Trong MỌI CÂU TRẢ LỜI có chứa thông tin di sản, bạn BẮT BUỘC PHẢI NÊU RÕ 4 YẾU TỐ:
   - Tên di sản (theo danh mục chính thức và tên gọi bản địa nếu có)
   - Cộng đồng / Dân tộc sở hữu
   - Địa danh hiện nay (và địa danh tư liệu nếu có)
   - Nguồn tư liệu đã sử dụng (tên tài liệu, đơn vị cung cấp, tác giả, năm công bố)
4. NẾU DỮ LIỆU ĐƯỢC CUNG CẤP KHÔNG CÓ THÔNG TIN để trả lời câu hỏi, hoặc người dùng hỏi về di sản, nghi lễ, nhân vật, địa danh KHÔNG CÓ trong disan.json, bạn BẮT BUỘC PHẢI TRẢ LỜI RÕ RÀNG:
   "Hiện chưa có tư liệu xác thực để trả lời câu hỏi này trong hệ thống dữ liệu di sản đã được thẩm định."
   (Không được xin lỗi dông dài, không được trả lời từ kiến thức internet).
5. TUYỆT ĐỐI KHÔNG gán ghép thông tin của cộng đồng hoặc vùng văn hoá này sang cộng đồng hoặc vùng văn hoá khác.
6. TUYỆT ĐỐI KHÔNG tự tạo tên nghệ nhân, người cung cấp, địa danh, niên đại lịch sử hoặc tình trạng ghi danh khi trong dữ liệu không có.
7. Nếu câu hỏi liên quan đến nhiều bản ghi, hãy phân biệt rành mạch từng bản ghi kèm nguồn trích dẫn tương ứng.
8. Toàn bộ câu trả lời bằng tiếng Việt trang trọng, chuẩn mực, tôn trọng văn hoá bản địa và tuân thủ đạo đức nghiên cứu di sản.

DỮ LIỆU DI SẢN CHÍNH THỨC TRONG disan.json:
${dataContext}`;

    if (apiKey) {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

      for (const modelName of candidateModels) {
        try {
          const config: any = {
            systemInstruction: systemInstruction,
          };
          if (modelName === 'gemini-3.8-flash') {
            config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
          }

          // 5-second timeout wrapper
          const responsePromise = ai.models.generateContent({
            model: modelName,
            contents: question,
            config: config,
          });

          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout 5s')), 5000)
          );

          const response = await Promise.race([responsePromise, timeoutPromise]);
          const answer = (response as any).text;
          if (answer) {
            return res.json({ answer, model: modelName, mode: 'gemini_ai' });
          }
        } catch (err: any) {
          console.warn(`Thử mô hình ${modelName} thất bại:`, err?.message || err);
        }
      }
    }

    // High-fidelity ground-truth fallback based strictly on disan.json
    const groundTruthAnswer = answerFromGroundTruth(question, relevantRecords);
    return res.json({
      answer: groundTruthAnswer,
      mode: 'ground_truth_direct',
    });
  } catch (error: any) {
    console.error('Lỗi khi xử lý hỏi đáp di sản:', error);
    return res.status(500).json({
      error: error?.message || 'Lỗi xử lý khi kết nối với mô hình di sản.',
    });
  }
});

function answerFromGroundTruth(question: string, records: any[]): string {
  const qLower = question.toLowerCase();

  // Explicit check for heritages outside Northwest Thai culture
  const outsideKeywords = ['chăm', 'katê', 'khmer', 'cồng chiêng', 'tây nguyên', 'quan họ', 'bắc ninh', 'ca trù', 'đờn ca tài tử'];
  if (outsideKeywords.some((k) => qLower.includes(k))) {
    return 'Hiện chưa có tư liệu xác thực để trả lời câu hỏi này trong hệ thống dữ liệu di sản đã được thẩm định.';
  }

  // Match records from disan.json
  const matched = records.filter((r) => {
    const tenMatch = r.ten_di_san.toLowerCase().split(' ').some((w: string) => w.length > 2 && qLower.includes(w));
    const banDiaMatch = r.ten_ban_dia.toLowerCase().split(' ').some((w: string) => w.length > 2 && qLower.includes(w));
    const diaDanhMatch = r.dia_danh_hien_nay.toLowerCase().split(/[\s,]+/).some((w: string) => w.length > 3 && qLower.includes(w));
    const loaiHinhMatch = r.loai_hinh.toLowerCase().split(/[\s,]+/).some((w: string) => w.length > 3 && qLower.includes(w));
    const artisanMatch = Array.isArray(r.nghe_nhan_nguoi_thuc_hanh) && r.nghe_nhan_nguoi_thuc_hanh.some((a: string) => {
      return a.toLowerCase().split(/[\s,]+/).some((w: string) => w.length > 3 && qLower.includes(w));
    });

    return tenMatch || banDiaMatch || diaDanhMatch || loaiHinhMatch || artisanMatch;
  });

  if (matched.length === 0) {
    return 'Hiện chưa có tư liệu xác thực để trả lời câu hỏi này trong hệ thống dữ liệu di sản đã được thẩm định.';
  }

  const results = matched.slice(0, 2).map((r) => {
    const sources = r.nguon_tu_lieu
      .map((s: any) => `• ${s.ten_tai_lieu} (${s.tac_gia_nguoi_ghi_nhan}, ${s.nam_cong_bo} - ${s.don_vi_cung_cap})`)
      .join('\n');
    const artisans = Array.isArray(r.nghe_nhan_nguoi_thuc_hanh) && r.nghe_nhan_nguoi_thuc_hanh.length > 0
      ? r.nghe_nhan_nguoi_thuc_hanh.join('; ')
      : 'Chưa có thông tin nghệ nhân được phép công khai';

    return `📌 **TÊN DI SẢN:** ${r.ten_di_san} (Tên gọi bản địa: ${r.ten_ban_dia})
👥 **CỘNG ĐỒNG SỞ HỮU:** ${r.dan_toc} (Vùng văn hoá: ${r.vung_van_hoa})
📍 **ĐỊA DANH HIỆN NAY:** ${r.dia_danh_hien_nay}${r.dia_danh_tu_lieu ? ` (Địa danh tư liệu: ${r.dia_danh_tu_lieu})` : ''}
🏛️ **TÌNH TRẠNG GHI DANH:** ${r.tinh_trang_ghi_danh}

📝 **THÔNG TIN XÁC THỰC TỪ TƯ LIỆU:**
${r.mo_ta}
${r.lich_su_nguon_goc ? `\n• Lịch sử, nguồn gốc: ${r.lich_su_nguon_goc}` : ''}
\n• Bối cảnh thực hành: ${r.boi_canh_thuc_hanh}
• Nghệ nhân / Người thực hành: ${artisans}

📚 **NGUỒN TƯ LIỆU ĐÃ SỬ DỤNG:**
${sources}`;
  });

  return results.join('\n\n---\n\n');
}

// Mount Vite or static server
async function startServer() {
  if (process.env.NODE_ENV === 'production' || fs.existsSync(path.resolve(__dirname, 'dist'))) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server chạy tại cổng http://0.0.0.0:${PORT}`);
  });
}

startServer();
