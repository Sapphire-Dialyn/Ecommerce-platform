import React from 'react';
export default function AboutPage() {
  return (
    // THAY ĐỔI: Thêm 'flex items-center justify-center' để căn giữa nội dung theo chiều dọc và ngang
    <div className="min-h-screen bg-linear-to-b from-fuchsia-50 to-white flex items-center justify-center py-24">
      
      <div className="max-w-3xl w-full mx-auto px-6"> {/* Thêm w-full để đảm bảo width chính xác */}
        
        {/* Tiêu đề */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-12 text-center">
          Câu chuyện thương hiệu
        </h1>

        {/* Nội dung chính */}
        <div className="space-y-12 text-gray-600 leading-loose flex flex-col items-center leading-10">
          
          <section className="space-y-4 w-full max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Về chúng tôi</h2>
            <p className="text-base md:text-lg leading-8">
              Beauty & Skincare là nền tảng thương mại điện tử hàng đầu trong lĩnh vực mỹ phẩm chăm sóc da.
              Chúng tôi cam kết cung cấp những sản phẩm chính hãng, chất lượng cao từ các thương hiệu nổi tiếng
              trên toàn thế giới.
            </p>
          </section>

          <section className="space-y-4 w-full max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Sứ mệnh của chúng tôi</h2>
            <p className="text-base md:text-lg leading-8">
              Mục tiêu của chúng tôi là giúp mỗi khách hàng tìm thấy những sản phẩm chăm sóc da phù hợp nhất
              với nhu cầu và loại da của họ. Chúng tôi tin rằng vẻ đẹp thực sự đến từ việc chăm sóc bản thân
              một cách đúng đắn.
            </p>
          </section>

          <section className="space-y-4 w-full max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Tại sao chọn chúng tôi?</h2>
            <ul className="space-y-3">
              <li className="flex gap-3 justify-center items-start"> {/* items-start để icon tick luôn ở dòng đầu nếu text dài */}
                <span className="text-fuchsia-600 font-bold text-lg mt-1">✓</span> 
                <span className="text-base md:text-lg text-left">Sản phẩm chính hãng 100% từ các hãng uy tín thế giới</span>
              </li>
              <li className="flex gap-3 justify-center items-start">
                <span className="text-fuchsia-600 font-bold text-lg mt-1">✓</span> 
                <span className="text-base md:text-lg text-left">Giá cạnh tranh và thường xuyên có các chương trình khuyến mãi</span>
              </li>
              <li className="flex gap-3 justify-center items-start">
                <span className="text-fuchsia-600 font-bold text-lg mt-1">✓</span> 
                <span className="text-base md:text-lg text-left">Dịch vụ giao hàng nhanh chóng, an toàn đến tay khách hàng</span>
              </li>
              <li className="flex gap-3 justify-center items-start">
                <span className="text-fuchsia-600 font-bold text-lg mt-1">✓</span> 
                <span className="text-base md:text-lg text-left">Hỗ trợ khách hàng 24/7 giải đáp mọi thắc mắc</span>
              </li>
              <li className="flex gap-3 justify-center items-start">
                <span className="text-fuchsia-600 font-bold text-lg mt-1">✓</span> 
                <span className="text-base md:text-lg text-left">Chính sách đổi trả hàng linh hoạt nếu khách hàng không hài lòng</span>
              </li>
            </ul>
          </section>

          <section className="space-y-4 w-full max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Cam kết của chúng tôi</h2>
            <p className="text-base md:text-lg leading-8">
              Chúng tôi cam kết sẽ luôn đặt lợi ích của khách hàng lên hàng đầu, cung cấp những sản phẩm
              chất lượng tốt nhất với giá cả hợp lý. Sự tin tưởng của các bạn là động lực lớn nhất để
              chúng tôi tiếp tục phát triển và cải thiện dịch vụ.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}