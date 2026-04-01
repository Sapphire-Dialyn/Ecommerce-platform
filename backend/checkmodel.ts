const API_KEY = "AIzaSyBWFGgSKQ4Z2zKLT4lJgQHKi1VBFo26_TY";

async function checkModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    
    if (data.error) {
        console.error("❌ Lỗi API Key:", data.error.message);
        return;
    }

    console.log("✅ DANH SÁCH CÁC MODEL BẠN ĐƯỢC HỖ TRỢ:\n");
    
    // Lọc và in ra tên các model
    data.models.forEach(model => {
      console.log(`- Tên Model: ${model.name}`);
      console.log(`  Mô tả: ${model.description}`);
      console.log(`  Version: ${model.version}`);
      console.log("--------------------------------------------------");
    });

  } catch (error) {
    console.error("❌ Không thể kết nối:", error);
  }
}

checkModels();