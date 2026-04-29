import { useState, useEffect } from "react";

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

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const url = isEmployee
        ? `${API_URL}/api/search/search?query=${encodeURIComponent(query)}`
        : `${API_URL}/api/search/cristin/projects?query=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      setResults(await res.json());
    } catch {
      setResults([]);
    }
    setLoading(false);
  }

  async function handleFetchNTNU(e) {
    e.preventDefault();
    setFetching(true);
    try {
      const res = await fetch(`${API_URL}/api/search/profile?username=${encodeURIComponent(username)}`);
      const data = await res.json();
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
              onChange={e => setQuery(e.target.value)}
              placeholder={isEmployee ? "e.g. Hansen" : "e.g. AI, HCI"}
              autoFocus
            />
          </div>
          <div className="admin-modal__actions">
            <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--save" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {isEmployee && selected && (
          <form onSubmit={handleFetchNTNU} style={{ padding: "1rem 1.5rem" }}>
            <p style={{ color: "#ccc", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              Confirm NTNU username for <strong>{selected.person.name}</strong>:
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input className="admin-modal__input" placeholder="e.g. olano" value={username} onChange={e => setUsername(e.target.value)} />
              <button type="submit" className="btn btn--save btn--small" disabled={fetching}>
                {fetching ? "Fetching..." : "Import"}
              </button>
            </div>
          </form>
        )}

        {searched && !loading && (
          <ul style={{ listStyle: "none", padding: "0 1.5rem", marginTop: "1rem" }}>
            {results.length === 0 && <li style={{ color: "#aaa" }}>No results found.</li>}
            {results.map(item => isEmployee ? (
              <li key={item.username} style={{ padding: "0.6rem 0", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                <span>
                  <strong>{item.name}</strong>
                  {item.role && <span style={{ marginLeft: "0.5rem", color: "#888", fontSize: "0.9rem" }}>{item.role}</span>}
                  {existingEmails.includes(item.email?.toLowerCase()) && <span style={{ marginLeft: "0.5rem", color: "#f79fc1", fontSize: "0.8rem" }}>(already added)</span>}
                </span>
                <button className="btn btn--save btn--small" onClick={() => setSelected({ person: item })} disabled={existingEmails.includes(item.email?.toLowerCase())}>Select</button>
              </li>
            ) : (
              <li key={item.id} style={{ padding: "0.6rem 0", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                <span>
                  <strong>{item.name}</strong>
                  <span style={{ marginLeft: "0.5rem", color: "#888", fontSize: "0.9rem" }}>{item.year} · {item.status}</span>
                </span>
                <button className="btn btn--save btn--small" onClick={() => { onSelect(item); onClose(); }}>Select</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
