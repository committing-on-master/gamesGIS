import classNames from 'classnames';
import React from 'react';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./EditSpanComponent.scss";

interface EditSpanComponentProps {
    id: number;
    onClick(markerId: number): void;
    size?: "small" | "medium" | "large";
}

function EditSpanComponent({ id, onClick, size = "small" }: EditSpanComponentProps) {
    const componentCss = classNames(
        "component-edit",
        {
            "component-edit--inline": size === "small"
        }
    );
    const iconCss = classNames(
        "fa-edit",
        {
            "fa-xs": size === "small",
            "fa-1x": size === "medium",
            "fa-5x": size === "large",
        }
    );
    return (
        <span 
            className={componentCss}
            onClick={() => onClick(id)}
        >
            <FontAwesomeIcon className={iconCss} icon={faEdit} />
        </span>
    );
}

export { EditSpanComponent };
