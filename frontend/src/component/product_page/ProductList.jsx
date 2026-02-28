import ProductItem from "./ProductItem";

const ProductList = ({ products }) => {
    return (
        <div className="flex-1 flex justify-center">
            <div className="grid grid-cols-3 gap-4">
                {products.map((product, idx) => (
                    <ProductItem
                        key={idx}
                        id={product.id}
                        source={product.imageSrc}
                        alterText={product.productName}
                        productName={product.productName}
                        price={product.price.toLocaleString("vi-VN") + " VNĐ"}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductList;