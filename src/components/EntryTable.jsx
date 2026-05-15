export default function EntryTable({ entries, onDelete }) {
    return (
        <table className="w-full">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>PDF</th>
                </tr>
            </thead>

            <tbody>
                {entries.map((e) => (
                    <tr key={e.id}>
                        <td>{e.title}</td>

                        <td>{e.type}</td>

                        <td>{new Date(e.date).toISOString().split("T")[0]}</td>

                        <td>{e.amount}</td>

                        <td>
                            <button
                                onClick={() => window.api.openPDF(e.pdfPath)}
                            >
                                Open PDF
                            </button>
                        </td>

                        <td>
                            <button onClick={() => onDelete(e.id)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
