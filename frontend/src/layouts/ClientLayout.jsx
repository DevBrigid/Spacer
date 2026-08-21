import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/NavBar";

function ClientLayout() {
    const { pathname } = useLocation();
    const isAuthPage = ["/login", "/register", "/forgot-password"].includes(pathname);

    return (
        <div>
            {!isAuthPage && <Navbar />}
            <main style={isAuthPage ? undefined : { padding: '20px' }}>
                <Outlet />
            </main>
        </div>
    )
}

export default ClientLayout;
