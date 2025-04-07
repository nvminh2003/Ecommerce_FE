import React, { useCallback, useEffect, useRef, useState } from "react";
import { WrapperHeader } from "./style";
import { Button, Form, Space } from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import * as UserSevice from "../../services/UserSevice";
import * as message from "../../components/Message/Message";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import ModalComponent from "../ModalComponent/ModalComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../LoadingComponent/Loading";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { WrapperUploadFile } from "../../pages/ProfilePage/style";
import { getBase64 } from "../../utils";

const AdminUser = () => {
    const [rowSelected, setRowSelected] = useState("");
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const user = useSelector((state) => state?.user);
    const [isModalDelete, setIsModalDelete] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    const [stateUserDetails, setStateUserDetails] = useState({
        name: "",
        email: "",
        isAdmin: false,
        phone: "",
        avartar: "",
        address: "",
    });

    //update  user
    const mutationUpdate = useMutationHooks((data) => {
        console.log("data Updat:", data);
        const { id, token, ...rests } = data;
        const res = UserSevice.updateUser(id, { ...rests }, token);
        return res;
    });

    //delete user
    const mutationDelete = useMutationHooks((data) => {
        const { id, token } = data;
        const res = UserSevice.deleteUser(id, token);
        return res;
    });

    //delete all user
    const mutationDeleteMany = useMutationHooks((data) => {
        const { token, ids } = data;
        const res = UserSevice.deleteManyUser({ ids }, token);
        return res;
    });
    // console.log("mutationDeleteMany", mutationDeleteMany);

    const getAllUsers = async () => {
        const res = await UserSevice.getAllUser(user?.access_token);
        console.log("resUser: ", res);
        return res;
    };

    const [form] = Form.useForm();

    const handleCloseDrawer = useCallback(() => {
        setIsOpenDrawer(false);
        setStateUserDetails({
            name: "",
            email: "",
            isAdmin: false,
            phone: "",
            avartar: "",
            address: "",
        });
        form.resetFields();
    }, [form]);

    //update product
    const {
        data: dataUpdated,
        isSuccess: isSuccessUpdated,
        isError: isErrorUpdated,
    } = mutationUpdate;

    //delete product
    const {
        data: dataDeleted,
        isSuccess: isSuccessDeleted,
        isError: isErrorDeleted,
    } = mutationDelete;
    // console.log("data", data);

    //delete many user
    const {
        data: dataDeletedMany,
        isLoading: isLoadingDeletedMany,
        isSuccess: isSuccessDeletedMany,
        isError: isErrorDeletedMany,
    } = mutationDeleteMany;

    const queryUser = useQuery({
        queryKey: ["users"],
        queryFn: getAllUsers,
    });
    const { isLoading: isLoadingUsers, data: users = [] } = queryUser;

    //delete product
    // useEffect(() => {
    //     if (isSuccessDeleted && dataDeleted?.status === "OK") {
    //         message.success("Xóa sản phẩm thành công!");
    //         handleCancelDelete();
    //     } else if (isErrorDeleted) {
    //         message.error("Xóa sản phẩm thất bại!");
    //     }
    // }, [isSuccessDeleted, isErrorDeleted, dataDeleted?.status]);

    //update product
    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === "OK") {
            message.success("Cập nhật thành công!");
            handleCloseDrawer();
            // mutationUpdate.reset();
        } else if (isErrorUpdated) {
            message.error("Cập nhật thất bại!");
        }
    }, [
        isSuccessUpdated,
        isErrorUpdated,
        dataUpdated?.status,
        handleCloseDrawer,
    ]);

    //delete many user
    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
            message.success("Xóa user thành công!");
            handleDeleteManyUser();
        } else if (isErrorDeletedMany) {
            message.error("Xóa user thất bại!");
        }
    }, [isSuccessDeletedMany, isErrorDeletedMany, dataDeletedMany?.status]);

    //update product
    // const handleCloseDrawer = () => {
    //     setIsOpenDrawer(false);
    //     setStateUserDetails({
    //         name: "",
    //         email: "",
    //         isAdmin: false,
    //         phone: "",
    //     });
    //     form.resetFields();
    // };

    //get details of user
    const handleOnChangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value,
        });
        console.log("e.target", e.target.name, e.target.value);
    };

    console.log("state - user:", stateUserDetails);
    //details of user
    useEffect(() => {
        // if (stateUserDetails) {
        form.setFieldsValue(stateUserDetails);
        // }
    }, [form, stateUserDetails]);

    //details of product
    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true);
            fetchGetDetailsUser(rowSelected);
        }
    }, [rowSelected, isOpenDrawer]);

    const handleDetailsUser = () => {
        setIsOpenDrawer(true);
    };

    //details of product
    const fetchGetDetailsUser = async (rowSelected) => {
        const res = await UserSevice.getDetailsUser(rowSelected);
        console.log("Fetched User Details:", res); // Log the response
        if (res?.data) {
            setStateUserDetails({
                name: res?.data?.name,
                email: res?.data?.email,
                phone: res?.data?.phone,
                isAdmin: res?.data?.isAdmin,
                address: res?.data?.address,
                avartar: res?.data?.avartar,
            });
        }
        setIsLoadingUpdate(false);
    };

    const handleOnChangeImageAvartar = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUserDetails({
            ...stateUserDetails,
            avartar: file.preview,
        });
    };

    //delete product
    const handleCancelDelete = () => {
        setIsModalDelete(false);
        // console.log("handleDeteleProduct", rowSelected);
    };

    //delete product
    const handleDeleteUser = () => {
        mutationDelete.mutate(
            { id: rowSelected, token: user?.access_token },
            {
                onSettled: () => {
                    queryUser.refetch();
                },
            }
        );
    };

    //delete many product
    const handleDeleteManyUser = (ids) => {
        mutationDeleteMany.mutate(
            { ids: ids, token: user?.access_token },
            {
                onSettled: () => {
                    queryUser.refetch();
                },
            }
        );
    };

    const renderAction = () => {
        return (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <DeleteOutlined
                    style={{
                        color: "red",
                        fontSize: "20px",
                        cursor: "pointer",
                    }}
                    onClick={() => setIsModalDelete(true)}
                />
                <EditOutlined
                    style={{
                        color: "orange",
                        fontSize: "20px",
                        cursor: "pointer",
                    }}
                    onClick={handleDetailsUser}
                />
            </div>
        );
    };

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
                    {/* <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button> */}
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
        onFilter: (value, record) => {
            const recordValue = record[dataIndex] || ""; // Xử lý giá trị null hoặc undefined
            return recordValue
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase());
        },
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            sorter: (a, b) => {
                const nameA = a.name?.toString().toLowerCase() || ""; // Xử lý giá trị null/undefined
                const nameB = b.name?.toString().toLowerCase() || "";
                return nameA.localeCompare(nameB); // Sắp xếp theo thứ tự alphabet
            },
            ...getColumnSearchProps("name"),
            width: "15%",
        },
        {
            title: "Email",
            dataIndex: "email",
            sorter: (a, b) => a.email.length - b.email.length,
            ...getColumnSearchProps("email"),
            width: "20%",
        },
        {
            title: "Admin",
            dataIndex: "isAdmin",
            filters: [
                {
                    text: "True",
                    value: true,
                },
                {
                    text: "False",
                    value: false,
                },
            ],
            onFilter: (value, record) => {
                if (value === true) {
                    return record.isAdmin === "True";
                }
                return record.isAdmin === "False";
            },
        },

        {
            title: "Phone",
            dataIndex: "phone",
            ...getColumnSearchProps("phone"),
            width: "15%",
        },
        {
            title: "Address",
            dataIndex: "address",
            ...getColumnSearchProps("address"),
        },
        {
            title: "City",
            dataIndex: "city",
        },
        {
            title: "Action",
            dataIndex: "action",
            render: renderAction,
        },
    ];

    const dataTable =
        users?.data?.length &&
        users?.data?.map((u) => {
            return { ...u, key: u._id, isAdmin: u.isAdmin ? "True" : "False" };
        });
    console.log("dataTable", dataTable);

    const onUpdateUser = (values) => {
        console.log("State User Data for Update:", values);
        mutationUpdate.mutate(
            {
                id: rowSelected,
                token: user?.access_token,
                ...values,
            },
            {
                onSettled: () => {
                    queryUser.refetch();
                },
            }
        );
    };
    return (
        <div>
            <WrapperHeader>Quản lý người dùng</WrapperHeader>
            <div style={{ margin: "15px 0" }}>
                <div>
                    <TableComponent
                        handleDeleteMany={handleDeleteManyUser}
                        columns={columns}
                        isLoading={isLoadingUsers}
                        data={dataTable}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: (event) => {
                                    setRowSelected(record._id);
                                },
                            };
                        }}
                    />
                </div>
                <DrawerComponent
                    title="Chi tiết người dùng"
                    isOpen={isOpenDrawer}
                    onClose={() => setIsOpenDrawer(false)}
                    width="60%"
                >
                    <Loading isLoading={isLoadingUpdate}>
                        <Form
                            form={form}
                            name="userDetails"
                            labelCol={{
                                span: 10,
                            }}
                            wrapperCol={{
                                span: 14,
                            }}
                            style={{
                                maxWidth: 600,
                            }}
                            onFinish={onUpdateUser}
                            autoComplete="on"
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
                                    value={stateUserDetails.name}
                                    onChange={handleOnChangeDetails}
                                    name="name"
                                    // disabled
                                />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your email!",
                                    },
                                ]}
                            >
                                <InputComponent
                                    value={stateUserDetails.email}
                                    onChange={handleOnChangeDetails}
                                    name="email"
                                />
                            </Form.Item>

                            <Form.Item label="Is Admin" name="isAdmin">
                                <Radio.Group
                                    onChange={(e) => {
                                        setStateUserDetails({
                                            ...stateUserDetails,
                                            isAdmin: e.target.value,
                                        });
                                    }}
                                    value={stateUserDetails.isAdmin}
                                >
                                    <Radio value={true}>True</Radio>
                                    <Radio value={false}>False</Radio>
                                </Radio.Group>
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

                            <Form.Item label="Avartar" name="avartar">
                                <WrapperUploadFile
                                    onChange={handleOnChangeImageAvartar}
                                    maxCount={1}
                                >
                                    <Button>Select File</Button>
                                    {stateUserDetails?.avartar && (
                                        <img
                                            src={stateUserDetails?.avartar}
                                            style={{
                                                height: "64px",
                                                width: "64px",
                                                borderRadius: "15%",
                                                objectFit: "cover",
                                                marginLeft: "10px",
                                            }}
                                            alt="image-avartar"
                                        />
                                    )}
                                </WrapperUploadFile>
                            </Form.Item>

                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    Apply
                                </Button>
                            </Form.Item>
                        </Form>
                    </Loading>
                </DrawerComponent>

                <ModalComponent
                    forceRender
                    title="Xóa nguời dùng"
                    open={isModalDelete}
                    onOk={handleDeleteUser}
                    onCancel={handleCancelDelete}
                >
                    <div>Bạn có muốn xóa user không!</div>
                </ModalComponent>
            </div>
        </div>
    );
};

export default AdminUser;
