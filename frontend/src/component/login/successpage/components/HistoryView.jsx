import React from "react";

const IMG_BASE = "/images/products/HÌNH ẢNH SẢN PHẨM/HÌNH ẢNH SẢN PHẨM";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

/** Dữ liệu mẫu lịch sử mua hàng */
const SAMPLE_HISTORY = [
    {
        productName: "Butterline Tennis Dress",
        price: 1000000,
        quantity: 1,
        size: "M",
        imageSrc: `${IMG_BASE}/THỜI TRANG NỮ/Butter set.JPG`,
    },
    {
        productName: "Baby Top",
        price: 1000000,
        quantity: 1,
        size: "M",
        imageSrc: `${IMG_BASE}/THỜI TRANG NỮ/Emily top.jpg`,
    },
];

export default function HistoryView() {
    const total = SAMPLE_HISTORY.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Lịch sử mua hàng</h2>
            <div className="space-y-6">
                {SAMPLE_HISTORY.map((item, idx) => (
                    <div key={idx} className="flex gap-4 py-4 border-b border-gray-200">
                        <div className="w-24 h-28 bg-gray-100 rounded overflow-hidden shrink-0">
                            <img
                                src={item.imageSrc}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = "https://via.placeholder.com/96x112?text=SP"; }}
                            />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.productName}</p>
                            <p className="text-gray-600 mt-1">{formatCurrency(item.price)}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Size: {item.size} · Số lượng: {item.quantity}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-lg font-semibold text-gray-900">
                    Tổng tiền: {formatCurrency(total)}
                </p>
            </div>
        </div>
    );
}
