import React, { useEffect, useState } from "react";
import { WrapperContent, WrapperLableText } from "./style";
import TypeProduct from "../TypeProduct/TypeProduct"; // Import component TypeProduct
import * as ProductService from "../../services/ProductService";

const NavbarComponent = () => {
    const [typeProducts, setTypeProducts] = useState([]);
    const fetchAllTypeProducts = async () => {
        const res = await ProductService.getAllTypeProduct();
        if (res?.status === "OK") {
            setTypeProducts(res?.data || []);
        } else {
            console.error("Failed to fetch type products");
            setTypeProducts([]);
        }
        // console.log("res  type: ", res);
    };
    useEffect(() => {
        fetchAllTypeProducts();
    }, []);

    return (
        <div>
            <WrapperLableText>Danh mục sản phẩm</WrapperLableText>
            <WrapperContent>
                <>
                    {typeProducts.length > 0 ? (
                        typeProducts?.map((item, index) => (
                            <TypeProduct name={item} key={index} />
                        ))
                    ) : (
                        <div>No product types available</div> // Trường hợp không có dữ liệu
                    )}
                </>
            </WrapperContent>
        </div>
    );
};

export default NavbarComponent;
