import { Outlet } from "react-router-dom";
import Navbar from "../components/NavBar";

function ClientLayout() {
    return (
        <div>
            <Navbar />
            <main style={{ padding: '20px' }}>
                <Outlet />
            </main>
        </div>
    )
}

export default ClientLayout;