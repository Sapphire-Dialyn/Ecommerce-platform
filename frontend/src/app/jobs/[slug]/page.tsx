'use client';

import React, { useState } from 'react';
import { ArrowLeft, Upload, FileText, CheckCircle2, MapPin, Briefcase, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const jobDetails = {
  'sales-executive': {
    title: 'Chuyên viên kinh doanh',
    department: 'Sales',
    type: 'Full-time',
    location: 'TP. Hồ Chí Minh',
    salary: '15 - 25 Triệu',
    description: 'Tìm kiếm những chiến binh sale đầy đam mê, có khả năng giao tiếp và thuyết phục xuất sắc.',
    fullDescription: 'Chúng tôi đang tìm kiếm những chuyên viên kinh doanh tài ba để gia nhập đội ngũ năng động của chúng tôi. Bạn sẽ được phát triển kỹ năng bán hàng, xây dựng mối quan hệ với khách hàng và đóng góp vào sự phát triển của công ty.',
    requirements: [
      'Có ít nhất 1 năm kinh nghiệm trong lĩnh vực bán hàng',
      'Kỹ năng giao tiếp xuất sắc và khả năng thuyết phục',
      'Nhiệt tình, quyết tâm và hướng đến kết quả',
      'Có khả năng làm việc độc lập và trong nhóm',
      'Sử dụng thành thạo máy tính và các ứng dụng CRM'
    ],
    benefits: [
      'Lương cứng + thưởng doanh số hấp dẫn',
      'Bảo hiểm sức khỏe toàn diện',
      'Cơ hội thăng tiến rõ ràng',
      'Đào tạo định kỳ và phát triển kỹ năng',
      'Môi trường làm việc thân thiện'
    ]
  },
  'customer-service': {
    title: 'CSKH & Tư vấn viên',
    department: 'Customer Service',
    type: 'Full-time',
    location: 'TP. Hồ Chí Minh',
    salary: '10 - 15 Triệu',
    description: 'Lắng nghe và thấu hiểu khách hàng. Yêu cầu giọng nói nhẹ nhàng, kiên nhẫn và tận tâm.',
    fullDescription: 'Bạn sẽ là đại diện của chúng tôi, lắng nghe những lo lắng của khách hàng và cung cấp những giải pháp tối ưu. Công việc này yêu cầu sự tận tâm, kiên nhẫn và một trái tim chân thật để chăm sóc khách hàng.',
    requirements: [
      'Có kinh nghiệm trong dịch vụ khách hàng hoặc tư vấn',
      'Giọng nói nhẹ nhàng, cách nói lịch sự',
      'Kiên nhẫn, empathy cao và tận tâm với công việc',
      'Khả năng giải quyết vấn đề nhanh chóng',
      'Thành thạo tiếng Anh là một lợi thế'
    ],
    benefits: [
      'Lương cứng ổn định',
      'Thưởng hiệu suất hàng tháng',
      'Bảo hiểm sức khỏe cao cấp',
      'Đào tạo chuyên sâu về sản phẩm',
      'Chế độ nghỉ phép linh hoạt'
    ]
  },
  'logistics-staff': {
    title: 'Nhân viên kho vận',
    department: 'Logistics',
    type: 'Full-time',
    location: 'Hà Nội',
    salary: '8 - 12 Triệu',
    description: 'Quản lý xuất nhập tồn, đóng gói sản phẩm cẩn thận. Ưu tiên có kinh nghiệm kho mỹ phẩm.',
    fullDescription: 'Chúng tôi cần những nhân viên kho vận trách nhiệm để đảm bảo sản phẩm được xử lý cẩn thận và giao tới khách hàng trong tình trạng tốt nhất. Đây là công việc quan trọng trong chuỗi cung ứng của chúng tôi.',
    requirements: [
      'Có kinh nghiệm làm việc tại kho hàng hoặc logistics',
      'Kinh nghiệm kho mỹ phẩm là ưu tiên',
      'Cẩn thận, chính xác trong công việc',
      'Có thể làm việc theo ca hoặc ngoài giờ nếu cần',
      'Thành thạo sử dụng hệ thống WMS'
    ],
    benefits: [
      'Lương cứng + phụ cấp ca',
      'Thưởng hiệu suất hàng tháng',
      'Bảo hiểm lao động đầy đủ',
      'Cơ hội nâng cấp lên trưởng kho',
      'Môi trường làm việc an toàn'
    ]
  },
  'senior-frontend-developer': {
    title: 'Senior Frontend Developer',
    department: 'Technology',
    type: 'Remote / Hybrid',
    location: 'TP. Hồ Chí Minh',
    salary: 'Thỏa thuận',
    description: 'Xây dựng trải nghiệm mua sắm mượt mà với React/Next.js. Tư duy thẩm mỹ tốt là một lợi thế.',
    fullDescription: 'Chúng tôi đang tìm một Senior Frontend Developer tài ba để lãnh đạo các dự án phía trước. Bạn sẽ cộng tác với UX/UI designers, backend developers và quản lý sản phẩm để xây dựng trải nghiệm người dùng tuyệt vời.',
    requirements: [
      'Ít nhất 3+ năm kinh nghiệm React/Next.js',
      'Thành thạo TypeScript, Tailwind CSS',
      'Hiểu rõ về performance optimization',
      'Kinh nghiệm với state management (Redux, Zustand)',
      'Có thể mentoring các developer junior',
      'Tư duy thẩm mỹ tốt và quan tâm đến UX'
    ],
    benefits: [
      'Mức lương cạnh tranh và thỏa thuận',
      'Làm việc remote hoặc hybrid',
      'Bảo hiểm sức khỏe cao cấp',
      'Máy tính công ty cao cấp',
      'Cơ hội phát triển kỹ năng liên tục',
      'Thưởng dự án và bonus hiệu suất'
    ]
  }
};

type JobSlug = keyof typeof jobDetails;

export default function JobDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const job = jobDetails[slug as JobSlug];
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Không tìm thấy vị trí</h1>
          <Link href="/careers" className="text-fuchsia-600 hover:text-fuchsia-700 font-bold">
            Quay lại trang tuyển dụng
          </Link>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      if (file.size <= 5 * 1024 * 1024) {
        setCvFile(file);
      } else {
        alert('File phải nhỏ hơn 5MB');
      }
    } else {
      alert('Vui lòng chọn file PDF');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) {
      alert('Vui lòng chọn file CV');
      return;
    }
    setUploading(true);
    // Simulate upload
    setTimeout(() => {
      alert('Ứng tuyển thành công! Chúng tôi sẽ liên hệ trong 3-5 ngày làm việc.');
      setCvFile(null);
      setUploading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-br from-pink-200 via-pink-100 to-rose-100 py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link href="/careers" className="flex items-center gap-2 text-fuchsia-600 hover:text-fuchsia-700 mb-6 font-bold">
            <ArrowLeft size={20} /> Quay lại
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">{job.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full">
              <Briefcase size={16} className="text-fuchsia-600" />
              <span className="font-semibold">{job.department}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full">
              <MapPin size={16} className="text-fuchsia-600" />
              <span className="font-semibold">{job.location}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full">
              <DollarSign size={16} className="text-fuchsia-600" />
              <span className="font-semibold">{job.salary}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 max-w-4xl py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Về vị trí này</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{job.fullDescription}</p>
            </section>

            {/* Requirements */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Yêu cầu</h2>
              <ul className="space-y-3">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex gap-3">
                    <CheckCircle2 size={20} className="text-fuchsia-600 shrink-0 mt-0.5" />
                    <span className="text-gray-600">{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Benefits */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Quyền lợi</h2>
              <ul className="space-y-3">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex gap-3">
                    <CheckCircle2 size={20} className="text-fuchsia-600 shrink-0 mt-0.5" />
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar - Application Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Ứng tuyển ngay</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* CV Upload */}
                <div>
                  <label htmlFor="cv-upload" className="block text-sm font-bold text-gray-900 mb-3">
                    Tải lên CV (PDF)
                  </label>
                  <div className="relative">
                    <input
                      id="cv-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="cv-upload"
                      className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-fuchsia-400 hover:bg-fuchsia-50 transition cursor-pointer"
                    >
                      <Upload size={20} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {cvFile ? cvFile.name : 'Chọn file PDF'}
                      </span>
                    </label>
                  </div>
                  {cvFile && (
                    <div className="mt-3 flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                      <FileText size={16} className="text-green-600" />
                      <span className="text-sm text-green-700">{cvFile.name}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">Tối đa 5MB</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!cvFile || uploading}
                  className="w-full py-3 bg-linear-to-r from-fuchsia-600 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-fuchsia-200 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
                >
                  {uploading ? 'Đang gửi...' : 'Ứng tuyển'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Chúng tôi sẽ xem xét CV của bạn và liên hệ trong 3-5 ngày làm việc.
                </p>
              </form>

              {/* Contact Info */}
              <div className="mt-8 pt-8 border-t border-gray-200 space-y-3">
                <p className="text-sm font-bold text-gray-900">Có câu hỏi?</p>
                <a href="mailto:careers@beautyandskincare.com" className="text-sm text-fuchsia-600 hover:text-fuchsia-700 block">
                  careers@beautyandskincare.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
