import { CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";

export default function ProductItem({id, source, alterText, productName, price}) {
    return (<Link to={`/product-detail/${id}`} className="h-100 w-fit">
        
        <img src={source} alt={alterText} className="object-fit h-4/5"/>
        <p className="font-bold mt-2">{productName}</p>
        <p>{price}</p>
    </Link>)
}