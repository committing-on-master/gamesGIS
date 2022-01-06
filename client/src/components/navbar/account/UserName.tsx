import React, { MouseEventHandler } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import "./UserName.scss"

export interface IUserProps {
    userName?: string;

    onClick?: MouseEventHandler<HTMLButtonElement> | undefined;

}

const UserName = (props: IUserProps) => {

    return (
        <button className="user-name-container" onClick={props.onClick}>
            <span>
                <FontAwesomeIcon icon={faUser} />
            </span>
            <span>{props.userName ? props.userName : "Login"}</span>
        </button>
    )
}

export { UserName };