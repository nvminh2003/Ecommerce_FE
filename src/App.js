import React, { Fragment, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
// import axios from "axios";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import * as UserService from "./services/UserSevice";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, resetUser } from "./redux/slides/useSlide";
import Loading from "./components/LoadingComponent/Loading";

export default function App() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const user = useSelector((state) => state.user);

    useEffect(() => {
        setIsLoading(true);
        const { storageData, decoded } = handleDecoded();
        // console.log("Decoded Token:", decoded);
        console.log("user:", user);
        if (decoded?.id) {
            handleGetDetailsUser(decoded?.id, storageData);
        }
        setIsLoading(false);
    }, []);

    const handleDecoded = () => {
        //deloy render.com
        let storageData =
            user?.access_token || localStorage.getItem("access_token");
        // let storageData = localStorage.getItem("access_token");
        let decoded = {};
        // console.log("storage data:", storageData, isJsonString(storageData));
        if (storageData && isJsonString(storageData) && !user?.access_token) {
            storageData = JSON.parse(storageData);
            decoded = jwtDecode(storageData);
        }
        return { decoded, storageData };
    };

    UserService.axiosJWT.interceptors.request.use(
        async (config) => {
            const currentTime = new Date().getTime() / 1000;
            const { decoded } = handleDecoded();
            let storageRefreshToken = localStorage.getItem("refresh_token");
            const refreshToken = JSON.parse(storageRefreshToken);
            const decodedRefreshToken = jwtDecode(refreshToken);
            if (decoded?.exp < currentTime) {
                if (decodedRefreshToken?.exp > currentTime) {
                    const data = await UserService.refreshToken(refreshToken);
                    config.headers["token"] = `Bearer ${data?.access_token}`;
                } else {
                    dispatch(resetUser());
                }
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        }
    );

    // UserService.axiosJWT.interceptors.request.use(
    //     async (config) => {
    //         const currentTime = new Date().getTime() / 1000;
    //         const { decoded } = handleDecoded();
    //         if (decoded?.exp < currentTime) {
    //             try {
    //                 const data = await UserService.refreshToken();
    //                 config.headers[
    //                     "Authorization"
    //                 ] = `Bearer ${data?.access_token}`;
    //             } catch (error) {
    //                 console.error("Token refresh error:", error);
    //             }
    //         }
    //         return config;
    //     },
    //     (err) => {
    //         console.error("Interceptor request error:", err);
    //         return Promise.reject(err);
    //     }
    // );

    // const handleGetDetailsUser = async (id, token) => {
    //     const res = await UserService.getDetailsUser(id, token);
    //     dispatch(updateUser({ ...res?.data, access_token: token }));

    //     // console.log("res", res);
    // };

    const handleGetDetailsUser = async (id, token) => {
        try {
            let storageRefreshToken = localStorage.getItem("refresh_token");
            const refreshToken = JSON.parse(storageRefreshToken);
            const res = await UserService.getDetailsUser(id, token);
            if (res?.data) {
                dispatch(
                    updateUser({
                        ...res.data,
                        access_token: token,
                        refreshToken: refreshToken,
                    })
                );
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            setIsLoading(false); // Stop loading once finished
        }
    };

    return (
        <div>
            {/* <Loading isLoading={{ isLoading }}> */}
            <Router>
                <Routes>
                    {routes.map((route) => {
                        const Page = route.page;
                        const isCheckAuth = !route.isPrivate || user.isAdmin;
                        const Layout = route.isShowHeader
                            ? DefaultComponent
                            : Fragment;
                        return isCheckAuth ? (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        ) : null;
                    })}
                </Routes>
            </Router>
            {/* </Loading> */}
        </div>
    );
}

// useEffect(() => {
//     const { storageData, decoded } = handleDecoded();
//     if (decoded?.id) {
//         handleGetDetailsUser(decoded.id, storageData);
//     }
// }, []);

// const handleDecoded = () => {
//     let storageData = localStorage.getItem("access_token");
//     console.log("storage data:", storageData);
//     let decoded = {};

//     if (storageData) {
//         try {
//             decoded = jwtDecode(storageData);
//             // console.log("decodedApp: ", decoded);
//         } catch (error) {
//             console.error("JWT decode error: ", error);
//         }
//     }
//     return { decoded, storageData };
// };

// // Add a request interceptor
// UserService.axiosJWT.interceptors.request.use(
//     async (config) => {
//         const currentTime = new Date();
//         const { decoded } = handleDecoded();
//         if (decoded?.exp < currentTime.getTime() / 1000) {
//             const data = await UserService.refreshToken();
//             config.headers["token"] = `Bearer: ${data?.access_token} `;
//         }
//         return config;
//     },
//     (err) => {
//         return Promise.reject(err);
//     }
// );
