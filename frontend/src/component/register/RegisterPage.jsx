import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import { useState } from "react";
import { getApiBaseUrl, getAuthRegisterUrl } from "../../utils/api";

const apiUrl = getApiBaseUrl();

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
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const registerUser = async () => {
        const f = (fullName || "").trim();
        const e = (email || "").trim();
        const u = (username || "").trim();
        const p = (password || "").trim();
        const cp = (confirmPassword || "").trim();
        const ph = (phoneNumber || "").trim();

        setShowFullNameWarning(false);
        setShowEmailWarning(false);
        setShowPhoneNumberWarning(false);
        setShowUsernameWarning(false);
        setShowPasswordWarning(false);
        setShowPasswordMismatchWarning(false);
        setErrorMessage("");

        if (f === "" || e === "" || u === "" || p === "" || p !== cp) {
            if (f === "") setShowFullNameWarning(true);
            if (e === "") setShowEmailWarning(true);
            if (u === "") setShowUsernameWarning(true);
            if (p === "") setShowPasswordWarning(true);
            if (p !== cp) setShowPasswordMismatchWarning(true);
            return;
        }

        if (!apiUrl) {
            setErrorMessage("Chưa cấu hình địa chỉ API (VITE_API_BASE_URL).");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(getAuthRegisterUrl(), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "omit",
                body: JSON.stringify({
                    fullName: f,
                    email: e,
                    username: u,
                    password: p,
                    phoneNumber: ph || null,
                }),
            });

            if (res.ok) {
                setShowSuccessModal(true);
            } else {
                const text = await res.text();
                let msg = "Đăng ký thất bại. Vui lòng thử lại.";
                if (res.status === 406) msg = "Tên tài khoản đã tồn tại. Vui lòng chọn tên khác.";
                else if (text) try { const j = JSON.parse(text); msg = j.message || j.error || msg; } catch (_) {}
                setErrorMessage(msg);
            }
        } catch (err) {
            console.error("Register error:", err);
            setErrorMessage("Không kết nối được máy chủ. Kiểm tra backend đang chạy và mạng.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                value={fullName}
                                className="w-full bg-transparent border border-[#d4c5bc] text-[#4a3b32] px-4 py-3 rounded-lg focus:outline-none focus:border-[#8c7365] placeholder-[#8c7365] text-sm"
                                onChange={e => setFullName(e.target.value)}
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
                                value={email}
                                className="w-full bg-transparent border border-[#d4c5bc] text-[#4a3b32] px-4 py-3 rounded-lg focus:outline-none focus:border-[#8c7365] placeholder-[#8c7365] text-sm"
                                onChange={e => setEmail(e.target.value)}
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
                                value={phoneNumber}
                                className="w-full bg-transparent border border-[#d4c5bc] text-[#4a3b32] px-4 py-3 rounded-lg focus:outline-none focus:border-[#8c7365] placeholder-[#8c7365] text-sm"
                                onChange={e => setPhoneNumber(e.target.value)}
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
                                value={username}
                                className="w-full bg-transparent border border-[#d4c5bc] text-[#4a3b32] px-4 py-3 rounded-lg focus:outline-none focus:border-[#8c7365] placeholder-[#8c7365] text-sm"
                                onChange={e => setUsername(e.target.value)}
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
                                value={password}
                                className="w-full bg-transparent border border-[#d4c5bc] text-[#4a3b32] px-4 py-3 rounded-lg focus:outline-none focus:border-[#8c7365] placeholder-[#8c7365] text-sm"
                                onChange={e => setPassword(e.target.value)}
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
                                value={confirmPassword}
                                className="w-full bg-transparent border border-[#d4c5bc] text-[#4a3b32] px-4 py-3 rounded-lg focus:outline-none focus:border-[#8c7365] placeholder-[#8c7365] text-sm"
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        {showPasswordMismatchWarning && (<div className="text-sm text-red-400 relative bottom-4 left-1">
                            <p>* Mật khẩu chưa trùng khớp</p>
                        </div>)}
                        {errorMessage && (
                            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                                {errorMessage}
                            </div>
                        )}
                        {/* Register Button */}
                        <div className="flex justify-center mb-6">
                            <button
                                type="button"
                                className="bg-[#463325] text-white text-center rounded-full px-16 py-3 text-sm tracking-wide hover:bg-[#2e2118] transition-colors duration-300 w-3/4 disabled:opacity-60 disabled:cursor-not-allowed"
                                onClick={registerUser}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
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