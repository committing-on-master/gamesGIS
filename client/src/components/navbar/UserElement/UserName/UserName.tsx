import React, { MouseEventHandler } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import styles from './UserName.module.scss';

export interface IUserProps {
    userName?: string;
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

const UserName = (props: IUserProps) => {
    return (
        <button className={styles.button} onClick={props.onClick}>
            <span className={styles.span}>
                <FontAwesomeIcon icon={faUser} />
            </span>
            {props.userName ? props.userName : "Login"}
        </button>
    )
}

export { UserName };