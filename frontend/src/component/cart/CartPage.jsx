import React, { useState, useMemo, useEffect } from 'react';
import { FiMinus, FiPlus, FiX } from "react-icons/fi";
import { FaTruck } from "react-icons/fa";
import Navbar from '../Navbar';
import Footer from '../Footer';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getLocalCart, removeFromLocalCart, updateLocalCartQuantity, CART_UPDATED_EVENT } from '../../utils/cartStorage';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

/** Chuẩn hóa item từ API sang format CartItem */
const normalizeApiItem = (item) => ({
    id: item.id,
    name: item.name ?? item.productName ?? 'Sản phẩm',
    imageSrc: item.imageSrc ?? item.image ?? '',
    price: Number(item.price) ?? 0,
    quantity: Number(item.quantity) ?? 1,
    isLocal: false,
});
// --- 1. Component CartItem (Nhận thêm các hàm xử lý sự kiện từ cha) ---
const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="grid grid-cols-12 gap-4 py-8 border-b border-gray-200 items-start text-gray-800 animate-fadeIn">
      
      {/* Cột 1: Ảnh & Thông tin */}
      <div className="col-span-12 md:col-span-6 flex gap-6">
        <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-100">
          <img
            src={item.imageSrc?.startsWith?.("http") ? item.imageSrc : encodeURI(item.imageSrc || "")}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://via.placeholder.com/96?text=Sản+phẩm"; }}
          /> 
        </div>
        <div className="flex flex-col gap-1">
            <h3 className="font-bold text-lg leading-tight text-gray-900">{item.name}</h3>
        </div>
      </div>

      {/* Cột 2: Giá */}
      <div className="col-span-4 md:col-span-2 md:text-center mt-4 md:mt-0 font-medium text-gray-700">
         <span className="md:hidden font-bold mr-2 text-black">Price:</span>
         {item.price.toLocaleString('vi-VN')} đ
      </div>

      {/* Cột 3: Số lượng (Đã gắn sự kiện onClick) */}
      <div className="col-span-4 md:col-span-2 flex justify-center mt-4 md:mt-0">
            <div className="flex items-center border border-black rounded px-3 py-1.5 gap-4">
                <button 
                    onClick={() => onDecrease(item.id)}
                    disabled={item.quantity <= 1} // Mờ nút đi nếu số lượng là 1
                    className={`transition-opacity ${item.quantity <= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-60'}`}
                >
                    <FiMinus size={14} />
                </button>
                
                <span className="w-4 text-center font-semibold select-none">{item.quantity}</span>
                
                <button 
                    onClick={() => onIncrease(item.id)}
                    className="hover:opacity-60 transition-opacity"
                >
                    <FiPlus size={14} />
                </button>
            </div>
      </div>

      {/* Cột 4: Tổng tiền & Nút Xóa */}
      <div className="col-span-4 md:col-span-2 flex justify-end items-start gap-3 mt-4 md:mt-0">
        <span className="font-bold text-gray-900">{(item.price * item.quantity).toLocaleString('vi-VN')} đ</span>
        
        <button 
            onClick={() => onRemove(item.id)}
            className="text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 ml-2 transition-colors"
            title="Remove item"
        >
            <FiX size={14} />
        </button>
      </div>
    </div>
  );
};

// --- 3. Component Chính ---
/** Chuẩn hóa item từ "Mua Ngay" (state.addedProduct) sang format CartItem */
const normalizeAddedProduct = (p) => ({
    id: p.id,
    name: p.name ?? p.productName ?? 'Sản phẩm',
    imageSrc: p.imageSrc ?? '',
    price: Number(p.price) ?? 0,
    quantity: Number(p.quantity) ?? 1,
    isLocal: true,
});

export default function CartPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [apiCartItems, setApiCartItems] = useState([]);
    const [localCartItems, setLocalCartItems] = useState([]);
    const [cartId, setCartId] = useState("");

    const fromBuyNowProduct = location.state?.fromBuyNow && location.state?.addedProduct
        ? normalizeAddedProduct(location.state.addedProduct)
        : null;

    const cartItems = useMemo(() => {
        const api = (Array.isArray(apiCartItems) ? apiCartItems : []).map(normalizeApiItem);
        const local = Array.isArray(localCartItems) ? localCartItems : [];
        const base = [...api, ...local];
        if (fromBuyNowProduct && !base.some((i) => i.id === fromBuyNowProduct.id)) {
            return [fromBuyNowProduct, ...base];
        }
        return base;
    }, [apiCartItems, localCartItems, fromBuyNowProduct]);

    useEffect(() => {
        setLocalCartItems(getLocalCart());
    }, []);

    useEffect(() => {
        const fetchCart = async () => {
            const token = Cookies.get("token");
            const userId = Cookies.get("id");
            if (!token || !userId) {
                setLocalCartItems(getLocalCart());
                return;
            }
            let currentCartId = null;
            try {
                const cartRes = await fetch(`${apiUrl}/api/user/cart?userId=${userId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!cartRes.ok) {
                    setLocalCartItems(getLocalCart());
                    return;
                }
                const cartData = await cartRes.json();
                currentCartId = cartData?.cartId ?? cartData?.cart_id;
                setCartId(currentCartId);
            } catch (err) {
                setLocalCartItems(getLocalCart());
                return;
            }

            try {
                const res = await fetch(`${apiUrl}/api/cart/${currentCartId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!res.ok) {
                    setLocalCartItems(getLocalCart());
                    return;
                }
                const data = await res.json();
                setApiCartItems(Array.isArray(data) ? data : []);
            } catch (err) {
                setLocalCartItems(getLocalCart());
            }
        };
        fetchCart();
        const onCartUpdated = () => {
            setLocalCartItems(getLocalCart());
            fetchCart();
        };
        window.addEventListener(CART_UPDATED_EVENT, onCartUpdated);
        return () => window.removeEventListener(CART_UPDATED_EVENT, onCartUpdated);
    }, []);

    const itemById = (id) => cartItems.find((item) => item.id === id);

    const handleIncrease = async (id) => {
        const item = itemById(id);
        if (!item) return;
        if (item.isLocal) {
            updateLocalCartQuantity(id, item.quantity + 1);
            setLocalCartItems(getLocalCart());
            return;
        }
        setApiCartItems(prev =>
            prev.map(i => i.id === id ? { ...i, quantity: (i.quantity || 1) + 1 } : i)
        );
        try {
            await fetch(`${apiUrl}/api/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                },
                body: JSON.stringify({ cartId, quantity: 1 })
            });
        } catch (e) {
            console.error("Increase error", e);
        }
    };

    const handleDecrease = async (id) => {
        const item = itemById(id);
        if (!item) return;
        if (item.isLocal) {
            const q = Math.max(1, item.quantity - 1);
            updateLocalCartQuantity(id, q);
            setLocalCartItems(getLocalCart());
            return;
        }
        if (item.quantity <= 1) return;
        setApiCartItems(prev =>
            prev.map(i => i.id === id ? { ...i, quantity: (i.quantity || 1) - 1 } : i)
        );
        try {
            await fetch(`${apiUrl}/api/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                },
                body: JSON.stringify({ cartId, quantity: 1 })
            });
        } catch (e) {
            console.error("Decrease error", e);
        }
    };

    const handleRemove = async (id) => {
        const item = itemById(id);
        if (!item) return;
        const qty = item.quantity || 1;
        if (item.isLocal) {
            removeFromLocalCart(id);
            setLocalCartItems(getLocalCart());
            return;
        }
        setApiCartItems(prev => prev.filter(i => i.id !== id));
        try {
            await fetch(`${apiUrl}/api/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                },
                body: JSON.stringify({ cartId, quantity: qty })
            });
        } catch (e) {
            console.error("Remove error", e);
        }
    };

    // Tự động tính lại tổng tiền khi cartItems thay đổi
    const subtotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cartItems]);

    const grandTotal = subtotal; // Ở đây chưa tính thuế/ship

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <div className="flex-grow py-30 container mx-auto px-4 lg:px-8 max-w-6xl">

                {/* Nút đóng giỏ hàng / quay về trang chủ */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate("/")}
                        className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Quay về trang chủ
                    </button>
                </div>

                {/* Nếu giỏ hàng trống thì hiện thông báo */}
                {cartItems.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl">Giỏ hàng của bạn hiện đang trống.</p>
                        <Link to={"/product"} className="mt-10 text-black underline hover:text-gray-600">Mua sắm ngay</Link>
                    </div>
                ) : (
                    <>
                        <p className="text-lg font-semibold text-gray-800 mb-6">
                            Đang có {cartItems.reduce((s, i) => s + (i.quantity || 1), 0)} đơn hàng
                        </p>
                        <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-gray-200 font-bold text-sm text-gray-900">
                            <div className="col-span-6">Sản phẩm</div>
                            <div className="col-span-2 text-center">Giá</div>
                            <div className="col-span-2 text-center">Số lượng</div>
                            <div className="col-span-2 text-right">Tổng</div>
                        </div>

                        <div className="mb-8">
                            {cartItems.map((item) => (
                                <CartItem 
                                    key={item.id} 
                                    item={item} 
                                    onIncrease={handleIncrease}
                                    onDecrease={handleDecrease}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </div>

                        <div className="flex flex-col items-end w-full pb-10">
                            <div className="w-full md:w-1/2 lg:w-1/3 space-y-4">
                                <div className="flex justify-between items-center text-gray-700">
                                    <span className="font-semibold">Thành tiền:</span>
                                    <span>{subtotal.toLocaleString('vi-VN')} đ</span>
                                </div>
                                
                                <div className="flex justify-between items-center text-2xl pt-2 text-gray-900 border-t border-gray-100 mt-2">
                                    <span className="font-normal">Tổng tiền:</span>
                                    <span className="font-normal">{grandTotal.toLocaleString('vi-VN')} đ</span>
                                </div>

                                {/* <div className="pt-6">
                                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-900">
                                        <span className="font-bold">Congrats, you're eligible for Free Shipping</span>
                                        <FaTruck size={16} className="text-gray-800" />
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-full"></div>
                                    </div>
                                </div> */}

                                <Link to={"/checkout"} className="w-full bg-black text-white font-bold py-4 px-6 mt-6 hover:bg-gray-800 transition-colors uppercase text-sm tracking-widest rounded-sm">
                                    THANH TOÁN
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
}