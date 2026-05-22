import Tag from './Tags';

export default function NewsCard({ item, saved, onStar, onOpen, isFeatured = false, variant, token }) {
  const classes = [
    "news-card",
    saved && "news-card--saved",
    isFeatured && "news-card--featured",
  ].filter(Boolean).join(" ");

  if (variant === "display") {
    return (
      <article className="news-card-display" aria-label={`${item.tag} — ${item.headline}`}>
        <Tag variant="display">{item.tag}</Tag>
        <h3 className="news-card-display__title">{item.headline}</h3>
      </article>
    );
  }

  return (
    <article
      className={classes}
      tabIndex={0}
      aria-label={`${item.tag} — ${item.headline}`}
      onClick={() => onOpen(item)}
      onKeyDown={(event) => event.key === "Enter" && onOpen(item)}
    >
      <div className="news-card__tags">
        <Tag status={item.regionTag?.toLowerCase()}>{item.regionTag}</Tag>
        <Tag variant="news">{item.tag}</Tag>
      </div>

      <h2 className="news-card__title">{item.headline}</h2>

      <p className="news-card__summary">{item.summary}</p>

      {item.why && (
        <p className="news-card__why">
          <span className="news-card__why-label" aria-hidden="true">
            Why it matters —{" "}
          </span>
          {item.why}
        </p>
      )}

      <div className="news-card__footer">
        <time className="news-card__time" dateTime={item.time}>
          {new Date(item.time).toLocaleDateString("en-GB", {
            day: "numeric", month: "short",
          })}
        </time>
        {token && (
          <button
            type="button"
            className={`news-card__star${saved ? " news-card__star--on" : ""}`}
            aria-label={saved ? `Remove "${item.headline}" from favorites` : `Save "${item.headline}" to favorites`}
            aria-pressed={saved}
            onClick={(event) => { event.stopPropagation(); onStar(item); }}
          >
            {saved ? "★" : "☆"}
          </button>
        )}
      </div>
    </article>
  );
}