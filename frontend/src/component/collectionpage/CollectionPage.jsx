import Navbar from "../Navbar";
import collectionImage from "../../assets/8.png"
import title from "../../assets/collection/chũ.png";
import img1 from "../../assets/collection/1.png"
import img2 from "../../assets/collection/2.png"
import img3 from "../../assets/collection/3.png"
import imgtitle from "../../assets/collection/Artboard 1@2x.png"
import { useState } from "react";
import Footer from "../Footer";
import { Link } from "react-router-dom";
import Button from "../Button";

export default function CollectionPage() {
    const [display, setDisplay] = useState(false);
    console.log(display);
    return (
        <div>
            <Navbar />
            {/* Phần hiển thị chi tiết khi display = true */}
            {display && (<div className="bg-[#babcbc] mt-12 flex flex-row justify-center items-center">
                <div className="text-white text-center py-5 w-1/2 px-12">
                    <p className="text-xl font-light font-stretch-extra-expanded">Một giai đoạn mới của phong cách</p>
                    <img src={title} alt="TỐI GIẢN" className="relative left-25 mx-auto" />
                    <p>The Clean Era Collection đánh dấu cách CNS quay về những giá trị cốt lõi: form dáng vừa vặn, chất liệu dễ chịu và thiết kế đủ tinh tế để tôn lên đường nét tự nhiên. Mỗi món đồ được tạo ra để đồng hành cùng bạn trong mọi nhịp sống - từ công việc, vận động đến những khoảng nghỉ riêng tư - theo cách giản lược nhưng có chủ đích.</p>
                    <div className="mt-10">
                        <Link to={"/product"}><Button content={"Khám phá ngay"}></Button></Link>
                    </div>
                </div>
                <div className="w-1/2">
                    <img src={collectionImage} alt="Collection image" className=" overflow-hidden" />
                </div>
            </div>)}

            {/* Phần hiển thị hình ảnh tiêu đề và chữ khi display = false */}
            {!display && (
                <div
                    className="w-full h-full min-h-[600px] font-sans relative cursor-pointer group" // Thêm relative và cursor-pointer
                    onClick={() => setDisplay(true)} // Thêm sự kiện click
                >
                    <img src={imgtitle} alt="The Clean Era" className="w-full h-full object-cover" />
                    
                    {/* Lớp phủ chứa văn bản */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4 transition-opacity duration-300 group-hover:bg-black/10">
                        <h3 className="text-sm md:text-lg font-light tracking-[0.2em] mb-2 uppercase">Cleannie Studio</h3>
                        <h1 className="text-3xl md:text-5xl font-serif tracking-widest mb-3 uppercase">The Clean Era</h1>
                        <p className="text-sm md:text-base font-light tracking-widest uppercase">Bộ sưu tập mới 2026</p>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    )
}