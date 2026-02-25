import Navbar from '../Navbar'
import Button from '../Button'
import Footer from '../Footer'
import { Link } from 'react-router-dom'
import ctaVideo from '../../assets/homepage/cta-vid.MOV'

import image1 from '../../assets/homepage/image1.png'
import image2 from '../../assets/homepage/image2.png'
import image3 from '../../assets/homepage/image3.png'
import image4 from '../../assets/homepage/image4.png'
import image5 from '../../assets/homepage/image5.png'
import image6 from '../../assets/homepage/image6.png'

export default function Homepage() {
    return (
        <div id='homepage' className=''>
            <Navbar />
            
            <div id='homepage-body' className='relative w-full h-screen overflow-hidden'>
                <video 
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                >
                    <source src={ctaVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* --- SECTION 1: VỀ CLEANNIE STUDIO --- */}
            <div className="w-full px-40 py-15 flex flex-col gap-10">
                {/* Image Container */}
                <div className="flex w-full h-[500px]">
                    <div className="w-1/2 h-full">
                        <img 
                            src={image1}
                            alt="Cleannie Studio Model on Hammock" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div className="w-1/2 h-full">
                        <img 
                            src={image2}
                            alt="Cleannie Studio Model on Hammock"
                            className="w-full h-full object-cover object-top" 
                        />
                    </div>
                </div>
                
                {/* Text Container */}
                <div className="flex w-full justify-between items-start pt-5">
                    <div className="w-1/3 pr-8">
                        <h2 className="text-4xl font-bold text-[#4a3629] tracking-wide uppercase">
                            Về Cleannie Studio
                        </h2>
                    </div>
                    <div className="w-2/3">
                        <p className="text-gray-600 leading-relaxed text-sm text-justify">
                            "Vào năm 2025, Cleannie Studio được ra đời với khát vọng tạo nên những thiết kế thời trang không chỉ đẹp về hình thức mà còn vừa vặn hoàn hảo với từng vóc dáng. Chúng tôi tin rằng mỗi cơ thể đều mang một câu chuyện riêng, và thời trang cần tôn vinh sự khác biệt đó. Bằng việc kết hợp tư duy thiết kế hiện đại, chất liệu chọn lọc và công nghệ đo lường thông số cơ thể chính xác, nhãn hàng hướng đến việc mang lại trải nghiệm cá nhân hóa, giúp mỗi khách hàng tự tin thể hiện phong cách và bản sắc của chính mình trong từng sản phẩm."
                        </p>
                    </div>
                </div>
            </div>

            {/* --- SECTION 2: BÁN CHẠY NHẤT --- */}
            <div className="w-full px-40 py-15 mb-10">
                <div className="flex w-full h-[600px] gap-8">
                    {/* Left Side: Large Image */}
                    <div className="w-[40%] h-full">
                        <img 
                            src={image3}
                            alt="Best Seller Main - Models" 
                            className="w-full h-full object-cover object-center" 
                        />
                    </div>
                    
                    {/* Right Side: Grid of Images and Text */}
                    <div className="w-[60%] flex flex-col justify-between h-full">
                        {/* Top 3 Small Images */}
                        <div className="flex justify-between h-[65%] gap-6">
                            <div className="w-1/3">
                                <img 
                                    src={image4}
                                    alt="Product 1" 
                                    className="w-full h-full object-cover object-center" 
                                />
                            </div>
                            <div className="w-1/3">
                                <img 
                                    src={image5}
                                    alt="Product 2" 
                                    className="w-full h-full object-cover object-center" 
                                />
                            </div>
                            <div className="w-1/3">
                                <img 
                                    src={image6}
                                    alt="Product 3" 
                                    className="w-full h-full object-cover object-top" 
                                />
                            </div>
                        </div>
                        
                        {/* Bottom Text and CTA */}
                        <div className="flex flex-col h-[30%] justify-end pb-2">
                            <h2 className="text-5xl text-[#4a3629] mb-4">
                                BÁN CHẠY NHẤT
                            </h2>
                            <div className="flex justify-between items-end gap-10">
                                <p className="w-[70%] text-gray-700 text-sm leading-relaxed">
                                    Với khả năng định hình, ôm sát và cảm giác nhẹ nhàng, chúng tôi đã thiết kế các sản phẩm với chất liệu phù hợp mọi nhu cầu và phong cách sống của bạn.
                                </p>
                                    <Link to={"/product"} className="px-10 py-3 w-fit bg-gray-200 hover:bg-gray-300 transition-colors text-black font-medium rounded-md w-[30%] cursor-pointer">
                                        Mua Ngay
                                    </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}