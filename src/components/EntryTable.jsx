import { useNavigate } from "react-router-dom";

export default function EntryTable({ entries, onDelete }) {
    const navigate = useNavigate();

    return (
        <table className="w-full">
            <thead>
                <tr>
                    <th>Ref#</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Amount</th>
                </tr>
            </thead>

            <tbody>
                {entries.map((e) => (
                    <tr key={e.id}>
                        <td>{e.id}</td>

                        <td>{e.title}</td>

                        <td>{e.type}</td>

                        <td>
                            {e.date != null
                                ? new Date(e.date).toLocaleDateString("en-US", {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                  })
                                : "-"}
                        </td>

                        <td>
                            {e.amount != null
                                ? `$${e.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                : "-"}
                        </td>

                        <td>
                            <button
                                onClick={() => window.api.openPDF(e.pdfPath)}
                            >
                                Open PDF
                            </button>
                        </td>

                        <td>
                            <button
                                onClick={() => {
                                    navigate("/update-entry", {
                                        state: { entry: e },
                                    });
                                }}
                            >
                                Edit
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
