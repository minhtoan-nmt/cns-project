import React, { useEffect, useState } from "react";
import Footer from "../../Footer";
import Navbar from "../../Navbar";
import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_API_BASE_URL;
// ==========================================
// 1. Component Form Thông Tin Giao Hàng
// ==========================================
function ShippingForm({ shippingInfo, setShippingInfo }) {
    const userId = Cookies.get("id");
    const token = Cookies.get("token");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/user?userId=${userId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!res.ok) {
                    console.log("Fetch user failed:", res.status);
                    return;
                }
                const data = await res.json();
                
                setShippingInfo(prev => ({
                    ...prev,
                    customerFullName: data.fullName || prev.customerFullName,
                    email: data.email || prev.email,
                    phoneNumber: data.phoneNumber || prev.phoneNumber,
                }));
            } catch (error) {
                console.error("Lỗi khi fetch user:", error);
            }
        };
        if (userId) fetchUser();
    }, [userId, token, setShippingInfo]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setShippingInfo(prev => ({
            ...prev,
            [id]: value
        }));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">Thông tin giao hàng</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <label htmlFor="customerFullName" className="block text-sm font-medium text-gray-700">Họ và tên</label>
                    <input type="text" id="customerFullName" value={shippingInfo.customerFullName} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-900" placeholder="Nguyễn Văn A" required />
                </div>
                <div className="md:col-span-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" value={shippingInfo.email} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800" placeholder="example@gmail.com" required />
                </div>
                <div className="md:col-span-1">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input type="tel" id="phoneNumber" value={shippingInfo.phoneNumber} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800" placeholder="0901234567" required />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ cụ thể</label>
                    <input type="text" id="address" value={shippingInfo.address} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800" placeholder="123 Đường Lê Lợi, Phường Bến Nghé, Quận 1" required />
                </div>
            </form>
        </div>
    );
}

// ==========================================
// 2. Component Phương Thức Thanh Toán
// ==========================================
function PaymentMethod({ paymentMethod, setPaymentMethod }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">Phương thức thanh toán</h2>
            <div className="space-y-4">
                <div className="flex items-center">
                    <input id="COD" name="paymentMethod" type="radio" checked={paymentMethod === "COD"} onChange={(e) => setPaymentMethod(e.target.id)} className="h-4 w-4 text-red-800 focus:ring-red-800 border-gray-300" />
                    <label htmlFor="COD" className="ml-3 block text-sm font-medium text-gray-700">Thanh toán khi nhận hàng (COD)</label>
                </div>
                <div className="flex items-center">
                    <input id="BANK_TRANSFER" name="paymentMethod" type="radio" checked={paymentMethod === "BANK_TRANSFER"} onChange={(e) => setPaymentMethod(e.target.id)} className="h-4 w-4 text-red-800 focus:ring-red-800 border-gray-300" />
                    <label htmlFor="BANK_TRANSFER" className="ml-3 block text-sm font-medium text-gray-700">Chuyển khoản ngân hàng</label>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 3. Component Tóm Tắt Đơn Hàng
// ==========================================
function OrderSummary({ shippingInfo, paymentMethod }) {
    const [cartItems, setCartItems] = useState([]);
    const [cartId, setCartId] = useState("");
    
    const [showModal, setShowModal] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    // State mới để lưu kết quả trả về từ API
    const [invoiceResult, setInvoiceResult] = useState(null);

    useEffect(() => {
        const fetchCart = async () => {
            const userId = Cookies.get("id");
            const token = Cookies.get("token");
            let currentCartId = null;
            
            try {
                const cartRes = await fetch(`${apiUrl}/api/user/cart?userId=${userId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (cartRes.ok) {
                    const cartData = await cartRes.json();
                    currentCartId = cartData.cartId;
                    setCartId(currentCartId);
                } else return;
            } catch (err) {
                console.error("Failed to fetch cartId", err);
                return;
            }

            try {
                const res = await fetch(`${apiUrl}/api/cart/${currentCartId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setCartItems(data);
                }
            } catch (err) {
                console.error("Error fetching cart items", err);
            }
        };
        fetchCart();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const subTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shippingFee = cartItems.length > 0 ? 30000 : 0;
    const total = subTotal + shippingFee;

    const handleConfirmOrder = async () => {
        if (!shippingInfo.customerFullName || !shippingInfo.phoneNumber || !shippingInfo.address) {
            setErrorMessage("Vui lòng điền đầy đủ tên, số điện thoại và địa chỉ giao hàng!");
            setShowModal(false);
            return;
        }

        setShowModal(false); 
        setIsProcessing(true); 
        setErrorMessage("");

        const payload = {
            customerFullName: shippingInfo.customerFullName,
            email: shippingInfo.email,
            phoneNumber: shippingInfo.phoneNumber,
            address: shippingInfo.address,
            payMethodOption: paymentMethod,
            cartId: cartId,
            totalPrice: total
        };

        try {
            const res = await fetch(`${apiUrl}/api/invoice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get("token")}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                // ĐỌC DỮ LIỆU JSON TRẢ VỀ Ở ĐÂY
                const data = await res.json();
                console.log("Invoice created:", data);
                
                // Lưu vào state để hiển thị ra UI
                setInvoiceResult(data);
                setShowNotification(true);
                
                // Ẩn notification sau 5 giây (để người dùng kịp đọc mã đơn)
                setTimeout(() => setShowNotification(false), 5000);
            } else {
                const errorData = await res.json();
                setErrorMessage(errorData.message || "Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi khi gọi API tạo hóa đơn:", error);
            setErrorMessage("Không thể kết nối đến máy chủ.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">Tóm tắt đơn hàng</h2>
            
            {cartItems.map((item, idx) => (
                <div key={idx} className="space-y-4 mb-6">
                    <div className="flex justify-between">
                        <div className="flex">
                            <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 object-cover overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                            </div>
                            <div className="ml-4 flex flex-col justify-center">
                                <span className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</span>
                                <span className="text-sm text-gray-500">Số lượng: {item.quantity}</span>
                            </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 mt-2">{formatCurrency(item.price)}</span>
                    </div>
                </div>
            ))}

            <hr className="my-4 border-gray-200" />

            <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span className="font-medium text-gray-900">{formatCurrency(subTotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Phí giao hàng</span>
                    <span className="font-medium text-gray-900">{formatCurrency(shippingFee)}</span>
                </div>
            </div>

            <hr className="my-4 border-gray-200" />

            <div className="flex justify-between mb-6">
                <span className="text-base font-semibold text-gray-900">Tổng cộng</span>
                <span className="text-lg font-bold text-red-800">{formatCurrency(total)}</span>
            </div>

            {errorMessage && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                    {errorMessage}
                </div>
            )}

            <button 
                onClick={() => setShowModal(true)}
                disabled={isProcessing || cartItems.length === 0}
                className={`w-full font-semibold py-3 px-4 rounded-md transition duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800 
                ${isProcessing || cartItems.length === 0 ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-red-800 text-white hover:bg-red-900'}`}
            >
                {isProcessing ? "Đang xử lý..." : "Đặt hàng"}
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-11/12 max-w-sm shadow-xl transform transition-all">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận đặt hàng</h3>
                        <p className="text-sm text-gray-500 mb-6">Xác nhận đặt đơn hàng với tổng trị giá <span className="font-bold text-red-800">{formatCurrency(total)}</span>?</p>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium transition">Hủy</button>
                            <button onClick={handleConfirmOrder} className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 font-medium transition">Xác nhận</button>
                        </div>
                    </div>
                </div>
            )}

            {/* CẬP NHẬT NOTIFICATION ĐỂ HIỂN THỊ INVOICE ID */}
            {showNotification && invoiceResult && (
                <div className="fixed bottom-10 right-10 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3 animate-fade-in-up">
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <div className="flex flex-col">
                        <span className="font-medium text-lg">CNS đã lên đơn hàng thành công</span>
                        <span className="text-sm opacity-90">Mã đơn: <strong>{invoiceResult.invoiceId}</strong></span>
                    </div>
                </div>
            )}
        </div>
    );
}

// ==========================================
// 4. Component Chính (Export Default)
// ==========================================
export default function CheckoutPage() {
    const [shippingInfo, setShippingInfo] = useState({
        customerFullName: "",
        email: "",
        phoneNumber: "",
        address: ""
    });

    const [paymentMethod, setPaymentMethod] = useState("COD");

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="grow mt-12 bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-6">
                        <ShippingForm shippingInfo={shippingInfo} setShippingInfo={setShippingInfo} />
                        <PaymentMethod paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
                    </div>
                    <div className="lg:col-span-4">
                        <OrderSummary shippingInfo={shippingInfo} paymentMethod={paymentMethod} />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}