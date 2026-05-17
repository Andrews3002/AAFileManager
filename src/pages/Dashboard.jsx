import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EntryTable from "../components/EntryTable.jsx";

export default function Dashboard() {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadEntries();
    }, []);

    const filteredEntries = entries.filter((e) =>
        e.title.toLowerCase().includes(search.toLowerCase()),
    );

    async function loadEntries() {
        const data = await window.api.getEntries();
        setEntries(data);
    }

    async function handleDelete(id) {
        await window.api.deleteEntry(id);

        loadEntries();
    }

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold">AA File Manager</h1>

            <input
                placeholder="Search..."
                onChange={(e) => setSearch(e.target.value)}
            />

            <button>Search</button>
            <button onClick={() => navigate("/entry-form")}>Add Entry</button>
            <EntryTable entries={entries} onDelete={handleDelete} />
        </div>
    );
}
