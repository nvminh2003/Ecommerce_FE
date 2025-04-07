import React, { useRef } from "react";
import { WrapperHeader } from "./style";
import { Button, Space, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import * as OrderSevice from "../../services/OrderService";
import * as message from "../../components/Message/Message";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import Loading from "../LoadingComponent/Loading";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { orderContant } from "../../contant";
import PieChartComponent from "./PieChart";
import { convertPrice } from "../../utils";

const OrderAdmin = () => {
    const user = useSelector((state) => state?.user);
    const searchInput = useRef(null);

    const getAllOrders = async () => {
        const res = await OrderSevice.getAllOrder(user?.access_token);
        // console.log("resUser: ", res);
        return res;
    };

    const queryOrder = useQuery({
        queryKey: ["orders"],
        queryFn: getAllOrders,
    });
    const { isLoading: isLoadingOrders, data: orders = [] } = queryOrder;

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        // setSearchText(selectedKeys[0]);
        // setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        // setSearchText("");
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1677ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const columns = [
        {
            title: "User name",
            dataIndex: "userName",
            sorter: (a, b) => a.userName.length - b.userName.length,
            ...getColumnSearchProps("userName"),
            // width: "15%",
        },
        {
            title: "Phone",
            dataIndex: "phone",
            ...getColumnSearchProps("phone"),
            // width: "15%",
        },
        {
            title: "Address",
            dataIndex: "address",
            ...getColumnSearchProps("address"),
        },
        {
            title: "Total Price",
            dataIndex: "totalPrice",
            render: (totalPrice) => convertPrice(totalPrice),
            sorter: (a, b) => a.totalPrice - b.totalPrice,
            filters: [
                {
                    text: ">= 10.000.000",
                    value: ">=",
                },
                {
                    text: "<=  10.000.000",
                    value: "<=",
                },
            ],
            onFilter: (value, record) => {
                if (value === ">=") {
                    return record.totalPrice >= 10000000;
                }
                return record.totalPrice <= 10000000;
            },
        },
        {
            title: "Paided",
            dataIndex: "isPaid",
            filters: [
                {
                    text: "Đã thanh toán",
                    value: true,
                },
                {
                    text: "Chưa thanh toán",
                    value: false,
                },
            ],
            onFilter: (value, record) => {
                if (value === true) {
                    return record.isPaid === "Đã thanh toán";
                }
                return record.isPaid === "Chưa thanh toán";
            },
        },
        {
            title: "Payment Method",
            dataIndex: "paymentMethod",
        },
        {
            title: "Shipped",
            dataIndex: "isDelivered",
            filters: [
                {
                    text: "Đã nhận hàng",
                    value: true,
                },
                {
                    text: "Chưa nhận hàng",
                    value: false,
                },
            ],
            onFilter: (value, record) => {
                if (value === true) {
                    return record.isDelivered === "Đã nhận hàng";
                }
                return record.isDelivered === "Chưa nhận hàng";
            },
        },
    ];

    const dataTable =
        orders?.data?.length &&
        orders?.data?.map((order) => {
            // console.log("users: ", order);
            return {
                ...order,
                key: order._id,
                totalPrice: order?.totalPrice,
                itemPrice: order?.itemsPrice,
                isPaid: order.isPaid ? "Đã thanh toán" : "Chưa thanh toán",
                paymentMethod: orderContant.payment[order.paymentMethod],
                isDelivered: order?.isDelivered
                    ? "Đã nhận hàng"
                    : "Chưa nhận hàng",
                userName: order.shippingAddress?.fullName,
                phone: order.shippingAddress?.phone,
                address: order.shippingAddress?.address,
            };
        });
    console.log("dataTable", dataTable);

    return (
        <div>
            <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
            <div style={{ height: 200, width: 300 }}>
                <PieChartComponent data={orders?.data} />
            </div>

            <div style={{ margin: "15px 0" }}>
                <div>
                    <Loading isLoading={isLoadingOrders}>
                        <Table
                            columns={columns}
                            dataSource={dataTable}
                            pagination={{ pageSize: 10 }}
                            // rowKey="key"
                        />
                    </Loading>
                </div>
            </div>
        </div>
    );
};

export default OrderAdmin;
