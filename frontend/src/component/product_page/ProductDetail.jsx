import { useEffect, useRef, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_API_BASE_URL;
// ==========================================
// 1. COMPONENT THÔNG BÁO (GÓC DƯỚI BÊN PHẢI)
// ==========================================
const NotificationToast = ({ toast }) => {
    if (!toast.show) return null;

    const isError = toast.isError;
    const bgColor = isError ? "bg-[#d7263d]" : "bg-[#3a2415]";
    const textColor = isError ? "text-white" : "text-green-400";

    return (
        <div className="fixed bottom-5 right-5 z-50 transition animate-bounce">
            <div className={`${bgColor} text-white px-6 py-4 rounded shadow-lg flex items-center gap-3 border border-[#e5d8ce]`}>
                {isError ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${textColor}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
                <div>
                    <h4 className="font-bold">{toast.title}</h4>
                    <p className="text-sm text-gray-200">{toast.message}</p>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 2. COMPONENT MODAL ĐĂNG NHẬP
// ==========================================
const LoginModal = ({ show, onClose }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(60, 40, 20, 0.18)' }}>
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-[#d7263d] mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold mb-2 text-[#3a2415]">Bạn cần đăng nhập</h3>
                <p className="text-gray-700 mb-6 text-center">Vui lòng đăng nhập để thực hiện chức năng này.</p>
                <button onClick={onClose} className="px-6 py-2 bg-[#3a2415] text-white rounded hover:bg-[#5a3a1a] font-semibold transition">
                    Đăng nhập
                </button>
            </div>
        </div>
    );
};

// ==========================================
// 3. COMPONENT BREADCRUMB
// ==========================================
const Breadcrumb = () => (
    <div className="text-base text-[#7c6f63] flex items-center gap-2 px-30 py-10">
        <Link to={"/product"} className="hover:underline">Sản Phẩm</Link>
        <span className="mx-1">/</span>
        <span className="font-bold text-2xl text-black">Chi Tiết Sản Phẩm</span>
    </div>
);

// ==========================================
// 4. COMPONENT HÌNH ẢNH SẢN PHẨM
// ==========================================
const ProductGallery = ({ imageData }) => (
    <div className="shrink-0 w-120 flex flex-col items-center">
        <img src={imageData} alt="Product image" className="rounded-lg object-cover border border-[#e5d8ce] w-200 h-full" />
        <button className="mt-4 text-2xl text-[#bdbdbd] hover:text-[#e5d8ce] bg-white rounded-full p-2 border border-[#e5d8ce] w-10 h-10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5l-6 6-3-3" />
            </svg>
        </button>
    </div>
);

// ==========================================
// 5. COMPONENT THÔNG TIN & THAO TÁC SẢN PHẨM
// ==========================================
const ProductInfo = ({ 
    productData, selectedSize, setSelectedSize, quantity, setQuantity, 
    onAddToCart, onAddToWishlist 
}) => {
    const sizes = productData.sizes || [];
    const stock = productData.stockQuantity || 0;

    return (
        <div className="flex-1 max-w-xl">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-semibold mb-2">{productData.productName}</h1>
                <button className="text-2xl text-[#bdbdbd] hover:text-[#e5d8ce] bg-white rounded-full p-2 border border-[#e5d8ce] w-10 h-10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5l-6 6-3-3" />
                    </svg>
                </button>
            </div>
            <p className="text-2xl font-light mb-2">{productData.price}<span className="text-base font-normal ml-1">VNĐ</span></p>
            <div className="border-b border-[#e5d8ce] my-4"></div>

            {/* Size selection */}
            <div className="mb-4">
                <h2 className="text-base font-medium mb-2">Size</h2>
                <div className="flex flex-row gap-3 mb-2">
                    {sizes.map(val => (
                        <button
                            key={val}
                            onClick={() => setSelectedSize(val)}
                            className={`w-10 h-10 border rounded text-lg font-medium flex items-center justify-center transition-all duration-150 ${selectedSize === val ? 'bg-[#f3eae5] border-[#7c6f63] text-[#7c6f63]' : 'bg-white border-[#bdbdbd] text-[#7c6f63] hover:bg-[#f3eae5]'}`}
                        >
                            {val}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#f3eae5] border border-[#bdbdbd] inline-block"></span>
                    <span className="text-[#7c6f63] text-xs">Chỉ còn <span className="text-[#d7263d] font-semibold">{stock}</span> sản phẩm trong kho!</span>
                </div>
            </div>

            {/* Quantity selection */}
            <div className="mb-6">
                <h2 className="text-base font-medium mb-2">Số Lượng</h2>
                <div className="flex flex-row items-center gap-2">
                    <button
                        className="w-8 h-8 border border-[#bdbdbd] rounded flex items-center justify-center text-lg font-bold text-[#7c6f63] bg-white hover:bg-[#f3eae5]"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    >-</button>
                    <span className="w-8 text-center text-lg font-medium">{quantity}</span>
                    <button
                        className="w-8 h-8 border border-[#bdbdbd] rounded flex items-center justify-center text-lg font-bold text-[#7c6f63] bg-white hover:bg-[#f3eae5]"
                        onClick={() => setQuantity(q => Math.min(stock, q + 1))}
                    >+</button>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-row gap-4 mb-4">
                <button 
                    className="flex-1 py-3 hover:scale-120 transition hover:cursor-pointer bg-[#f3eae5] border border-[#e5d8ce] text-[#7c6f63] font-medium rounded hover:bg-[#e5d8ce]"
                    onClick={onAddToCart}
                >
                    Thêm Vào Giỏ Hàng
                </button>
                <button 
                    className="flex-1 py-3 bg-[#f3eae5] border border-[#e5d8ce] text-[#7c6f63] font-medium rounded hover:bg-[#e5d8ce] transition hover:cursor-pointer"
                    onClick={onAddToWishlist}
                >
                    Thêm Vào Danh Sách Yêu Thích
                </button>
            </div>
            <button className="w-full py-3 bg-[#3a2415] text-white font-semibold rounded text-lg hover:bg-[#5a3a1a] transition">Mua Ngay</button>
        </div>
    );
};

// ==========================================
// 6. MAIN COMPONENT (CONTAINER)
// ==========================================
export default function ProductDetail() {
    const { id } = useParams();
    const nav = useNavigate();
    
    // States
    const [productData, setProductData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [toast, setToast] = useState({ show: false, isError: false, title: "", message: "" });
    const toastTimeoutRef = useRef(null);

    // Fetch Product Data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/products/${id}`);
                if (!response.ok) {
                    console.log("Error fetching data with status ", response.status);
                }
                const data = await response.json();
                console.log(data);
                setProductData(data);
                // Tự động set size đầu tiên nếu có
                if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

    // Hàm hiển thị Toast thông báo chung
    const showToastMessage = (isError, title, message) => {
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        setToast({ show: true, isError, title, message });
        toastTimeoutRef.current = setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    // Hàm xử lý Thêm vào giỏ hàng
    const handleAddToCart = async () => {
        if (!Cookies.get("token")) {
            setShowLoginModal(true);
            return;
        }

        const userId = Cookies.get("id");
        let currentCartId = null;
        try {
            const cartRes = await fetch(`${apiUrl}/api/user/cart?userId=${userId}`, {
                headers: { "Authorization" : `Bearer ${Cookies.get("token")}` }
            });
            if (cartRes.ok) {
                const cartData = await cartRes.json();
                currentCartId = cartData.cartId;
            } else {
                showToastMessage(true, "Thất bại!", "Lỗi lấy thông tin giỏ hàng.");
                return; 
            }
        } catch (err) {
            showToastMessage(true, "Lỗi!", "Không thể kết nối đến server.");
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/api/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${Cookies.get("token")}`  
                },
                body: JSON.stringify({
                    "cartId": currentCartId,
                    "quantity": quantity,
                    "size": selectedSize,
                })
            });
            if (!response.ok) {
                showToastMessage(true, "Thất bại!", "Thêm sản phẩm vào giỏ hàng thất bại.");
            } else {
                showToastMessage(false, "Thành công!", "Đã thêm sản phẩm vào giỏ hàng.");
            }
        } catch (err) {
            showToastMessage(true, "Lỗi!", "Lỗi thêm vào giỏ hàng.");
        }
    };

    // Hàm xử lý Thêm vào Wishlist (Yêu cầu mới)
    const handleAddToWishlist = async () => {
        const token = Cookies.get("token");
        const userId = Cookies.get("id");

        console.log("user id = ", userId);

        if (!token || !userId) {
            setShowLoginModal(true);
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/api/wishlist/product/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                // Theo swagger hình ảnh cung cấp, API nhận body dạng string (application/json)
                body: JSON.stringify(userId)
            });

            if (response.ok) {
                showToastMessage(false, "Thành công!", "Đã thêm vào danh sách yêu thích.");
            } else {
                showToastMessage(true, "Thất bại!", "Không thể thêm vào danh sách yêu thích.");
            }
        } catch (err) {
            showToastMessage(true, "Lỗi!", "Có lỗi xảy ra khi kết nối server.");
        }
    };

    const handleCloseLoginModal = () => {
        setShowLoginModal(false);
        nav("/login");
    };

    // Render trạng thái Loading
    if (isLoading) {
        return (
            <div>
                <Navbar />
                <div className="p-50 text-center">
                    <p className="text-4xl font-bold">Loading ...</p>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div>
            <Navbar />
            
            <NotificationToast toast={toast} />
            <LoginModal show={showLoginModal} onClose={handleCloseLoginModal} />
            <Breadcrumb />

            <div className="flex flex-row gap-12 px-30 py-10">
                <ProductGallery imageData={productData.imageSrc} />
                <ProductInfo 
                    productData={productData}
                    selectedSize={selectedSize}
                    setSelectedSize={setSelectedSize}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                />
            </div>

            <Footer />
        </div>
    );
}