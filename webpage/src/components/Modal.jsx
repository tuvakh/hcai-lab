import { useEffect } from "react";

export default function Modal({ onClose, ariaLabel, children, size }) {
    useEffect(() => {
        const handleKey = (event) => {
            if (event.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className={`modal${size ? ` modal--${size}` : ''}`} role="dialog" aria-modal="true" aria-label={ariaLabel}>
            <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>
            {children}
        </div>
      </div>
    );
}
