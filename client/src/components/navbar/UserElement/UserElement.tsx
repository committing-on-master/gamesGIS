import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames"
import { LoginForm } from "./LoginForm";
import { LogoutForm } from "./LogoutForm";
import { UserName } from "./UserName";
import "./UserElement.scss"

interface UserProps {
    /**
     * Отображаемое имя пользователя
     * undefined - отображается строкой Login
     */
    userName?: string;
    /**
     * Выравнивание выпадайки по краю
     * undefined | left - по левому краю
     * right - по правому краю
     */
    // dropdownAlignDirection?: "right" | "left";
}

function UserElement(props: UserProps) {
    const [dropdownVisibility, setDropdownVisibility] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const dropDownCSS = classNames(
        "dropdown-menu",
        {
            "dropdown-menu--is-active": dropdownVisibility
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
        <div className="dropdown-container" >
            <UserName userName={props.userName} onClick={switchDropdownVisivility} />
            <div ref={dropdownRef} className={dropDownCSS}>
                {dropDownContent}
            </div>
        </div>
    );
}

export { UserElement }