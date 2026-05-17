import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EntryForm({ onSave }) {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [type, setType] = useState("DOCUMENT");
    const [date, setDate] = useState(null);
    const [amount, setAmount] = useState(null);
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nextRefNum = await window.api.nextRefNum();

        let filePath = null;

        if(file){
            const arrayBuffer = await file.arrayBuffer();

            const obj = {
                name: file.name,
                buffer: Array.from(new Uint8Array(arrayBuffer)),
            };

            filePath = await window.api.savePDF(obj, nextRefNum);
        }

        const formData = {
            title,
            type,
            date,
            amount: parseFloat(amount),
            filePath,
        };

        await window.api.createEntry(formData);
        navigate("/");  
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
            <h1>Add File Entry</h1>
            <input
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
            />

            <select onChange={(e) => setType(e.target.value)}>
                <option>DOCUMENT</option>
                <option>FORM</option>
                <option>RECIEPT</option>
            </select>

            <input type="date" onChange={(e) => setDate(e.target.value)} />

            <input
                type="number"
                placeholder="Amount"
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
                type="cancel"
                onClick={() => {
                    navigate("/");
                }}
            >
                Cancel
            </button>
        </form>
    );
}
