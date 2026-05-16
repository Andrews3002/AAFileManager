import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'

console.log(window.api);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Dashboard />
    </StrictMode>,
);
