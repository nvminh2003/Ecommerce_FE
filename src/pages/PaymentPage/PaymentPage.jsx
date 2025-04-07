import { Button, Form, Radio } from "antd";
import React, { useEffect, useState } from "react";
import {
    Lable,
    WrapperInfo,
    WrapperLeft,
    WrapperRadio,
    WrapperRight,
    WrapperTotal,
} from "./style";

import { useDispatch, useSelector } from "react-redux";
import { convertPrice } from "../../utils";
import { useMemo } from "react";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserSevice";
import * as OrderService from "../../services/OrderService";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slides/useSlide";
import { useNavigate } from "react-router-dom";
import { removeAllOrderProduct } from "../../redux/slides/orderSlide";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import * as PaymentService from "../../services/PaymentService";

const PaymentPage = () => {
    const order = useSelector((state) => state.order);
    const user = useSelector((state) => state.user);

    const [delivery, setDelivery] = useState("fast");
    const [payment, setPayment] = useState("later_money");
    const navigate = useNavigate();
    const [sdkReady, setSdkReady] = useState(false);
    const [clientId, setClientId] = useState(null); // lưu client-id

    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
    const [stateUserDetails, setStateUserDetails] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
    });
    const [form] = Form.useForm();

    const dispatch = useDispatch();

    useEffect(() => {
        form.setFieldsValue(stateUserDetails);
    }, [form, stateUserDetails]);

    useEffect(() => {
        if (isOpenModalUpdateInfo) {
            setStateUserDetails({
                city: user?.city,
                name: user?.name,
                address: user?.address,
                phone: user?.phone,
            });
        }
    }, [isOpenModalUpdateInfo]);

    const handleChangeAddress = () => {
        setIsOpenModalUpdateInfo(true);
    };

    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSlected?.reduce((total, cur) => {
            return total + cur.price * cur.amount;
        }, 0);
        return result;
    }, [order]);

    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSlected?.reduce((total, cur) => {
            const discountRate = cur.discount || 0;
            return total + cur.amount * cur.price * (discountRate / 100);
        }, 0);
        return result || 0; // Trả về 0 nếu không có kết quả hợp lệ
    }, [order]);

    // const diliveryPriceMemo = useMemo(() => {
    //     return priceMemo > 10000000 ? 10000 : priceMemo === 0 ? 0 : 20000;
    // }, [priceMemo]);
    const diliveryPriceMemo = useMemo(() => {
        return priceMemo === 0
            ? 0
            : priceMemo >= 500000
            ? 0
            : priceMemo > 200000
            ? 10000
            : 20000;
    }, [priceMemo]);

    // console.log("priceMemo:", priceMemo);
    // console.log("diliveryPriceMemo:", diliveryPriceMemo);

    const totalPriceMemo = useMemo(() => {
        return priceMemo - priceDiscountMemo + diliveryPriceMemo;
    }, [priceMemo, diliveryPriceMemo, priceDiscountMemo]);

    const handleAddOrder = () => {
        if (
            user?.access_token &&
            order?.orderItemsSlected &&
            user?.name &&
            user?.address &&
            user?.phone &&
            user?.city &&
            priceMemo &&
            user?.id
        ) {
            // eslint-disable-next-line no-unused-expressions
            mutationAddOrder.mutate({
                token: user?.access_token,
                orderItems: order?.orderItemsSlected,
                fullName: user?.name,
                address: user?.address,
                phone: user?.phone,
                city: user?.city,
                paymentMethod: payment,
                itemsPrice: priceMemo,
                shippingPrice: diliveryPriceMemo,
                totalPrice: totalPriceMemo,
                user: user?.id,
                email: user?.email,
            });
        }
    };
    // console.log("order: ", order, user);

    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        const res = UserService.updateUser(id, { ...rests }, token);
        return res;
    });

    const mutationAddOrder = useMutationHooks((data) => {
        // console.log("Data gửi tới API:", data);
        const { token, ...rests } = data;
        const res = OrderService.createOrder({ ...rests }, token);
        return res;
    });

    const { isLoading, data } = mutationUpdate;
    const {
        data: dataAdd,
        isLoading: isLoadingAddOrder,
        isSuccess,
        isError,
    } = mutationAddOrder;

    useEffect(() => {
        // console.log("isSuccess:", isSuccess, "dataAdd:", dataAdd);
        if (isSuccess && dataAdd?.status === "OK") {
            // console.log("Data is successful, processing order...");
            const arrayOrdered = [];
            order?.orderItemsSlected?.forEach((element) => {
                arrayOrdered.push(element.product);
            });
            dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
            message.success("Đặt hàng thành công");
            navigate("/orderSuccess", {
                state: {
                    delivery,
                    payment,
                    orders: order?.orderItemsSlected,
                    totalPriceMemo: totalPriceMemo,
                },
            });
        } else if (isError) {
            // console.log("Order failed:", dataAdd);
            message.error("Đặt hàng thất bại");
        }
    }, [isSuccess, isError]);

    const handleCancleUpdate = () => {
        setStateUserDetails({
            name: "",
            email: "",
            phone: "",
            isAdmin: false,
        });
        form.resetFields();
        setIsOpenModalUpdateInfo(false);
    };

    const onSuccessPaypal = (data, actions) => {
        if (!data || !actions) {
            console.error("Error: Missing data or actions in PayPal response.");
            return;
        }

        console.log("Data received from PayPal: ", data);
        console.log("Actions available for PayPal: ", actions);

        // Gửi dữ liệu thanh toán đã thành công vào hệ thống
        mutationAddOrder.mutate({
            token: user?.access_token,
            orderItems: order?.orderItemsSlected,
            fullName: user?.name,
            address: user?.address,
            phone: user?.phone,
            city: user?.city,
            paymentMethod: payment,
            itemsPrice: priceMemo,
            shippingPrice: diliveryPriceMemo,
            totalPrice: totalPriceMemo,
            user: user?.id,
            isPaid: true,
            paidAt: actions.update_time, // Ensure this property exists
            email: user?.email,
        });

        if (mutationAddOrder.isSuccess) {
            dispatch({
                payload: {
                    status: "OK",
                    details: data, // Dữ liệu thanh toán từ PayPal
                },
            });
        }
    };

    const handleUpdateInforUser = () => {
        const { name, address, city, phone } = stateUserDetails;
        if (name && address && city && phone) {
            mutationUpdate.mutate(
                {
                    id: user?.id,
                    token: user?.access_token,
                    ...stateUserDetails,
                },
                {
                    onSuccess: () => {
                        dispatch(updateUser({ name, address, city, phone }));
                        setIsOpenModalUpdateInfo(false);
                        window.location.reload();
                    },
                }
            );
        }
    };

    // console.log("Order Items:", order?.orderItemsSlected);
    // console.log("Price Memo:", priceMemo);
    // console.log("Price Discount Memo:", priceDiscountMemo);
    // console.log("Delivery Price Memo:", diliveryPriceMemo);
    // console.log("Total Price Memo:", totalPriceMemo);

    console.log("Order:", order);
    console.log("Order Items Selected:", order?.orderItemsSlected);

    console.log("user", user);
    console.log("priceMemo", priceMemo);

    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value,
        });
    };
    const handleDilivery = (e) => {
        setDelivery(e.target.value);
    };

    const handlePayment = (e) => {
        setPayment(e.target.value);
    };

    const addPaypalScript = async () => {
        const { data } = await PaymentService.getConfig();
        setClientId(data);

        if (!document.body) {
            console.error(
                "document.body is not available, unable to append PayPal script."
            );
            return;
        }

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
        script.async = true;
        script.onload = () => {
            console.log("PayPal SDK loaded.");
            setSdkReady(true);
        };
        script.onerror = (error) => {
            console.error("Error loading PayPal SDK script: ", error);
        };

        document.body.appendChild(script);
    };

    useEffect(() => {
        if (!window.paypal) {
            console.log("PayPal SDK chưa được tải, đang tải...");
            addPaypalScript();
        } else {
            console.log("PayPal SDK đã tải thành công.");
            setSdkReady(true);
        }
    }, []);

    return (
        <div
            style={{
                with: "100%",
                height: "100vh",
                paddingTop: "70px",
            }}
        >
            {/* <Loading isLoading={isLoadingAddOrder}> */}
            <div
                style={{
                    height: "100%",
                    width: "1270px",
                    margin: "0 auto",
                }}
            >
                <h3>Thanh toán</h3>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <WrapperLeft>
                        <WrapperInfo>
                            <div>
                                <Lable>Chọn phương thức giao hàng</Lable>
                                <WrapperRadio
                                    onChange={handleDilivery}
                                    value={delivery}
                                >
                                    <Radio value="fast">
                                        <span
                                            style={{
                                                color: "#ea8500",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            FAST
                                        </span>{" "}
                                        Giao hàng tiết kiệm
                                    </Radio>
                                    <Radio value="gojek">
                                        <span
                                            style={{
                                                color: "#ea8500",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            GO_JEK
                                        </span>{" "}
                                        Giao hàng tiết kiệm
                                    </Radio>
                                </WrapperRadio>
                            </div>
                        </WrapperInfo>
                        <WrapperInfo>
                            <div>
                                <Lable>Chọn phương thức thanh toán</Lable>
                                <WrapperRadio
                                    onChange={handlePayment}
                                    value={payment}
                                >
                                    <Radio value="later_money">
                                        {" "}
                                        Thanh toán tiền mặt khi nhận hàng
                                    </Radio>
                                    <Radio value="paypal">
                                        {" "}
                                        Thanh toán tiền bằng paypal
                                    </Radio>
                                </WrapperRadio>
                            </div>
                        </WrapperInfo>
                    </WrapperLeft>
                    <WrapperRight>
                        <div style={{ width: "100%" }}>
                            <WrapperInfo>
                                <div>
                                    <span>Địa chỉ: </span>
                                    <span style={{ fontWeight: "bold" }}>
                                        {`${user?.address} ${user?.city}`}{" "}
                                    </span>
                                    <span
                                        onClick={handleChangeAddress}
                                        style={{
                                            color: "#9255FD",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Thay đổi
                                    </span>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <span>Tạm tính</span>
                                    <span
                                        style={{
                                            color: "#000",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {convertPrice(priceMemo)} VND
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <span>Giảm giá</span>
                                    <span
                                        style={{
                                            color: "#000",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {convertPrice(priceDiscountMemo)} VND
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <span>Phí giao hàng</span>
                                    <span
                                        style={{
                                            color: "#000",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {convertPrice(diliveryPriceMemo)} VND
                                    </span>
                                </div>
                            </WrapperInfo>
                            <WrapperTotal>
                                <span>Tổng tiền</span>
                                <span
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <span
                                        style={{
                                            color: "rgb(254, 56, 52)",
                                            fontSize: "21px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {convertPrice(totalPriceMemo)}
                                    </span>
                                    <span
                                        style={{
                                            color: "#000",
                                            fontSize: "10px",
                                        }}
                                    >
                                        (Đã bao gồm VAT nếu có)
                                    </span>
                                </span>
                            </WrapperTotal>
                        </div>
                        {payment === "paypal" && sdkReady ? (
                            <div style={{ width: "320px" }}>
                                <PayPalScriptProvider
                                    options={{
                                        "client-id": clientId, // client-id lấy từ backend
                                        currency: "USD", // Hoặc loại tiền bạn muốn (có thể thay đổi thành VND nếu muốn)
                                    }}
                                >
                                    <PayPalButtons
                                        createOrder={(data, actions) => {
                                            if (!actions || !actions.order) {
                                                console.error(
                                                    "Error: No order action available."
                                                );
                                                return;
                                            }
                                            const exchangeRateVNDToUSD = 23000; // Ví dụ: 1 USD = 23,000 VND
                                            const totalPriceInUSD = (
                                                totalPriceMemo /
                                                exchangeRateVNDToUSD
                                            ).toFixed(2); // Đổi sang USD
                                            return actions.order
                                                .create({
                                                    purchase_units: [
                                                        {
                                                            amount: {
                                                                value: totalPriceInUSD.toString(), // Sử dụng totalPriceMemo để thanh toán đúng
                                                            },
                                                        },
                                                    ],
                                                })
                                                .catch((error) => {
                                                    console.error(
                                                        "Error creating the order:",
                                                        error
                                                    );
                                                });
                                        }}
                                        onApprove={(data, actions) => {
                                            onSuccessPaypal(data, actions);
                                        }}
                                    />
                                </PayPalScriptProvider>
                            </div>
                        ) : (
                            <Button
                                style={{
                                    width: "100%",
                                    height: "40px",
                                    backgroundColor: "red",
                                    color: "white",
                                    borderColor: "red",
                                }}
                                disabled={
                                    !order?.orderItemsSlected ||
                                    !user?.access_token
                                }
                                onClick={() => handleAddOrder()}
                            >
                                Đặt hàng
                            </Button>
                        )}
                    </WrapperRight>
                </div>
            </div>
            <ModalComponent
                title="Cập nhật thông tin giao hàng"
                open={isOpenModalUpdateInfo}
                onCancel={handleCancleUpdate}
                onOk={handleUpdateInforUser}
            >
                {/* <Loading isLoading={isLoading}> */}
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    // onFinish={onUpdateUser}
                    autoComplete="on"
                    form={form}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please input your name!",
                            },
                        ]}
                    >
                        <InputComponent
                            value={stateUserDetails["name"]}
                            onChange={handleOnchangeDetails}
                            name="name"
                        />
                    </Form.Item>
                    <Form.Item
                        label="City"
                        name="city"
                        rules={[
                            {
                                required: true,
                                message: "Please input your city!",
                            },
                        ]}
                    >
                        <InputComponent
                            value={stateUserDetails["city"]}
                            onChange={handleOnchangeDetails}
                            name="city"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: "Please input your  phone!",
                            },
                        ]}
                    >
                        <InputComponent
                            value={stateUserDetails.phone}
                            onChange={handleOnchangeDetails}
                            name="phone"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Adress"
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: "Please input your  address!",
                            },
                        ]}
                    >
                        <InputComponent
                            value={stateUserDetails.address}
                            onChange={handleOnchangeDetails}
                            name="address"
                        />
                    </Form.Item>
                </Form>
                {/* </Loading> */}
            </ModalComponent>
            {/* </Loading> */}
        </div>
    );
};

export default PaymentPage;
