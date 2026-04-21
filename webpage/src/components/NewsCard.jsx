export default function NewsCard({ item, saved, onStar, onOpen, isFeatured = false }) {
  const classes = [
    "news-card",
    saved      && "news-card--saved",
    isFeatured && "news-card--featured",
  ].filter(Boolean).join(" ");

  return (
    <article
      className={classes}
      tabIndex={0}
      aria-label={`${item.tag} — ${item.headline}`}
      onClick={() => onOpen(item)}
      onKeyDown={(e) => e.key === "Enter" && onOpen(item)}
    >
      <span className="news-card__tag">{item.tag}</span>

      <h3 className="news-card__title">{item.headline}</h3>

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
        <button
          type="button"
          className={`news-card__star${saved ? " news-card__star--on" : ""}`}
          aria-label={saved
            ? `Remove "${item.headline}" from favorites`
            : `Save "${item.headline}" to favorites`}
          aria-pressed={saved}
          onClick={(e) => { e.stopPropagation(); onStar(item); }}
        >
          {saved ? "★" : "☆"}
        </button>
      </div>
    </article>
  );
}

//Fix the favorite thing again. not working -- shoud be able to remove in the side bar aswell