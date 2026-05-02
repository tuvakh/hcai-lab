import { useState, useEffect } from "react";
import Button from "./Buttons";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function AdminImportSearch({ type, onSelect, onClose, existingEmails = [] }) {
  const isEmployee = type === "employee";

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState(null);
  const [username, setUsername] = useState("");
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (selected) setUsername(selected.person.username);
  }, [selected]);

  async function handleSearch(event) {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const url = isEmployee
        ? `${API_URL}/api/search/search?query=${encodeURIComponent(query)}`
        : `${API_URL}/api/search/cristin/projects?query=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      setResults(await response.json());
    } catch {
      setResults([]);
    }
    setLoading(false);
  }

  async function handleFetchNTNU(event) {
    event.preventDefault();
    setFetching(true);
    try {
      const response = await fetch(`${API_URL}/api/search/profile?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      if (!data.name) { alert("Could not fetch profile. Check the username."); setFetching(false); return; }
      onSelect(data);
    } catch {
      alert("Failed to fetch profile.");
    }
    setFetching(false);
  }

  return (
    <div className="admin-modal" role="dialog" aria-modal="true">
      <div className="admin-modal__box">
        <div className="admin-modal__header">
          <h2 className="admin-modal__title">{isEmployee ? "Import Employee" : "Import Project"}</h2>
          <button className="admin-modal__close" onClick={onClose} type="button" aria-label="Close">&times;</button>
        </div>
        <form onSubmit={handleSearch} className="admin-modal__form">
          <div className="admin-modal__field">
            <label className="admin-modal__label">{isEmployee ? "Search by name" : "Search by title"}</label>
            <input
              className="admin-modal__input"
              type="text"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder={isEmployee ? "e.g. Hansen" : "e.g. AI, HCI"}
              autoFocus
            />
          </div>
          <div className="admin-modal__actions">
            <Button text="Cancel" action={onClose} variant="secondary" />

            <button type="submit" className="btn btn--save" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {isEmployee && selected && (
          <form onSubmit={handleFetchNTNU} className="admin-modal__confirm-form">
            <p className="admin-modal__confirm-text">
              Confirm NTNU username for <strong>{selected.person.name}</strong>:
            </p>
            <div className="admin-modal__confirm-row">
              <input className="admin-modal__input" placeholder="e.g. olano" value={username} onChange={event => setUsername(event.target.value)} />
              <button type="submit" className="btn btn--save btn--small" disabled={fetching}>
                {fetching ? "Fetching..." : "Import"}
              </button>
            </div>
          </form>
        )}

        {searched && !loading && (
          <ul className="admin-search__results">
            {results.length === 0 && <li className="admin-search__no-results">No results found.</li>}
            {results.map(item => isEmployee ? (
              <li key={item.username} className="admin-search__result-item">
                <span>
                  <strong>{item.name}</strong>
                  {item.role && <span className="admin-search__result-meta">{item.role}</span>}
                  {existingEmails.includes(item.email?.toLowerCase()) && <span className="admin-search__result-existing">(already added)</span>}
                </span>
                <Button text="Select" action={() => setSelected({ person: item })} disabled={existingEmails.includes(item.email?.toLowerCase())} variant="save" size="small" />
              </li>
            ) : (
              <li key={item.id} className="admin-search__result-item">
                <span>
                  <strong>{item.name}</strong>
                  <span className="admin-search__result-meta">{item.year} · {item.status}</span>
                </span>
                <Button text="Select" action={() => { onSelect(item); onClose(); }} variant="save" size="small" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
