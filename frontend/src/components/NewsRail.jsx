// src/components/NewsRail.jsx
import NewsCard from "./NewsCard";

export default function NewsRail({ label, items, saved, onStar, onOpen, token }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="news-rail" aria-label={`${label} news`}>
      <p className="news-rail__label" aria-hidden="true">{label}</p>
      <ul className="news-rail__track">
        {items.map((item, index) => (
          <li key={item.id} className="news-rail__item">
            <NewsCard
              item={item}
              saved={saved.has(item.id)}
              onStar={onStar}
              onOpen={onOpen}
              isFeatured={index === 1}
              token={token}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}