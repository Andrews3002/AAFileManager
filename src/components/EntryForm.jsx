import { useState } from "react";

export default function EntryForm({ onSave }) {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [date, setDate] = useState(null);
    const [amount, setAmount] = useState(null);
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        nextRefNum = await window.api.nextRefNum();

        if(file){
            filePath = await window.api.savePDF(file, nextRefNum);
        }
        else{
            filePath = null
        }

        const formData = {
            title,
            type,
            date,
            amount: parseFloat(amount),
            filePath,
        };

        await window.api.createEntry(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
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
                onChange={(e) => setAmount(e.target.value)}
            />

            <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <button type="submit">Save</button>
        </form>
    );
}
