import React, { useEffect, useState } from "react";
import {
    WrapperContainerLeft,
    WrapperContainerRight,
    WrapperTextLight,
} from "./style";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import InputFormComponent from "../../components/InputFormComponent/InputFormComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Image } from "antd";
import imageLogo from "../../assets/images/login.png";
import { useLocation, useNavigate } from "react-router";
import * as UserService from "../../services/UserSevice";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/Message/Message";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slides/useSlide";

const SignInPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const mutation = useMutationHooks((data) => UserService.loginUser(data));
    // console.log("mutation", mutation);

    const { data, isLoading, isSuccess } = mutation;
    console.log("object,", isLoading);

    useEffect(() => {
        console.log("isSuccess", isSuccess);
        if (isSuccess) {
            if (location?.state) {
                navigate(location?.state);
            } else {
                navigate("/");
            }

            // console.log("data", data);
            localStorage.setItem(
                "access_token",
                JSON.stringify(data?.access_token)
            );
            //deloy render.com
            localStorage.setItem(
                "refresh_token",
                JSON.stringify(data?.refresh_token)
            );
            //deloy
            if (data?.access_token) {
                const decoded = jwtDecode(data?.access_token);
                console.log("decoded", decoded);
                if (decoded?.id) {
                    handleGetDetailsUser(decoded?.id, data?.access_token);
                }
            }
        }
    }, [isSuccess]);

    const handleGetDetailsUser = async (id, token) => {
        //deloy render.com
        const storage = localStorage.getItem("refresh_token");
        const refreshToken = JSON.parse(storage);
        //deloy render.com
        console.log("Getting user details for ID:", id);
        const res = await UserService.getDetailsUser(id, token);
        dispatch(
            updateUser({ ...res?.data, access_token: token, refreshToken })
        );
        console.log("res", res);
    };

    const handleOnChangeEmail = (value) => {
        setEmail(value);
    };
    const handleOnChangePassword = (value) => {
        setPassword(value);
    };
    const handldSignIn = () => {
        mutation.mutate({ email, password });
        // console.log("signin", email, password);
    };

    const handleNavigateSignUp = () => {
        navigate("/sign-up");
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#ccc",
                height: "100vh",
            }}
        >
            <div
                style={{
                    width: "800px",
                    height: "445px",
                    borderRadius: "20px",
                    background: "#fff",

                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <WrapperContainerLeft>
                    <h1>Xin chao</h1>
                    <p>Đăng nhập hoặc tạo tài khoản</p>
                    <InputFormComponent
                        style={{ marginBottom: "10px" }}
                        placeholder="abc@gmail.com"
                        value={email}
                        onChange={handleOnChangeEmail}
                    />

                    <div style={{ position: "relative" }}>
                        <span
                            onClick={() => setIsShowPassword(!isShowPassword)}
                            style={{
                                zIndex: 10,
                                position: "absolute",
                                top: "4px",
                                right: "8px",
                            }}
                        >
                            {isShowPassword ? (
                                <EyeFilled />
                            ) : (
                                <EyeInvisibleFilled />
                            )}
                        </span>
                        <InputFormComponent
                            placeholder="password"
                            type={isShowPassword ? "text" : "password"}
                            value={password}
                            onChange={handleOnChangePassword}
                        />
                    </div>
                    {data?.status === "ERR" && (
                        <span style={{ color: "red" }}>{data?.message}</span>
                    )}
                    <ButtonComponent
                        disabled={!email.length || !password.length}
                        onClick={handldSignIn}
                        size={40}
                        styleButton={{
                            background: "rgb(255, 66, 78)",
                            color: "white",
                            margin: "20px 0 20px",
                            width: "100%",
                            height: "40px",
                        }}
                        textButton="Đăng nhập"
                    ></ButtonComponent>
                    <p>
                        <WrapperTextLight>Quên mật khẩu?</WrapperTextLight>
                    </p>
                    <p>
                        Chưa có tài khoản?{" "}
                        <WrapperTextLight onClick={handleNavigateSignUp}>
                            Tạo tài khoản
                        </WrapperTextLight>
                    </p>
                </WrapperContainerLeft>

                <WrapperContainerRight>
                    <Image
                        src={imageLogo}
                        preview={false}
                        alt="logo"
                        height="203px"
                        width="203px"
                    />
                    <strong>
                        <WrapperTextLight>Mua sắm tại Tiki</WrapperTextLight>
                    </strong>
                </WrapperContainerRight>
            </div>
        </div>
    );
};

export default SignInPage;
