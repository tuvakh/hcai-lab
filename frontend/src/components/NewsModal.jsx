import Modal from "./Modal";
import Tag from './Tags';

export default function NewsModal({ item, onClose }) {
  if (!item) return null;

  return (
    <Modal onClose={onClose} ariaLabel={item.headline}>
      <div className="news-modal__scroll">
        <div className="news-modal__tags">
          <Tag status={item.regionTag?.toLowerCase()}>{item.regionTag}</Tag>
          <Tag variant="news">{item.tag}</Tag>
        </div>

        <h2 className="news-modal__title" id="modal-title">
          {item.headline}
        </h2>

        <p className="news-modal__summary">{item.summary}</p>

        {item.body && (
          <div className="news-modal__body">
            {item.body.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
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

          {item.url && item.url !== "#" && (
            <a
              className="news-modal__link"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Read full article: ${item.headline}`}
            >
              Read full article →
            </a>
          )}
        </div>

      </div>
    </Modal>
  );
}
