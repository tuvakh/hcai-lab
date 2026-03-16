import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CardGrid({ items = [], variant = "people" }) {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => { 
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <>
      <div className={`card-grid card-grid--${variant}`}>
        {items.map((item, i) => (
          <button
            key={item.id}
            className="card"
            onClick={() => setSelected(item)}
            style={{ animationDelay: `${i * 0.07}s` }}
            aria-label={`View ${item.name}`}
          >
            <div className="card__image-wrap">
              {item.image ? (
                <img src={item.image} alt={item.name} className="card__image" />
              ) : (
                <div className="card__image card__image--placeholder" />
              )}
            </div>
            <div className="card__body">
              <h3 className="card__name">{item.name}</h3>
              {variant === "people" && item.role && (
                <span className="card__role">{item.role}</span>
              )}
              {variant === "projects" && (
                <div className="card__tags">
                  {item.status && (
                    <span className={`card__tag card__tag--${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  )}
                  {item.tags?.map((tag) => (
                    <span key={tag} className="card__tag">{tag}</span>
                  ))}
                </div>
              )}
              <p className="card__desc">{item.shortDescription}</p>
              <span className="card__cta">
                {variant === "people" ? "View profile →" : "View project →"}
              </span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selected.name}
        >
          <div className="modal">
            <button
              className="modal__close"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              ✕
            </button>

            {/* ── People modal ── */}
            {variant === "people" && (
              <>
                <div className="modal__header">
                  <div className="modal__image-wrap">
                    {selected.image ? (
                      <img src={selected.image} alt={selected.name} className="modal__image" />
                    ) : (
                      <div className="modal__image modal__image--placeholder" />
                    )}
                  </div>
                  <div className="modal__header-text">
                    <h2 className="modal__name">{selected.name}</h2>
                    {selected.role && (
                      <span className="modal__role">{selected.role}</span>
                    )}
                  </div>
                </div>

                <div className="modal__body">
                  <p className="modal__bio">
                    {selected.fullBio || selected.shortDescription}
                  </p>
                </div>

                <div className="modal__contact">
                  {selected.email && (
                    <a href={`mailto:${selected.email}`} className="modal__contact-link">
                      <span className="modal__contact-icon">✉</span>
                      {selected.email}
                    </a>
                  )}
                  {selected.linkedin && (
                    <a href={selected.linkedin} target="_blank" rel="noreferrer" className="modal__contact-link">
                      <span className="modal__contact-icon">in</span>
                      LinkedIn
                    </a>
                  )}
                  {selected.github && (
                    <a href={selected.github} target="_blank" rel="noreferrer" className="modal__contact-link">
                      <span className="modal__contact-icon">⌥</span>
                      GitHub
                    </a>
                  )}
                </div>
              </>
            )}

            {/* ── Projects modal ── */}
            {variant === "projects" && (
              <>
                <div className="modal__header">
                  <div className="modal__header-text modal__header-text--full">
                    <div className="modal__tags">
                      {selected.status && (
                        <span className={`modal__tag modal__tag--${selected.status.toLowerCase()}`}>
                          {selected.status}
                        </span>
                      )}
                      {selected.tags?.map((tag) => (
                        <span key={tag} className="modal__tag">{tag}</span>
                      ))}
                    </div>
                    <h2 className="modal__name">{selected.name}</h2>
                  </div>
                </div>

                <div className="modal__body">
                  <p className="modal__bio">{selected.fullDescription || selected.shortDescription}</p>
                </div>

                {/* People involved */}
                {selected.team?.length > 0 && (
                  <div className="modal__section">
                    <h3 className="modal__section-title">People involved</h3>
                    <div className="modal__team-grid">
                      {selected.team.map((name) => (
                        <div key={name} className="modal__team-card">
                          <div className="modal__team-avatar" />
                          <span className="modal__team-name">{name}</span>
                          <button
                            type="button"
                            className="modal__team-btn"
                            onClick={() => {
                              setSelected(null);
                              navigate("/People");
                            }}
                          >
                            View profile
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Outcomes */}
                {selected.outcomes && (
                  <div className="modal__section">
                    <h3 className="modal__section-title">Outcomes / Results</h3>
                    <p className="modal__bio">{selected.outcomes}</p>
                  </div>
                )}

                {/* External links */}
                {selected.links?.length > 0 && (
                  <div className="modal__section">
                    <h3 className="modal__section-title">External links</h3>
                    <div className="modal__contact">
                      {selected.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="modal__contact-link"
                        >
                          <span className="modal__contact-icon">↗</span>
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Watch presentation */}
                {selected.presentationUrl && (
                  <div className="modal__section">
                    <h3 className="modal__section-title">Watch presentation</h3>
                    <a
                      href={selected.presentationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="modal__contact-link"
                    >
                      <span className="modal__contact-icon">▶</span>
                      Watch now
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}