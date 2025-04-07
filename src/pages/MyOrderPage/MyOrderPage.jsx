import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as OrderService from "../../services/OrderService";
import { convertPrice } from "../../utils";
import * as message from "../../components/Message/Message";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import {
    Container,
    OrderCard,
    OrderHeader,
    OrderBody,
    OrderFooter,
    ProductList,
    ProductItem,
    ProductImage,
    ProductName,
    ProductPrice,
    StatusTag,
    ActionButtons,
    TotalAmount,
} from "./style"; // Assume we create a modern styled-components file
import { useMutationHooks } from "../../hooks/useMutationHook";

const MyOrderPage = () => {
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);

    const fetchMyOrder = async () => {
        if (!user?.id || !user?.access_token) {
            message.error("Vui lòng đăng nhập để xem đơn hàng.");
            return [];
        }
        try {
            const res = await OrderService.getOrderByUserId(
                user.id,
                user.access_token
            );
            return res.data;
        } catch (error) {
            message.error("Không thể tải danh sách đơn hàng.");
            throw error;
        }
    };

    const queryOrder = useQuery({
        queryKey: ["orders"], // Đúng cú pháp dưới dạng Object
        queryFn: fetchMyOrder,
        enabled: Boolean(user?.id && user?.access_token), // Kiểm tra điều kiện trước khi gọi API
    });

    const { data: orders, isLoading } = queryOrder;

    const handleDetailsOrder = (id) => {
        navigate(`/details-order/${id}`, { state: { token: state?.token } });
    };

    const mutation = useMutationHooks((data) => {
        const { id, token, orderItems, userId } = data;
        const res = OrderService.cancelOrder(id, token, orderItems, userId);
        return res;
    });

    const handleCancelOrder = (order) => {
        console.log("Order data:", order);
        if (!order?._id) {
            message.error("Invalid Order ID. Unable to cancel order.");
            return;
        }

        mutation.mutate(
            {
                id: order._id,
                token: state?.token,
                orderItems: order?.orderItems,
                userId: user.id,
            },
            {
                onSuccess: () => {
                    queryOrder.refetch();
                },
            }
        );
        console.log(`Cancel Order: ${order}`);
    };

    return (
        <Container>
            <h2>Đơn hàng của tôi</h2>
            {isLoading ? (
                <div>Đang tải...</div>
            ) : (
                <div>
                    {orders?.map((order) => (
                        <OrderCard key={order._id}>
                            <OrderHeader>
                                <div>
                                    <span>Mã đơn hàng: {order._id}</span>
                                </div>
                                <div>
                                    <StatusTag $status={order.isDelivered}>
                                        {order.isDelivered
                                            ? "Đã giao hàng"
                                            : "Chưa giao hàng"}
                                    </StatusTag>
                                    <StatusTag $status={order.isPaid}>
                                        {order.isPaid
                                            ? "Đã thanh toán"
                                            : "Chưa thanh toán"}
                                    </StatusTag>
                                </div>
                            </OrderHeader>
                            <OrderBody>
                                <ProductList>
                                    {order.orderItems.map((item) => (
                                        <ProductItem key={item._id}>
                                            <ProductImage
                                                src={item.image}
                                                alt={item.name}
                                            />
                                            <ProductName>
                                                {/* {item.name} */}
                                                {item.name.length > 38
                                                    ? item.name.slice(0, 38) +
                                                      "..."
                                                    : item.name}
                                            </ProductName>
                                            <ProductPrice>
                                                {convertPrice(item.price)} VND
                                            </ProductPrice>
                                        </ProductItem>
                                    ))}
                                </ProductList>
                            </OrderBody>
                            <OrderFooter>
                                <TotalAmount>
                                    Tổng tiền: {convertPrice(order.totalPrice)}
                                </TotalAmount>
                                <ActionButtons>
                                    <ButtonComponent
                                        textButton="Hủy đơn hàng"
                                        styleButton={{
                                            backgroundColor: "#ff4d4f",
                                            color: "black",
                                        }}
                                        onClick={() => handleCancelOrder(order)}
                                    />
                                    <ButtonComponent
                                        textButton="Xem chi tiết"
                                        styleButton={{
                                            backgroundColor: "#1890ff",
                                            color: "black",
                                        }}
                                        onClick={() =>
                                            handleDetailsOrder(order._id)
                                        }
                                    />
                                </ActionButtons>
                            </OrderFooter>
                        </OrderCard>
                    ))}
                </div>
            )}
        </Container>
    );
};

export default MyOrderPage;
