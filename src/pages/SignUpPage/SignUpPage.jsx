import React, { useEffect, useState } from "react";
import {
    WrapperContainerLeft,
    WrapperContainerRight,
    WrapperTextLight,
} from "../SignInPage/style";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";

import InputFormComponent from "../../components/InputFormComponent/InputFormComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Image } from "antd";
import imageLogo from "../../assets/images/login.png";
import { useNavigate } from "react-router";
import * as UserService from "../../services/UserSevice";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";

const SignUpPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    const mutation = useMutationHooks((data) => UserService.signUpUser(data));
    console.log("mutation", mutation);

    const { data, isLoading, isSuccess, isError } = mutation;

    useEffect(() => {
        if (isSuccess) {
            message.success("Tạo tài khoản thành công!");
            handleNavigateSignIn();
        } else if (isError) {
            message.error("Tạo tài khoản thất bại!");
        }
    }, [isSuccess, isError]);
    // useEffect(() => {
    //     if (isSuccess) {
    //         handleNavigateSignIn();
    //         message.success();
    //     } else if (isError) {
    //         message.error();
    //     }
    // }, [isSuccess, isError]);
    const handleOnChangeEmail = (value) => {
        setEmail(value);
    };
    const handleOnChangePassword = (value) => {
        setPassword(value);
    };
    const handleOnChangeConfirmPassword = (value) => {
        setConfirmPassword(value);
    };
    const handldSignUp = () => {
        mutation.mutate({ email, password, confirmPassword });
        console.log("signUp", email, password, confirmPassword);
    };

    const handleNavigateSignIn = () => {
        navigate("/sign-in");
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
                            style={{ marginBottom: "10px" }}
                            placeholder="password"
                            type={isShowPassword ? "text" : "password"}
                            value={password}
                            onChange={handleOnChangePassword}
                        />
                    </div>
                    <div style={{ position: "relative" }}>
                        <span
                            onClick={() =>
                                setIsShowConfirmPassword(!isShowConfirmPassword)
                            }
                            style={{
                                zIndex: 10,
                                position: "absolute",
                                top: "4px",
                                right: "8px",
                            }}
                        >
                            {isShowConfirmPassword ? (
                                <EyeFilled />
                            ) : (
                                <EyeInvisibleFilled />
                            )}
                        </span>
                        <InputFormComponent
                            placeholder="comfirm password"
                            type={isShowConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={handleOnChangeConfirmPassword}
                        />
                    </div>
                    {data?.status === "ERR" && (
                        <span style={{ color: "red" }}>{data?.message}</span>
                    )}
                    {/* <Loading isLoading={isLoading}> */}
                    <ButtonComponent
                        disabled={
                            !email.length ||
                            !password.length ||
                            !confirmPassword.length
                        }
                        onClick={handldSignUp}
                        size={40}
                        styleButton={{
                            background: "rgb(255, 66, 78)",
                            color: "white",
                            margin: "20px 0 20px",
                            width: "100%",
                            height: "40px",
                        }}
                        textButton="Đăng ký"
                        type="submit"
                    ></ButtonComponent>
                    {/* </Loading> */}
                    <p>
                        Bạn đã có tài khoản?{" "}
                        <WrapperTextLight onClick={handleNavigateSignIn}>
                            Đăng nhập
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

export default SignUpPage;
