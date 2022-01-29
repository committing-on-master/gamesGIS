import { useState } from "react";
import classNames from "classnames";

import "./SidePanel.scss";

interface SidePanelProps {
    visibility: boolean;
    children?: React.ReactNode;
    header?: string;
}

function SidePanel(props: SidePanelProps) {
    const [visibility, setVisibility] = useState(props.visibility);

    const navClass = classNames(
        "sidenav",
        { "sidenav--active": visibility }

    )
    const arrowClass = classNames(
        "arrow",
        { "arrow--right": visibility }
    );
    const arrowContainerClass = classNames(
        "arrowContainer",
        {"arrowContainer--right": visibility}
    )

    const handleOnCLick = () => {
        setVisibility(!visibility);
    }


    return (
        <nav className={navClass}>
            {props.header && <h2>{props.header}</h2>}
            <div className={arrowContainerClass}>
                <span className={arrowClass} onClick={handleOnCLick}></span>
            </div>
            <div className="navbody">
                {props.children ?? props.children}
            </div>            
        </nav>
    )
}

export { SidePanel };
