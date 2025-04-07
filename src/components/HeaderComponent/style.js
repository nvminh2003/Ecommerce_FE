import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
    // padding: 10px 120px;
    // background-color: #00a0ff;
    // align-items: center;
    padding: 10px 120px;
    background-color: #51a7bf;
    align-items: center;
    position: fixed; // Đặt header ở vị trí cố định
    top: 0; // Đặt nó ở trên cùng của trang
    left: 0;
    right: 0;
    z-index: 1000; // Z-index lớn để nó nằm trên các nội dung khác
    width: 100%; // Đảm bảo header bao phủ toàn bộ chiều rộng của trang
`;

export const WrapperTextHeader = styled.span`
    color: white;
    font-size: 24px;
    font-weight: bold;
`;

export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 10px;
    font-size: 12px;
    margin-left: 35px;
`;

export const WrapperTextHeaderSmall = styled.span`
    color: #fff;
    gap: 10px;
    font-size: 12px;
`;

export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover {
        background: rgb(26, 148, 255);
        color: #fff;
    }
`;
