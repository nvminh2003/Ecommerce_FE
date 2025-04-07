import React, { useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Col, Pagination, Row } from "antd";
import { WrapperNavbar, WrapperProducts } from "./style";
import { useLocation } from "react-router";
import * as ProductService from "../../services/ProductService";
import { StarFilled } from "@ant-design/icons";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";

const TypeProductPage = () => {
    const { state } = useLocation();
    const searchProduct = useSelector((state) => state?.product?.search);
    const searchDebounce = useDebounce(searchProduct, 1000);
    const [products, setProducts] = useState([]);
    const [loading, setIsLoading] = useState(false);
    const [panigate, setPanigate] = useState({ page: 0, limit: 10, total: 1 });
    // console.log("location: ", location);

    const fetchProductType = async (type, page, limit) => {
        setIsLoading(true);
        const res = await ProductService.getProductType(type, page, limit);
        if (res?.status === "OK") {
            console.log("res: ", res);
            setProducts(res?.data);
            setPanigate({ ...panigate, total: res?.total });
        } else {
            console.log("Error fetching products");
        }
        setIsLoading(false);
        // console.log("res type: ", res);
    };

    // console.log("loading products", loading);
    useEffect(() => {
        if (state) {
            fetchProductType(state, panigate.page, panigate.limit);
        }
    }, [state, panigate.page, panigate.limit]);

    const onChange = (cursor, pageSize) => {
        setPanigate({ ...panigate, page: cursor - 1, limit: pageSize });
    };

    const renderStars = (num) => {
        const stars = [];
        for (let i = 0; i < num; i++) {
            stars.push(
                <StarFilled key={i} style={{ color: "rgb(255, 196, 0)" }} />
            );
        }
        return stars;
    };
    return (
        <Loading isLoading={loading}>
            <div
                style={{
                    padding: "0 120px",
                    background: "#efefef",
                    marginTop: "60px",
                    height: "100%",
                }}
            >
                <Row
                    style={{
                        flexWrap: "nowrap",
                        paddingTop: "30px",
                    }}
                >
                    <WrapperNavbar span={4}>
                        <NavbarComponent />
                    </WrapperNavbar>
                    <Col span={20}>
                        <WrapperProducts>
                            {products
                                ?.filter((pro) => {
                                    if (searchDebounce === "") {
                                        return pro;
                                    } else if (
                                        pro?.name
                                            ?.toLowerCase()
                                            ?.includes(
                                                searchDebounce?.toLowerCase()
                                            )
                                    ) {
                                        return pro;
                                    }
                                })
                                ?.map((p) => {
                                    return (
                                        <CardComponent
                                            key={p._id}
                                            countInStock={p.countInStock}
                                            description={p.description}
                                            image={p.image}
                                            name={p.name}
                                            price={p?.price}
                                            rating={renderStars(p?.rating)}
                                            type={p.type}
                                            discount={p.discount}
                                            selled={p.selled}
                                            id={p._id}
                                        />
                                    );
                                })}
                        </WrapperProducts>
                        <Pagination
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                margin: "30px 0 50px",
                            }}
                            defaultCurrent={panigate.page + 1}
                            // current={panigate.page + 1}
                            total={panigate.total}
                            onChange={onChange}
                        />
                    </Col>
                </Row>
            </div>
        </Loading>
    );
};

export default TypeProductPage;
