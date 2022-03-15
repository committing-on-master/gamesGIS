import { useState } from "react";
import classNames from "classnames";

import styles from './SidePanel.module.scss';

interface SidePanelProps {
    visibility: boolean;
    children?: React.ReactNode;
    header?: string;
}

function SidePanel(props: SidePanelProps) {
    const [visibility, setVisibility] = useState(props.visibility);

    const headerCss = classNames(
        styles.header,
        { [styles.headerActive]: visibility }
    );

    const navClass = classNames(
        styles.sidenav,
        { [styles.sidenavActive]: visibility }

    )
    const arrowClass = classNames(
        styles.arrow,
        { [styles.arrowRight]: visibility }
    );
    const arrowContainerClass = classNames(
        styles.arrowContainer,
        { [styles.arrowContainerRight]: visibility }
    )
    const nabBodyClass = classNames(
        styles.navbody,
        { [styles.navbodyVisible] : visibility }
    );

    const handleOnCLick = () => {
        setVisibility(!visibility);
    }


    return (
        <nav className={navClass}>
            <div className={arrowContainerClass}>
                <span className={arrowClass} onClick={handleOnCLick}></span>
            </div>
            {props.header && <h2 className={headerCss}>{props.header}</h2>}
            <div className={nabBodyClass}>
                {props.children ?? props.children}
            </div>
        </nav>
    )
}

export { SidePanel };
