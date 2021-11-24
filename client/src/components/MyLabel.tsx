import React, { useState } from "react";


export const MyLabel = () => {
    const [value, setValue ] = useState(3);

    onclick = () => {
        setValue(value + 1);
    }

    return (
        <label>{value}</label>
    );
}
