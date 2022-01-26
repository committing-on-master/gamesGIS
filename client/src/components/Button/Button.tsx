import "./Button.scss";
import classNames from "classnames";

interface ButtonProps {
    /**
     * Is this the principal call to action on the page?
     */
    primary?: boolean;
    /**
     * How large should the button be?
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * Button contents
     */
    label: string;
    /**
     * Optional click handler
     */
    onClick?: () => void;
}

function Button({
    primary = false,
    size = 'medium',
    label,
    ...props
}: ButtonProps) {
    const classname = classNames(
        "button",
        `button--${size}`,
        primary ? 'button--primary' : 'button--secondary'
    );
    return (
        <button
            type="button"
            className={classname}
            {...props}
        >
            {label}
        </button>
    )
}

export { Button }
