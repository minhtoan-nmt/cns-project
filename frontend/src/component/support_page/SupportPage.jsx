import Navbar from "../Navbar";
import React, { useState } from 'react';

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border border-white/30 rounded-lg mb-4 overflow-hidden bg-white/5 backdrop-blur-sm transition-all duration-300">
      <button
        className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
        onClick={onClick}
      >
        <span className="font-semibold text-white text-base md:text-lg">{question}</span>
        <div className={`p-1 rounded-full border border-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4 pt-0 text-gray-300 text-sm md:text-base border-t border-white/10 mt-2">
          {answer}
        </div>
      </div>
    </div>
  );
};

export default function SupportPage() {
    const [openIndex, setOpenIndex] = useState(0);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    // Hàm xử lý cuộn trang mượt mà
    const scrollToSection = (e, sectionId) => {
        e.preventDefault(); // Ngăn chặn hành vi nhảy trang mặc định của thẻ a
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // Dữ liệu câu hỏi
    const faqs = [
        {
        question: "Cách theo dõi đơn hàng CNS:",
        answer: "Bạn có thể kiểm tra trạng thái đơn hàng ngay trong Order History khi đăng nhập tài khoản. Hoặc sử dụng mã đơn hàng + email để tra cứu trực tiếp."
        },
        {
        question: "Khi nào tôi nhận được mã vận đơn?",
        answer: "Mã vận đơn sẽ được gửi qua email trong vòng 24 giờ kể từ khi đơn hàng được chuyển sang đơn vị vận chuyển."
        },
        {
        question: "Hướng dẫn đặt hàng trực tuyến?",
        answer: "Nhập thông tin -> Chọn phương thức thanh toán -> Xác nhận đơn -> Nhận hàng"
        },
        {
        question: "Hỗ trợ sản phẩm lỗi hoặc thiếu hàng?",
        answer: "Vui lòng liên hệ bộ phận CSKH qua email hoặc hotline trong vòng 48h kể từ khi nhận hàng để được hỗ trợ đổi trả/bù hàng nhanh nhất."
        }
    ];

    return (<>
        <Navbar />
        <div className="min-h-screen mt-15 bg-[#3E2b22] text-white font-sans relative overflow-hidden">
      
            {/* Background Watermark Text "CNS" */}
            <div className="absolute top-0 left-0 w-full h-[600px] flex justify-center items-start pointer-events-none z-0 opacity-[0.03]">
                <span className="text-[400px] font-bold tracking-tighter text-white leading-none">CNS</span>
            </div>

            <div className="container mx-auto px-4 py-12 relative z-10 max-w-5xl">
                
                {/* --- PHẦN TRÊN: LINK HỖ TRỢ & LIÊN HỆ --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
                
                {/* Cột trái: Newsletter */}
                <div className="w-full md:w-1/3 order-2 md:order-1">
                    <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                    Hãy tham gia cộng đồng của chúng tôi để trở thành người đầu tiên cập nhật các bộ sưu tập mới nhất, chương trình ưu đãi đặc biệt và những điều sắp ra mắt
                    </p>
                    <div className="relative">
                    <input 
                        type="email" 
                        placeholder="E-mail" 
                        className="w-full bg-[#4a362d] border border-white/30 rounded-full py-3 px-6 text-sm text-white focus:outline-none focus:border-white placeholder-gray-400"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-1.5 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                    </div>
                </div>

                {/* Cột giữa: Danh sách liên kết (Centered) */}
                <div className="w-full md:w-1/3 text-center flex flex-col items-center order-1 md:order-2 mb-8 md:mb-0">
                    <h1 className="text-3xl font-medium mb-6">Hỗ trợ</h1>
                    <ul className="space-y-3 text-sm md:text-base text-gray-200">
                        {/* Gọi hàm scrollToSection với ID tương ứng */}
                        <li><a href="#faq-section" onClick={(e) => scrollToSection(e, 'faq-section')} className="hover:text-white hover:underline decoration-1 underline-offset-4 cursor-pointer">Những câu hỏi thường gặp</a></li>
                        <li><a href="#return-policy" onClick={(e) => scrollToSection(e, 'return-policy')} className="hover:text-white hover:underline decoration-1 underline-offset-4 cursor-pointer">Chính sách đổi trả</a></li>
                        <li><a href="#order-tracking" onClick={(e) => scrollToSection(e, 'order-tracking')} className="hover:text-white hover:underline decoration-1 underline-offset-4 cursor-pointer">Theo dõi đơn hàng</a></li>
                        <li><a href="#contact-info" onClick={(e) => scrollToSection(e, 'contact-info')} className="hover:text-white hover:underline decoration-1 underline-offset-4 cursor-pointer">Thông tin liên lạc</a></li>
                    </ul>
                </div>

                {/* Cột phải: Social Icons */}
                <div className="w-full md:w-1/3 flex justify-end gap-3 order-3">
                    {/* Các icon mạng xã hội giữ nguyên... */}
                    <div className="w-10 h-10 bg-white/20 rounded md:rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/30 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded md:rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/30 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded md:rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/30 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded md:rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/30 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z"/></svg>
                    </div>
                </div>
                </div>

                {/* --- PHẦN DƯỚI: FAQ --- */}
                {/* Thêm id và class scroll-mt-24 để cuộn không bị dính sát mép trên */}
                <div id="faq-section" className="mt-12 scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-medium text-center mb-10">Những câu hỏi thường gặp</h2>
                    
                    <div className="space-y-2">
                        {faqs.map((faq, index) => (
                        <AccordionItem 
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onClick={() => toggleAccordion(index)}
                        />
                        ))}
                    </div>
                </div>

            </div>
            
            <div className="w-full text-white pt-20 pb-10">
      
                {/* --- PHẦN 1: CHÍNH SÁCH ĐỔI TRẢ --- */}
                {/* Thêm id và class scroll-mt-24 */}
                <div id="return-policy" className="mb-24 scroll-mt-24">
                    <h2 className="text-3xl md:text-4xl font-medium text-center mb-12">Chính sách đổi trả</h2>
                    <div className="space-y-8 max-w-4xl mx-auto px-4 md:px-0 text-sm md:text-base text-gray-200 leading-relaxed">
                        <div>
                            <h3 className="font-bold text-white mb-2">Chính sách đổi/trả sản phẩm:</h3>
                            <ul className="list-disc pl-5 space-y-1 marker:text-gray-400">
                            <li>CNS hỗ trợ đổi sản phẩm nếu bạn không hài lòng về size, màu, chất lượng vải hoặc kiểu dáng trong vòng 30 ngày kể từ ngày nhận hàng.</li>
                            <li>Đối với đặt hàng trực tiếp qua website, bạn có thể hoàn trả và nhận refund, nếu sản phẩm còn nguyên tem mác và chưa qua sử dụng.</li>
                            </ul>
                        </div>
                        {/* Các block còn lại giữ nguyên... */}
                    </div>
                </div>

                {/* --- PHẦN 2: THEO DÕI ĐƠN HÀNG --- */}
                {/* Thêm id và class scroll-mt-24 */}
                <div id="order-tracking" className="mb-12 relative scroll-mt-24">
                    <h2 className="text-3xl md:text-4xl font-medium text-center mb-12">Theo dõi đơn hàng</h2>
                    <div className="space-y-8 max-w-4xl mx-auto px-4 md:px-0 text-center text-sm md:text-base text-gray-200">
                        <div>
                            <h3 className="font-bold text-white mb-2">Bạn có thể:</h3>
                            <ul className="list-disc list-inside space-y-1 marker:text-gray-400 inline-block text-left">
                            <li>Đăng nhập tài khoản và xem trực tiếp trong mục Order History</li>
                            <li>Nhập Mã vận đơn + Email tại trang "Theo dõi đơn hàng" của CNS</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* --- FOOTER SOCIAL ICONS (Đóng vai trò là Thông tin liên lạc) --- */}
                {/* Thêm id */}
                <div id="contact-info" className="flex justify-end gap-3 px-4 md:px-0 max-w-5xl mx-auto mt-20 scroll-mt-24">
                    {/* Icon mạng xã hội giữ nguyên... */}
                    <div className="w-9 h-9 bg-white/20 rounded flex items-center justify-center cursor-pointer hover:bg-white/30 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </div>
                </div>
            </div>
        </div>
    </>)
}