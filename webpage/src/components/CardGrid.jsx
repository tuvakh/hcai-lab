import { useState } from "react";
import Modal from "./Modal";

export default function CardGrid({ items = [], variant = "people", onSelect }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div className={`card-grid card-grid--${variant}`}>
        {items.map((item, i) => (
          <button
            key={item.id}
            className="card"
            onClick={() => onSelect ? onSelect(item) : setSelected(item)}
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
              {variant === "equipment" && (
                <span className="card__role">{item.category}</span>
              )}
              {variant === "projects" && (
                <div className="card__tags">
                  {item.status && (Array.isArray(item.status) ? item.status : [item.status]).map((s) => (
                    <span key={s} className={`card__tag card__tag--${s.toLowerCase()}`}>{s}</span>
                  ))}
                  {item.tags?.map((tag) => (
                    <span key={tag} className="card__tag">{tag}</span>
                  ))}
                </div>
              )}
              {variant === "equipment" && (
                <div className="card__tags">
                  <span className={`card__tag card__tag--${item.status === "Available" ? "available" : "booked"}`}>
                    {item.status}
                  </span>
                </div>
              )}
              <p className="card__desc">{item.shortDescription || item.description}</p>
              <span className="card__cta">
                {variant === "people" ? "View profile →" : variant === "equipment" ? "View booking details →" : "View project →"}
              </span>
            </div>
          </button>
        ))}
      </div>

      {!onSelect && selected && (
        <Modal onClose={() => setSelected(null)} ariaLabel={selected.name}>
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

              {selected.researchInterests?.length > 0 && (
                <div className="modal__section">
                  <h3 className="modal__section-title">Research interests</h3>
                  <div className="modal__tags">
                    {selected.researchInterests.map((interest) => (
                      <span key={interest} className="modal__tag modal__tag--interest">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selected.projects?.some((p) => p.url) && (
                <div className="modal__section">
                  <h3 className="modal__section-title">Projects</h3>
                  <div className="modal__project-grid">
                    {selected.projects.filter((p) => p.url).map((project) => (
                      <div key={project.name} className="modal__project-card">
                        <span className="modal__project-name">{project.name}</span>
                        <a href={project.url} target="_blank" rel="noreferrer" className="modal__project-btn">
                          View project
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selected.publicationsUrl && (
                <div className="modal__section">
                  <h3 className="modal__section-title">Publications</h3>
                  <a href={selected.publicationsUrl} target="_blank" rel="noreferrer" className="modal__contact-link">
                    <span className="modal__contact-icon">↗</span>
                    View all publications
                  </a>
                </div>
              )}

              <div className="modal__contact">
                {selected.ntnuProfile && (
                  <a href={selected.ntnuProfile} target="_blank" rel="noreferrer" className="modal__contact-link">
                    <span className="modal__contact-icon">N</span>
                    NTNU Profile
                  </a>
                )}
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
                {selected.scholar && (
                  <a href={selected.scholar} target="_blank" rel="noreferrer" className="modal__contact-link">
                    <span className="modal__contact-icon">GS</span>
                    Google Scholar
                  </a>
                )}
                {selected.researchgate && (
                  <a href={selected.researchgate} target="_blank" rel="noreferrer" className="modal__contact-link">
                    <span className="modal__contact-icon">RG</span>
                    ResearchGate
                  </a>
                )}
                {selected.twitter && (
                  <a href={selected.twitter} target="_blank" rel="noreferrer" className="modal__contact-link">
                    <span className="modal__contact-icon">𝕏</span>
                    X / Twitter
                  </a>
                )}
                {selected.instagram && (
                  <a href={selected.instagram} target="_blank" rel="noreferrer" className="modal__contact-link">
                    <span className="modal__contact-icon">IG</span>
                    Instagram
                  </a>
                )}
                {selected.github && (
                  <a href={selected.github} target="_blank" rel="noreferrer" className="modal__contact-link">
                    <span className="modal__contact-icon">⌥</span>
                    GitHub
                  </a>
                )}
                {selected.scopus && (
                  <a href={selected.scopus} target="_blank" rel="noreferrer" className="modal__contact-link">
                    <span className="modal__contact-icon">Sc</span>
                    Scopus
                  </a>
                )}
                {selected.dblp && (
                  <a href={selected.dblp} target="_blank" rel="noreferrer" className="modal__contact-link">
                    <span className="modal__contact-icon">db</span>
                    DBLP
                  </a>
                )}
              </div>
            </>
          )}

          {variant === "projects" && (
            <>
              <div className="modal__header">
                <div className="modal__header-text modal__header-text--full">
                  <div className="modal__tags">
                    {selected.status && (Array.isArray(selected.status) ? selected.status : [selected.status]).map((s) => (
                      <span key={s} className={`modal__tag modal__tag--${s.toLowerCase()}`}>{s}</span>
                    ))}
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

              {selected.team?.length > 0 && (
                <div className="modal__section">
                  <h3 className="modal__section-title">People involved</h3>
                  <div className="modal__team-grid">
                    {selected.team.map((name) => (
                      <div key={name} className="modal__team-card">
                        <img src="/assets/people/anonymous.png" alt={name} className="modal__team-avatar" />
                        <span className="modal__team-name">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selected.outcomes && (
                <div className="modal__section">
                  <h3 className="modal__section-title">Outcomes / Results</h3>
                  <p className="modal__bio">{selected.outcomes}</p>
                </div>
              )}

              {selected.links?.length > 0 && (
                <div className="modal__section">
                  <h3 className="modal__section-title">External links</h3>
                  <div className="modal__contact">
                    {selected.links.map((link) => (
                      <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="modal__contact-link">
                        <span className="modal__contact-icon">↗</span>
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selected.presentationUrl && (
                <div className="modal__section">
                  <h3 className="modal__section-title">Watch presentation</h3>
                  <a href={selected.presentationUrl} target="_blank" rel="noreferrer" className="modal__contact-link">
                    <span className="modal__contact-icon">▶</span>
                    Watch now
                  </a>
                </div>
              )}
            </>
          )}
        </Modal>
      )}
    </>
  );
}
