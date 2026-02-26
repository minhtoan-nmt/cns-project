import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showWarning, setShowWarning] = useState(false);
    const [failureNotification, showFailureNotification] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        if (Cookies.get("token")) {
            nav("/profile");
        }
    }, [nav]);

    const login = async () => {
        if (username === "" || password === "") {
            setShowWarning(true);
            return;
        }

        const res = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        })

        if (!res.ok) {
            console.log("Status code", res.status)
            setShowWarning(false);
            showFailureNotification(true);
            return;
        }
        const data = await res.json();
        Cookies.set("token", data.token, {
            expires: 1
        })
        Cookies.set("id", data.userId, {
            expires: 1
        })
        nav("/profile")
    }

    return (<>
        <Navbar />
        <div className=" flex items-center justify-center bg-white mt-30">
            {/* Container Card */}
            <div className="w-full max-w-137.5 bg-[#f9f3f0] px-12 py-16 shadow-sm">
                
                {/* Header */}
                <h1 className="text-center text-[#3e2b1d] font-serif text-3xl tracking-widest uppercase mb-10 font-medium">
                Đăng nhập
                </h1>

                <form className="flex flex-col">
                {/* Email Input */}
                <div className="mb-5">
                    <input
                    type="text"
                    placeholder="Tên tài khoản"
                    className="w-full bg-transparent border border-[#d4c5bc] text-[#4a3b32] px-4 py-3 rounded-lg focus:outline-none focus:border-[#8c7365] placeholder-[#8c7365] text-sm"
                    onChange={e => setTimeout(() => setUsername(e.target.value), 500)}
                    />
                </div>

                {/* Password Input */}
                <div className="mb-2">
                    <input
                    type="password"
                    placeholder="Mật khẩu"
                    className="w-full bg-transparent border border-[#d4c5bc] text-[#4a3b32] px-4 py-3 rounded-lg focus:outline-none focus:border-[#8c7365] placeholder-[#8c7365] text-sm"
                    onChange={e => setTimeout(() => setPassword(e.target.value), 500)}
                    />
                </div>

                {/* Forgot Password Link */}
                <div className="mb-8">
                    <a href="#" className="text-[#a89c96] text-xs hover:text-[#3e2b1d] transition-colors pl-1">
                    Quên mật khẩu?
                    </a>
                </div>

                {showWarning && (<div className="text-sm text-red-400 relative bottom-4 left-1">
                    <p>* Vui lòng điền đầy đủ thông tin trước khi đăng nhập</p>
                </div>)}

                {failureNotification && (<div className="text-sm text-red-400 relative bottom-4 left-1">
                    <p>* Thông tin tài khoản hoặc mật khẩu không chính xác</p>
                </div>)}

                {/* Login Button */}
                <div className="flex justify-center mb-6">
                    <button
                        type="button"
                        className="bg-[#463325] text-white text-center rounded-full px-16 py-3 text-sm tracking-wide hover:bg-[#2e2118] transition-colors duration-300 w-3/4 hover:cursor-pointer"
                        onClick={login}
                    >
                        Đăng nhập
                    </button>
                </div>

                {/* Register Link */}
                <div className="text-center">
                    <Link to={"/register"} className="text-[#a89c96] text-xs hover:text-[#3e2b1d] hover:underline transition-colors">
                    <p>Đăng ký</p>
                    </Link>
                </div>
                </form>
            </div>
            </div>
    </>)
}