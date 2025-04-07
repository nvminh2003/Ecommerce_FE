import { axiosJWT } from "./UserSevice";

export const createOrder = async (data, access_token) => {
    console.log("access_token: ", access_token, data);
    const res = await axiosJWT.post(
        `${process.env.REACT_APP_API_URL_BACKEND}/order/create-payment/${data.user}`,
        data,
        {
            headers: {
                token: `Bearer: ${access_token}`,
            },
        }
    );
    return res.data;
};

export const getOrderByUserId = async (id, access_token) => {
    const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/order/get-all-order/${id}`,
        {
            headers: {
                token: `Bearer: ${access_token}`,
            },
        }
    );
    console.log("API Response:", res);
    return res.data;
};

export const getDetailsOrder = async (id, access_token) => {
    const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/order/get-details-order/${id}`,
        {
            headers: {
                token: `Bearer: ${access_token}`,
            },
        }
    );
    console.log("API Response:", res);
    return res.data;
};

// export const getDetailsOrder = async (id, access_token) => {
//     if (!id || !access_token) {
//         console.error("Invalid parameters for getDetailsOrder:", {
//             id,
//             access_token,
//         });
//         throw new Error("Missing required parameters: id or access_token");
//     }

//     try {
//         const res = await axiosJWT.get(
//             `${process.env.REACT_APP_API_URL_BACKEND}/order/get-details-order/${id}`,
//             {
//                 headers: {
//                     token: `Bearer ${access_token}`, // Correct token format
//                 },
//             }
//         );
//         console.log("API Response (getDetailsOrder):", res.data);
//         return res.data;
//     } catch (error) {
//         console.error(
//             "Error fetching order details:",
//             error.response?.data || error.message
//         );
//         throw error; // Re-throw error for the caller to handle
//     }
// };

export const cancelOrder = async (id, access_token, orderItems, userId) => {
    const data = { orderItems, orderId: id };
    const res = await axiosJWT.delete(
        `${process.env.REACT_APP_API_URL_BACKEND}/order/cancel-order/${userId}`,
        { data },
        {
            headers: {
                token: `Bearer: ${access_token}`,
            },
        }
    );
    console.log("API Response:", res);
    return res.data;
};

export const getAllOrder = async (access_token) => {
    const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/order/get-all-order`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        }
    );
    return res.data;
};
