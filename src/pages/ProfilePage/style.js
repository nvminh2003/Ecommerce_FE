import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h1`
    color: #000;
    font-size: 24px;
    margin: 4px 0;
    margin-top: 70px;
    padding: 0 120px;
`;

export const WrapperContentProfile = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    width: 600px;
    padding: 30px;
    width: 600px;
    margin: 0 auto;
    margin-top: 40px;
    border-radius: 10px;
    gap: 20px;
    background-color: #fff;
`;

export const WrapperLable = styled.label`
    color: #000;
    font-size: 14px;
    line-height: 30px;
`;

export const WrapperInput = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const WrapperUploadFile = styled(Upload)`
    & .ant-upload-list ant-upload-list-text {
    }
    & .ant-upload-list-item-container {
        display: none;
    }
`;
