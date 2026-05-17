import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function EntryForm({ onSave }) {
    const navigate = useNavigate();
    const { state } = useLocation();
    const entry = state.entry;
    const [title, setTitle] = useState(entry.title);
    const [type, setType] = useState(entry.type);
    const [date, setDate] = useState(entry.date);
    const [amount, setAmount] = useState(entry.amount);
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let filePath = entry.pdfPath;

        if(file){
            const arrayBuffer = await file.arrayBuffer();

            const obj = {
                name: file.name,
                buffer: Array.from(new Uint8Array(arrayBuffer)),
            };

            await window.api.removePDF(filePath);

            filePath = await window.api.savePDF(obj, entry.id);
        }

        let id = entry.id;

        console.log(filePath);

        const formData = {
            id,
            title,
            type,
            date,
            amount: parseFloat(amount),
            filePath,
        };

        await window.api.updateEntry(formData);
        navigate("/");  
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
            <h1>Update File Entry</h1>
            <input
                placeholder="Title"
                value = {title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <select
                value={type}
                onChange={(e) => setType(e.target.value)}
            >
                <option>DOCUMENT</option>
                <option>FORM</option>
                <option>RECIEPT</option>
            </select>

            <input
                value={new Date(date).toISOString().split("T")[0]}
                type="date"
                onChange={(e) => setDate(e.target.value)}
            />

            <input
                type="number"
                placeholder="amount"
                value={amount}
                step="0.01"
                onChange={(e) => setAmount(e.target.value)}
            />

            <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <button type="submit">Save</button>
            <button
                type="button"
                onClick={() => {
                    navigate("/");
                }}
            >
                Cancel
            </button>
        </form>
    );
}
