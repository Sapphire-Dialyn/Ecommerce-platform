import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-fuchsia-50 to-white py-24">
      <div className="max-w-3xl mx-auto px-4 flex flex-col items-center">
        {/* Tiêu đề */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 text-center">
          Trợ giúp
        </h1>
        <p className="text-center text-gray-600 text-base md:text-lg mb-16 leading-relaxed max-w-2xl">
          Chọn chủ đề bên dưới để tìm kiếm câu trả lời cho những thắc mắc của bạn
        </p>

        {/* Các mục trợ giúp */}
        <div className="space-y-6 w-full max-w-2xl">
          {/* Hướng dẫn mua hàng */}
          <Link href="/help/how-to-buy">
            <div className="bg-white rounded-xl border border-fuchsia-100 p-6 hover:shadow-lg hover:border-fuchsia-300 transition cursor-pointer">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hướng dẫn mua hàng</h3>
              <p className="text-gray-600 text-sm">
                Tìm hiểu cách thức đặt hàng, chọn sản phẩm, thanh toán và nhận hàng
              </p>
            </div>
          </Link>

          {/* Chính sách đổi trả */}
          <Link href="/help/return-policy">
            <div className="bg-white rounded-xl border border-fuchsia-100 p-6 hover:shadow-lg hover:border-fuchsia-300 transition cursor-pointer">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chính sách đổi trả</h3>
              <p className="text-gray-600 text-sm">
                Thông tin chi tiết về quy trình đổi trả hàng, hạn chế và điều kiện áp dụng
              </p>
            </div>
          </Link>

          {/* Bảo mật thông tin */}
          <Link href="/help/privacy-policy">
            <div className="bg-white rounded-xl border border-fuchsia-100 p-6 hover:shadow-lg hover:border-fuchsia-300 transition cursor-pointer">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Bảo mật thông tin</h3>
              <p className="text-gray-600 text-sm">
                Cách chúng tôi bảo vệ thông tin cá nhân của bạn và chính sách bảo mật
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
