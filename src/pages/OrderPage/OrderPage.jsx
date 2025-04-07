import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, Checkbox, Form, Table } from "antd";
import { DeleteOutlined, LineOutlined, PlusOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import {
    increaseAmount,
    decreaseAmount,
    removeOrderProduct,
    removeAllOrderProduct,
    selectedOrder,
} from "../../redux/slides/orderSlide";
import { convertPrice } from "../../utils";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserSevice from "../../services/UserSevice";
import Loading from "../../components/LoadingComponent/Loading";
import { useNavigate } from "react-router";
import StepComponent from "../../components/StepComponent/StepComponent";

const OrderPage = () => {
    const dispatch = useDispatch();
    const order = useSelector((state) => state.order);
    const user = useSelector((state) => state.user);
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
    const [listChecked, setListChecked] = useState([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [stateUserDetails, setStateUserDetails] = useState({
        name: "",
        phone: "",
        city: "",
        address: "",
    });

    const cartData = order?.orderItems?.map((item) => ({
        key: item.product,
        image: item.image,
        name: item.name,
        price: item.price,
        discount: item.discount,
        quantity: item.amount,
        countInStock: item.countInStock,
        total: item.amount * item.price * (1 - (item.discount ?? 0) / 100), // Xử lý discount mặc định
    }));
    console.log("cartData: ", order);

    useEffect(() => {
        if (isOpenModalUpdateInfo) {
            setStateUserDetails({
                name: user?.name,
                phone: user?.phone,
                address: user?.address,
                city: user?.city,
            });
        }
    }, [isOpenModalUpdateInfo]);

    useEffect(() => {
        form.setFieldsValue(stateUserDetails);
    }, [form, stateUserDetails]);

    const onChangeProduct = (e) => {
        if (listChecked.includes(e.target.value)) {
            const newListChecked = listChecked.filter(
                (item) => item !== e.target.value
            );
            setListChecked(newListChecked);
        } else {
            setListChecked([...listChecked, e.target.value]);
        }
    };

    useEffect(() => {
        dispatch(selectedOrder({ listChecked }));
    }, [listChecked]);

    const handleChangeAddress = () => {
        setIsOpenModalUpdateInfo(true);
    };

    // console.log(`listChecked:`, listChecked);
    const handleOnChangeCheckAllProducts = (e) => {
        if (e.target.checked) {
            const newListChecked = cartData.map((item) => item.key); // Lấy tất cả key từ cartData
            setListChecked(newListChecked);
        } else {
            setListChecked([]);
        }
    };

    const handleQuantityChange = (record, increment) => {
        if (increment === 1) {
            dispatch(increaseAmount({ idProduct: record.key }));
        } else {
            dispatch(decreaseAmount({ idProduct: record.key }));
        }
    };

    const handleRemoveProduct = (record) => {
        dispatch(removeOrderProduct({ idProduct: record.key }));
    };

    const handleRemoveAllOrder = () => {
        if (listChecked?.length > 1) {
            dispatch(removeAllOrderProduct({ listChecked }));
        }
    };

    const handleOnChangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddCard = () => {
        console.log("user: ", user);
        if (!user?.phone || !user?.address || !user?.name || !user?.city) {
            setIsOpenModalUpdateInfo(true);
        } else {
            navigate("/payment");
        }
    };

    const handleCancelUpdateInfo = () => {
        setStateUserDetails({
            name: "",
            phone: "",
            address: "",
            city: "",
        });
        form.resetFields();
        setIsOpenModalUpdateInfo(false);
    };

    //update  user
    const mutationUpdate = useMutationHooks((data) => {
        // console.log("data Updat:", data);
        const { id, token, ...rests } = data;
        const res = UserSevice.updateUser(id, { ...rests }, token);
        return res;
    });

    const { isLoading, data } = mutationUpdate;

    const handleUpdateInfoUser = () => {
        const { name, phone, address, city } = stateUserDetails;
        if (phone && address && name && city) {
            mutationUpdate.mutate(
                {
                    id: user?.id,
                    token: user?.access_token,
                    ...stateUserDetails,
                },
                {
                    onSuccess: () => {
                        setIsOpenModalUpdateInfo(false);
                        window.location.reload();
                    },
                }
            );
        }
        // console.log("stataUpdateInfo", stateUserDetails);
    };
    // console.log("data: ", data);

    const columns = [
        {
            title: (
                <Checkbox
                    onChange={handleOnChangeCheckAllProducts}
                    checked={listChecked?.length === cartData?.length}
                >
                    Tất cả ({cartData?.length}) sản phẩm
                </Checkbox>
            ),
            dataIndex: "image",
            render: (_, record) => (
                <>
                    <Checkbox
                        onChange={onChangeProduct}
                        value={record?.key}
                        checked={listChecked.includes(record.key)}
                    ></Checkbox>
                    <img
                        src={record.image}
                        alt="product"
                        style={{ width: 50, height: 50, marginLeft: "10px" }}
                    />
                </>
            ),
            width: "21%",
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            width: "22%",
            render: (text) =>
                text.length > 38 ? `${text.slice(0, 38)}...` : text,
        },
        {
            title: "Đơn giá",
            dataIndex: "price",
            render: (_, record) => {
                const discountPrice =
                    record.price * (1 - record.discount / 100); // Tính giá sau giảm
                return (
                    <>
                        <span>
                            {record.discount > 0 ? (
                                <>
                                    <span
                                        style={{
                                            textDecoration: "line-through",
                                            marginRight: 8,
                                            color: "#b8b8b8",
                                        }}
                                    >
                                        {convertPrice(record.price)}
                                    </span>
                                    <span>{convertPrice(discountPrice)}</span>
                                    <span
                                        style={{
                                            marginLeft: 3,
                                            color: "green",
                                        }}
                                    >
                                        ({record.discount}%)
                                    </span>
                                </>
                            ) : (
                                <span>{convertPrice(record.price)}</span>
                            )}
                        </span>
                    </>
                );
            },
            width: "24%",
        },

        {
            title: "Số lượng",
            dataIndex: "quantity",
            render: (_, record) => (
                <div
                    style={{
                        display: "flex",
                        gap: 5,
                    }}
                >
                    <Button
                        size="small"
                        disabled={record.quantity === 1}
                        onClick={() => handleQuantityChange(record, -1)}
                    >
                        <LineOutlined />
                    </Button>
                    <span
                        style={{
                            border: "1px solid #ccc",
                            width: "25px",
                            textAlign: "center",
                            borderRadius: "4px",
                        }}
                    >
                        {record.quantity}
                    </span>
                    <Button
                        size="small"
                        disabled={record.quantity >= record.countInStock}
                        onClick={() => handleQuantityChange(record, 1)}
                    >
                        <PlusOutlined />
                    </Button>
                </div>
            ),
        },
        {
            title: "Thành tiền",
            dataIndex: "total",
            render: (total) => (
                <span style={{ color: "red" }}>{convertPrice(total)}</span>
            ),
            width: "12%",
        },
        {
            title: (
                <Tooltip title="Xóa tất cả">
                    <DeleteOutlined
                        onClick={handleRemoveAllOrder}
                        style={{
                            color: "red",
                            fontSize: "17px",
                            cursor: "pointer",
                        }}
                    />
                </Tooltip>
            ),
            dataIndex: "action",
            render: (_, record) => (
                <DeleteOutlined
                    style={{ color: "black", cursor: "pointer" }}
                    onClick={() => handleRemoveProduct(record)}
                />
            ),
        },
    ];

    const priceMemo = useMemo(() => {
        return order?.orderItemsSlected?.reduce((total, cur) => {
            return total + cur.amount * cur.price; // Tổng giá chưa giảm
        }, 0);
    }, [order]);

    const priceDiscountMemo = useMemo(() => {
        return order?.orderItemsSlected?.reduce((total, cur) => {
            const discountRate = cur.discount || 0;
            return total + cur.amount * cur.price * (discountRate / 100); // Tổng tiền giảm giá
        }, 0);
    }, [order]);

    const diliveryPriceMemo = useMemo(() => {
        const totalAfterDiscount = priceMemo - priceDiscountMemo;
        return totalAfterDiscount === 0
            ? 0
            : totalAfterDiscount >= 500000
            ? 0
            : totalAfterDiscount > 200000
            ? 10000
            : 20000;
    }, [priceMemo, priceDiscountMemo]);

    const totalPriceMemo = useMemo(() => {
        return priceMemo - priceDiscountMemo + diliveryPriceMemo; // Tổng tiền cuối cùng
    }, [priceMemo, priceDiscountMemo, diliveryPriceMemo]);

    const totalSummary = useMemo(() => {
        return cartData
            .filter((item) => listChecked.includes(item.key)) // Lọc sản phẩm được chọn
            .reduce((sum, item) => sum + item.total, 0); // Tính tổng thành tiền của sản phẩm được chọn
    }, [cartData, listChecked]);

    const itemsDilivery = [
        {
            title: "20k",
            description: "Dưới 200k",
        },
        {
            title: "10k",
            description: "Từ 200k đến 500k",
            subTitle: "Left 00:00:08",
        },
        {
            title: "0k",
            description: "Trên 500k",
        },
    ];

    const currentStep = useMemo(() => {
        if (priceMemo === 0) {
            return -1;
        } else if (diliveryPriceMemo === 20000) {
            return 0;
        } else if (diliveryPriceMemo === 10000) {
            return 1;
        } else {
            return 2;
        }
    }, [priceMemo, diliveryPriceMemo]);

    return (
        <div style={{ margin: "80px 0", padding: "0 120px" }}>
            <h2>Giỏ hàng</h2>

            <div style={{ display: "flex", gap: 24 }}>
                <div style={{ flex: 3 }}>
                    <div
                        style={{
                            padding: "10px 0px",
                            backgroundColor: "#fff",
                            padding: " 10px",
                            borderRadius: 8,
                            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <StepComponent
                            items={itemsDilivery}
                            current={currentStep}
                        />
                    </div>
                    <hr />
                    <Table
                        columns={columns}
                        dataSource={cartData}
                        pagination={false}
                        summary={() => (
                            <Table.Summary>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell
                                        colSpan={4}
                                        style={{ textAlign: "right" }}
                                    >
                                        Tổng cộng
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                        <span
                                            style={{
                                                color: "red",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {convertPrice(totalSummary)} VND
                                        </span>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            </Table.Summary>
                        )}
                    />
                </div>
                <Card style={{ flex: 1 }}>
                    <div>
                        <span>Địa chỉ: </span>
                        <span
                            style={{ fontWeight: "bold" }}
                        >{`${user?.address} ${user?.city}  `}</span>
                        <span
                            onClick={handleChangeAddress}
                            style={{ color: "blue", cursor: "pointer" }}
                        >
                            Thay đổi
                        </span>
                    </div>
                    <hr />
                    <p>Tạm tính tien: {convertPrice(priceMemo)} VND</p>
                    {/* <p>Tạm tính: {convertPrice(summary.subTotal)} VND</p> */}
                    <p>Giảm giá tien: {convertPrice(priceDiscountMemo)} VND</p>
                    {/* <p>Giảm giá: {convertPrice(summary.discount)} VND</p> */}
                    <p>Thuế: 0</p>
                    <p>Phí giao hàng: {convertPrice(diliveryPriceMemo)} VND</p>
                    {/* <p>Phí giao hàng: {convertPrice(summary.shipping)} VND</p> */}
                    <hr />
                    <h3>
                        Tổng tiền:{" "}
                        <span style={{ color: "red" }}>
                            {convertPrice(totalPriceMemo)} VND
                            {/* {convertPrice(summary.total)} VND */}
                        </span>
                    </h3>
                    {/* <Tooltip title="Vui lòng chọn sản phẩm trước khi mua!"> */}
                    <Button
                        style={{
                            width: "100%",
                            height: "45px",
                            backgroundColor:
                                listChecked.length === 0 ? "#d9d9d9" : "red",
                            color: listChecked.length === 0 ? "gray" : "white",
                            // borderColor: "red",
                            marginTop: "20px",
                        }}
                        onClick={() => handleAddCard()}
                        disabled={listChecked.length === 0}
                    >
                        Mua hàng
                    </Button>
                    {/* </Tooltip> */}
                </Card>
            </div>
            <ModalComponent
                forceRender
                title="Cập nhập thông tin giao hàng"
                open={isOpenModalUpdateInfo}
                onOk={handleUpdateInfoUser}
                onCancel={handleCancelUpdateInfo}
            >
                {/* <Loading isLoading={isLoading}> */}
                <Form
                    form={form}
                    name="userDetails"
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                    style={{
                        maxWidth: 500,
                        marginTop: 30,
                    }}
                    // onFinish={onUpdateUser}
                    autoComplete="on"
                >
                    <Form.Item
                        label="Full Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please input your name!",
                            },
                        ]}
                    >
                        <InputComponent
                            value={stateUserDetails.name}
                            onChange={handleOnChangeDetails}
                            name="name"
                            // disabled
                        />
                    </Form.Item>

                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: "Please input your phone!",
                            },
                        ]}
                    >
                        <InputComponent
                            value={stateUserDetails.phone}
                            onChange={handleOnChangeDetails}
                            name="phone"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: "Please input your address!",
                            },
                        ]}
                    >
                        <InputComponent
                            value={stateUserDetails.address}
                            onChange={handleOnChangeDetails}
                            name="address"
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
                            value={stateUserDetails.email}
                            onChange={handleOnChangeDetails}
                            name="city"
                        />
                    </Form.Item>
                </Form>
                {/* </Loading> */}
            </ModalComponent>
        </div>
    );
};

export default OrderPage;
