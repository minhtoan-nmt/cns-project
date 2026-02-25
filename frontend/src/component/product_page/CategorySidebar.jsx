import { useState } from "react";
import { MdCheckCircle, MdCheckCircleOutline } from "react-icons/md";

const CategorySidebar = ({ isOpen, options, selectedCategories, onToggle }) => {
    return (
        <div
            className={`shrink-0 transition-all duration-500 ease-in-out overflow-hidden 
            ${isOpen ? "w-75 opacity-100 mr-5" : "w-0 opacity-0 mr-0"}`}
        >
            <div className="w-75">
                {options.map((option, idx) => {
                    const isSelected = option === "Tất cả" ? selectedCategories.length === 0 : selectedCategories.includes(option);
                    return (
                        <div
                            key={idx}
                            // Thêm cursor-pointer và sự kiện click vào cả dòng để dễ bấm
                            className="flex flex-row border-b-2 border-gray-400 py-5 justify-between items-center cursor-pointer select-none"
                            onClick={() => onToggle(option)}
                        >
                            <span className={isSelected ? "font-bold text-black" : "text-gray-700"}>
                                {option}
                            </span>
                            
                            {/* Hiển thị icon: chọn = dấu tích đen, chưa chọn = vòng trắng */}
                            <div className="text-2xl">
                                {isSelected ? (
                                    <MdCheckCircle className="text-black" /> 
                                ) : (
                                    <MdCheckCircleOutline className="text-gray-300" />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategorySidebar;