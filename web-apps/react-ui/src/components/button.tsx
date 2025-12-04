import { Button } from "@mui/material";
import React from "react";

import './MyButton.css'

export interface ButtonProps {
    label: string;
    count: number;
}

const MyButtons = (props: ButtonProps) => {

    let index = 0;
    const arrays = [];

    if (props.count > 0) {
        while (index < props.count) {
            index++;
            arrays.push(index);
        }
    } else {
        arrays.push(index);
    }

    return (
        <div className="container">
            {
                arrays.map(n => {
                    return <Button key={n} className="btn" variant="contained">{`${props.label} index ${n}`}</Button>
                })
            }
        </div>
    );
};

export default MyButtons;