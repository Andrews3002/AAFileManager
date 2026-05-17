import { HashRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import EntryForm from "./pages/EntryForm.jsx";
import UpdateEntry from "./pages/UpdateEntry.jsx";

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/entry-form" element={<EntryForm />} />
                <Route path="/update-entry" element={<UpdateEntry />} />
            </Routes>
        </HashRouter>
    );
}
