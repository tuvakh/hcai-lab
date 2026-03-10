export default function Buttons({ text, action }) {
    return (
        <button class="button" onClick={() => action()}> {text} </button>
    )
}