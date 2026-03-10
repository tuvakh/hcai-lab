import { useState, useEffect } from "react";

/**
 * CardGrid — reusable for People and Projects pages
 *
 * Props:
 *  items: Array of objects.
 *
 *  People item shape:
 *    { id, name, role, image, shortDescription, fullBio, email, linkedin, github }
 *
 *  Projects item shape:
 *    { id, name, tags, image, shortDescription, fullDescription, link, team }
 *
 *  variant: "people" | "projects"
 */
export default function CardGrid({ items = [], variant = "people" }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
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
              {variant === "projects" && item.tags && (
                <div className="card__tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="card__tag">
                      {tag}
                    </span>
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

            <div className="modal__header">
              <div className="modal__image-wrap">
                {selected.image ? (
                  <img
                    src={selected.image}
                    alt={selected.name}
                    className="modal__image"
                  />
                ) : (
                  <div className="modal__image modal__image--placeholder" />
                )}
              </div>
              <div className="modal__header-text">
                <h2 className="modal__name">{selected.name}</h2>
                {variant === "people" && selected.role && (
                  <span className="modal__role">{selected.role}</span>
                )}
                {variant === "projects" && selected.tags && (
                  <div className="modal__tags">
                    {selected.tags.map((tag) => (
                      <span key={tag} className="modal__tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="modal__body">
              <p className="modal__bio">
                {selected.fullBio ||
                  selected.fullDescription ||
                  selected.shortDescription}
              </p>
            </div>

            {variant === "people" && (
              <div className="modal__contact">
                {selected.email && (
                  <a
                    href={`mailto:${selected.email}`}
                    className="modal__contact-link"
                  >
                    <span className="modal__contact-icon">✉</span>
                    {selected.email}
                  </a>
                )}
                {selected.linkedin && (
                  <a
                    href={selected.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="modal__contact-link"
                  >
                    <span className="modal__contact-icon">in</span>
                    LinkedIn
                  </a>
                )}
                {selected.github && (
                  <a
                    href={selected.github}
                    target="_blank"
                    rel="noreferrer"
                    className="modal__contact-link"
                  >
                    <span className="modal__contact-icon">⌥</span>
                    GitHub
                  </a>
                )}
              </div>
            )}

            {variant === "projects" && (
              <div className="modal__contact">
                {selected.link && (
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noreferrer"
                    className="modal__contact-link"
                  >
                    <span className="modal__contact-icon">↗</span>
                    View Project
                  </a>
                )}
                {selected.team && (
                  <p className="modal__team">Team: {selected.team}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
