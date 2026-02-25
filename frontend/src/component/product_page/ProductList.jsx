import ProductItem from "./ProductItem";

const ProductList = ({ products, fetchError }) => {
    if (fetchError) {
        return (
            <div className="flex-1 flex justify-center items-center py-20 px-6">
                <div className="text-center max-w-md">
                    <p className="text-red-500 font-medium mb-2">Lỗi tải sản phẩm</p>
                    <p className="text-gray-600 text-sm">{fetchError}</p>
                </div>
            </div>
        );
    }
    if (!products || products.length === 0) {
        return (
            <div className="flex-1 flex justify-center items-center py-20 px-6">
                <p className="text-gray-500">Chưa có sản phẩm nào. Hãy thêm sản phẩm vào database hoặc thử bỏ bộ lọc.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col items-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product, idx) => (
                    <ProductItem
                        key={product.id || idx}
                        product={product}
                        id={product.id}
                        source={product.imageSrc}
                        alterText={product.productName}
                        productName={product.productName}
                        price={(product.price ?? 0).toLocaleString("vi-VN") + " VNĐ"}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductList;
