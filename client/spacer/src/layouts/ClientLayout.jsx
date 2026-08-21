import { Outlet } from "react-router-dom";
import Navbar from "../components/NavBar";

function ClientLayout() {
    return (
        <div className="app-shell">
            <Navbar />
            <main className="public-main">
                <Outlet />
            </main>
        </div>
    )
}

export default ClientLayout;