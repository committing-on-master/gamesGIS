import classNames from 'classnames';
import React from 'react';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import "./EditSpanComponent.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface EditSpanComponentProps {
    id: number;
    onClick(markerId: number): void;
    size?: "small" | "medium" | "large";
}

function EditSpanComponent({ id, onClick, size = "small" }: EditSpanComponentProps) {
    const cssClass = classNames(
        "",
        {
            "fa-xs": size === "small",
            "fa-1x": size === "medium",
            "fa-5x": size === "large",
        }
    );
    return (
        <span onClick={() => onClick(id)}>
            <FontAwesomeIcon className={cssClass} icon={faEdit} />
        </span>
    );
}

export { EditSpanComponent };
