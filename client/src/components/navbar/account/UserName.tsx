import React, { MouseEventHandler } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

export interface IUserProps {
    userName?: string;

    onClick?: MouseEventHandler<HTMLButtonElement> | undefined;

}

const UserName = (props: IUserProps) => {

    return (
        <div className="dropdown-trigger">
            <button className="button" onClick={props.onClick}>
                <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faUser} />
                </span>
                <span>{props.userName ? props.userName : "Login"}</span>
            </button>
        </div >
    )
}

export { UserName };