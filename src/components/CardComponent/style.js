import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyple = styled(Card)`
    padding: 1px;
    width: 243px;
    & img {
        height: 200px;
        width: 200px;
    }
    position: relative;
    .ant-card-body {
        padding: 10px;
    }
`;
export const StyleNameProduct = styled.div`
    font-weight: 400;
    font-size: 18px;
    color: rgb(56, 56, 61);
`;

export const WrapperReportText = styled.div`
    font-size: 11px;
    display: flex;
    align-items: center;
    color: rgb(128, 128, 137);
`;

export const WrapperPriceText = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: rgb(255, 66, 78);
`;

export const WrapperDiscountPriceText = styled.span`
    font-size: 12px;
    background-color: #f5f5fa;
    border-radius: 8px;
`;

export const WrapperStyleTextSell = styled.span`
    color: rgb(120, 120, 120);
    font-size: 15px;
    font-height: 500;
`;

export const WrapperTextPrice = styled.span`
    width: 100%;
    padding: 0 10px;
    color: #808089;
    text-decoration-line: line-through;
    font-size: 11px;
    font-style: normal;
`;
