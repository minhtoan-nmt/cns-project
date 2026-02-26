import React from "react";
import product1 from "../../../../assets/product1.png"; // Chỉnh sửa lại path nếu cần
import product2 from "../../../../assets/product2.png"; 

// Sub-component chỉ dùng trong HistoryView để hiển thị từng sản phẩm
const Item = ({ image, title, price, sizes, stockWarning, colorDotClass }) => (
    <div className="flex gap-6 pb-6 border-b border-[#D8CFC6]">
        <div className="w-32 h-40 bg-white rounded-2xl overflow-hidden shrink-0 shadow-sm">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 space-y-2">
        <div>
            <h3 className="text-xl font-medium">{title}</h3>
            <p className="text-sm font-semibold mt-1">{price}</p>
        </div>

        <div className="pt-2">
            <p className="text-xs mb-1 font-medium">Size</p>
            <div className="flex items-center gap-4">
            <div className="flex gap-2">
                {sizes.map((sizeObj, idx) => (
                <span
                    key={idx}
                    className={`w-8 h-8 border border-[#4a3b32] flex items-center justify-center text-xs ${
                    sizeObj.active
                        ? "bg-[#C5B5A9] font-bold"
                        : "text-gray-400"
                    } ${sizeObj.disabled ? "box-decoration-slice line-through" : ""}`}
                >
                    {sizeObj.label}
                </span>
                ))}
            </div>
            {stockWarning && (
                <span className="text-xs text-red-700 font-medium">
                {stockWarning}
                </span>
            )}
            </div>
        </div>

        <div className="pt-2 space-y-2">
            <div className={`w-5 h-5 rounded-full border border-gray-300 ${colorDotClass}`}></div>
            <div className="flex items-center space-x-2">
            <span className="text-xs font-medium">Số lượng</span>
            <div className="flex items-center border border-[#4a3b32] h-7">
                <button className="px-2 hover:bg-gray-200">-</button>
                <span className="px-2 text-sm">1</span>
                <button className="px-2 hover:bg-gray-200">+</button>
            </div>
            </div>
        </div>
        </div>
    </div>
);

export { Item };

export default function HistoryView() {
    return (
        <div className="flex-1 space-y-8">
        <Item
            image={product1}
            title="Butterline Tennis Dress"
            price="1,000,000vnd"
            colorDotClass="bg-[#EFE8A8]"
            stockWarning="Chỉ còn 3 sản phẩm trong kho!"
            sizes={[
            { label: "S", active: false },
            { label: "M", active: true },
            { label: "L", active: false, disabled: true },
            { label: "XL", active: false },
            ]}
        />

        <Item
            image={product2}
            title="Baby Top"
            price="1,000,000vnd"
            colorDotClass="bg-white"
            sizes={[
            { label: "S", active: false },
            { label: "M", active: true },
            { label: "L", active: false },
            ]}
        />

        <div className="flex justify-end items-end pt-4">
            <span className="text-xl font-medium mr-4">Tổng tiền:</span>
            <span className="text-3xl font-semibold">2,000,000vnd</span>
        </div>
        </div>
    );
}