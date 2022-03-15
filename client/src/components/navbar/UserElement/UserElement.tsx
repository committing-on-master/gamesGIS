import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames"
import { LoginForm } from "./LoginForm";
import { LogoutForm } from "./LogoutForm";
import { UserName } from "./UserName";

import styles from './UserElement.module.scss';

interface UserProps {
    /**
     * Отображаемое имя пользователя
     * undefined - отображается строкой Login
     */
    userName?: string;    
}

function UserElement(props: UserProps) {
    const [dropdownVisibility, setDropdownVisibility] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const dropDownCSS = classNames(
        styles.menu,
        {
            [styles.menu_visible]: dropdownVisibility
        }
    )

    const handleDropdownSuccessfullyEvent = () => {
        setDropdownVisibility(false);
    }

    const dropDownContent: JSX.Element = (props.userName)
        ? <LogoutForm onLogout={handleDropdownSuccessfullyEvent} />
        : <LoginForm onSuccessfullyLogin={handleDropdownSuccessfullyEvent} onRegistrationRedirect={handleDropdownSuccessfullyEvent} />

    function switchDropdownVisivility() {
        setDropdownVisibility(!dropdownVisibility);
    }

    // обрабатываем событие скрытия выпадайки по клику в любую другую рабочую область
    useEffect(() => {
        const pageClickEvent = (e: Event) => {
            // проверяем click на попадание в область dropdown разметки
            if (dropdownRef.current !== null && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownVisibility(!dropdownVisibility);
            }
        };

        if (dropdownVisibility) {
            window.addEventListener('click', pageClickEvent);
        }

        return () => {
            window.removeEventListener('click', pageClickEvent);
        }

    }, [dropdownVisibility]);


    return (
        <div className={styles.container} >
            <UserName userName={props.userName} onClick={switchDropdownVisivility} />
            <div ref={dropdownRef} className={dropDownCSS}>
                {dropDownContent}
            </div>
        </div>
    );
}

export { UserElement }