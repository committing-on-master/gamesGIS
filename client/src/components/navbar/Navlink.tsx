import React from "react";

interface NavLinkProps {
    text: string;
}

function Navlink(props: NavLinkProps): JSX.Element {

    return (
        <ul>
            {props.text}
        </ul>
    )
}

export default Navlink
