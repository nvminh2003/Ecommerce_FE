import { Button, Col } from "antd";
import styled from "styled-components";

export const WrapperProducts = styled.div`
    display: flex;
    gap: 20px;
    // flex-wrap: wrap;
`;

export const WrapperNavbar = styled(Col)`
    padding: 10px;
    background: #fff;
    margin-right: 20px;
    border-radius: 4px;
    height: fit-content;
    width: 200px;
`;

export const WrapperNavbaQuantity = styled.div`
    display: "flex";
    justifycontent: "center";
    gap: "8px";
    alignitems: "center";
`;

export const quantityControl = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    background-color: #fff;
`;

export const quantityBtn = styled(Button)`
    width: 32px;
    height: 32px;
    font-size: 16px;
    background: #f0f0f0;
    border: none;
    cursor: pointer;
    outline: none;
    text-align: center;
`;

export const quantityDisplay = styled.span`
    border: "1px solid #ccc";
    borderradius: "5px";
    width: "100%";
    textalign: "center";
    backgroundcolor: "white";
`;
