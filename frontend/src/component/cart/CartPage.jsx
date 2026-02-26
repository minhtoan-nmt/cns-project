import React, { useState, useMemo, useEffect } from 'react';
import { FiMinus, FiPlus, FiX } from "react-icons/fi";
import { FaTruck } from "react-icons/fa";
import Navbar from '../Navbar';
import Footer from '../Footer';
// import { mockProducts } from '../product_page/ProductPage';
import img_4965 from "../../assets/mock_product/IMG_4965.JPG"
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const apiUrl = import.meta.env.VITE_API_BASE_URL;
// --- 1. Chọn lọc dữ liệu ban đầu ---
// Chỉ lấy 3 sản phẩm có ID cụ thể (ví dụ: 2, 4, 7) để hiển thị trong giỏ
const selectedIds = [4, 5]; 

// const initialData = mockProducts
//     .filter(product => selectedIds.includes(product.id)) // Lọc lấy 3 sản phẩm này
//     .map(product => ({
//         id: product.id,
//         name: product.productName,
//         image: product.imageSrc,
//         price: Number(product.price),
//         quantity: 1, // Mặc định số lượng ban đầu là 1
//         brand: 'CNS Studio',
//         estimatedShip: 'June 6th',
//     }));

const initialData = [
    {id: 1, name: "Some Product", image: img_4965, price: 923847, quantity: 1}
]

// --- 2. Component CartItem (Nhận thêm các hàm xử lý sự kiện từ cha) ---
const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="grid grid-cols-12 gap-4 py-8 border-b border-gray-200 items-start text-gray-800 animate-fadeIn">
      
      {/* Cột 1: Ảnh & Thông tin */}
      <div className="col-span-12 md:col-span-6 flex gap-6">
        <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-100">
          <img src={item.imageSrc} alt={item.name} className="w-full h-full object-cover" /> 
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
export default function CartPage() {
    // Sử dụng State để quản lý danh sách sản phẩm
    const [cartItems, setCartItems] = useState([]);
    const [cartId, setCartId] = useState("");
    useEffect(() => {
        const fetchCart = async () => {
            const userId = Cookies.get("id");
            let currentCartId = null;
            try {
                const cartRes = await fetch(`${apiUrl}/api/user/cart?userId=${userId}`, {
                    headers: {
                        "Authorization" : `Bearer ${Cookies.get("token")}` 
                    }
                });
                if (cartRes.ok) {
                    const cartData = await cartRes.json();
                    currentCartId = cartData.cartId;
                } else {
                    console.log("Failed to fetch cartId, status:", cartRes.status);
                    setShowFailureNotification(true);
                    return; // Dừng lại ngay nếu lỗi
                }
            } catch (err) {
                console.error("Failed to fetch cartId", err);
                setShowFailureNotification(true);
                return; // Dừng lại nếu rớt mạng/server sập
            }
            console.log("Cart Id là", currentCartId);
            setCartId(currentCartId);

            const res = await fetch(`${apiUrl}/api/cart/${currentCartId}`, {
                headers: {
                    "Authorization" : `Bearer ${Cookies.get("token")}` 
                }
            });
            if (!res.ok) {
                console.log("Error fetching data ", res.status)
            }
            const data = await res.json();
            console.log(data);
            setCartItems(data);
        }
        fetchCart();
    }, [])

    // Logic Tăng số lượng
    const handleIncrease = async (id) => {
        setCartItems(prevItems => 
            prevItems.map(item => 
                item.id === id && item.quantity > 1 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
            )
        );
        const response = await fetch(`${apiUrl}/api/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${Cookies.get("token")}`  
            },
            body: JSON.stringify({
                "cartId": cartId,
                "quantity": 1,
                // "size": selectedSize,
            })
        });
        if (!response.ok) {
            console.log("Response error, status: ", res.status);
        }
        
    };

    // Logic Giảm số lượng (Không giảm dưới 1)
    const handleDecrease = async (id) => {
        setCartItems(prevItems => 
            prevItems.map(item => 
                item.id === id && item.quantity > 1 
                    ? { ...item, quantity: item.quantity - 1 } 
                    : item
            )
        );

        const response = await fetch(`${apiUrl}/api/products/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${Cookies.get("token")}`   
            },
            body: JSON.stringify({
                "cartId": cartId,
                "quantity": 1,
                // "size": selectedSize,
            })
        });
        if (!response.ok) {
            console.log("Response error, status: ", res.status);
        }
    };

    // Logic Xóa sản phẩm
        const handleRemove = async (id) => {
            // Find the current quantity of the item being removed
            const itemToRemove = cartItems.find(item => item.id === id);
            const currentQuantity = itemToRemove ? itemToRemove.quantity : 1;
            setCartItems(prevItems => prevItems.filter(item => item.id !== id));
            const response = await fetch(`${apiUrl}/api/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${Cookies.get("token")}`   
                },
                body: JSON.stringify({
                    "cartId": cartId,
                    "quantity": currentQuantity,
                    // "size": selectedSize,
                })
            });
            if (!response.ok) {
                console.log("Response error, status: ", response.status);
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

                {/* Nếu giỏ hàng trống thì hiện thông báo */}
                {cartItems.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl">Giỏ hàng của bạn hiện đang trống.</p>
                        <Link to={"/product"} className="mt-10 text-black underline hover:text-gray-600">Mua sắm ngay</Link>
                    </div>
                ) : (
                    <>
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