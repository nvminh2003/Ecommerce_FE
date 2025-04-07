import { Badge, Col, Popover } from "antd";
import React, { useEffect, useState } from "react";
import {
    WrapperContentPopup,
    WrapperHeader,
    WrapperHeaderAccount,
    WrapperTextHeader,
    WrapperTextHeaderSmall,
} from "./style";
import {
    UserOutlined,
    CaretDownOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserSevice";
import { resetUser } from "../../redux/slides/useSlide";
import Loading from "../LoadingComponent/Loading";
import { searchProduct } from "../../redux/slides/productSlide";

const HeaderComponent = ({ isHidenSearch = false, isHidenCart = false }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userName, setUserName] = useState("");
    const [userAvartar, setUserAvartar] = useState("");
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [popoverOpen, setPopoverOpen] = useState(false); // Trạng thái mở Popover
    const order = useSelector((state) => state.order);
    const user = useSelector((state) => state.user);

    const handleNavigateLogin = () => {
        navigate("/sign-in");
    };

    const handleLogout = async () => {
        setLoading(true);
        navigate("/");
        await UserService.logoutUser();
        dispatch(resetUser());
        setLoading(false);
        setPopoverOpen(false); // Đóng Popover sau khi logout
    };

    useEffect(() => {
        setLoading(true);
        setUserName(user?.name);
        setUserAvartar(user?.avartar);
        setLoading(false);
    }, [user?.name, user?.avartar]);

    const handlePopoverClick = (path) => {
        navigate(path);
        setPopoverOpen(false); // Đóng Popover khi chuyển trang
    };

    const content = (
        <div>
            <WrapperContentPopup
                onClick={() => handlePopoverClick("/profile-user")}
            >
                Thông tin người dùng
            </WrapperContentPopup>
            {user?.isAdmin && (
                <WrapperContentPopup
                    onClick={() => handlePopoverClick("/system/admin")}
                >
                    Quản lý hệ thống
                </WrapperContentPopup>
            )}
            <WrapperContentPopup onClick={() => handlePopoverClick("/my-oder")}>
                Đơn hàng của tôi
            </WrapperContentPopup>
            <WrapperContentPopup onClick={handleLogout}>
                Đăng xuất
            </WrapperContentPopup>
        </div>
    );

    const onSearch = (e) => {
        setSearch(e.target.value);
        dispatch(searchProduct(e.target.value));
    };

    return (
        <div
            style={{
                width: "100%",
                background: "rgb(26, 148, 255)",
            }}
        >
            <WrapperHeader
                style={{
                    justifyContent:
                        isHidenSearch && isHidenCart
                            ? "space-between"
                            : "unset",
                }}
            >
                <Col span={5}>
                    <WrapperTextHeader
                        onClick={() => navigate("/")}
                        style={{ cursor: "pointer" }}
                    >
                        SHOP
                    </WrapperTextHeader>
                </Col>
                {!isHidenSearch && (
                    <Col span={13}>
                        <ButtonInputSearch
                            placeholder="input search text"
                            textButton="Tìm kiếm"
                            size="large"
                            loading
                            onChange={onSearch}
                        />
                    </Col>
                )}

                <Col
                    span={6}
                    style={{
                        display: "flex",
                        gap: "15px",
                        alignItems: "center",
                    }}
                >
                    <Loading isLoading={loading}>
                        <WrapperHeaderAccount>
                            {userAvartar ? (
                                <img
                                    src={userAvartar}
                                    alt="avartar"
                                    style={{
                                        height: "30px",
                                        width: "30px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        border: "1px solid #fff",
                                    }}
                                />
                            ) : (
                                <UserOutlined style={{ fontSize: "30px" }} />
                            )}

                            {user?.access_token ? (
                                <>
                                    <Popover
                                        content={content}
                                        trigger="click"
                                        open={popoverOpen}
                                        onOpenChange={(open) =>
                                            setPopoverOpen(open)
                                        }
                                    >
                                        <div style={{ cursor: "pointer" }}>
                                            {userName?.length
                                                ? userName
                                                : user?.email}
                                        </div>
                                    </Popover>
                                </>
                            ) : (
                                <div
                                    onClick={handleNavigateLogin}
                                    style={{ cursor: "pointer" }}
                                >
                                    <WrapperTextHeaderSmall>
                                        Đăng nhập/ Đăng ký
                                    </WrapperTextHeaderSmall>
                                    <div>
                                        <WrapperTextHeaderSmall>
                                            Tài khoản
                                        </WrapperTextHeaderSmall>
                                        <CaretDownOutlined />
                                    </div>
                                </div>
                            )}
                        </WrapperHeaderAccount>
                    </Loading>
                    {!isHidenCart && (
                        <div
                            onClick={() => navigate("/order")}
                            style={{ cursor: "pointer" }}
                        >
                            <Badge
                                count={order?.orderItems?.length}
                                size="small"
                            >
                                <ShoppingCartOutlined
                                    style={{ fontSize: "30px", color: "#fff" }}
                                />
                            </Badge>
                            <WrapperTextHeaderSmall>
                                Giỏ hàng
                            </WrapperTextHeaderSmall>
                        </div>
                    )}
                </Col>
            </WrapperHeader>
        </div>
    );
};

export default HeaderComponent;
