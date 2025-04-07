import React from "react";
import {
    WrapperAllPrice,
    WrapperContentInfo,
    WrapperHeaderUser,
    WrapperInfoUser,
    WrapperItem,
    WrapperItemLabel,
    WrapperLabel,
    WrapperNameProduct,
    WrapperProduct,
    WrapperStyleContent,
} from "./style";
import { useLocation, useParams } from "react-router-dom";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { orderContant } from "../../contant";
import { convertPrice } from "../../utils";
import { useMemo } from "react";
import Loading from "../../components/LoadingComponent/Loading";

const DetailsOrderPage = () => {
    const params = useParams();
    const location = useLocation();
    const { state } = location;
    const { id } = params;

    const fetchDetailsOrder = async () => {
        const res = await OrderService.getDetailsOrder(id, state?.token);
        return res.data;
    };

    const queryOrder = useQuery({
        queryKey: ["orders-details"],
        queryFn: fetchDetailsOrder,
        enabled: Boolean(id),
    });

    const { isLoading, data } = queryOrder;

    const priceMemo = useMemo(() => {
        const result = data?.orderItems?.reduce((total, cur) => {
            const discount = cur.discount ?? 0; // Đặt discount mặc định là 0 nếu không có giá trị
            return total + cur.price * cur.amount * (1 - discount / 100);
        }, 0);
        return result || 0; // Đảm bảo trả về 0 nếu result là undefined hoặc null
    }, [data]);

    return (
        <Loading isLoading={isLoading}>
            <div
                style={{
                    margin: " 80px 0",
                    width: "100%",
                    height: "100%",
                }}
            >
                <div
                    style={{
                        width: "1270px",
                        margin: "0 auto",
                        height: "100%",
                    }}
                >
                    <h2>Chi tiết đơn hàng</h2>
                    <WrapperHeaderUser>
                        <WrapperInfoUser>
                            <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
                            <WrapperContentInfo>
                                <div className="name-info">
                                    {data?.shippingAddress?.fullName}
                                </div>
                                <div
                                    style={{ marginTop: "8px" }}
                                    className="address-info"
                                >
                                    <span>Địa chỉ: </span>
                                    {`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}
                                </div>
                                <div className="phone-info">
                                    <span>Điện thoại: </span>{" "}
                                    {data?.shippingAddress?.phone}
                                </div>
                            </WrapperContentInfo>
                        </WrapperInfoUser>
                        <WrapperInfoUser>
                            <WrapperLabel>Hình thức giao hàng</WrapperLabel>
                            <WrapperContentInfo>
                                <div className="delivery-info">
                                    <span className="name-delivery">FAST </span>
                                    Giao hàng tiết kiệm
                                </div>
                                <div className="delivery-fee">
                                    <span>Phí giao hàng: </span>{" "}
                                    {convertPrice(data?.shippingPrice)}
                                </div>
                            </WrapperContentInfo>
                        </WrapperInfoUser>
                        <WrapperInfoUser>
                            <WrapperLabel>Hình thức thanh toán</WrapperLabel>
                            <WrapperContentInfo>
                                <div className="payment-info">
                                    {orderContant.payment[data?.paymentMethod]}
                                </div>
                                <div className="status-payment">
                                    {data?.isPaid
                                        ? "Đã thanh toán"
                                        : "Chưa thanh toán"}
                                </div>
                            </WrapperContentInfo>
                        </WrapperInfoUser>
                    </WrapperHeaderUser>

                    <WrapperStyleContent>
                        <div
                            style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <div style={{ width: "670px" }}>Sản phẩm</div>
                            <WrapperItemLabel>Giá</WrapperItemLabel>
                            <WrapperItemLabel>Số lượng</WrapperItemLabel>
                            <WrapperItemLabel>Giảm giá</WrapperItemLabel>
                        </div>
                        {data?.orderItems?.map((order) => {
                            console.log("order data", order);
                            return (
                                <WrapperProduct key={order._id}>
                                    <WrapperNameProduct>
                                        <img
                                            src={order?.image}
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                objectFit: "cover",
                                                border: "1px solid rgb(238, 238, 238)",
                                                padding: "2px",
                                                borderRadius: "5px",
                                            }}
                                        />
                                        <div
                                            style={{
                                                width: 260,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                marginLeft: "10px",
                                                height: "70px",
                                            }}
                                        >
                                            {order?.name}
                                        </div>
                                    </WrapperNameProduct>
                                    <WrapperItem>
                                        {convertPrice(order?.price)}
                                    </WrapperItem>
                                    <WrapperItem>{order?.amount}</WrapperItem>
                                    <WrapperItem>
                                        {order?.discount
                                            ? convertPrice(
                                                  (order?.price *
                                                      order?.discount) /
                                                      100
                                              )
                                            : "0 "}
                                        VND
                                    </WrapperItem>
                                </WrapperProduct>
                            );
                        })}

                        <WrapperAllPrice>
                            <WrapperItemLabel>Tạm tính</WrapperItemLabel>
                            <WrapperItem>{convertPrice(priceMemo)}</WrapperItem>
                        </WrapperAllPrice>
                        <WrapperAllPrice>
                            <WrapperItemLabel>Phí vận chuyển</WrapperItemLabel>
                            <WrapperItem>
                                {convertPrice(data?.shippingPrice)}
                            </WrapperItem>
                        </WrapperAllPrice>
                        <WrapperAllPrice>
                            <WrapperItemLabel>Tổng cộng</WrapperItemLabel>
                            <WrapperItem>
                                <WrapperItem>
                                    {convertPrice(data?.totalPrice)}
                                </WrapperItem>
                            </WrapperItem>
                        </WrapperAllPrice>
                    </WrapperStyleContent>
                </div>
            </div>
        </Loading>
    );
};

export default DetailsOrderPage;
