import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo transparent.png';
import { IoSearch } from 'react-icons/io5';
import { CgProfile } from 'react-icons/cg';
import { BsBasket3 } from "react-icons/bs";
import { useState, useRef, useEffect } from 'react';
import LogoutModal from './LogoutModal';
import ProfileDropdown from './ProfileDropdown';
import NavbarMenu from './NavbarMenu';
import { getLocalCartCount, CART_UPDATED_EVENT } from '../utils/cartStorage';
import Cookies from 'js-cookie';

const apiUrl = import.meta.env.VITE_API_BASE_URL || '';

/** Lấy tổng số lượng sản phẩm trong giỏ từ API (khi đã đăng nhập). Trả về 0 nếu lỗi hoặc chưa đăng nhập. */
async function fetchApiCartCount() {
    const token = Cookies.get('token');
    const userId = Cookies.get('id');
    if (!token || !userId) return 0;
    try {
        const cartRes = await fetch(`${apiUrl}/api/user/cart?userId=${encodeURIComponent(userId)}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!cartRes.ok) return 0;
        const cartData = await cartRes.json();
        const cartId = cartData?.cartId ?? cartData?.cart_id;
        if (!cartId) return 0;
        const res = await fetch(`${apiUrl}/api/cart/${cartId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return 0;
        const data = await res.json();
        const items = Array.isArray(data) ? data : [];
        return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    } catch {
        return 0;
    }
}

export default function Navbar() {
    const [searchToggle, setSearchToggle] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [apiCartCount, setApiCartCount] = useState(0);

    useEffect(() => {
        setCartCount(getLocalCartCount() + apiCartCount);
    }, [apiCartCount]);

    useEffect(() => {
        const update = async () => {
            const api = await fetchApiCartCount();
            setApiCartCount(api);
            setCartCount(getLocalCartCount() + api);
        };
        update();
        window.addEventListener(CART_UPDATED_EVENT, update);
        return () => window.removeEventListener(CART_UPDATED_EVENT, update);
    }, []);
    const profileRef = useRef(null);
    const navigator = useNavigate();
    const menu = [
        {route: "/about-us", content: "Về chúng tôi"},
        {route: "/product", content: "Sản phẩm"},
        {route: "/collection", content: "Bộ sưu tập"},
        // {route: "/ar-ai", content: "CNS AI"},
        {route: "/login", content: "Tài khoản"},
        {route: "/support", content: "Hỗ trợ"},
    ];

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        }
        if (showProfileDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileDropdown]);

    const clearAllCookies = () => {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        }
    };

    return (
        <div className=' sticky top-0 z-50'>
            <div className='bg-black font-stretch-expanded text-white text-lg text-center py-2 overflow-hidden'>
                <p className="animate-marquee">Tại CNS, mọi thứ đều xuất phát từ sự tối giản và thấu hiểu – từ cách chúng tôi thiết kế, đến cách bạn mặc mỗi ngày.</p>
            </div>
            <div id="navbar" className='bg-white fixed w-full flex flex-row justify-between'>
                <LogoutModal
                    open={showLogoutModal}
                    onConfirm={() => {
                        clearAllCookies();
                        setShowLogoutModal(false);
                        setShowProfileDropdown(false);
                        navigator("/")
                    }}
                    onCancel={() => setShowLogoutModal(false)}
                />
                <div className='flex flex-row gap-2 items-center'>
                    <Link to={"/"}><img src={logo} alt="Logo" className='overflow-hidden w-27.5 object-fit hover:scale-130 transition'/></Link>
                    <NavbarMenu menu={menu} />
                </div>
                <div className='flex flex-row jusitfy-between gap-5 items-center relative right-10'>
                    <input 
                        className={`
                            transition-all duration-500 ease-in-out outline-none
                            ${searchToggle ? 'w-48 opacity-100 border-b-2 p-2' : 'w-0 opacity-0 border-none p-0'}
                        `}
                        placeholder="Tìm kiếm sản phẩm..."
                    />
                    <button onClick={() => setSearchToggle(!searchToggle)}>
                        <IoSearch size={30} className='opacity-50 cursor-pointer hover:opacity-100 transition-opacity'/>
                    </button>
                    <div className='relative top-0.5' ref={profileRef}>
                        <button
                            onClick={() => setShowProfileDropdown((prev) => !prev)}
                            className='focus:outline-none cursor-pointer'
                        >
                            <CgProfile size={30} className='opacity-50 hover:opacity-100 transition-opacity'/>
                        </button>
                        <ProfileDropdown
                            open={showProfileDropdown}
                            onLogout={() => setShowLogoutModal(true)}
                            onClose={() => setShowProfileDropdown(false)}
                            profileRef={null}
                        />
                    </div>
                    <Link
                        to="/cart"
                        className="relative"
                        title={cartCount > 0 ? `Đang có ${cartCount} đơn hàng` : 'Giỏ hàng'}
                    >
                        <BsBasket3 size={30} className="opacity-50 hover:opacity-100 transition-opacity" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-xs font-bold text-white bg-[#3a2415] rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </div>
    );
}