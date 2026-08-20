import { Outlet } from "react-router-dom";
import AdminSideBar from '../components/AdminSideBar';

function AdminLayout() {
    return (
        <div style={{ display: 'flex '}}>
            <AdminSideBar />
            <main style={{ flex: 1, padding: '20px' }}>
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;