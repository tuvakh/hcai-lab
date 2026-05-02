export default function Button({ text, action, variant = "primary", size, type = "button", scrollTop = false, className = "", style }) {
  const cls = ["btn", `btn--${variant}`, size && `btn--${size}`, className].filter(Boolean).join(" ");

  const handleClick = () => {
    if (action) action();
    if (scrollTop) window.scrollTo(0, 0);
  };

  return (
    <button type={type} style={style} className={cls} onClick={handleClick}>{text}</button>
  );
}

