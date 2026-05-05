const Button = ({
    type = 'button',
    className = '',
    disabled = false,
    children,
    active = true,
    onClick = () => { }
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full ${active ? "btn-primary" : "btn-secondary"} ${className}`}
            type={type}
        >
            {children}
        </button>
    )
}
export default Button