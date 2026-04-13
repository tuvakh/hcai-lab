// src/components/NewsModal.jsx
import { useEffect } from "react";

export default function NewsModal({ item, onClose }) {
  useEffect(() => {
    if (!item) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="news-modal__overlay"
      aria-hidden="true"
      onClick={onClose}
    >
      <div
        className="news-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="news-modal__close"
          aria-label="Close article"
          autoFocus
          onClick={onClose}
        >
          ×
        </button>

        {/* __scroll wraps everything that should scroll */}
        <div className="news-modal__scroll">

          <div className="news-modal__tags">
            <span className={`news-modal__tag news-modal__tag--region news-modal__tag--${item.regionTag?.toLowerCase()}`}>
              {item.regionTag}
            </span>
            <span className="news-modal__tag news-modal__tag--topic">{item.tag}</span>
          </div>

          <h2 className="news-modal__title" id="modal-title">
            {item.headline}
          </h2>

          <p className="news-modal__summary">{item.summary}</p>

          {item.body && (
            <div className="news-modal__body">
              {item.body.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}

          {item.why && (
            <p className="news-modal__why">
              <span className="news-modal__why-label" aria-hidden="true">
                Why it matters —{" "}
              </span>
              {item.why}
            </p>
          )}

          <div className="news-modal__footer">
           
            <time className="news-modal__meta" dateTime={item.time}>
              {new Date(item.time).toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </time>
          </div>

        </div>
      </div>
    </div>
  );
}
