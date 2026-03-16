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
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div className="news-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="news-modal__close"
          aria-label="Close article"
          autoFocus
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="news-modal__title" id="modal-title">
          {item.headline}
        </h2>

        <p className="news-modal__summary">{item.summary}</p>

        {item.why && (
          <p className="news-modal__why">
            <span className="news-modal__why-label" aria-hidden="true">Why it matters — </span>
            {item.why}
          </p>
        )}

        <div className="news-modal__footer">
          <a
            className="news-modal__link"
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open full article: ${item.headline} (opens in new tab)`}
          >
            Open article
          </a>
          <time className="news-modal__meta" dateTime={item.time}>
            {new Date(item.time).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </time>
        </div>
      </div>
    </div>
  );
}