import Button from './Buttons';
import { useLocation, useNavigate } from 'react-router';

export default function NewsSidebar({ favItems, onOpen, onStar, token }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="news-sidebar" aria-labelledby="sidebar-heading">
      <h2 className="news-sidebar__heading" id="sidebar-heading">Favorites</h2>

      {!token ? (
        <div className="news-sidebar__login">
          <p className="news-sidebar__empty">You need to have a user to save news.</p>
          <Button text="Log in" variant="white" action={() => navigate('/login', { state: { from: location.pathname } })} className="news-sidebar__login-btn" />
        </div>

      ) : favItems.length === 0 ? (
        <p className="news-sidebar__empty" aria-live="polite">
          Star a card to save it here.
        </p>

      ) : (
        <ul className="news-sidebar__list">
          {favItems.map((item) => (
            <li
              key={item.id}
              className="news-sidebar__item"
              tabIndex={0}
              aria-label={`Open article: ${item.headline}`}
              onClick={() => onOpen(item)}
              onKeyDown={(event) => event.key === "Enter" && onOpen(item)}
            >
              <strong className="news-sidebar__item-tag">{item.tag}</strong>
              {" — "}
              <span className="news-sidebar__item-title">
                {item.headline}
              </span>
              <button
                type="button"
                className="news-sidebar__remove"
                aria-label={`Remove "${item.headline}" from favorites`}
                onClick={(event) => { event.stopPropagation(); onStar(item); }}
              >
                ★
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}