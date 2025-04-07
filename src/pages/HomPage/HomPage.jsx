import React, { useEffect, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {
    WrapperButtonMore,
    WrapperProducts,
    WrapperTypeProduct,
} from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slider1 from "../../assets/images/slide1.webp";
import slider2 from "../../assets/images/slide2.webp";
import slider3 from "../../assets/images/slide3.webp";
import { StarFilled } from "@ant-design/icons";
import CardComponent from "../../components/CardComponent/CardComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService";
import { useSelector } from "react-redux";
import Loading from "../../components/LoadingComponent/Loading";
import { useDebounce } from "../../hooks/useDebounce";

const HomPage = () => {
    const searchProduct = useSelector((state) => state?.product?.search);
    const searchDebounce = useDebounce(searchProduct || "", 1000);
    const [limit, setLimit] = useState(10);
    const [loading, setIsLoading] = useState(false);
    const [typeProducts, setTypeProducts] = useState([]);

    const fetchProductAll = async (context) => {
        const search = context?.queryKey && context?.queryKey[2];
        const limit = context?.queryKey && context?.queryKey[1];
        console.log("context", context);
        const res = await ProductService.getAllProduct(search, limit);
        return res;
    };

    const {
        isLoading,
        data: products,
        isPreviousData,
    } = useQuery({
        queryKey: ["products", limit, searchDebounce],
        queryFn: fetchProductAll,
        retry: 3,
        retryDelay: 1000,
    });
    // console.log("isPreviousData: ", products);

    const renderStars = (num) => {
        const stars = [];
        for (let i = 0; i < num; i++) {
            stars.push(
                <StarFilled key={i} style={{ color: "rgb(255, 196, 0)" }} />
            );
        }
        return stars;
    };

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
    // console.log("Length:", products?.data?.length);
    // console.log("Total:", products?.total);
    return (
        <Loading isLoading={isLoading || loading}>
            <div style={{ marginTop: "60px" }}>
                <div style={{ padding: "0 120px", backgroundColor: "#fff" }}>
                    <WrapperTypeProduct>
                        {typeProducts.length > 0 ? (
                            typeProducts?.map((item, index) => (
                                <TypeProduct name={item} key={index} />
                            ))
                        ) : (
                            <div>No product types available</div> // Trường hợp không có dữ liệu
                        )}
                    </WrapperTypeProduct>
                </div>
                <div
                    style={{
                        backgroundColor: "#efefef",
                        padding: "5px 120px",
                        width: "100%",
                    }}
                >
                    <SliderComponent arrImages={[slider1, slider2, slider3]} />
                    <WrapperProducts>
                        {products?.data?.length > 0 ? (
                            products.data.map((p) => (
                                <CardComponent
                                    key={p._id}
                                    countInStock={p.countInStock}
                                    description={p.description}
                                    image={p.image}
                                    name={p.name}
                                    price={p.price}
                                    rating={renderStars(p?.rating)}
                                    type={p.type}
                                    discount={p.discount}
                                    selled={p.selled}
                                    id={p._id}
                                />
                            ))
                        ) : (
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "20px",
                                    backgroundColor: "ButtonFace",
                                }}
                            >
                                Không tìm thấy sản phẩm
                            </div>
                        )}
                    </WrapperProducts>
                    {products?.data?.length > 0 && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                            }}
                        >
                            <WrapperButtonMore
                                textButton="Xem thêm"
                                type="outline"
                                style={{
                                    border: "1px solid rgb(11, 116, 229)",
                                    color: "rgb(11, 116, 229)",
                                    width: "240px",
                                    height: "38px",
                                    borderRadius: "4px",
                                    margin: "15px",
                                }}
                                disabled={
                                    products?.data?.length >= products?.total
                                }
                                onClick={() => {
                                    setLimit((prev) => prev + 5);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Loading>
    );
};

export default HomPage;
