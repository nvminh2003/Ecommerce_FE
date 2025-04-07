import React from "react";
import { WrapperInputStyle } from "./style";

const InputFormComponent = (props) => {
    // const [valueInput, setValueInput] = useState("");
    const { placeholder = "Nhap text", value, onChange, ...rests } = props;
    const handleOnChangeInput = (e) => {
        props.onChange(e.target.value);
    };
    return (
        <div>
            <WrapperInputStyle
                placeholder={placeholder}
                value={value}
                onChange={handleOnChangeInput}
                {...rests}
            />
        </div>
    );
};

export default InputFormComponent;
