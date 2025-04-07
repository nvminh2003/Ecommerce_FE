import React, { useEffect, useState } from "react";
import {
    WrapperContentProfile,
    WrapperHeader,
    WrapperInput,
    WrapperLable,
    WrapperUploadFile,
} from "./style";
import InputFormComponent from "../../components/InputFormComponent/InputFormComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserSevice";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slides/useSlide";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils";

const ProfilePage = () => {
    const user = useSelector((state) => state.user);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [avartar, setAvartar] = useState("");
    const mutation = useMutationHooks((data) => {
        const { id, access_token, ...rests } = data;
        UserService.updateUser(id, rests, access_token);
    });
    const dispatch = useDispatch();
    const { data, isLoading, isSuccess, isError } = mutation;

    useEffect(() => {
        setName(user?.name);
        setEmail(user?.email);
        setPhone(user?.phone);
        setAddress(user?.address);
        setAvartar(user?.avartar);
    }, [user]);
    console.log("data", data);

    useEffect(() => {
        if (isSuccess) {
            message.success("Cập nhật thành công");
            handleGetDetailsUser(user?.id, user.access_token);
        } else if (isError) {
            message.error("Cập nhật thất bại");
        }
        console.log("update", name, email, phone, address, avartar);
    }, [isError, isSuccess]);

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token);
        dispatch(updateUser({ ...res?.data, access_token: token }));
        console.log("res", res);
    };

    const handleOnChangeName = (value) => {
        setName(value);
    };
    const handleOnChangeEmail = (value) => {
        setEmail(value);
    };
    const handleOnChangePhone = (value) => {
        setPhone(value);
    };
    const handleOnChangeAddress = (value) => {
        setAddress(value);
    };
    const handleOnChangeAvartar = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvartar(file.preview);
    };

    const handldUpdate = () => {
        mutation.mutate({
            id: user?.id,
            name,
            email,
            phone,
            address,
            avartar,
            access_token: user?.access_token,
        });
    };

    return (
        <div style={{ margin: "0 auto", height: "500px" }}>
            <WrapperHeader>Thông tin người dùng</WrapperHeader>
            {/* <Loading isLoading={isLoading}> */}
            <WrapperContentProfile>
                <WrapperInput>
                    <WrapperLable htmlFor="name">Name:</WrapperLable>
                    <InputFormComponent
                        style={{ width: "300px" }}
                        placeholder="Họ và tên"
                        id="name"
                        value={name}
                        onChange={handleOnChangeName}
                    />
                    <ButtonComponent
                        onClick={handldUpdate}
                        size={40}
                        styleButton={{
                            background: "#00a0ff",
                            color: "white",
                            margin: "10px 0",
                            width: "fit-content",
                            height: "40px",
                        }}
                        textButton="Cập nhật"
                    ></ButtonComponent>
                </WrapperInput>
                <WrapperInput>
                    <WrapperLable htmlFor="email">Email</WrapperLable>
                    <InputFormComponent
                        style={{ width: "300px" }}
                        placeholder="Nhậtp email.."
                        id="email"
                        value={email}
                        onChange={handleOnChangeEmail}
                    />
                    <ButtonComponent
                        onClick={handldUpdate}
                        size={40}
                        styleButton={{
                            background: "#00a0ff",
                            color: "white",
                            margin: "10px 0 10px",
                            width: "fit-content",
                            height: "40px",
                        }}
                        textButton="Cập nhật"
                    ></ButtonComponent>
                </WrapperInput>
                <WrapperInput>
                    <WrapperLable htmlFor="phone">Phone:</WrapperLable>
                    <InputFormComponent
                        style={{ width: "300px" }}
                        placeholder="Nhận số điện thoại.."
                        id="phone"
                        value={phone}
                        onChange={handleOnChangePhone}
                    />
                    <ButtonComponent
                        onClick={handldUpdate}
                        size={40}
                        styleButton={{
                            background: "#00a0ff",
                            color: "white",
                            margin: "10px 0 10px",
                            width: "fit-content",
                            height: "40px",
                        }}
                        textButton="Cập nhật"
                    ></ButtonComponent>
                </WrapperInput>
                <WrapperInput>
                    <WrapperLable htmlFor="address">Address:</WrapperLable>
                    <InputFormComponent
                        style={{ width: "300px" }}
                        placeholder="Nhập địa chỉ.."
                        id="address"
                        value={address}
                        onChange={handleOnChangeAddress}
                    />
                    <ButtonComponent
                        onClick={handldUpdate}
                        size={40}
                        styleButton={{
                            background: "#00a0ff",
                            color: "white",
                            margin: "10px 0 10px",
                            width: "fit-content",
                            height: "40px",
                        }}
                        textButton="Cập nhật"
                    ></ButtonComponent>
                </WrapperInput>
                <WrapperInput>
                    <WrapperLable htmlFor="avartar">Avartar:</WrapperLable>
                    <WrapperUploadFile
                        onChange={handleOnChangeAvartar}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </WrapperUploadFile>
                    {avartar && (
                        <img
                            src={avartar}
                            style={{
                                height: "64px",
                                width: "64px",
                                borderRadius: "50%",
                                objectFit: "cover",
                            }}
                            alt="avartar"
                        />
                    )}
                    <ButtonComponent
                        onClick={handldUpdate}
                        size={40}
                        styleButton={{
                            background: "#00a0ff",
                            color: "white",
                            margin: "10px 0 10px",
                            width: "fit-content",
                            height: "40px",
                        }}
                        textButton="Cập nhật"
                    ></ButtonComponent>
                </WrapperInput>
            </WrapperContentProfile>
            {/* </Loading> */}
        </div>
    );
};

export default ProfilePage;
