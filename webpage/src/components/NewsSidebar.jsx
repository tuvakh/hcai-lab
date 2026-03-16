export default function NewsSidebar({ favItems, onOpen }) {
    return (
      <aside className="news-sidebar" aria-labelledby="sidebar-heading">
        <h2 className="news-sidebar__heading" id="sidebar-heading">Favorites</h2>
  
        {favItems.length === 0 ? (
          <p className="news-sidebar__empty" aria-live="polite">
            Star a card to save it here.
          </p>
        ) : (
          <ul className="news-sidebar__list">
            {favItems.map((item) => (
              <li
                key={item.id}
                className="news-sidebar__item"
                role="button"
                tabIndex={0}
                aria-label={`Open article: ${item.headline}`}
                onClick={() => onOpen(item)}
                onKeyDown={(e) => e.key === "Enter" && onOpen(item)}
              >
                <strong className="news-sidebar__item-tag">{item.tag}</strong>
                {" — "}
                <span className="news-sidebar__item-title">
                  {item.headline.length > 40
                    ? `${item.headline.slice(0, 40)}…`
                    : item.headline}
                </span>
              </li>
            ))}
          </ul>
        )}
      </aside>
    );
  }