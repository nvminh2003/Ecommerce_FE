import { Steps } from "antd";
import React from "react";

const StepComponent = ({ current = -1, items = [] }) => {
    const { Step } = Steps;
    // if (current < 0) {
    //     return (
    //         <div style={{ color: "green" }}>Chưa có sản phẩm được chọn.</div>
    //     );
    // }

    return (
        <Steps current={current}>
            {items.map((item) => {
                return (
                    <Step
                        key={item.title}
                        title={item.title}
                        description={item.description}
                    />
                );
            })}
        </Steps>
    );
};

export default StepComponent;
