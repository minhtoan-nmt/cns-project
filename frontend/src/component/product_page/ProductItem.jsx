import { useState } from "react";
import { Link } from "react-router-dom";

const PLACEHOLDER_IMG = "https://via.placeholder.com/300x400?text=Sản+phẩm";

export default function ProductItem({ product, id, source, alterText, productName, price }) {
    const [imgError, setImgError] = useState(false);
    const src = source && !imgError ? (source.startsWith("http") ? source : encodeURI(source)) : PLACEHOLDER_IMG;

    return (
        <Link
            to={`/product-detail/${id}`}
            state={{ product }}
            className="relative block group bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
        >
            <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                <img
                    src={src}
                    alt={alterText || productName || "Sản phẩm"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => setImgError(true)}
                />
            </div>
            <div className="block p-2.5 hover:bg-gray-50/50 transition">
                <p className="font-semibold text-sm text-gray-800 line-clamp-2 mb-0.5">{productName}</p>
                <p className="text-[#5e4b43] text-sm font-medium">{price}</p>
                <span className="text-xs text-[#7c6f63] hover:underline mt-0.5 inline-block">Chọn size & số lượng</span>
            </div>
        </Link>
    );
}
