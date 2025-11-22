import React from 'react';
import { Mail, MapPin, ArrowRight, Briefcase, Heart, Star, Users, Smile, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CareersPage() {
  const openPositions = [
    {
      id: 1,
      title: 'Chuyên viên kinh doanh',
      department: 'Sales',
      type: 'Full-time',
      location: 'TP. Hồ Chí Minh',
      description: 'Tìm kiếm những chiến binh sale đầy đam mê, có khả năng giao tiếp và thuyết phục xuất sắc.',
      salary: '15 - 25 Triệu',
      slug: 'sales-executive',
    },
    {
      id: 2,
      title: 'CSKH & Tư vấn viên',
      department: 'Customer Service',
      type: 'Full-time',
      location: 'TP. Hồ Chí Minh',
      description: 'Lắng nghe và thấu hiểu khách hàng. Yêu cầu giọng nói nhẹ nhàng, kiên nhẫn và tận tâm.',
      salary: '10 - 15 Triệu',
      slug: 'customer-service',
    },
    {
      id: 3,
      title: 'Nhân viên kho vận',
      department: 'Logistics',
      type: 'Full-time',
      location: 'Hà Nội',
      description: 'Quản lý xuất nhập tồn, đóng gói sản phẩm cẩn thận. Ưu tiên có kinh nghiệm kho mỹ phẩm.',
      salary: '8 - 12 Triệu',
      slug: 'logistics-staff',
    },
    {
      id: 4,
      title: 'Senior Frontend Developer',
      department: 'Technology',
      type: 'Remote / Hybrid',
      location: 'TP. Hồ Chí Minh',
      description: 'Xây dựng trải nghiệm mua sắm mượt mà với React/Next.js. Tư duy thẩm mỹ tốt là một lợi thế.',
      salary: 'Thỏa thuận',
      slug: 'senior-frontend-developer',
    },
  ];

  const benefits = [
    {
      icon: <Star size={24} />,
      title: "Cơ hội thăng tiến",
      desc: "Lộ trình nghề nghiệp rõ ràng, xét duyệt tăng lương và thăng chức định kỳ 6 tháng/lần."
    },
    {
      icon: <Heart size={24} />,
      title: "Phúc lợi toàn diện",
      desc: "Bảo hiểm sức khỏe cao cấp, khám sức khỏe định kỳ và các gói chăm sóc sắc đẹp miễn phí."
    },
    {
      icon: <Users size={24} />,
      title: "Môi trường Gen Z",
      desc: "Năng động, cởi mở, tôn trọng sự khác biệt. Happy Hour hàng tuần và Teambuilding hàng quý."
    },
    {
      icon: <Smile size={24} />,
      title: "Cân bằng cuộc sống",
      desc: "Chế độ nghỉ phép linh hoạt, không khuyến khích OT, chú trọng sức khỏe tinh thần nhân viên."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 overflow-x-hidden">
      
      {/* --- 1. HERO SECTION: CĂN GIỮA TUYỆT ĐỐI --- */}
      <section className="w-screen relative left-1/2 -translate-x-1/2 py-24 bg-linear-to-br from-pink-200 via-pink-100 to-rose-100 overflow-hidden">
        {/* Decorative blobs (Giữ nguyên) */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>

        {/* Container: Thêm flex-col items-center text-center để căn giữa nội dung */}
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
            <span className="text-fuchsia-600 font-bold tracking-widest uppercase text-sm mb-4 block">
              Careers at Beauty & Skincare
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              Cùng kiến tạo <br/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-fuchsia-600 to-pink-500">Vẻ đẹp đích thực</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl leading-8 mb-10">
              Chúng tôi không chỉ bán mỹ phẩm, chúng tôi mang lại sự tự tin. 
              Gia nhập đội ngũ ngay hôm nay để cùng nhau tỏa sáng.
            </p>
            <div>
              <a href="#jobs" className="px-8 py-4 bg-white text-fuchsia-600 rounded-full font-bold hover:bg-fuchsia-700 hover:text-white transition shadow-lg transform hover:-translate-y-1 inline-flex items-center gap-2">
                Xem vị trí đang tuyển <ArrowRight size={18}/>
              </a>
            </div>
        </div>
      </section>

      {/* --- 2. BENEFITS SECTION: CĂN GIỮA CỨNG (NO SHIFT) --- */}
      {/* Kỹ thuật: w-[100vw] ml-[calc(50%-50vw)]
          - Đây là công thức toán học để ép thẻ này rộng bằng đúng màn hình 
          - Và tự động căn lề trái để tâm của nó trùng khớp tuyệt đối với tâm màn hình.
      */}
      <section className="py-24 bg-fuchsia-50 w-screen ml-[calc(50%-50vw)] relative shadow-inner leading-8"> 
        
        {/* Container nội dung: Dùng mx-auto để căn giữa nội dung bên trong background đó */}
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          
          {/* Flexbox để căn giữa tất cả text và grid */}
          <div className="flex flex-col items-center justify-center w-full">

            {/* Header */}
            <div className="text-center mb-16 max-w-3xl mx-auto w-full leading-5 ">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3 leading-4 ">Tại sao chọn chúng tôi?</h2>
              <p className="text-gray-600 text-lg leading-10">Những đặc quyền dành riêng cho thành viên Beauty & Skincare</p>
            </div>

            {/* Grid Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center justify-center mx-auto max-w-6xl w-full leading-9">
              {benefits.map((item, index) => (
                <div 
                  key={index} 
                  className="
                      bg-white 
                      p-8 
                      rounded-3xl 
                      w-full /* Đảm bảo box chiếm hết chiều rộng cột */
                      shadow-xl shadow-fuchsia-200/50 
                      border-2 border-transparent 
                      hover:border-fuchsia-400 
                      hover:shadow-2xl hover:shadow-fuchsia-300 
                      hover:-translate-y-2 
                      transition-all duration-300 
                      group
                      text-center flex flex-col items-center
                  "
                >
                  {/* Icon Box */}
                  <div className="w-16 h-16 bg-fuchsia-50 rounded-2xl flex items-center justify-center text-fuchsia-600 mb-6 group-hover:bg-fuchsia-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                    {React.cloneElement(item.icon, { className: "text-current" })} 
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-fuchsia-700 transition">
                      {item.title}
                  </h3>
                  
                  {/* Desc */}
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* --- 3. JOB LISTINGS (Danh sách việc làm) --- */}
      <section id="jobs" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-5xl flex flex-col items-center">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4 w-full">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">Vị trí đang mở</h2>
              <p className="text-gray-500 mt-2 leading-10">Hãy tìm vị trí phù hợp với tài năng của bạn</p>
            </div>
            <button className="text-fuchsia-700 font-bold hover:underline underline-offset-4">Xem tất cả →</button>
          </div>    

          <div className="grid grid-cols-1 gap-6 w-full">
            {openPositions.map((position) => (
              <div
                key={position.id}
                className="group bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 hover:border-fuchsia-200 hover:shadow-lg hover:shadow-fuchsia-50 transition duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="bg-fuchsia-50 text-fuchsia-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-fuchsia-100">
                      {position.department}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 text-xs font-medium bg-gray-100 px-3 py-1 rounded-full">
                      <Briefcase size={12} /> {position.type}
                    </span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-fuchsia-700 transition">
                    {position.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2 max-w-2xl">
                    {position.description}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
                     <div className="flex items-center gap-1">
                        <MapPin size={16} className="text-gray-400"/>
                        {position.location}
                     </div>
                     <div className="text-fuchsia-600 font-bold">
                        {position.salary}
                     </div>
                  </div>
                </div>

                <Link href={`/jobs/${position.slug}`} className="shrink-0 bg-white border-2 border-gray-200 text-gray-900 px-6 py-3 rounded-full font-bold hover:border-fuchsia-600 hover:bg-fuchsia-600 hover:text-white transition duration-300 w-full md:w-auto text-center">
                  Xem chi tiết
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. CONTACT CTA: CĂN GIỮA BOX & TEXT --- */}
      <section className="py-20 mt-32 w-full flex justify-center items-center px-6">
            
            <div className="bg-gray-200 rounded-3xl p-10 md:p-16 text-black">
                
                <div className="absolute top-0 right-20 w-64 h-64 bg-fuchsia-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
                <div className="relative max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
                    
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 leading-tight">
                        Chưa tìm thấy vị trí phù hợp?
                    </h2>
                    
                    <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                        Đừng lo lắng! Hãy gửi CV của bạn vào ngân hàng nhân sự của chúng tôi. 
                        Chúng tôi sẽ liên hệ ngay khi có cơ hội phù hợp với bạn.
                    </p>
                    
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <div className="flex items-center justify-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm border border-white/10 hover:bg-white/20 transition cursor-pointer w-full md:w-auto">
                            <Mail className="text-fuchsia-400 shrink-0" size={20} />
                            <span className="font-medium whitespace-nowrap">careers@beautyandskincare.com</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm border border-white/10 hover:bg-white/20 transition cursor-pointer w-full md:w-auto">
                            <MapPin className="text-fuchsia-400 shrink-0" size={20} />
                            <span className="font-medium whitespace-nowrap">Tầng 36, Tòa nhà Beauty, TP.HCM</span>
                        </div>
                    </div>

                </div>
            </div>
      </section>

    </div>
  );
}