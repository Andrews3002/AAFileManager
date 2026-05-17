import { useState, useRef } from "react";
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
    const [removeFile, setRemoveFile] = useState(false);
    const fileRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let filePath = removeFile ? null : entry.pdfPath;

        if(file){
            const arrayBuffer = await file.arrayBuffer();

            const obj = {
                name: file.name,
                buffer: Array.from(new Uint8Array(arrayBuffer)),
            };

            if (filePath) await window.api.removePDF(filePath);

            filePath = await window.api.savePDF(obj, entry.id);
        }
        else if (removeFile && filePath){
            await api.removePDF(filePath);
        }

        let id = entry.id;

        const parsedDate = date ? new Date(date) : null;
        const parsedAmount = amount ? parseFloat(amount) : null;

        const formData = {
            id,
            title,
            type,
            date: parsedDate,
            amount: parsedAmount,
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option>DOCUMENT</option>
                <option>FORM</option>
                <option>RECIEPT</option>
            </select>

            <input
                value={date ? new Date(date).toISOString().split("T")[0] : ""}
                type="date"
                onChange={(e) => setDate(e.target.value)}
            />
            <button type="button" onClick={() => setDate(null)}>
                Clear Date
            </button>

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
                ref={fileRef}
                style={{ display: "none" }}
                onChange={(e) => {
                    setFile(e.target.files[0]);
                    setRemoveFile(false);
                }}
            />
            <button type="button" onClick={() => fileRef.current.click()}>
                Choose File
            </button>
            <span style={{ fontSize: "12px" }}>
                {file
                    ? file.name
                    : !removeFile && entry.pdfPath
                      ? entry.pdfPath.split("\\").pop()
                      : "No file chosen"}
            </span>
            <button
                type="button"
                onClick={() => {
                    setFile(null);
                    setRemoveFile(true);
                    fileRef.current.value = "";
                }}
            >
                Remove File
            </button>

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
