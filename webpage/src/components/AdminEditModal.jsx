// src/components/AdminEditModal.jsx
import { useState } from "react";
import Modal from "./Modal";

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
    const [uploading, setUploading] = useState(false);

    function handleChange(key, value) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function handleSubmit(event) {
        event.preventDefault();

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
                out[f.key] = form[f.key].split(",").map((status) => status.trim()).filter(Boolean);
            } else if (f.type === "number") {
                out[f.key] = Number(form[f.key]);
            } else {
                out[f.key] = form[f.key];
            }
        });
        onSave(out);
    }

    return (
        <Modal onClose={onClose} ariaLabel={title} size="small">
            <div>
                <h2 className="admin-modal__title">{title}</h2>
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
                                    onChange={(event) => handleChange(f.key, event.target.value)}
                                    rows={3}
                                    maxLength={f.maxLength}
                                    required={f.required}
                                />
                            ) : (f.key === "eventImg" || f.key === "image") ? (
                                <>
                                    <label style={{ cursor: "pointer" }}>
                                        <span className="btn btn--secondary">
                                            {uploading ? "Uploading..." : "Choose image"}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            onChange={async (event) => {
                                                const file = event.target.files[0];
                                                if (!file) return;
                                                setUploading(true);
                                                const formData = new FormData();
                                                formData.append("file", file);
                                                const res = await fetch(`${API_URL}/api/upload?folder=${f.folder || "misc"}`, { method: "POST", body: formData });
                                                const { path } = await res.json();
                                                handleChange(f.key, path);
                                                setUploading(false);
                                            }}
                                        />
                                    </label>

                                    {form[f.key] && (
                                        <img src={form[f.key]} alt="preview"
                                            style={{ marginTop: "8px", maxHeight: "100px", objectFit: "cover", borderRadius: "4px" }}
                                            onError={(event) => event.target.style.display = "none"}
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
                                                        ? current.filter((status) => status !== opt)
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
                                    onChange={(event) => handleChange(f.key, event.target.value)}
                                />
                            )}
                        </div>
                    ))}
                    <div className="admin-modal__actions">
                        <button type="button" className="btn btn--secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn--save">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}