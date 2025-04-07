import styled from "styled-components";

// Container chính
export const Container = styled.div`
    max-width: 1200px;
    margin: 80px auto;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

// Thẻ đơn hàng
export const OrderCard = styled.div`
    background: #ffffff;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 10px;
`;

// Header đơn hàng
export const OrderHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: 600;
    color: #333;
`;

// Tag trạng thái
export const StatusTag = styled.span`
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    margin-left: 8px;
    color: ${(props) => (props.$status ? "#52c41a" : "#ff4d4f")};
    background: ${(props) => (props.$status ? "#f6ffed" : "#fff1f0")};
    border: 1px solid ${(props) => (props.$status ? "#b7eb8f" : "#ffa39e")};
`;

// Body của thẻ đơn hàng
export const OrderBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

// Danh sách sản phẩm trong đơn hàng
export const ProductList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

// Sản phẩm trong danh sách
export const ProductItem = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
`;

// Hình ảnh sản phẩm
export const ProductImage = styled.img`
    width: 60px;
    height: 60px;
    object-fit: cover;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
`;

// Tên sản phẩm
export const ProductName = styled.div`
    flex: 1;
    font-size: 14px;
    color: #333;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

// Giá sản phẩm
export const ProductPrice = styled.div`
    font-size: 14px;
    font-weight: bold;
    color: #1890ff;
`;

// Footer của thẻ đơn hàng
export const OrderFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

// Tổng số tiền
export const TotalAmount = styled.div`
    font-size: 16px;
    font-weight: bold;
    color: red;
`;

// Nhóm nút hành động
export const ActionButtons = styled.div`
    display: flex;
    gap: 10px;

    button {
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            opacity: 0.9;
        }
    }
`;
