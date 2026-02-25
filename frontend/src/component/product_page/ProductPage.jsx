import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import VideoPopUp from "../VideoPopUp";
import { CiCircleChevDown } from "react-icons/ci";

// Import các component con vừa tách
import CategorySidebar from "./CategorySidebar"; 
import FilterSidebar from "./FilterSidebar";
import ProductList from "./ProductList";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Toast thông báo (giữ cho tương lai nếu cần)
const NotificationToast = ({ toast }) => {
    if (!toast?.show) return null;
    const isError = toast.isError;
    return (
        <div className="fixed bottom-5 right-5 z-50 animate-fadeIn">
            <div className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${isError ? "bg-red-600" : "bg-[#3a2415]"} text-white`}>
                <span className="font-semibold">{toast.title}</span>
                <span className="text-sm">{toast.message}</span>
            </div>
        </div>
    );
};

// Modal yêu cầu đăng nhập - giữ cho tương lai nếu cần
const LoginModal = ({ show, onClose, onGoLogin }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm mx-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-[#3a2415] mb-2">Bạn cần đăng nhập</h3>
                <p className="text-gray-600 mb-6">Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50">Đóng</button>
                    <button onClick={onGoLogin} className="flex-1 py-2 bg-[#3a2415] text-white rounded hover:bg-[#5a3a1a]">Đăng nhập</button>
                </div>
            </div>
        </div>
    );
};

const IMG_BASE = "/images/products/HÌNH ẢNH SẢN PHẨM/HÌNH ẢNH SẢN PHẨM";
const VALENTINE_BASE = `${IMG_BASE}/BỘ SƯU TẬP VALENTINE_S`;

// Sản phẩm Bộ sưu tập Valentine (hiển thị, thêm giỏ sẽ báo lỗi vì backend chưa có)
const VALENTINE_PRODUCTS = [
    { id: "val-blush-1", imageSrc: `${VALENTINE_BASE}/1. BLUSH TOP/1.JPG`, productName: "Blush Top 1", price: 349000, categories: ["Valentine"], sizes: ["S", "M", "L"], stockQuantity: 100 },
    { id: "val-blush-2", imageSrc: `${VALENTINE_BASE}/1. BLUSH TOP/2.jpg`, productName: "Blush Top 2", price: 349000, categories: ["Valentine"], sizes: ["S", "M", "L"], stockQuantity: 100 },
    { id: "val-blush-3", imageSrc: `${VALENTINE_BASE}/1. BLUSH TOP/3.jpg`, productName: "Blush Top 3", price: 349000, categories: ["Valentine"], sizes: ["S", "M", "L"], stockQuantity: 100 },
    { id: "val-kiss-1", imageSrc: `${VALENTINE_BASE}/2. KISS SET/1.JPG`, productName: "Kiss Set 1", price: 399000, categories: ["Valentine"], sizes: ["S", "M", "L"], stockQuantity: 100 },
    { id: "val-kiss-2", imageSrc: `${VALENTINE_BASE}/2. KISS SET/2.JPG`, productName: "Kiss Set 2", price: 399000, categories: ["Valentine"], sizes: ["S", "M", "L"], stockQuantity: 100 },
    { id: "val-kiss-3", imageSrc: `${VALENTINE_BASE}/2. KISS SET/3.JPG`, productName: "Kiss Set 3", price: 399000, categories: ["Valentine"], sizes: ["S", "M", "L"], stockQuantity: 100 },
    { id: "val-kiss-4", imageSrc: `${VALENTINE_BASE}/2. KISS SET/4.JPG`, productName: "Kiss Set 4", price: 399000, categories: ["Valentine"], sizes: ["S", "M", "L"], stockQuantity: 100 },
    { id: "val-kiss-5", imageSrc: `${VALENTINE_BASE}/2. KISS SET/5.JPG`, productName: "Kiss Set 5", price: 399000, categories: ["Valentine"], sizes: ["S", "M", "L"], stockQuantity: 100 },
    { id: "val-kiss-6", imageSrc: `${VALENTINE_BASE}/2. KISS SET/6.JPG`, productName: "Kiss Set 6", price: 399000, categories: ["Valentine"], sizes: ["S", "M", "L"], stockQuantity: 100 },
    { id: "val-crush-1", imageSrc: `${VALENTINE_BASE}/3. CRUSH BOTTOM/1.JPG`, productName: "Crush Bottom 1", price: 329000, categories: ["Valentine"], sizes: ["S", "M", "L"], stockQuantity: 100 },
    { id: "val-crush-2", imageSrc: `${VALENTINE_BASE}/3. CRUSH BOTTOM/2.JPG`, productName: "Crush Bottom 2", price: 329000, categories: ["Valentine"], sizes: ["S", "M", "L"], stockQuantity: 100 },
    { id: "val-crush-3", imageSrc: `${VALENTINE_BASE}/3. CRUSH BOTTOM/3.JPG`, productName: "Crush Bottom 3", price: 329000, categories: ["Valentine"], sizes: ["S", "M", "L"], stockQuantity: 100 },
    { id: "val-crush-4", imageSrc: `${VALENTINE_BASE}/3. CRUSH BOTTOM/4.JPG`, productName: "Crush Bottom 4", price: 329000, categories: ["Valentine"], sizes: ["S", "M", "L"], stockQuantity: 100 },
    { id: "val-luv-1", imageSrc: `${VALENTINE_BASE}/4. LUV TOP/1.JPG`, productName: "Luv Top 1", price: 369000, categories: ["Valentine"], sizes: ["S", "M", "L"], stockQuantity: 100 },
    { id: "val-luv-2", imageSrc: `${VALENTINE_BASE}/4. LUV TOP/2.JPG`, productName: "Luv Top 2", price: 369000, categories: ["Valentine"], sizes: ["S", "M", "L"], stockQuantity: 100 },
    { id: "val-luv-3", imageSrc: `${VALENTINE_BASE}/4. LUV TOP/3.JPG`, productName: "Luv Top 3", price: 369000, categories: ["Valentine"], sizes: ["S", "M", "L"], stockQuantity: 100 },
    { id: "val-luv-4", imageSrc: `${VALENTINE_BASE}/4. LUV TOP/4.JPG`, productName: "Luv Top 4", price: 369000, categories: ["Valentine"], sizes: ["S", "M", "L"], stockQuantity: 100 },
    { id: "val-sweet-1", imageSrc: `${VALENTINE_BASE}/5. SWEET BOTTOM/1.JPG`, productName: "Sweet Bottom 1", price: 319000, categories: ["Valentine"], sizes: ["S", "M", "L"], stockQuantity: 100 },
    { id: "val-sweet-2", imageSrc: `${VALENTINE_BASE}/5. SWEET BOTTOM/2.JPG`, productName: "Sweet Bottom 2", price: 319000, categories: ["Valentine"], sizes: ["S", "M", "L"], stockQuantity: 100 },
    { id: "val-sweet-3", imageSrc: `${VALENTINE_BASE}/5. SWEET BOTTOM/3.JPG`, productName: "Sweet Bottom 3", price: 319000, categories: ["Valentine"], sizes: ["S", "M", "L"], stockQuantity: 100 },
];

// Sản phẩm Thời trang Nam & Nữ (trùng backend seed – thêm giỏ được)
const withDetail = (p) => ({ ...p, sizes: ["S", "M", "L"], stockQuantity: 100 });
const PRODUCTS = [
    // --- THỜI TRANG NỮ ---
    withDetail({ id: "p-nu-1", imageSrc: `${IMG_BASE}/THỜI TRANG NỮ/Black top.png`, productName: "Black Top", price: 389000, categories: ["Nữ"] }),
    withDetail({ id: "p-nu-2", imageSrc: `${IMG_BASE}/THỜI TRANG NỮ/Blush lift bra.JPG`, productName: "Blush Lift Bra", price: 319000, categories: ["Nữ"] }),
    withDetail({ id: "p-nu-3", imageSrc: `${IMG_BASE}/THỜI TRANG NỮ/Butter set.JPG`, productName: "Butter Set", price: 459000, categories: ["Nữ"] }),
    withDetail({ id: "p-nu-4", imageSrc: `${IMG_BASE}/THỜI TRANG NỮ/Cemly set_.png`, productName: "Cemly Set", price: 429000, categories: ["Nữ"] }),
    withDetail({ id: "p-nu-5", imageSrc: `${IMG_BASE}/THỜI TRANG NỮ/Contour fit short.JPG`, productName: "Contour Fit Short", price: 279000, categories: ["Nữ"] }),
    withDetail({ id: "p-nu-6", imageSrc: `${IMG_BASE}/THỜI TRANG NỮ/Core high-waist legging .png`, productName: "Core High-Waist Legging", price: 349000, categories: ["Nữ"] }),
    withDetail({ id: "p-nu-7", imageSrc: `${IMG_BASE}/THỜI TRANG NỮ/Dual tone sculpt bra.JPG`, productName: "Dual Tone Sculpt Bra", price: 339000, categories: ["Nữ"] }),
    withDetail({ id: "p-nu-8", imageSrc: `${IMG_BASE}/THỜI TRANG NỮ/Emily top.jpg`, productName: "Emily Top", price: 299000, categories: ["Nữ"] }),
    withDetail({ id: "p-nu-9", imageSrc: `${IMG_BASE}/THỜI TRANG NỮ/Second top.jpg`, productName: "Second Top", price: 269000, categories: ["Nữ"] }),
    withDetail({ id: "p-nu-10", imageSrc: `${IMG_BASE}/THỜI TRANG NỮ/Soft form short.png`, productName: "Soft Form Short", price: 309000, categories: ["Nữ"] }),
    withDetail({ id: "p-nu-11", imageSrc: `${IMG_BASE}/THỜI TRANG NỮ/Vanilla sculpt set.png`, productName: "Vanilla Sculpt Set", price: 499000, categories: ["Nữ"] }),
    // --- THỜI TRANG NAM ---
    withDetail({ id: "p-nam-1", imageSrc: `${IMG_BASE}/THỜI TRANG NAM/Campaign.jpg`, productName: "Campaign - Thời trang nam", price: 459000, categories: ["Nam"] }),
    withDetail({ id: "p-nam-2", imageSrc: `${IMG_BASE}/THỜI TRANG NAM/Classic Zip Hoodie.jpg`, productName: "Classic Zip Hoodie", price: 499000, categories: ["Nam"] }),
    withDetail({ id: "p-nam-3", imageSrc: `${IMG_BASE}/THỜI TRANG NAM/Essential Ribbed Tank Top – 3 Pack.jpg`, productName: "Essential Ribbed Tank Top – 3 Pack", price: 329000, categories: ["Nam"] }),
    withDetail({ id: "p-nam-4", imageSrc: `${IMG_BASE}/THỜI TRANG NAM/Essential Long Sleeve T-Shirt.jpg`, productName: "Essential Long Sleeve T-Shirt", price: 349000, categories: ["Nam"] }),
    withDetail({ id: "p-nam-5", imageSrc: `${IMG_BASE}/THỜI TRANG NAM/Essential Short Sleeve T-Shirt.jpg`, productName: "Essential Short Sleeve T-Shirt", price: 329000, categories: ["Nam"] }),
    withDetail({ id: "p-nam-6", imageSrc: `${IMG_BASE}/THỜI TRANG NAM/Fleece Jogger Sweatpants.jpg`, productName: "Fleece Jogger Sweatpants", price: 449000, categories: ["Nam"] }),
    withDetail({ id: "p-nam-7", imageSrc: `${IMG_BASE}/THỜI TRANG NAM/Lightweight Zip-Up Hoodie Set.jpg`, productName: "Lightweight Zip-Up Hoodie Set", price: 499000, categories: ["Nam"] }),
    withDetail({ id: "p-nam-8", imageSrc: `${IMG_BASE}/THỜI TRANG NAM/Lightweight Zip-Up Hoodie Set(1).jpg`, productName: "Lightweight Zip-Up Hoodie Set (Variant)", price: 499000, categories: ["Nam"] }),
    withDetail({ id: "p-nam-9", imageSrc: `${IMG_BASE}/THỜI TRANG NAM/Relaxed Fit Cotton T-Shirt.jpg`, productName: "Relaxed Fit Cotton T-Shirt", price: 299000, categories: ["Nam"] }),
    withDetail({ id: "p-nam-10", imageSrc: `${IMG_BASE}/THỜI TRANG NAM/Relaxed Fit Lounge T-Shirt & Shorts Set.jpg`, productName: "Relaxed Fit Lounge T-Shirt & Shorts Set", price: 429000, categories: ["Nam"] }),
    withDetail({ id: "p-nam-11", imageSrc: `${IMG_BASE}/THỜI TRANG NAM/Slim Fit Cotton Tank Top.jpg`, productName: "Slim Fit Cotton Tank Top", price: 279000, categories: ["Nam"] }),
];

export default function ProductPage() {
    const nav = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const collectionParam = searchParams.get("collection");
    const [productData, setProductData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [toast, setToast] = useState({ show: false, isError: false, title: "", message: "" });

    const handleCloseLoginModal = () => {
        setShowLoginModal(false);
        nav("/login");
    };

    // State quản lý đóng mở sidebar
    const [isOpenTypeSel, setisOpenTypeSel] = useState(false);
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const [isOpenPopUp, setIsOpenPopUp] = useState(false);

    // State lưu các categories - khởi tạo từ URL ?filter=Nữ hoặc ?filter=Nam
    const [selectedCategories, setSelectedCategories] = useState(() => {
        const f = searchParams.get("filter");
        return f && ["Nữ", "Nam"].includes(f) ? [f] : [];
    });

    // State lưu sort filter
    const [selectedSortOption, setSelectedSortOption] = useState(null);

    // Dữ liệu tĩnh cho sidebar
    const categoryOptions = ["Tất cả", "Nữ", "Nam"];
    const filterOptions = ["Giá từ thấp tới cao", "Giá từ cao tới thấp", "Độ bán chạy"];

    const handleCategoryToggle = (category) => {
        if (category === "Tất cả") {
            setSearchParams({});
            setSelectedCategories([]);
            return;
        }
        // Đang xem Valentine: chuyển sang Thời trang Nữ/Nam
        if (collectionParam === "valentine") {
            setSearchParams({ filter: category });
            setSelectedCategories([category]);
            return;
        }
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                setSearchParams({});
                return [];
            } else {
                setSearchParams({ filter: category });
                return [category];
            }
        });
    }

    const handleSortToggle = (option) => {
        if (selectedSortOption === option) {
            setSelectedSortOption(null); // Click lại thì bỏ chọn
        } else {
            setSelectedSortOption(option); // Chọn cái mới
        }
    };

    // Đồng bộ selectedCategories khi URL thay đổi
    useEffect(() => {
        const f = searchParams.get("filter");
        if (f && ["Nữ", "Nam"].includes(f)) {
            setSelectedCategories([f]);
        } else if (!searchParams.get("collection")) {
            setSelectedCategories([]);
        }
    }, [searchParams]);

    // Hiển thị Valentine hoặc Thời trang theo ?collection=
    useEffect(() => {
        if (collectionParam === "valentine") {
            setIsLoading(false);
            setProductData(VALENTINE_PRODUCTS);
            setFetchError(null);
            return;
        }
        setIsLoading(false);
        setProductData(PRODUCTS);
        setFetchError(null);
    }, [collectionParam]);

    const displayProducts = useMemo(() => {
        let filtered = productData;
        if (collectionParam !== "valentine" && selectedCategories.length > 0) {
            filtered = productData.filter(p => {
                const cats = p.categories || [];
                return selectedCategories.every(c => cats.includes(c));
            });
        }

        if (!selectedSortOption || selectedSortOption === "Độ bán chạy") {
            return filtered;
        }
        const sorted = [...filtered];
        if (selectedSortOption === "Giá từ thấp tới cao") {
            return sorted.sort((a, b) => a.price - b.price);
        }
        if (selectedSortOption === "Giá từ cao tới thấp") {
            return sorted.sort((a, b) => b.price - a.price);
        }
        return filtered;
    }, [productData, selectedSortOption, selectedCategories, collectionParam])

    if (isLoading) {
        return (
            <div>
                <Navbar />
                <div className="h-screen flex items-center justify-center">
                    <p className="text-4xl font-bold">Loading ...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div id="product-page">
            <Navbar />
            <NotificationToast toast={toast} />
            <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} onGoLogin={handleCloseLoginModal} />
            
            <div id="product-page-body" className="px-10 py-30 text-2xl">
                {collectionParam === "valentine" && (
                    <h1 className="text-2xl md:text-3xl font-semibold text-[#3a2415] mb-6 text-center md:text-left tracking-wide">
                        Set Collection Valentine
                    </h1>
                )}

                {/* HEADER CONTROL (Nút bấm mở Sidebar) */}
                <div className="flex flex-row justify-between mb-5 select-none">
                    {/* Nút mở Phân Loại */}
                    <div className="flex flex-row gap-15 items-center justify-center px-10 cursor-pointer" 
                         onClick={() => setisOpenTypeSel(!isOpenTypeSel)}>
                        <p className="text-lg text-center font-semibold">PHÂN LOẠI</p>
                        <CiCircleChevDown className={`transform transition-transform duration-300 text-3xl ${isOpenTypeSel ? "rotate-180" : ""}`} />
                    </div>

                    {/* Nút mở Bộ Lọc */}
                    <div className="flex flex-row gap-3 items-center cursor-pointer" 
                         onClick={() => setIsOpenFilter(!isOpenFilter)}>
                        <p className="text-lg font-semibold">BỘ LỌC</p>
                        <CiCircleChevDown className={`transform transition-transform duration-300 text-3xl ${isOpenFilter ? "rotate-180" : ""}`} />
                    </div>
                </div>

                {/* --- MAIN CONTENT LAYOUT --- */}
                <div className="flex flex-row w-full text-lg items-start">
                    
                    {/* 1. Sidebar Trái (Category) - Đã xử lý logic check/uncheck bên trong component này */}
                    <CategorySidebar 
                        isOpen={isOpenTypeSel} 
                        options={categoryOptions}
                        selectedCategories={selectedCategories}
                        onToggle={handleCategoryToggle} 
                    />

                    {/* 2. Danh sách sản phẩm - click vào card → sang trang chi tiết chọn size & số lượng */}
                    <ProductList 
                        products={displayProducts} 
                        fetchError={fetchError}
                    />

                    {/* 3. Sidebar Phải (Filter) */}
                    <FilterSidebar 
                        isOpen={isOpenFilter} 
                        options={filterOptions}
                        selectedFilter={selectedSortOption}
                        onToggle={handleSortToggle} 
                    />

                </div>
            </div>

            <VideoPopUp isOpenPopUp={isOpenPopUp} setIsOpenPopUp={setIsOpenPopUp} />
            <Footer />
        </div>
    );
}