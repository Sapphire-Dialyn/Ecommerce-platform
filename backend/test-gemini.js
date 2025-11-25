// File: check-list.js
require('dotenv').config();

async function listAvailableModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  // Gọi vào endpoint danh sách model (Method GET)
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  console.log("📡 Đang hỏi Google danh sách model...");

  try {
    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();

    if (response.ok) {
      console.log("✅ KẾT NỐI THÀNH CÔNG! Dưới đây là danh sách model bạn được dùng:");
      console.log("---------------------------------------------------------------");
      
      if (data.models && data.models.length > 0) {
        data.models.forEach(model => {
            // Chỉ in ra các model dòng Gemini để dễ nhìn
            if(model.name.includes("gemini")) {
                console.log(`📦 Tên chuẩn: ${model.name}`);
                console.log(`   Hỗ trợ: ${model.supportedGenerationMethods.join(", ")}`);
                console.log("---");
            }
        });
      } else {
        console.log("⚠️ DANH SÁCH TRỐNG RỖNG! (Account này không có quyền truy cập model nào)");
      }
    } else {
      console.log("❌ LỖI KHI LẤY DANH SÁCH:");
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("Lỗi mạng:", err);
  }
}

listAvailableModels();