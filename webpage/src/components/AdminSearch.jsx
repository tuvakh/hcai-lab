import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function AdminSearch({ onSelect, onClose, existingEmails = [] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState(null);
  const [username, setUsername] = useState("");
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (selected) setUsername(selected.username);
  }, [selected]);

  async function handleSearch(event) {
  event.preventDefault();
  if (!query.trim()) return;
  setLoading(true);
  setSearched(true);
  try {
    const res = await fetch(`${API_URL}/api/ntnu/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
  } catch {
    setResults([]);
  }
  setLoading(false);
}

function handleSelect(person) {
  setSelected({ person, username: person.username });
}

  async function handleFetchNTNU(event) {
  event.preventDefault();
  setFetching(true);
  try {
    const res = await fetch(`${API_URL}/api/ntnu/profile?username=${encodeURIComponent(username)}`);
    const data = await res.json();
    if (!data.name) {
      alert("Could not fetch profile. Check the username.");
      setFetching(false);
      return;
    }
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
          <h2 className="admin-modal__title">Import Employee</h2>
          <button className="admin-modal__close" onClick={onClose} type="button" aria-label="Close">&times;</button>
        </div>

        <form onSubmit={handleSearch} className="admin-modal__form">
          <div className="admin-modal__field">
            <label className="admin-modal__label">Search by name</label>
            <input
              className="admin-modal__input"
              type="text"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="event.g. Hansen"
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
        {selected && (
          <form onSubmit={handleFetchNTNU} style={{ padding: "1rem 1.5rem" }}>
            <p style={{ color: "#ccc", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                Confirm NTNU username for <strong>{selected.person.name}</strong>:
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                className="admin-modal__input"
                value={username}
                onChange={event => setUsername(event.target.value)}
              />
              <button type="submit" className="btn btn--save btn--small" disabled={fetching}>
                {fetching ? "Fetching..." : "Import"}
              </button>
            </div>
          </form>
        )}
        {searched && !loading && (
          <ul style={{ listStyle: "none", padding: "0 1.5rem", marginTop: "1rem" }}>
            

{results.map(person => {
    const alreadyAdded = existingEmails.includes(person.email?.toLowerCase());
    return (
      <li key={person.username} style={{ padding: "0.6rem 0", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <span>
          <strong>{person.name}</strong>
          {person.role && <span style={{ marginLeft: "0.5rem", color: "#888", fontSize: "0.9rem" }}>{person.role}</span>}
          {alreadyAdded && <span style={{ marginLeft: "0.5rem", color: "#f79fc1", fontSize: "0.8rem" }}>(already added)</span>}
        </span>
        <button
          className="btn btn--save btn--small"
          onClick={() => handleSelect(person)}
          disabled={alreadyAdded}
        >
          Select
        </button>
      </li>
    );
  })}

            
          </ul>
        )}
      </div>
    </div>
  );
}
