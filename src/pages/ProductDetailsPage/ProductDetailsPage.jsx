import React from "react";
import ProductDetailComponent from "../../components/ProductDetailComponent/ProductDetailComponent";
import { useNavigate, useParams } from "react-router";

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    console.log("param", id);

    // Kiểm tra id
    if (!id) {
        console.error("Missing product ID in URL");
        navigate("/"); // Điều hướng về trang chủ hoặc trang khác
        return null;
    }

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <div
                style={{
                    marginTop: "60px",
                    padding: "0 120px",
                    backgroundColor: "#efefef",
                    // height: "400px",
                }}
            >
                <h2 style={{ paddingTop: "15px" }}>Chi tiết sản phẩm </h2>
                <ProductDetailComponent idProduct={id} />
            </div>
        </div>
    );
};

export default ProductDetailsPage;
