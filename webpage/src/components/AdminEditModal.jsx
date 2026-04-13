// src/components/AdminEditModal.jsx
import { useState } from "react";

export default function AdminEditModal({ fields, data, onSave, onClose, title }) {
  const [form, setForm] = useState(() => {
    const init = {};
    fields.forEach((f) => {
      init[f.key] = f.isArray
        ? (data?.[f.key] ?? []).join(", ")
        : data?.[f.key] ?? "";
    });
    return init;
  });

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const out = {};
    fields.forEach((f) => {
      if (f.isArray) {
        out[f.key] = form[f.key].split(",").map((s) => s.trim()).filter(Boolean);
      } else if (f.type === "number") {
        out[f.key] = Number(form[f.key]);
      } else {
        out[f.key] = form[f.key];
      }
    });
    onSave(out);
  }

  return (
    <div className="admin-modal" role="dialog" aria-modal="true">
      <div className="admin-modal__box">
        <div className="admin-modal__header">
          <h2 className="admin-modal__title">{title}</h2>
          <button className="admin-modal__close" onClick={onClose} type="button" aria-label="Close">
            &times;
          </button>
        </div>
        <form className="admin-modal__form" onSubmit={handleSubmit}>
          {fields.map((f) => (
            <div className="admin-modal__field" key={f.key}>
              <label className="admin-modal__label" htmlFor={`field-${f.key}`}>
                {f.label}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  id={`field-${f.key}`}
                  className="admin-modal__textarea"
                  value={form[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  rows={3}
                />
              ) : (
                <input
                  id={`field-${f.key}`}
                  className="admin-modal__input"
                  type={f.type}
                  value={form[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                />
              )}
            </div>
          ))}
          <div className="admin-modal__actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="admin-btn admin-btn--primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
