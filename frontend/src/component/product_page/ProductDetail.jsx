import { useEffect, useRef, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { dispatchCartUpdated, addToLocalCart } from "../../utils/cartStorage";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
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
const ProductGallery = ({ imageData }) => {
    const imgSrc = imageData && (imageData.startsWith("http") ? imageData : encodeURI(imageData));
    return (
    <div className="shrink-0 w-120 flex flex-col items-center">
        <img 
            src={imgSrc || "https://via.placeholder.com/400x500?text=Sản+phẩm"} 
            alt="Product image" 
            className="rounded-lg object-cover border border-[#e5d8ce] w-200 h-full"
            onError={(e) => { e.target.src = "https://via.placeholder.com/400x500?text=Sản+phẩm"; }}
        />
        <button className="mt-4 text-2xl text-[#bdbdbd] hover:text-[#e5d8ce] bg-white rounded-full p-2 border border-[#e5d8ce] w-10 h-10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5l-6 6-3-3" />
            </svg>
        </button>
    </div>
    );
};

// ==========================================
// 5. COMPONENT THÔNG TIN & THAO TÁC SẢN PHẨM
// ==========================================
const ProductInfo = ({ 
    productData, selectedSize, setSelectedSize, quantity, setQuantity, 
    onAddToCart, onAddToWishlist, onBuyNow, isAddingToCart = false 
}) => {
    // Luôn có ít nhất một lựa chọn size: dùng từ API hoặc mặc định S, M, L
    const sizes = (productData.sizes && productData.sizes.length > 0)
        ? productData.sizes
        : ["S", "M", "L"];
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
            <p className="text-2xl font-light mb-2">
                {typeof productData.price === "number" ? productData.price.toLocaleString("vi-VN") : productData.price}
                <span className="text-base font-normal ml-1">VNĐ</span>
            </p>
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
                    className="flex-1 py-3 hover:scale-120 transition hover:cursor-pointer bg-[#f3eae5] border border-[#e5d8ce] text-[#7c6f63] font-medium rounded hover:bg-[#e5d8ce] disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={onAddToCart}
                    disabled={isAddingToCart}
                >
                    {isAddingToCart ? "Đang thêm..." : "Thêm Vào Giỏ Hàng"}
                </button>
                <button 
                    className="flex-1 py-3 bg-[#f3eae5] border border-[#e5d8ce] text-[#7c6f63] font-medium rounded hover:bg-[#e5d8ce] transition hover:cursor-pointer"
                    onClick={onAddToWishlist}
                >
                    Thêm Vào Danh Sách Yêu Thích
                </button>
            </div>
            <button
                type="button"
                className="w-full py-3 bg-[#3a2415] text-white font-semibold rounded text-lg hover:bg-[#5a3a1a] transition disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={onBuyNow}
                disabled={isAddingToCart}
            >
                {isAddingToCart ? "Đang thêm..." : "Mua Ngay"}
            </button>
        </div>
    );
};

// ==========================================
// 6. MAIN COMPONENT (CONTAINER)
// ==========================================
export default function ProductDetail() {
    const { id } = useParams();
    const nav = useNavigate();
    const location = useLocation();
    
    // States
    const [productData, setProductData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [toast, setToast] = useState({ show: false, isError: false, title: "", message: "" });
    const toastTimeoutRef = useRef(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // Fetch Product Data + gọi seed trước để sản phẩm có trên hệ thống khi thêm giỏ
    useEffect(() => {
        const stateProduct = location.state?.product;
        if (stateProduct && String(stateProduct.id) === String(id)) {
            const p = stateProduct;
            setProductData({
                ...p,
                price: typeof p.price === "number" ? p.price : Number(p.price) || 0,
                sizes: p.sizes && p.sizes.length > 0 ? p.sizes : ["S", "M", "L"],
                stockQuantity: p.stockQuantity ?? 100,
            });
            const sizesList = (p.sizes && p.sizes.length > 0) ? p.sizes : ["S", "M", "L"];
            setSelectedSize(sizesList[0]);
            setIsLoading(false);
            // Vẫn gọi seed nền để backend có sản phẩm khi thêm giỏ
            if (apiUrl) fetch(`${apiUrl}/api/seed/products`).catch(() => {});
            return;
        }

        const fetchProduct = async () => {
            try {
                // Gọi seed trước để đảm bảo sản phẩm có trong DB khi thêm giỏ
                if (apiUrl) {
                    await fetch(`${apiUrl}/api/seed/products`).catch(() => {});
                }
                const response = await fetch(`${apiUrl}/api/products/${id}`);
                if (!response.ok) {
                    setProductData(null);
                    setIsLoading(false);
                    return;
                }
                const data = await response.json();
                console.log(data);
                setProductData(data);
                const sizesList = (data.sizes && data.sizes.length > 0) ? data.sizes : ["S", "M", "L"];
                setSelectedSize(sizesList[0]);
            } catch (error) {
                console.log(error);
                setProductData(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // Gọi seed ngay khi mở trang (chạy sớm, không đợi) để tăng cơ hội có sản phẩm trước khi user bấm thêm giỏ
    useEffect(() => {
        if (!apiUrl) return;
        fetch(`${apiUrl}/api/seed/products`).catch(() => {});
    }, [apiUrl]);

    // Hàm hiển thị Toast thông báo chung
    const showToastMessage = (isError, title, message) => {
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        setToast({ show: true, isError, title, message });
        toastTimeoutRef.current = setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    // Hàm xử lý Thêm vào giỏ hàng (tự động check lỗi đầy đủ)
    const handleAddToCart = async () => {
        // --- 1. Check đăng nhập ---
        const token = Cookies.get("token");
        const userId = Cookies.get("id");
        // Cách dự phòng: chưa đăng nhập vẫn thêm vào giỏ local
        if (!token || String(token).trim() === "") {
            if (productData && id && selectedSize && quantity >= 1) {
                addToLocalCart({
                    id,
                    productName: productData.productName || productData.name,
                    imageSrc: productData.imageSrc,
                    price: productData.price,
                    quantity: Number(quantity) || 1,
                });
                showToastMessage(false, "Đã thêm vào giỏ (lưu tạm)", "Đăng nhập để đồng bộ giỏ hàng với tài khoản.");
                dispatchCartUpdated();
            } else {
                setShowLoginModal(true);
            }
            return;
        }

        // --- 2. Check size ---
        if (!selectedSize || String(selectedSize).trim() === "") {
            showToastMessage(true, "Vui lòng chọn size", "Hãy chọn size trước khi thêm vào giỏ hàng.");
            return;
        }

        // --- 3. Check số lượng ---
        const stock = productData?.stockQuantity ?? 0;
        if (quantity < 1) {
            showToastMessage(true, "Lỗi", "Số lượng phải lớn hơn 0.");
            return;
        }
        if (stock > 0 && quantity > stock) {
            showToastMessage(true, "Lỗi", `Chỉ còn ${stock} sản phẩm trong kho.`);
            return;
        }

        // --- 4. Check userId ---
        if (!userId || String(userId).trim() === "") {
            showToastMessage(true, "Thất bại!", "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
            return;
        }

        // --- 5. Check API URL ---
        if (!apiUrl || apiUrl.trim() === "") {
            showToastMessage(true, "Lỗi cấu hình", "Không tìm thấy địa chỉ API. Kiểm tra VITE_API_BASE_URL.");
            return;
        }

        if (isAddingToCart) return;
        setIsAddingToCart(true);

        let currentCartId = null;

        try {
            const cartRes = await fetch(`${apiUrl}/api/user/cart?userId=${encodeURIComponent(userId)}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!cartRes.ok) {
                if (cartRes.status === 401) {
                    showToastMessage(true, "Phiên hết hạn", "Vui lòng đăng nhập lại.");
                    setIsAddingToCart(false);
                    return;
                }
                if (cartRes.status === 404) {
                    showToastMessage(true, "Thất bại!", "Không tìm thấy giỏ hàng. Vui lòng đăng nhập lại.");
                    setIsAddingToCart(false);
                    return;
                }
                showToastMessage(true, "Thất bại!", "Lỗi lấy thông tin giỏ hàng.");
                setIsAddingToCart(false);
                return;
            }
            const cartData = await cartRes.json();
            currentCartId = cartData?.cartId ?? cartData?.cart_id ?? null;
            if (!currentCartId || String(currentCartId).trim() === "") {
                showToastMessage(true, "Thất bại!", "Không lấy được mã giỏ hàng.");
                setIsAddingToCart(false);
                return;
            }
        } catch (err) {
            console.error(err);
            showToastMessage(true, "Lỗi!", "Không thể kết nối đến server. Kiểm tra mạng hoặc backend.");
            setIsAddingToCart(false);
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/api/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    cartId: currentCartId,
                    quantity: Number(quantity),
                    size: String(selectedSize).trim(),
                })
            });

            const putBodyText = await response.text().catch(() => "");

            if (response.ok) {
                showToastMessage(false, "Thành công!", "Đã thêm sản phẩm vào giỏ hàng.");
                dispatchCartUpdated();
                return;
            }

            const status = response.status;
            let message = "Thêm sản phẩm vào giỏ hàng thất bại.";
            try {
                const text = putBodyText;
                if (text) {
                    try {
                        const errBody = JSON.parse(text);
                        if (errBody?.message) message = errBody.message;
                        else if (typeof errBody === "string") message = errBody;
                    } catch {
                        message = text;
                    }
                }
            } catch (_) {}

            if (status === 400) {
                showToastMessage(true, "Dữ liệu không hợp lệ", message || "Kiểm tra size và số lượng.");
            } else if (status === 401) {
                showToastMessage(true, "Phiên hết hạn", "Vui lòng đăng nhập lại.");
            } else if (status === 404 || status === 406) {
                // Sản phẩm hoặc giỏ chưa sẵn sàng: gọi seed rồi thử thêm giỏ lại 1 lần
                try {
                    const seedRes = await fetch(`${apiUrl}/api/seed/products`);
                    let seedData = null;
                    try {
                        seedData = await seedRes.json();
                    } catch (_) {}
                    const added = seedData?.added ?? 0;
                    // Thử thêm giỏ lại sau khi seed (dù added = 0 vẫn thử, vì có thể lỗi do cart)
                    const retryRes = await fetch(`${apiUrl}/api/products/${id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            cartId: currentCartId,
                            quantity: Number(quantity),
                            size: String(selectedSize).trim(),
                        }),
                    });
                    if (retryRes.ok) {
                        showToastMessage(false, "Thành công!", "Đã thêm sản phẩm vào giỏ hàng.");
                        dispatchCartUpdated();
                        return;
                    }
                    if (added > 0) {
                        showToastMessage(true, "Thất bại!", "Đã cập nhật dữ liệu sản phẩm. Vui lòng bấm \"Thêm Vào Giỏ Hàng\" lại.");
                    } else if (seedData?.message) {
                        showToastMessage(true, "Thất bại!", seedData.message);
                    } else {
                        // Cách dự phòng: thêm vào giỏ local để vẫn hiển thị trong Giỏ hàng
                        if (productData && id) {
                            addToLocalCart({
                                id,
                                productName: productData.productName || productData.name,
                                imageSrc: productData.imageSrc,
                                price: productData.price,
                                quantity: Number(quantity) || 1,
                            });
                            showToastMessage(false, "Đã thêm vào giỏ (lưu tạm)", "Sản phẩm đã được lưu trên trình duyệt. Xem tại trang Giỏ hàng.");
                        } else {
                            showToastMessage(true, "Thất bại!", "Không thêm được. Kiểm tra backend đang chạy và đã gọi " + apiUrl + "/api/seed/products chưa.");
                        }
                    }
                } catch (_) {
                    showToastMessage(true, "Thất bại!", "Không kết nối được server. Kiểm tra backend và mạng.");
                    if (productData && id) {
                        addToLocalCart({
                            id,
                            productName: productData.productName || productData.name,
                            imageSrc: productData.imageSrc,
                            price: productData.price,
                            quantity: Number(quantity) || 1,
                        });
                        showToastMessage(false, "Đã thêm vào giỏ (lưu tạm)", "Sản phẩm đã được lưu trên trình duyệt. Xem tại trang Giỏ hàng.");
                    }
                }
            } else if (status >= 500) {
                showToastMessage(true, "Lỗi server", message || "Thử lại sau.");
            } else {
                showToastMessage(true, "Thất bại!", message);
            }
        } catch (err) {
            console.error(err);
            showToastMessage(true, "Lỗi!", "Không thể kết nối server. Kiểm tra mạng hoặc backend.");
        } finally {
            setIsAddingToCart(false);
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

    /** Mua Ngay: thêm vào giỏ rồi chuyển tới trang giỏ hàng, truyền sản phẩm vừa thêm để trang giỏ hiển thị ngay */
    const handleBuyNow = async () => {
        await handleAddToCart();
        nav("/cart", {
            state: {
                fromBuyNow: true,
                addedProduct: productData ? {
                    id,
                    name: productData.productName || productData.name,
                    imageSrc: productData.imageSrc,
                    price: productData.price,
                    quantity: Number(quantity) || 1,
                } : null,
            },
        });
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
        );
    }

    // Sản phẩm không tồn tại (404 hoặc lỗi) → hiển thị giao diện thay vì trang trắng
    if (!productData) {
        return (
            <div>
                <Navbar />
                <NotificationToast toast={toast} />
                <LoginModal show={showLoginModal} onClose={handleCloseLoginModal} />
                <div className="text-base text-[#7c6f63] flex items-center gap-2 px-30 py-10">
                    <Link to="/product" className="hover:underline">Sản Phẩm</Link>
                    <span className="mx-1">/</span>
                    <span className="text-black">Không tìm thấy sản phẩm</span>
                </div>
                <div className="flex flex-col items-center justify-center px-30 py-20 min-h-[40vh]">
                    <p className="text-xl text-[#7c6f63] mb-2">Không tìm thấy sản phẩm này.</p>
                    <p className="text-base text-gray-500 mb-6">Mã sản phẩm có thể không tồn tại trên hệ thống.</p>
                    <Link
                        to="/product"
                        className="px-6 py-3 bg-[#3a2415] text-white font-semibold rounded hover:bg-[#5a3a1a] transition"
                    >
                        Quay lại danh sách sản phẩm
                    </Link>
                </div>
                <Footer />
            </div>
        );
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
                    onBuyNow={handleBuyNow}
                    isAddingToCart={isAddingToCart}
                />
            </div>

            <Footer />
        </div>
    );
}