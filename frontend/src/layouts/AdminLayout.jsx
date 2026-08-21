import { Outlet } from "react-router-dom";
import AdminSideBar from '../components/AdminSidebar';

function AdminLayout() {
    return (
        <div className="admin-shell">
            <AdminSideBar />
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
