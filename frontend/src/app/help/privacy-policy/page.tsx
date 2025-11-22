export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-fuchsia-50 to-white pt-32 pb-24 leading-8">
      <div className="max-w-8xl mx-auto px-8 flex flex-col items-center leading-10">
        {/* Tiêu đề */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-12 text-center">
          Bảo mật thông tin
        </h1>

        <div className="space-y-12 text-gray-600 leading-loose w-full max-w-2xl">
          {/* Giới thiệu */}
          <section className="text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Chính sách bảo mật</h2>
            <p className="text-base leading-8 max-w-2xl mx-auto">
              Beauty & Skincare cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. Chính sách này
              mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.
            </p>
          </section>

          {/* Thông tin chúng tôi thu thập */}
          <section className="text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Thông tin chúng tôi thu thập</h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              <p className="text-base leading-8">Chúng tôi có thể thu thập các thông tin sau:</p>
              <ul className="space-y-2">
                <li className="flex gap-2"><span className="text-fuchsia-600 font-bold shrink-0">•</span> <span><strong>Thông tin cá nhân:</strong> Tên, email, số điện thoại, địa chỉ</span></li>
                <li className="flex gap-2"><span className="text-fuchsia-600 font-bold shrink-0">•</span> <span><strong>Thông tin thanh toán:</strong> Số thẻ tín dụng, tài khoản ngân hàng (được mã hóa)</span></li>
                <li className="flex gap-2"><span className="text-fuchsia-600 font-bold shrink-0">•</span> <span><strong>Lịch sử mua hàng:</strong> Sản phẩm đã mua, giá tiền, ngày mua</span></li>
                <li className="flex gap-2"><span className="text-fuchsia-600 font-bold shrink-0">•</span> <span><strong>Dữ liệu kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, hệ điều hành</span></li>
                <li className="flex gap-2"><span className="text-fuchsia-600 font-bold shrink-0">•</span> <span><strong>Sở thích:</strong> Sản phẩm yêu thích, danh mục quan tâm</span></li>
              </ul>
            </div>
          </section>

          {/* Cách chúng tôi sử dụng thông tin */}
          <section className="text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Cách chúng tôi sử dụng thông tin</h2>
            <ul className="space-y-2 max-w-2xl mx-auto">
              <li className="flex gap-2"><span className="text-fuchsia-600 font-bold shrink-0">•</span> <span>Xử lý đơn hàng và giao hàng</span></li>
              <li className="flex gap-2"><span className="text-fuchsia-600 font-bold shrink-0">•</span> <span>Cải thiện trải nghiệm người dùng</span></li>
              <li className="flex gap-2"><span className="text-fuchsia-600 font-bold shrink-0">•</span> <span>Gửi thông tin cập nhật về sản phẩm mới và khuyến mãi</span></li>
              <li className="flex gap-2"><span className="text-fuchsia-600 font-bold shrink-0">•</span> <span>Phòng chống gian lận và bảo vệ an toàn</span></li>
              <li className="flex gap-2"><span className="text-fuchsia-600 font-bold shrink-0">•</span> <span>Phân tích dữ liệu để hiểu nhu cầu khách hàng</span></li>
            </ul>
          </section>

          {/* Bảo vệ dữ liệu */}
          <section className="text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Bảo vệ dữ liệu</h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              <p className="text-base leading-8">
                Chúng tôi sử dụng các biện pháp bảo mật hiện đại để bảo vệ thông tin cá nhân của bạn:
              </p>
              <ul className="space-y-2">
                <li className="flex gap-2"><span className="text-green-600 font-bold shrink-0">✓</span> <span>Mã hóa SSL cho tất cả các giao dịch</span></li>
                <li className="flex gap-2"><span className="text-green-600 font-bold shrink-0">✓</span> <span>Tường lửa và hệ thống giám sát 24/7</span></li>
                <li className="flex gap-2"><span className="text-green-600 font-bold shrink-0">✓</span> <span>Kiểm tra bảo mật định kỳ</span></li>
                <li className="flex gap-2"><span className="text-green-600 font-bold shrink-0">✓</span> <span>Chỉ nhân viên được phép mới có quyền truy cập thông tin</span></li>
              </ul>
            </div>
          </section>

          {/* Cookie */}
          <section className="text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Sử dụng Cookie</h2>
            <p className="text-base leading-8 max-w-2xl mx-auto">
              Trang web của chúng tôi sử dụng cookie để ghi nhớ tùy chọn của bạn và cải thiện trải nghiệm.
              Bạn có thể tắt cookie trong cài đặt trình duyệt, nhưng điều này có thể ảnh hưởng đến một số
              chức năng của trang web.
            </p>
          </section>

          {/* Quyền của bạn */}
          <section className="text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Quyền của bạn</h2>
            <p className="mb-4 text-base max-w-2xl mx-auto">Bạn có quyền:</p>
            <ul className="space-y-2 max-w-2xl mx-auto">
              <li className="flex gap-2"><span className="text-fuchsia-600 font-bold shrink-0">✓</span> <span>Truy cập thông tin cá nhân của bạn</span></li>
              <li className="flex gap-2"><span className="text-fuchsia-600 font-bold shrink-0">✓</span> <span>Yêu cầu sửa đổi hoặc xóa thông tin</span></li>
              <li className="flex gap-2"><span className="text-fuchsia-600 font-bold shrink-0">✓</span> <span>Hủy đăng ký nhận email quảng cáo</span></li>
              <li className="flex gap-2"><span className="text-fuchsia-600 font-bold shrink-0">✓</span> <span>Yêu cầu không sử dụng thông tin cho mục đích marketing</span></li>
            </ul>
          </section>

          {/* Thay đổi chính sách */}
          <section className="text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Thay đổi chính sách</h2>
            <p className="text-base leading-8 max-w-2xl mx-auto">
              Chúng tôi có quyền cập nhật chính sách bảo mật này bất kỳ lúc nào. Thay đổi sẽ có hiệu lực
              ngay khi được công bố trên trang web. Chúng tôi khuyến khích bạn thường xuyên kiểm tra
              chính sách này.
            </p>
          </section>

          {/* Liên hệ */}
          <section className="bg-fuchsia-50 rounded-xl p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">Liên hệ với chúng tôi</h2>
            <p className="mb-4 text-center">
              Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ:
            </p>
            <div className="space-y-3 text-center">
              <p><strong>Email:</strong> privacy@beautyandskincare.com</p>
              <p><strong>Địa chỉ:</strong> 50 94 Đường Lạng, Dống Đô, Hà Nội</p>
              <p><strong>Hotline:</strong> 1900 0000</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
