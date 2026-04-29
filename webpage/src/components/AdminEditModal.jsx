// src/components/AdminEditModal.jsx
import { useState } from "react";
import Modal from "./Modal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function AdminEditModal({ fields, data, onSave, onClose, title }) {
    const [values, setValues] = useState(() => {
        const init = {};
        fields.forEach((field) => {
            if (field.type === "checkboxes") {
                init[field.key] = data?.[field.key] ?? [];
            } else if (field.isArray) {
                init[field.key] = (data?.[field.key] ?? []).join(", ");
            } else {
                init[field.key] = data?.[field.key] ?? "";
            }
        });
        return init;
    });
    const [uploading, setUploading] = useState(false);

    function handleChange(key, value) {
        setValues((prev) => ({ ...prev, [key]: value }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        for (const field of fields) {
            if (field.type === "checkboxes" && field.required && (!values[field.key] || values[field.key].length === 0)) {
                alert("Please select at least one status.");
                return;
            }
            if ((field.key === "eventImg" || field.key === "image") && field.required && !values[field.key]) {
                alert("Please select an image.");
                return;
            }
        }

        const out = {};
        fields.forEach((field) => {
            if (field.type === "checkboxes") {
                out[field.key] = values[field.key] || [];
            } else if (field.isArray) {
                out[field.key] = values[field.key].split(",").map((s) => s.trim()).filter(Boolean);
            } else if (field.type === "number") {
                out[field.key] = Number(values[field.key]);
            } else {
                out[field.key] = values[field.key];
            }
        });
        onSave(out);
    }

    return (
        <Modal onClose={onClose} ariaLabel={title} size="small">
            <div className="admin-modal__content">
                <h2 className="admin-modal__title">{title}</h2>
                <form className="admin-modal__form" onSubmit={handleSubmit}>
                    {fields.map((field) => (
                        <div className="admin-modal__field" key={field.key}>
                            <label className="admin-modal__label" htmlFor={`field-${field.key}`}>
                                {field.label}
                            </label>
                            {field.type === "textarea" ? (
                                <textarea
                                    id={`field-${field.key}`}
                                    className="admin-modal__textarea"
                                    value={values[field.key]}
                                    placeholder={field.placeholder}
                                    onChange={(event) => handleChange(field.key, event.target.value)}
                                    rows={3}
                                    maxLength={field.maxLength}
                                    required={field.required}
                                />
                            ) : (field.key === "eventImg" || field.key === "image") ? (
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
                                                const res = await fetch(`${API_URL}/api/upload?folder=${field.folder || "misc"}`, { method: "POST", body: formData });
                                                const { path } = await res.json();
                                                handleChange(field.key, path);
                                                setUploading(false);
                                            }}
                                        />
                                    </label>
                                    {values[field.key] && (
                                        <img
                                            src={values[field.key]}
                                            alt="preview"
                                            style={{ marginTop: "8px", maxHeight: "100px", objectFit: "cover", borderRadius: "4px" }}
                                            onError={(event) => event.target.style.display = "none"}
                                        />
                                    )}
                                </>
                            ) : field.type === "checkboxes" ? (
                                <div className="admin-modal__checkboxes">
                                    {field.options.map((opt) => (
                                        <label key={opt} className="admin-modal__checkbox-label">
                                            <input
                                                type="checkbox"
                                                className="admin-modal__checkbox"
                                                checked={(values[field.key] || []).includes(opt)}
                                                onChange={() => {
                                                    const current = values[field.key] || [];
                                                    const next = current.includes(opt)
                                                        ? current.filter((s) => s !== opt)
                                                        : [...current, opt];
                                                    handleChange(field.key, next);
                                                }}
                                            />
                                            {opt}
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <input
                                    id={`field-${field.key}`}
                                    className="admin-modal__input"
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={values[field.key]}
                                    maxLength={field.maxLength}
                                    required={field.required}
                                    onChange={(event) => handleChange(field.key, event.target.value)}
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
