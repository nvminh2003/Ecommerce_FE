import React from "react";
import {
    StyleNameProduct,
    WrapperCardStyple,
    WrapperDiscountPriceText,
    WrapperPriceText,
    WrapperReportText,
    WrapperStyleTextSell,
    WrapperTextPrice,
} from "./style";
// import logo from "../../assets/images/image.png";
import { useNavigate } from "react-router";
import { convertPrice } from "../../utils";

const CardComponent = (props) => {
    const {
        // countInStock,
        // description,
        image,
        name,
        price,
        rating,
        // type,
        discount,
        selled,
        id,
    } = props;

    const navigate = useNavigate();
    const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`);
        // console.log("Product ID:", id);
        window.location.reload();
    };

    return (
        <WrapperCardStyple
            hoverable
            cover={
                <img
                    alt="product"
                    src={image}
                    onClick={() => handleDetailsProduct(id)}
                />
            }
        >
            {/* <img
                alt="logo"
                src={logo}
                style={{
                    width: "68px",
                    height: "14px",
                    position: "absolute",
                    top: 1,
                    left: 1,
                    borderTopLeftRadius: "3px",
                }}
            /> */}
            <StyleNameProduct>
                {name.length > 38 ? `${name.slice(0, 38)}...` : name}
            </StyleNameProduct>

            <WrapperReportText>
                <span style={{ marginRight: "4px" }}>
                    <span>{rating}</span>{" "}
                </span>

                <WrapperStyleTextSell> Đã bán {selled}</WrapperStyleTextSell>
            </WrapperReportText>
            {/* {"nếu có discount mới hiện - ngược lạilại"} */}
            <WrapperPriceText>
                <span style={{ marginRight: "8px" }}>
                    {discount > 0
                        ? convertPrice(price - (price * discount) / 100) // Giá đã giảm
                        : convertPrice(price)}{" "}
                </span>
            </WrapperPriceText>

            {discount > 0 && (
                <WrapperDiscountPriceText>
                    - {discount}%
                </WrapperDiscountPriceText>
            )}

            {discount > 0 && (
                <WrapperTextPrice>{convertPrice(price)}</WrapperTextPrice>
            )}
        </WrapperCardStyple>
    );
};

export default CardComponent;
