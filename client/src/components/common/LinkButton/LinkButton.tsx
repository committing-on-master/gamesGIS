import React from 'react';
import { NavigateOptions, useNavigate } from 'react-router-dom';

interface LinkButtonProps {
    to: string;
    options?: NavigateOptions;
    className: string;
    children?: React.ReactNode;
    onClick?(e?: React.MouseEvent<HTMLButtonElement>): void;
}

function LinkButton(props: LinkButtonProps) {
    const navigate = useNavigate();
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        props.onClick && props.onClick(e);
        props.options ? navigate(props.to, props.options) : navigate(props.to);
    }
    return (
        <button className={props.className} onClick={handleClick}>
            {props.children ? props.children : null}
        </button>
    );
}

export { LinkButton };
