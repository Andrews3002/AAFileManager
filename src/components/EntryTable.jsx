import { useNavigate } from "react-router-dom";

// ─── Icons ────────────────────────────────────────────────────────────────
function OpenIcon() {
    return (
        <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
    );
}

function EditIcon() {
    return (
        <svg
            width="13"
            height="13"
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

function TrashIcon() {
    return (
        <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
    );
}

function FilePdfIcon() {
    return (
        <svg
            width="14"
            height="14"
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
            <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
    );
}

function EmptyFolderIcon() {
    return (
        <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            <line x1="12" y1="11" x2="12" y2="17" />
            <line x1="9" y1="14" x2="15" y2="14" />
        </svg>
    );
}

// ─── Type Badge ───────────────────────────────────────────────────────────
const TYPE_DOT = {
    DOCUMENT: "#4f46e5",
    RECIEPT: "#10b981",
    FORM: "#f59e0b",
};

function TypeBadge({ type }) {
    return (
        <span className={`type-badge ${type}`} aria-label={`Type: ${type}`}>
            <span
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: TYPE_DOT[type] ?? "#8288a8",
                    display: "inline-block",
                    flexShrink: 0,
                }}
            />
            {type}
        </span>
    );
}

// ─── EntryTable ───────────────────────────────────────────────────────────
export default function EntryTable({ entries, onDelete }) {
    const navigate = useNavigate();

    if (entries.length === 0) {
        return (
            <div className="table-card">
                <div className="empty-state" role="status">
                    <div className="empty-icon">
                        <EmptyFolderIcon />
                    </div>
                    <p className="empty-title">No entries found</p>
                    <p className="empty-desc">
                        Try adjusting your search or filters, or add a new
                        document entry.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="table-card animate-in">
            <div style={{ overflowX: "auto" }}>
                <table
                    className="data-table"
                    role="table"
                    aria-label="Document entries"
                >
                    <thead>
                        <tr>
                            <th className="col-ref" scope="col">
                                Ref #
                            </th>
                            <th className="col-title" scope="col">
                                Title
                            </th>
                            <th className="col-type" scope="col">
                                Type
                            </th>
                            <th className="col-date" scope="col">
                                Date
                            </th>
                            <th className="col-amount" scope="col">
                                Amount
                            </th>
                            <th className="col-file" scope="col">
                                File
                            </th>
                            <th className="col-actions" scope="col">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((e) => (
                            <tr key={e.id} role="row">
                                {/* Ref */}
                                <td>
                                    <span className="cell-ref">#{e.id}</span>
                                </td>

                                {/* Title */}
                                <td>
                                    <div className="cell-title-wrap">
                                        <div
                                            className="cell-file-icon"
                                            aria-hidden="true"
                                        >
                                            <FilePdfIcon />
                                        </div>
                                        <span
                                            className="cell-title truncate"
                                            title={e.title}
                                        >
                                            {e.title}
                                        </span>
                                    </div>
                                </td>

                                {/* Type */}
                                <td>
                                    <TypeBadge type={e.type} />
                                </td>

                                {/* Date */}
                                <td>
                                    {e.date != null ? (
                                        <time
                                            dateTime={new Date(
                                                e.date,
                                            ).toISOString()}
                                            style={{ fontSize: 13 }}
                                        >
                                            {new Date(
                                                e.date,
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </time>
                                    ) : (
                                        <span
                                            style={{
                                                color: "var(--color-text-3)",
                                                fontSize: 12,
                                            }}
                                        >
                                            —
                                        </span>
                                    )}
                                </td>

                                {/* Amount */}
                                <td>
                                    {e.amount != null ? (
                                        <span className="cell-amount">
                                            $
                                            {e.amount.toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </span>
                                    ) : (
                                        <span
                                            style={{
                                                color: "var(--color-text-3)",
                                                fontSize: 12,
                                            }}
                                        >
                                            —
                                        </span>
                                    )}
                                </td>

                                {/* File */}
                                <td>
                                    {e.pdfPath ? (
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() =>
                                                window.api.openPDF(e.pdfPath)
                                            }
                                            aria-label={`Open PDF for ${e.title}`}
                                            style={{ gap: "var(--space-1)" }}
                                        >
                                            <OpenIcon />
                                            PDF
                                        </button>
                                    ) : (
                                        <span
                                            style={{
                                                color: "var(--color-text-3)",
                                                fontSize: 12,
                                            }}
                                        >
                                            None
                                        </span>
                                    )}
                                </td>

                                {/* Actions */}
                                <td>
                                    <div className="cell-actions">
                                        <button
                                            className="btn btn-icon btn-sm"
                                            onClick={() =>
                                                navigate("/update-entry", {
                                                    state: { entry: e },
                                                })
                                            }
                                            aria-label={`Edit entry: ${e.title}`}
                                            title="Edit"
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={async () => {
                                                await onDelete(e.id);
                                                window.api.refocusWindow();
                                            }}
                                            aria-label={`Delete entry: ${e.title}`}
                                            title="Delete"
                                            style={{
                                                width: 30,
                                                height: 30,
                                                padding: 0,
                                            }}
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer row count */}
            <div
                style={{
                    padding: "var(--space-3) var(--space-5)",
                    borderTop: "1px solid var(--color-border)",
                    fontSize: 12,
                    color: "var(--color-text-3)",
                    background: "var(--color-surface-2)",
                }}
                aria-live="polite"
            >
                Showing {entries.length}{" "}
                {entries.length === 1 ? "entry" : "entries"}
            </div>
        </div>
    );
}
