import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    // gap: 25px;
    // justify-content: flex-start;
    height: 45px;
`;

export const WrapperButtonMore = styled(ButtonComponent)`
    &:hover {
        color: #fff;
        background: rgb(13, 92, 182);
        span {
            color: #fff;
        }
    }

    &:disabled {
        background: #e0e0e0; // Màu nền khi nút bị vô hiệu hóa
        color: #b0b0b0; // Màu chữ khi nút bị vô hiệu hóa
        cursor: not-allowed; // Đổi kiểu con trỏ thành not-allowed
        &:hover {
            background: #e0e0e0; // Màu nền không thay đổi khi hover khi bị vô hiệu hóa
            color: #b0b0b0; // Màu chữ không thay đổi khi hover
            span {
                color: #b0b0b0; // Màu chữ của span khi hover trên nút vô hiệu hóa
            }
        }
    }
`;

export const WrapperProducts = styled.div`
    margin-top: 20px;
    display: flex;
    // justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
`;
