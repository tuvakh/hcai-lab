export default function Buttons({ text, action, variant = "blue", className = "" }) {
    
    const handleClick = () => {
        if (action) action();
        window.scrollTo(0, 0);
    };

    return (
        <button className={`button button--${variant} ${className}`} onClick={handleClick}> {text} </button>
    )
}