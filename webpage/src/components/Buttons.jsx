export default function Buttons({ text, action, variant = "blue", className = "" }) {
    return (
        <button class={`button button--${variant} ${className}`} onClick={() => action()}> {text} </button>
    )
}