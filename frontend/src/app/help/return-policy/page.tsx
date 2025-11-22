export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-fuchsia-50 to-white pt-32 pb-24 leading-8">
      <div className="max-w-8xl mx-auto px-8 flex flex-col items-center leading-10">
        {/* Tiêu đề */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-12 text-center">
          Chính sách đổi trả
        </h1>

        <div className="space-y-12 text-gray-600 leading-loose w-full max-w-2xl">
          {/* Điều kiện đổi trả */}
          <section className="text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Điều kiện đổi trả</h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              <p className="text-base leading-8">
                Beauty & Skincare chấp nhận đổi trả hàng trong vòng <strong>30 ngày</strong> kể từ ngày nhận hàng,
                với các điều kiện sau:
              </p>
              <ul className="space-y-2">
                <li className="flex gap-2"><span className="text-fuchsia-600 font-bold shrink-0">✓</span> <span>Sản phẩm phải còn trong tình trạng nguyên vẹn, chưa sử dụng</span></li>
                <li className="flex gap-2"><span className="text-fuchsia-600 font-bold shrink-0">✓</span> <span>Vẫn có đầy đủ bao bì, tem nhãn và hóa đơn</span></li>
                <li className="flex gap-2"><span className="text-fuchsia-600 font-bold shrink-0">✓</span> <span>Sản phẩm không bị hư hỏng, rách nát hoặc bẩn</span></li>
                <li className="flex gap-2"><span className="text-fuchsia-600 font-bold shrink-0">✓</span> <span>Lý do đổi trả phải rõ ràng và hợp lý</span></li>
              </ul>
            </div>
          </section>

          {/* Quy trình đổi trả */}
          <section className="text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Quy trình đổi trả</h2>
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="border-l-4 border-fuchsia-600 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Bước 1: Liên hệ với chúng tôi</h3>
                <p>Gọi số hotline hoặc gửi email với lý do muốn đổi trả sản phẩm</p>
              </div>
              <div className="border-l-4 border-fuchsia-600 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Bước 2: Chuẩn bị hàng</h3>
                <p>Đóng gói sản phẩm cẩn thận cùng với hóa đơn gốc</p>
              </div>
              <div className="border-l-4 border-fuchsia-600 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Bước 3: Gửi trả</h3>
                <p>Gửi hàng đến địa chỉ được cung cấp. Chúng tôi sẽ thanh toán phí gửi</p>
              </div>
              <div className="border-l-4 border-fuchsia-600 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Bước 4: Kiểm tra và xử lý</h3>
                <p>Chúng tôi sẽ kiểm tra hàng và xác nhận yêu cầu đổi trả trong 5-7 ngày làm việc</p>
              </div>
              <div className="border-l-4 border-fuchsia-600 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Bước 5: Hoàn tiền hoặc đổi hàng</h3>
                <p>Nếu được chấp nhận, chúng tôi sẽ hoàn tiền hoặc gửi sản phẩm mới</p>
              </div>
            </div>
          </section>

          {/* Các trường hợp không được đổi trả */}
          <section className="text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Các trường hợp không được đổi trả</h2>
            <ul className="space-y-2 max-w-2xl mx-auto">
              <li className="flex gap-2"><span className="text-red-600 font-bold shrink-0">✕</span> <span>Sản phẩm đã được sử dụng hoặc bị mở nắp</span></li>
              <li className="flex gap-2"><span className="text-red-600 font-bold shrink-0">✕</span> <span>Bao bì bị hư hỏng, rách nát hoặc mất tem nhãn</span></li>
              <li className="flex gap-2"><span className="text-red-600 font-bold shrink-0">✕</span> <span>Sản phẩm bị tổn hại do lỗi của khách hàng</span></li>
              <li className="flex gap-2"><span className="text-red-600 font-bold shrink-0">✕</span> <span>Vượt quá thời hạn 30 ngày kể từ ngày nhận hàng</span></li>
              <li className="flex gap-2"><span className="text-red-600 font-bold shrink-0">✕</span> <span>Không có hóa đơn hoặc chứng minh mua hàng</span></li>
            </ul>
          </section>

          {/* Chính sách hoàn tiền */}
          <section className="text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Chính sách hoàn tiền</h2>
            <p className="text-base leading-8 max-w-2xl mx-auto">
              Khi yêu cầu đổi trả được chấp nhận, chúng tôi sẽ hoàn tiền trong vòng 7-10 ngày làm việc.
              Tiền hoàn sẽ được chuyển vào tài khoản ngân hàng hoặc ví điện tử mà khách hàng đã sử dụng
              để thanh toán. Vui lòng kiểm tra số tài khoản khi liên hệ để đảm bảo hoàn tiền chính xác.
            </p>
          </section>

          {/* Liên hệ */}
          <section className="bg-fuchsia-50 rounded-xl p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">Cần giúp đỡ?</h2>
            <p className="mb-4 text-center">
              Nếu bạn có bất kỳ thắc mắc nào về chính sách đổi trả, vui lòng liên hệ với chúng tôi:
            </p>
            <div className="space-y-3 text-center">
              <p><strong>Email:</strong> support@beautyandskincare.com</p>
              <p><strong>Hotline:</strong> 1900 0000</p>
              <p><strong>Thời gian:</strong> 8:00 - 22:00 hàng ngày</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
