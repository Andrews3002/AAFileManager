import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import EntryTable from "../components/EntryTable.jsx";

// ─── SVG Icons ───────────────────────────────────────────────────────────
function PlusIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}

function SearchIcon() {
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
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

function FileIcon() {
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
        </svg>
    );
}

function DollarIcon() {
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
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    );
}

function GridIcon() {
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
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
        </svg>
    );
}

function ReceiptIcon() {
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
            <polyline points="6 2 3 6 3 20 21 20 21 6 18 2 6 2" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M15 10a3 3 0 1 1-6 0" />
        </svg>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────
function StatCard({ icon, iconColor, value, label, badge, badgeType, delay }) {
    return (
        <div
            className={`stat-card animate-in animate-delay-${delay}`}
            role="figure"
            aria-label={`${label}: ${value}`}
        >
            <div className="stat-card-header">
                <div className={`stat-icon ${iconColor}`} aria-hidden="true">
                    {icon}
                </div>
                {badge && (
                    <span
                        className={`stat-badge ${badgeType}`}
                        aria-label={`Change: ${badge}`}
                    >
                        {badge}
                    </span>
                )}
            </div>
            <div>
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
            </div>
        </div>
    );
}

// ─── Dashboard ────────────────────────────────────────────────────────────
const TYPE_FILTERS = ["All", "DOCUMENT", "FORM", "RECIEPT"];

export default function Dashboard({ onCountChange }) {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("All");

    useEffect(() => {
        loadEntries();
    }, []);

    async function loadEntries() {
        try {
            const data = await window.api.getEntries();
            setEntries(data);
            onCountChange?.(data.length);
        } catch (e) {
            console.error("Failed to load entries:", e);
        }
    }

    const filteredEntries = useMemo(() => {
        const q = search.toLowerCase();
        return entries.filter((e) => {
            const matchSearch =
                e.title.toLowerCase().includes(q) ||
                e.type.toLowerCase().includes(q);
            const matchType = typeFilter === "All" || e.type === typeFilter;
            return matchSearch && matchType;
        });
    }, [entries, search, typeFilter]);

    async function handleDelete(id) {
        if (!confirm("Delete this entry? This action cannot be undone."))
            return;
        await window.api.deleteEntry(id);
        loadEntries();
    }

    // Stats
    const totalAmount = entries
        .filter((e) => e.amount != null)
        .reduce((s, e) => s + e.amount, 0);
    const withFile = entries.filter((e) => e.pdfPath).length;
    const typeCounts = entries.reduce((acc, e) => {
        acc[e.type] = (acc[e.type] || 0) + 1;
        return acc;
    }, {});

    return (
        <>
            {/* Top Bar */}
            <header className="topbar">
                <h1 className="topbar-title">Documents</h1>

                {/* Search */}
                <div className="search-wrapper" role="search">
                    <span className="search-icon">
                        <SearchIcon />
                    </span>
                    <input
                        className="search-input"
                        type="search"
                        placeholder="Search by title or type…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Search entries"
                    />
                </div>

                <div className="topbar-actions">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/entry-form")}
                        aria-label="Add new entry"
                    >
                        <PlusIcon />
                        New Entry
                    </button>
                </div>
            </header>

            {/* Page Content */}
            <div className="page-content">
                {/* Stats */}
                <div
                    className="stats-row"
                    role="region"
                    aria-label="Summary statistics"
                >
                    <StatCard
                        icon={<FileIcon />}
                        iconColor="indigo"
                        value={entries.length}
                        label="Total Files"
                        delay={1}
                    />
                    <StatCard
                        icon={<DollarIcon />}
                        iconColor="green"
                        value={typeCounts["RECIEPT"] ?? 0}
                        label="Receipts"
                        delay={2}
                    />
                    <StatCard
                        icon={<GridIcon />}
                        iconColor="indigo"
                        value={typeCounts["DOCUMENT"] ?? 0}
                        label="Documents"
                        delay={3}
                    />
                    <StatCard
                        icon={<ReceiptIcon />}
                        iconColor="amber"
                        value={typeCounts["FORM"] ?? 0}
                        label="Forms"
                        delay={4}
                    />
                </div>

                {/* Table Section */}
                <section aria-label="Entries list">
                    <div className="section-header">
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--space-3)",
                            }}
                        >
                            <h2 className="section-title">All Entries</h2>
                            <span className="section-count" aria-live="polite">
                                {filteredEntries.length} of {entries.length}
                            </span>
                        </div>

                        {/* Type filter chips */}
                        <div
                            className="filter-chips"
                            role="group"
                            aria-label="Filter by type"
                        >
                            {TYPE_FILTERS.map((t) => (
                                <button
                                    key={t}
                                    className={`chip${typeFilter === t ? " active" : ""}`}
                                    onClick={() => setTypeFilter(t)}
                                    aria-pressed={typeFilter === t}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <EntryTable
                        entries={filteredEntries}
                        onDelete={handleDelete}
                    />
                </section>
            </div>
        </>
    );
}
