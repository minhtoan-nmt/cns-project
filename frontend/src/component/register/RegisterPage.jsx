import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import { useState } from "react";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export default function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showFullNameWarning, setShowFullNameWarning] = useState(false);
    const [showEmailWarning, setShowEmailWarning] = useState(false);
    const [showPhoneNumberWarning, setShowPhoneNumberWarning] = useState(false);
    const [showUsernameWarning, setShowUsernameWarning] = useState(false);
    const [showPasswordWarning, setShowPasswordWarning] = useState(false);
    const [showPasswordMismatchWarning, setShowPasswordMismatchWarning] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const registerUser = async () => {
        // Check input validation
        if (fullName === "" || email === "" || username === "" || password === "" || password !== confirmPassword){
            if (fullName === "") {
                setShowFullNameWarning(true);
            }
            if (email === "") {
                setShowEmailWarning(true);
            }
            if (username === "") {
                setShowUsernameWarning(true);
            }
            if (password === "") {
                setShowPasswordWarning(true);
            }
            if (password !== confirmPassword) {
                setShowPasswordMismatchWarning(true);
            }
            return;
        }

        const res = await fetch(`${apiUrl}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "fullName": fullName,
                "email": email,
                "username": username,
                "password": password,
                "phoneNumber": phoneNumber,
            })
        });

        if (res.ok) {
            setShowSuccessModal(true);
        } else {
            console.log("Status code", res.status);
        }
    }

    return (
        <>
            <Navbar />
            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
                        <h2 className="text-2xl font-semibold mb-4 text-[#3e2b1d]">Đăng ký thành công!</h2>
                        <p className="mb-6 text-[#4a3b32]">Bạn đã đăng ký tài khoản thành công. Hãy đăng nhập để tiếp tục.</p>
                        <Link
                            to="/login"
                            className="bg-[#463325] text-white rounded-full px-8 py-2 text-sm tracking-wide hover:bg-[#2e2118] transition-colors duration-300"
                        >
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            )}
            <div className="flex items-center justify-center bg-white mt-30">
                {/* Container Card */}
                <div className="w-full max-w-137.5 bg-[#f9f3f0] px-12 py-16 shadow-sm">
                    {/* Header */}
                    <h1 className="text-center text-[#3e2b1d] font-serif text-3xl tracking-widest uppercase mb-10 font-medium">
                        Đăng ký
                    </h1>
                    <div className="flex flex-col">
                        {/* Name Input */}
                        <div className="mb-5">
                            <input
                                type="text"
                                placeholder="Họ và tên"
                                className="w-full bg-transparent border border-[#d4c5bc] text-[#4a3b32] px-4 py-3 rounded-lg focus:outline-none focus:border-[#8c7365] placeholder-[#8c7365] text-sm"
                                onChange={e => setTimeout(() => setFullName(e.target.value), 1000)}
                            />
                        </div>
                        {showFullNameWarning && (<div className="text-sm text-red-400 relative bottom-4 left-1">
                            <p>* Vui lòng nhập tên của bạn</p>
                        </div>)}
                        {/* Email Input */}
                        <div className="mb-5">
                            <input
                                type="email"
                                placeholder="E-mail"
                                className="w-full bg-transparent border border-[#d4c5bc] text-[#4a3b32] px-4 py-3 rounded-lg focus:outline-none focus:border-[#8c7365] placeholder-[#8c7365] text-sm"
                                onChange={e => setTimeout(() => setEmail(e.target.value), 1000)}
                            />
                        </div>
                        {showEmailWarning && (<div className="text-sm text-red-400 relative bottom-4 left-1">
                            <p>* Vui lòng nhập email của bạn</p>
                        </div>)}
                        {/* Phone Number Input */}
                        <div className="mb-5">
                            <input
                                type="text"
                                placeholder="Số điện thoại"
                                className="w-full bg-transparent border border-[#d4c5bc] text-[#4a3b32] px-4 py-3 rounded-lg focus:outline-none focus:border-[#8c7365] placeholder-[#8c7365] text-sm"
                                onChange={e => setTimeout(() => setPhoneNumber(e.target.value), 1000)}
                            />
                        </div>
                        {showPhoneNumberWarning && (<div className="text-sm text-red-400 relative bottom-4 left-1">
                            <p>* Vui lòng nhập số điện thoại của bạn</p>
                        </div>)}
                        {/* Username Input */}
                        <div className="mb-5">
                            <input
                                type="text"
                                placeholder="Tên tài khoản"
                                className="w-full bg-transparent border border-[#d4c5bc] text-[#4a3b32] px-4 py-3 rounded-lg focus:outline-none focus:border-[#8c7365] placeholder-[#8c7365] text-sm"
                                onChange={e => setTimeout(() => setUsername(e.target.value), 1000)}
                            />
                        </div>
                        {showUsernameWarning && (<div className="text-sm text-red-400 relative bottom-4 left-1">
                            <p>* Vui lòng nhập tên tài khoản của bạn</p>
                        </div>)}
                        {/* Password Input */}
                        <div className="mb-5">
                            <input
                                type="password"
                                placeholder="Mật khẩu"
                                className="w-full bg-transparent border border-[#d4c5bc] text-[#4a3b32] px-4 py-3 rounded-lg focus:outline-none focus:border-[#8c7365] placeholder-[#8c7365] text-sm"
                                onChange={e => setTimeout(() => setPassword(e.target.value), 1000)}
                            />
                        </div>
                        {showPasswordWarning && (<div className="text-sm text-red-400 relative bottom-4 left-1">
                            <p>* Vui lòng nhập mật khẩu của bạn</p>
                        </div>)}
                        {/* Confirm Password Input */}
                        <div className="mb-8">
                            <input
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                className="w-full bg-transparent border border-[#d4c5bc] text-[#4a3b32] px-4 py-3 rounded-lg focus:outline-none focus:border-[#8c7365] placeholder-[#8c7365] text-sm"
                                onChange={e => setTimeout(() => setConfirmPassword(e.target.value), 1000)}
                            />
                        </div>
                        {showPasswordMismatchWarning && (<div className="text-sm text-red-400 relative bottom-4 left-1">
                            <p>* Mật khẩu chưa trùng khớp</p>
                        </div>)}
                        {/* Register Button */}
                        <div className="flex justify-center mb-6">
                            <button 
                                type="button" 
                                className="bg-[#463325] text-white text-center rounded-full px-16 py-3 text-sm tracking-wide hover:bg-[#2e2118] transition-colors duration-300 w-3/4"
                                onClick={registerUser}
                            >
                                Đăng ký
                            </button>
                        </div>
                        {/* Login Link */}
                        <div className="text-center">
                            <p className="text-[#a89c96] text-xs">
                                Đã có tài khoản?{" "}
                                <Link to={"/login"} className="text-[#3e2b1d] hover:underline font-medium transition-colors">
                                    Đăng nhập
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}