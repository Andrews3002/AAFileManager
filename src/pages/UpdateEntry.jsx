import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ─── Icons ────────────────────────────────────────────────────────────────
function ArrowLeftIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
        </svg>
    );
}

function EditIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}

function UploadIcon() {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <polyline points="16 16 12 12 8 16" />
            <line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        </svg>
    );
}

function FilePdfIcon() {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
        </svg>
    );
}

function XCircleIcon() {
    return (
        <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
    );
}

function SaveIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
        </svg>
    );
}

// ─── UpdateEntry ──────────────────────────────────────────────────────────
export default function UpdateEntry() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const entry = state?.entry;

    const [title, setTitle] = useState(entry?.title ?? "");
    const [type, setType] = useState(entry?.type ?? "DOCUMENT");
    const [date, setDate] = useState(
        entry?.date ? new Date(entry.date).toISOString().split("T")[0] : "",
    );
    const [amount, setAmount] = useState(entry?.amount ?? "");
    const [file, setFile] = useState(null);
    const [removeFile, setRemoveFile] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const fileRef = useRef(null);

    // Redirect if no entry state
    if (!entry) {
        navigate("/");
        return null;
    }

    const existingFileName = entry.pdfPath
        ? entry.pdfPath.split(/[\\/]/).pop()
        : null;

    const currentFile = file
        ? file.name
        : !removeFile && existingFileName
          ? existingFileName
          : null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setSubmitting(true);

        try {
            let filePath = removeFile ? null : entry.pdfPath;

            if (file) {
                const arrayBuffer = await file.arrayBuffer();
                const obj = {
                    name: file.name,
                    buffer: Array.from(new Uint8Array(arrayBuffer)),
                };
                if (filePath) await window.api.removePDF(filePath);
                filePath = await window.api.savePDF(obj, entry.id);
            } else if (removeFile && entry.pdfPath) {
                await window.api.removePDF(entry.pdfPath);
            }

            await window.api.updateEntry({
                id: entry.id,
                title: title.trim(),
                type,
                date: date ? new Date(date) : null,
                amount: amount !== "" ? parseFloat(amount) : null,
                filePath,
            });

            navigate("/");
        } catch (err) {
            console.error("Failed to update entry:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const clearFile = (e) => {
        e.stopPropagation();
        setFile(null);
        setRemoveFile(true);
        if (fileRef.current) fileRef.current.value = "";
    };

    const hasFile = !!currentFile;

    return (
        <>
            {/* Top Bar */}
            <header className="topbar">
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate("/")}
                    aria-label="Go back to dashboard"
                >
                    <ArrowLeftIcon />
                    Back
                </button>
                <h1 className="topbar-title" style={{ fontSize: 15 }}>
                    Edit Entry #{entry.id}
                </h1>
            </header>

            {/* Form */}
            <div className="page-content">
                <div className="form-page animate-in">
                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        aria-label="Update entry form"
                    >
                        <div className="form-card">
                            {/* Card Header */}
                            <div className="form-card-header">
                                <div
                                    className="form-card-icon"
                                    aria-hidden="true"
                                >
                                    <EditIcon />
                                </div>
                                <div>
                                    <div className="form-card-title">
                                        Update Entry
                                    </div>
                                    <div className="form-card-sub">
                                        Editing entry{" "}
                                        <strong
                                            style={{
                                                fontFamily: "var(--font-mono)",
                                                color: "var(--color-text)",
                                            }}
                                        >
                                            #{entry.id}
                                        </strong>{" "}
                                        — changes will be saved immediately.
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="form-body">
                                {/* Title */}
                                <div className="field">
                                    <label
                                        className="field-label"
                                        htmlFor="title"
                                    >
                                        Title{" "}
                                        <span
                                            className="field-required"
                                            aria-hidden="true"
                                        >
                                            *
                                        </span>
                                    </label>
                                    <input
                                        id="title"
                                        className="field-input"
                                        type="text"
                                        placeholder="e.g. Invoice #2024-001"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        required
                                        aria-required="true"
                                        autoFocus
                                    />
                                </div>

                                {/* Type + Amount */}
                                <div className="form-grid-2">
                                    <div className="field">
                                        <label
                                            className="field-label"
                                            htmlFor="type"
                                        >
                                            Type
                                        </label>
                                        <select
                                            id="type"
                                            className="field-select"
                                            value={type}
                                            onChange={(e) =>
                                                setType(e.target.value)
                                            }
                                        >
                                            <option value="DOCUMENT">
                                                Document
                                            </option>
                                            <option value="FORM">Form</option>
                                            <option value="RECIEPT">
                                                Receipt
                                            </option>
                                        </select>
                                    </div>

                                    <div className="field">
                                        <label
                                            className="field-label"
                                            htmlFor="amount"
                                        >
                                            Amount (USD)
                                        </label>
                                        <input
                                            id="amount"
                                            className="field-input"
                                            type="number"
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                            value={amount}
                                            onChange={(e) =>
                                                setAmount(e.target.value)
                                            }
                                            style={{
                                                fontFamily: "var(--font-mono)",
                                                fontSize: 14,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="field">
                                    <label
                                        className="field-label"
                                        htmlFor="date"
                                    >
                                        Date
                                    </label>
                                    <div className="field-date-row">
                                        <input
                                            id="date"
                                            className="field-input"
                                            type="date"
                                            value={date}
                                            onChange={(e) =>
                                                setDate(e.target.value)
                                            }
                                            aria-label="Entry date"
                                        />
                                        {date && (
                                            <button
                                                type="button"
                                                className="btn btn-ghost btn-sm"
                                                onClick={() => setDate("")}
                                                aria-label="Clear date"
                                                style={{ flexShrink: 0 }}
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* File Upload */}
                                <div className="field">
                                    <span className="field-label">
                                        PDF Attachment
                                    </span>
                                    <div
                                        className={`file-zone${hasFile ? " has-file" : ""}`}
                                        onClick={() =>
                                            !file && fileRef.current?.click()
                                        }
                                        onKeyDown={(e) =>
                                            (e.key === "Enter" ||
                                                e.key === " ") &&
                                            !file &&
                                            fileRef.current?.click()
                                        }
                                        role="button"
                                        tabIndex={0}
                                        aria-label={
                                            hasFile
                                                ? `Current file: ${currentFile}`
                                                : "Upload PDF file"
                                        }
                                    >
                                        <div className="file-zone-icon">
                                            {hasFile ? (
                                                <FilePdfIcon />
                                            ) : (
                                                <UploadIcon />
                                            )}
                                        </div>
                                        <div className="file-zone-title">
                                            {hasFile
                                                ? file
                                                    ? "New file selected"
                                                    : "Current file"
                                                : "Click to upload PDF"}
                                        </div>
                                        <div className="file-zone-sub">
                                            {hasFile
                                                ? null
                                                : "Replaces existing file if any"}
                                        </div>
                                        {hasFile && (
                                            <div
                                                className="file-zone-name"
                                                title={currentFile}
                                            >
                                                {currentFile}
                                            </div>
                                        )}
                                        {hasFile && (
                                            <button
                                                type="button"
                                                className="file-remove-btn"
                                                onClick={clearFile}
                                                aria-label="Remove file"
                                            >
                                                <XCircleIcon />
                                                Remove file
                                            </button>
                                        )}
                                        {!file && (
                                            <input
                                                ref={fileRef}
                                                type="file"
                                                accept="application/pdf"
                                                style={{ display: "none" }}
                                                onChange={(e) => {
                                                    setFile(
                                                        e.target.files[0] ||
                                                            null,
                                                    );
                                                    setRemoveFile(false);
                                                }}
                                                tabIndex={-1}
                                                aria-hidden="true"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="form-footer">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => navigate("/")}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={submitting || !title.trim()}
                                    aria-busy={submitting}
                                >
                                    <SaveIcon />
                                    {submitting ? "Saving…" : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
