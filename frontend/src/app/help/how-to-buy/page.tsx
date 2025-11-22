export default function HowToBuyPage() {
  const steps = [
    {
      number: 1,
      title: 'Duyệt sản phẩm',
      description: 'Truy cập trang Shop và duyệt các sản phẩm theo danh mục hoặc tìm kiếm sản phẩm cụ thể',
    },
    {
      number: 2,
      title: 'Xem chi tiết sản phẩm',
      description: 'Nhấp vào sản phẩm để xem thông tin chi tiết, hình ảnh, đánh giá và giá tiền',
    },
    {
      number: 3,
      title: 'Thêm vào giỏ hàng',
      description: 'Chọn số lượng và biến thể (nếu có), sau đó nhấp nút "Thêm vào giỏ"',
    },
    {
      number: 4,
      title: 'Kiểm tra giỏ hàng',
      description: 'Xem lại các sản phẩm trong giỏ, có thể sửa số lượng hoặc xóa sản phẩm',
    },
    {
      number: 5,
      title: 'Thanh toán',
      description: 'Cung cấp địa chỉ giao hàng và chọn phương thức thanh toán (Thẻ, Chuyển khoản, COD)',
    },
    {
      number: 6,
      title: 'Xác nhận đơn hàng',
      description: 'Kiểm tra lại thông tin đơn hàng và nhấp "Đặt hàng" để hoàn thành',
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-fuchsia-50 to-white pt-32 pb-24 leading-8">
      <div className="max-w-8xl mx-auto px-8 flex flex-col items-center leading-10">
        {/* Tiêu đề */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-12 text-center">
          Hướng dẫn mua hàng
        </h1>

        {/* Các bước */}
        <div className="space-y-8 mb-16 w-full max-w-2xl">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-6">
              <div className="shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fuchsia-600 text-white font-bold">
                  {step.number}
                </div>
              </div>
              <div className="grow">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lưu ý quan trọng */}
        <div className="bg-fuchsia-50 rounded-xl p-8 w-full max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">Lưu ý quan trọng</h2>
          <ul className="space-y-4 text-gray-600">
            <li className="flex gap-2 text-base justify-center">
              <span className="text-fuchsia-600 font-bold text-lg shrink-0">•</span>
              <span className="leading-relaxed">Bạn phải tạo tài khoản để có thể đặt hàng</span>
            </li>
            <li className="flex gap-2 text-base justify-center">
              <span className="text-fuchsia-600 font-bold text-lg shrink-0">•</span>
              <span className="leading-relaxed">Kiểm tra số lượng và thông tin sản phẩm trước khi thanh toán</span>
            </li>
            <li className="flex gap-2 text-base justify-center">
              <span className="text-fuchsia-600 font-bold text-lg shrink-0">•</span>
              <span className="leading-relaxed">Thời gian giao hàng có thể khác tùy theo địa phương</span>
            </li>
            <li className="flex gap-2 text-base justify-center">
              <span className="text-fuchsia-600 font-bold text-lg shrink-0">•</span>
              <span className="leading-relaxed">Lưu lại số tracking để theo dõi đơn hàng của bạn</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
