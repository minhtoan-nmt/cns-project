import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import Navbar from "../../Navbar"; // Kiểm tra lại path
import Sidebar from "./components/Sidebar";
import ProfileView from "./components/ProfileView";
import HistoryView from "./components/HistoryView";
import WishlistView from "./components/WishlistView";

export default function SuccessPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const nav = useNavigate();

    useEffect(() => {
      if (!Cookies.get("token")) {
        nav("/login");
      }
    }, [nav]);

    // Render nội dung tương ứng với tab đang chọn
    const renderContent = () => {
      switch (activeTab) {
        case "profile": return <ProfileView />;
        case "history": return <HistoryView />;
        case "wishlist": return <WishlistView />;
        default: return <ProfileView />;
      }
    };

    return (
      <>
        <Navbar />
        <div className="min-h-screen relative top-30 bg-white flex justify-center items-start p-10 font-sans text-[#4a3b32]">
          <div className="flex w-full max-w-6xl gap-16">
            
            {/* Main Content Area */}
            <div className="flex-1">
              {renderContent()}
            </div>

            {/* Sidebar Menu */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            
          </div>
        </div>
      </>
    );
}