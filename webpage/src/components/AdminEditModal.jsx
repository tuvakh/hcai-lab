// src/components/AdminEditModal.jsx
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function AdminEditModal({ fields, data, onSave, onClose, title }) {
  const [form, setForm] = useState(() => {
    const init = {};
    fields.forEach((f) => {
      if (f.type === "checkboxes") {
        init[f.key] = data?.[f.key] ?? [];
    } else if (f.isArray) {
        init[f.key] = (data?.[f.key] ?? []).join(", ");
    } else {
        init[f.key] = data?.[f.key] ?? "";
    }
    });
    return init;
  });

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    for (const f of fields) {
    if (f.type === "checkboxes" && f.required && (!form[f.key] || form[f.key].length === 0)) {
      alert("Please select at least one status.");
      return;
    }

    if ((f.key === "eventImg" || f.key === "image") && f.required && !form[f.key]) {
        alert("Please select an image.");
        return;
    }

  }

    const out = {};
    fields.forEach((f) => {
      if (f.type === "checkboxes") {
        out[f.key] = form[f.key] || [];
      } else if (f.isArray) {
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
                    maxLength={f.maxLength}
                    required={f.required}
                />
               ) : (f.key === "eventImg" || f.key === "image") ? (
                    <>
                        <label style={{ cursor: "pointer" }}>
                            <span className="admin-btn admin-btn--ghost">Choose image</span>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                const formData = new FormData();
                                formData.append("file", file);
                                const res = await fetch(`${API_URL}/api/upload`, { method: "POST", body: formData });
                                const { path } = await res.json();
                                handleChange(f.key, path);
                                }}
                            />
                        </label>

                        {form[f.key] && (
                        <img src={form[f.key]} alt="preview"
                            style={{ marginTop: "8px", maxHeight: "100px", objectFit: "cover", borderRadius: "4px" }}
                            onError={(e) => e.target.style.display = "none"}
                        />
                        )}
                    </>
                ) : f.type === "checkboxes" ? (
                    <div className="admin-modal__checkboxes">
                        {f.options.map((opt) => (
                        <label key={opt} className="admin-modal__checkbox-label">
                            <input
                            type="checkbox"
                            className="admin-modal__checkbox"
                            checked={(form[f.key] || []).includes(opt)}
                            onChange={() => {
                                const current = form[f.key] || [];
                                const next = current.includes(opt)
                                ? current.filter((s) => s !== opt)
                                : [...current, opt];
                                handleChange(f.key, next);
                            }}
                            />
                            {opt}
                        </label>
                        ))}
                    </div>
                    ) : (
                <input
                    id={`field-${f.key}`}
                    className="admin-modal__input"
                    type={f.type}
                    value={form[f.key]}
                    maxLength={f.maxLength}
                    required={f.required}
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
