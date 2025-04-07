import { InputNumber } from "antd";
import styled from "styled-components";

export const WrapperStyleImageSmall = styled.div`
    height: 64px;
    width: 64px;
`;

export const WrapperStyleNameProduct = styled.h1`
    color: rgb(36, 36, 36);
    font-size: 25px;
    font-weight: 500;
    line-height: 32px;
    word-break: break-word;
    margin-top: 10px;
`;

export const WrapperPriceProduct = styled.div`
    background: rgb(250, 250, 250);
    border-radius: 4px;
    color: rgb(255, 66, 78);
`;

export const WrapperPriceTextProduct = styled.h1`
    font-size: 25px;
    line-height: 40px;
    margin-right: 8px;
    font-weight: 600;
    padding: 0 10px;
    margin-top: 10px;
`;

export const WrapperAddressProduct = styled.div`
    span.address {
        text-decoration: underline;
        font-size: 20px;
        line-height: 30px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    span.change-address {
        color: rgb(10, 104, 255);
        font-size: 20px;
        line-height: 24px;
        font-weight: 500;
    }
    border-block: 1px solid #e5e5e5;
    padding: 10px 0;
`;

export const WrapperQualityProduct = styled.h2`
    margin-top: 10px;
`;

export const WrapperBtQualityProduct = styled.div`
    display: flex;
    margin-top: 15px;
`;

export const WrapperInputNumber = styled(InputNumber)`
    .ant-input-number.ant-input-number-sm {
        width: 30px;
    }
`;

export const WrapperDiscountPriceText = styled.span`
    font-size: 12px;
    background-color: #f5f5fa;
    border-radius: 8px;
`;
